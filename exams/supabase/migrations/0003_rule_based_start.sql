-- ---------------------------------------------------------------------------
-- 0003. Make rule based exams startable.
--
-- 0001 shipped start_attempt refusing any exam with no rows in exam_questions,
-- and it never called generate_exam_questions. A rule based exam therefore
-- could not be sat at all: the blueprint existed but nothing ever drew from it.
--
-- generate_exam_questions could not simply be called from start_attempt for
-- two reasons. It is staff guarded, so a student would be rejected, and it
-- begins by deleting exam_questions, which would destroy the question set that
-- already submitted attempts join against when rendering their review.
--
-- So the drawing logic moves into exam_fill_from_rules, which inserts only and
-- never deletes. generate_exam_questions keeps its staff guard and its delete,
-- since regenerating a draft paper on purpose is a legitimate admin action.
-- start_attempt calls the filler under an advisory lock, so a whole batch
-- starting at once still produces exactly one paper.
--
-- Safe to run more than once.
-- ---------------------------------------------------------------------------

-- Insert only. Draws each exam_rules row from the pool of active questions and
-- appends to exam_questions. Never deletes, so it cannot disturb a paper that
-- attempts already reference.
create or replace function exam_fill_from_rules(p_exam_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rule record;
  v_next integer;
  v_available integer;
  v_inserted integer := 0;
begin
  select coalesce(max(order_index), 0) into v_next
  from exam_questions where exam_id = p_exam_id;

  for v_rule in select * from exam_rules where exam_id = p_exam_id order by id
  loop
    select count(*) into v_available
    from questions q
    where q.status = 'active'
      and q.subject_id = v_rule.subject_id
      and (v_rule.topic_id is null or q.topic_id = v_rule.topic_id)
      and (v_rule.difficulty is null or q.difficulty = v_rule.difficulty)
      and not exists (
        select 1 from exam_questions eq
        where eq.exam_id = p_exam_id and eq.question_id = q.id
      );

    if v_available < v_rule.question_count then
      raise exception 'Not enough active questions for a rule: need %, have %',
        v_rule.question_count, v_available;
    end if;

    insert into exam_questions (exam_id, question_id, order_index)
    select p_exam_id, q.id, v_next + row_number() over ()
    from (
      select q.id
      from questions q
      where q.status = 'active'
        and q.subject_id = v_rule.subject_id
        and (v_rule.topic_id is null or q.topic_id = v_rule.topic_id)
        and (v_rule.difficulty is null or q.difficulty = v_rule.difficulty)
        and not exists (
          select 1 from exam_questions eq
          where eq.exam_id = p_exam_id and eq.question_id = q.id
        )
      order by random()
      limit v_rule.question_count
    ) q;

    get diagnostics v_inserted = row_count;
    v_next := v_next + v_inserted;
  end loop;

  update exams e
  set total_marks = (
    select count(*) * e.marks_per_question from exam_questions where exam_id = p_exam_id
  )
  where e.id = p_exam_id;

  return v_next;
end;
$$;

revoke execute on function exam_fill_from_rules(uuid) from public, anon, authenticated;

create or replace function start_attempt(p_exam_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_exam exams%rowtype;
  v_uid uuid := auth.uid();
  v_attempt attempts%rowtype;
  v_used integer;
  v_question_count integer;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  if not exists (select 1 from profiles where id = v_uid and is_active) then
    raise exception 'Account is inactive';
  end if;

  perform auto_expire_attempts();

  select * into v_exam from exams where id = p_exam_id;
  if not found then
    raise exception 'Exam not found';
  end if;
  if v_exam.status <> 'published' then
    raise exception 'This exam is not open';
  end if;
  if not exam_is_assigned(p_exam_id, v_uid) then
    raise exception 'This exam is not assigned to you';
  end if;
  if v_exam.opens_at is not null and now() < v_exam.opens_at then
    raise exception 'This exam has not opened yet';
  end if;
  if v_exam.closes_at is not null and now() > v_exam.closes_at then
    raise exception 'This exam has closed';
  end if;

  -- Resume a live attempt if one exists
  select * into v_attempt
  from attempts
  where exam_id = p_exam_id and student_id = v_uid and status = 'in_progress'
  limit 1;

  if not found then
    select count(*) into v_used
    from attempts
    where exam_id = p_exam_id and student_id = v_uid;

    if v_used >= v_exam.max_attempts then
      raise exception 'No attempts left for this exam';
    end if;

    select count(*) into v_question_count from exam_questions where exam_id = p_exam_id;
    if v_question_count = 0 then
      -- Rule based exam that has never been drawn. Fill it from the blueprint
      -- on first start rather than refusing. The advisory lock serialises
      -- concurrent first starts so a batch beginning together cannot each
      -- insert their own copy of the paper.
      if exists (select 1 from exam_rules where exam_id = p_exam_id) then
        perform pg_advisory_xact_lock(hashtextextended(p_exam_id::text, 0));
        select count(*) into v_question_count from exam_questions where exam_id = p_exam_id;
        if v_question_count = 0 then
          perform exam_fill_from_rules(p_exam_id);
          select count(*) into v_question_count from exam_questions where exam_id = p_exam_id;
        end if;
      end if;
      if v_question_count = 0 then
        raise exception 'This exam has no questions yet';
      end if;
    end if;

    -- Two near simultaneous starts both miss the resume branch above. The
    -- partial unique index catches the loser, which then resumes instead of
    -- failing with a raw constraint error.
    begin
      insert into attempts (exam_id, student_id, total_questions)
      values (p_exam_id, v_uid, v_question_count)
      returning * into v_attempt;
    exception when unique_violation then
      select * into v_attempt
      from attempts
      where exam_id = p_exam_id and student_id = v_uid and status = 'in_progress'
      limit 1;
    end;

    -- Pre-create answer rows so the palette has a stable shape
    insert into attempt_answers (attempt_id, question_id)
    select v_attempt.id, eq.question_id
    from exam_questions eq
    where eq.exam_id = p_exam_id
    on conflict do nothing;
  end if;

  return jsonb_build_object(
    'attempt', jsonb_build_object(
      'id', v_attempt.id,
      'exam_id', v_attempt.exam_id,
      'started_at', v_attempt.started_at,
      'status', v_attempt.status,
      'tab_switch_count', v_attempt.tab_switch_count,
      'deadline', exam_attempt_deadline(v_attempt.id),
      'server_now', now()
    ),
    'exam', jsonb_build_object(
      'id', v_exam.id,
      'title', v_exam.title,
      'duration_minutes', v_exam.duration_minutes,
      'marks_per_question', v_exam.marks_per_question,
      'negative_marks', v_exam.negative_marks,
      'shuffle_options', v_exam.shuffle_options,
      'allow_review', v_exam.allow_review,
      'show_result_immediately', v_exam.show_result_immediately
    ),
    'questions', exam_attempt_questions(v_attempt.id),
    'answers', coalesce((
      select jsonb_agg(jsonb_build_object(
        'question_id', aa.question_id,
        'selected_option', aa.selected_option,
        'marked_for_review', aa.marked_for_review,
        'time_spent_seconds', aa.time_spent_seconds
      ))
      from attempt_answers aa
      where aa.attempt_id = v_attempt.id
    ), '[]'::jsonb)
  );
end;
$$;

notify pgrst, 'reload schema';
