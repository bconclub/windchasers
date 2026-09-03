-- ---------------------------------------------------------------------------
-- 0005. Allow three option questions, and scope the admin dashboard by batch.
--
-- PART ONE, three option questions.
--
-- 0001 assumed every question has four options. That assumption is wrong. The
-- DGCA Meteorology bank is overwhelmingly three option: of roughly 1000
-- questions, 887 offer only (a), (b) and (c). Requiring a fourth would mean
-- inventing a distractor for each, which is not acceptable on exam material.
--
-- option_d becomes nullable and correct_option may no longer be 'D' when there
-- is no option D. Everything else is unchanged, so existing four option
-- questions are untouched.
--
-- PART TWO, get_admin_dashboard batch scoping.
--
-- The dashboard RPC is security definer and guarded only by exam_is_staff(),
-- so its recent_attempts list ignored instructor_batches. An instructor saw
-- student names and scores from batches it does not teach, while every direct
-- table read correctly returned nothing. That inconsistency is what made the
-- accuracy panel look broken while activity still showed rows.
--
-- Safe to run more than once.
-- ---------------------------------------------------------------------------

-- ---- part one ----

alter table questions alter column option_d drop not null;

alter table questions drop constraint if exists questions_correct_option_check;
alter table questions add constraint questions_correct_option_check
  check (correct_option in ('A', 'B', 'C', 'D'));

-- Three option questions were imported before this migration could run, using
-- an empty string to satisfy the old NOT NULL. Now that the column is nullable,
-- convert those to a real null so "no option D" is stated rather than implied.
update questions set option_d = null where option_d is not null and btrim(option_d) = '';

-- A question cannot be keyed to an option it does not offer.
alter table questions drop constraint if exists questions_correct_option_present;
alter table questions add constraint questions_correct_option_present
  check (correct_option <> 'D' or option_d is not null);

-- ---- part two ----

create or replace function get_admin_dashboard()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exam_is_staff() then
    raise exception 'Staff only';
  end if;

  return jsonb_build_object(
    'total_students', (select count(*) from profiles where role = 'student' and is_active),
    'active_batches', (
      select count(*) from batches b where b.is_active and exam_can_see_batch(b.id)
    ),
    'total_questions', (select count(*) from questions where status = 'active'),
    'published_exams', (select count(*) from exams where status = 'published'),
    'attempts_this_week', (
      select count(*) from attempts a
      where a.started_at > now() - interval '7 days'
        and exam_can_see_student(a.student_id)
    ),
    'questions_by_subject', coalesce((
      select jsonb_agg(x order by x ->> 'subject_name')
      from (
        select jsonb_build_object(
          'subject_id', s.id,
          'subject_name', s.name,
          'total', count(q.id)
        ) as x
        from subjects s
        left join questions q on q.subject_id = s.id and q.status = 'active'
        group by s.id, s.name
      ) sub
    ), '[]'::jsonb),
    -- Now filtered the same way every direct read is, so an instructor sees
    -- activity only for the batches assigned to it.
    'recent_attempts', coalesce((
      select jsonb_agg(x order by x ->> 'started_at' desc)
      from (
        select jsonb_build_object(
          'id', a.id,
          'student_name', p.full_name,
          'exam_title', e.title,
          'status', a.status,
          'score', a.score,
          'total_marks', e.total_marks,
          'started_at', a.started_at
        ) as x
        from attempts a
        join profiles p on p.id = a.student_id
        join exams e on e.id = a.exam_id
        where exam_can_see_student(a.student_id)
        order by a.started_at desc
        limit 10
      ) sub
    ), '[]'::jsonb)
  );
end;
$$;

revoke execute on function get_admin_dashboard() from public, anon;
grant execute on function get_admin_dashboard() to authenticated;

notify pgrst, 'reload schema';
