-- WindChasers Aviation Academy: exam and question bank platform
-- Target: the shared windchasers Supabase project (auth.users is shared with the main site)
-- Apply in the Supabase SQL editor. Idempotent where practical so a re-run is safe.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- 1. Enums
-- ---------------------------------------------------------------------------

do $$ begin
  create type user_role as enum ('admin', 'instructor', 'student');
exception when duplicate_object then null; end $$;

do $$ begin
  create type question_difficulty as enum ('easy', 'medium', 'hard');
exception when duplicate_object then null; end $$;

do $$ begin
  create type question_status as enum ('draft', 'active', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type exam_type as enum ('practice', 'mock', 'assignment');
exception when duplicate_object then null; end $$;

do $$ begin
  create type exam_status as enum ('draft', 'published', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type attempt_status as enum ('in_progress', 'submitted', 'auto_submitted', 'expired');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- 2. Tables
-- ---------------------------------------------------------------------------

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text,
  role user_role not null default 'student',
  is_active boolean not null default true,
  -- GoTrue session id of the most recent login. One active session per
  -- account is an exam integrity measure, so an older tab is signed out when
  -- the same account logs in somewhere else.
  active_session_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists batches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  start_date date,
  end_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists batch_enrollments (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references batches (id) on delete cascade,
  student_id uuid not null references profiles (id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (batch_id, student_id)
);

-- Which batches an instructor may assess. Admins are never listed here; they
-- see everything. An instructor with no rows here sees no student results.
create table if not exists instructor_batches (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid not null references profiles (id) on delete cascade,
  batch_id uuid not null references batches (id) on delete cascade,
  assigned_at timestamptz not null default now(),
  unique (instructor_id, batch_id)
);

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text not null unique,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects (id) on delete cascade,
  name text not null,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  unique (subject_id, name)
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references subjects (id) on delete restrict,
  topic_id uuid references topics (id) on delete set null,
  stem text not null,
  stem_hash text,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option char(1) not null check (correct_option in ('A', 'B', 'C', 'D')),
  explanation text,
  difficulty question_difficulty not null default 'medium',
  image_url text,
  source text,
  status question_status not null default 'active',
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type exam_type not null default 'mock',
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  total_marks numeric not null default 0,
  marks_per_question numeric not null default 1,
  negative_marks numeric not null default 0,
  shuffle_questions boolean not null default true,
  shuffle_options boolean not null default false,
  show_result_immediately boolean not null default true,
  allow_review boolean not null default true,
  show_leaderboard boolean not null default true,
  opens_at timestamptz,
  closes_at timestamptz,
  max_attempts integer not null default 1 check (max_attempts > 0),
  status exam_status not null default 'draft',
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists exam_questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams (id) on delete cascade,
  question_id uuid not null references questions (id) on delete cascade,
  order_index integer not null default 0,
  unique (exam_id, question_id)
);

create table if not exists exam_rules (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams (id) on delete cascade,
  subject_id uuid not null references subjects (id) on delete cascade,
  topic_id uuid references topics (id) on delete cascade,
  difficulty question_difficulty,
  question_count integer not null check (question_count > 0)
);

create table if not exists exam_assignments (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams (id) on delete cascade,
  batch_id uuid references batches (id) on delete cascade,
  student_id uuid references profiles (id) on delete cascade,
  assigned_at timestamptz not null default now(),
  constraint exam_assignments_target_check
    check (num_nonnulls(batch_id, student_id) = 1)
);

create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams (id) on delete cascade,
  student_id uuid not null references profiles (id) on delete cascade,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  status attempt_status not null default 'in_progress',
  score numeric,
  total_questions integer not null default 0,
  correct_count integer not null default 0,
  incorrect_count integer not null default 0,
  unattempted_count integer not null default 0,
  time_taken_seconds integer,
  tab_switch_count integer not null default 0
);

create table if not exists attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references attempts (id) on delete cascade,
  question_id uuid not null references questions (id) on delete cascade,
  selected_option char(1) check (selected_option in ('A', 'B', 'C', 'D')),
  is_correct boolean,
  marked_for_review boolean not null default false,
  time_spent_seconds integer not null default 0,
  answered_at timestamptz,
  unique (attempt_id, question_id)
);

-- Practice is logged separately from assigned exams so it never contaminates
-- attempt based reporting. Leaderboards, batch averages and exam analytics all
-- read from attempts, which practice never writes to.
create table if not exists practice_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id) on delete cascade,
  subject_id uuid references subjects (id) on delete set null,
  topic_id uuid references topics (id) on delete set null,
  difficulty question_difficulty,
  question_count integer not null default 0,
  answered_count integer not null default 0,
  correct_count integer not null default 0,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists practice_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references practice_sessions (id) on delete cascade,
  question_id uuid not null references questions (id) on delete cascade,
  selected_option char(1) check (selected_option in ('A', 'B', 'C', 'D')),
  is_correct boolean not null default false,
  answered_at timestamptz not null default now(),
  unique (session_id, question_id)
);

-- ---------------------------------------------------------------------------
-- 3. Indexes
-- ---------------------------------------------------------------------------

create index if not exists questions_subject_topic_status_idx
  on questions (subject_id, topic_id, status);
create index if not exists questions_stem_hash_idx on questions (stem_hash);
create index if not exists topics_subject_idx on topics (subject_id, order_index);
create index if not exists attempts_student_exam_idx on attempts (student_id, exam_id);
create index if not exists attempts_exam_status_idx on attempts (exam_id, status);
create index if not exists attempt_answers_attempt_idx on attempt_answers (attempt_id);
create index if not exists exam_questions_exam_idx on exam_questions (exam_id, order_index);
create index if not exists exam_assignments_exam_idx on exam_assignments (exam_id);
create index if not exists exam_assignments_student_idx on exam_assignments (student_id);
create index if not exists exam_assignments_batch_idx on exam_assignments (batch_id);
create index if not exists batch_enrollments_student_idx on batch_enrollments (student_id);
create index if not exists profiles_role_idx on profiles (role) where is_active;
create index if not exists batch_enrollments_batch_idx on batch_enrollments (batch_id);
create index if not exists instructor_batches_instructor_idx
  on instructor_batches (instructor_id);
create index if not exists instructor_batches_batch_idx on instructor_batches (batch_id);
create index if not exists practice_sessions_student_idx
  on practice_sessions (student_id, started_at desc);
create index if not exists practice_answers_session_idx on practice_answers (session_id);

-- Only one live attempt per student per exam
create unique index if not exists attempts_one_in_progress_idx
  on attempts (exam_id, student_id)
  where status = 'in_progress';

-- ---------------------------------------------------------------------------
-- 4. Triggers
-- ---------------------------------------------------------------------------

-- Normalized hash of the question stem, used to flag duplicate imports.
-- Strips HTML tags (stems are stored as rich text HTML), collapses whitespace.
create or replace function exam_normalize_stem(p_stem text)
returns text
language sql
immutable
as $$
  select btrim(
    regexp_replace(
      lower(
        regexp_replace(
          regexp_replace(coalesce(p_stem, ''), '<[^>]*>', ' ', 'g'),
          '&nbsp;', ' ', 'g'
        )
      ),
      '\s+', ' ', 'g'
    )
  );
$$;

create or replace function exam_questions_before_write()
returns trigger
language plpgsql
as $$
begin
  new.stem_hash := md5(exam_normalize_stem(new.stem));
  new.correct_option := upper(new.correct_option);
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists questions_before_write on questions;
create trigger questions_before_write
  before insert or update on questions
  for each row execute function exam_questions_before_write();

create or replace function exam_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists exams_touch_updated_at on exams;
create trigger exams_touch_updated_at
  before update on exams
  for each row execute function exam_touch_updated_at();

-- A user editing their own profile cannot change their role or reactivate a
-- deactivated account. Staff edits pass through untouched.
create or replace function exam_guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or exam_is_staff() then
    return new;
  end if;
  if new.id = auth.uid() then
    new.role := old.role;
    new.is_active := old.is_active;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_update on profiles;
create trigger profiles_guard_update
  before update on profiles
  for each row execute function exam_guard_profile_update();

-- Mirror new auth users into profiles. The main windchasers site does not
-- create auth users, so this trigger is owned by the exam platform.
create or replace function handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Role is never read from raw_user_meta_data. That field is set verbatim by
  -- the client on signUp, so trusting it would let anyone self promote. Staff
  -- are promoted afterwards by an admin, see the README.
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_auth_user();

-- ---------------------------------------------------------------------------
-- 5. Helper functions
-- ---------------------------------------------------------------------------

create or replace function exam_is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and is_active
      and role in ('admin', 'instructor')
  );
$$;

create or replace function exam_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and is_active and role = 'admin'
  );
$$;

-- True when the caller may read a given batch. Admins see every batch,
-- instructors only the ones they are assigned to via instructor_batches.
create or replace function exam_can_see_batch(p_batch_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exam_is_admin() or exists (
    select 1 from instructor_batches ib
    where ib.batch_id = p_batch_id and ib.instructor_id = auth.uid()
  );
$$;

-- True when the caller may read a given student's results. Admins see all,
-- instructors only students enrolled in a batch assigned to them.
create or replace function exam_can_see_student(p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exam_is_admin() or exists (
    select 1
    from batch_enrollments be
    join instructor_batches ib on ib.batch_id = be.batch_id
    where be.student_id = p_student_id and ib.instructor_id = auth.uid()
  );
$$;

create or replace function exam_is_assigned(p_exam_id uuid, p_student_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from exam_assignments ea
    left join batch_enrollments be
      on be.batch_id = ea.batch_id and be.student_id = p_student_id
    where ea.exam_id = p_exam_id
      and (ea.student_id = p_student_id or be.id is not null)
  );
$$;

-- Deadline of an attempt: start plus the exam duration, clipped to closes_at.
create or replace function exam_attempt_deadline(p_attempt_id uuid)
returns timestamptz
language sql
stable
security definer
set search_path = public
as $$
  select least(
    a.started_at + make_interval(mins => e.duration_minutes),
    coalesce(e.closes_at, a.started_at + make_interval(mins => e.duration_minutes))
  )
  from attempts a
  join exams e on e.id = a.exam_id
  where a.id = p_attempt_id;
$$;

-- ---------------------------------------------------------------------------
-- 6. Row level security
-- ---------------------------------------------------------------------------

alter table profiles enable row level security;
alter table batches enable row level security;
alter table batch_enrollments enable row level security;
alter table subjects enable row level security;
alter table topics enable row level security;
alter table questions enable row level security;
alter table exams enable row level security;
alter table exam_questions enable row level security;
alter table exam_rules enable row level security;
alter table exam_assignments enable row level security;
alter table attempts enable row level security;
alter table attempt_answers enable row level security;
alter table instructor_batches enable row level security;
alter table practice_sessions enable row level security;
alter table practice_answers enable row level security;

-- Permission model, from the system definition:
--   admin      full control over users, batches, questions, exams, reporting
--   instructor assess but not administer. Creates and assigns exams, adds
--              questions, reads results for its assigned batches only.
--              Cannot manage accounts and cannot delete data.
--   student    own performance only
-- So write policies split three ways: exam_is_staff() for the things an
-- instructor may author, exam_is_admin() for accounts, taxonomy and every
-- destructive path, and owner checks for students.

-- profiles: staff read, only admins may create or modify other accounts
drop policy if exists profiles_select on profiles;
create policy profiles_select on profiles
  for select to authenticated
  using (id = auth.uid() or exam_is_staff());

-- Students may edit their own name and phone. The trigger below is what stops
-- them promoting themselves, a policy subquery against profiles would have to
-- re-enter this same table.
drop policy if exists profiles_update_self on profiles;
create policy profiles_update_self on profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists profiles_staff_write on profiles;
drop policy if exists profiles_admin_write on profiles;
create policy profiles_admin_write on profiles
  for all to authenticated
  using (exam_is_admin())
  with check (exam_is_admin());

-- instructor_batches: admins assign, instructors may see their own rows
drop policy if exists instructor_batches_read on instructor_batches;
create policy instructor_batches_read on instructor_batches
  for select to authenticated
  using (exam_is_admin() or instructor_id = auth.uid());

drop policy if exists instructor_batches_admin_write on instructor_batches;
create policy instructor_batches_admin_write on instructor_batches
  for all to authenticated
  using (exam_is_admin())
  with check (exam_is_admin());

-- subjects and topics: every signed in user can read. The taxonomy is kept
-- by admin, so instructors cannot reshape it under a live question bank.
drop policy if exists subjects_read on subjects;
create policy subjects_read on subjects
  for select to authenticated using (true);

drop policy if exists subjects_staff_write on subjects;
drop policy if exists subjects_admin_write on subjects;
create policy subjects_admin_write on subjects
  for all to authenticated using (exam_is_admin()) with check (exam_is_admin());

drop policy if exists topics_read on topics;
create policy topics_read on topics
  for select to authenticated using (true);

drop policy if exists topics_staff_write on topics;
drop policy if exists topics_admin_write on topics;
create policy topics_admin_write on topics
  for all to authenticated using (exam_is_admin()) with check (exam_is_admin());

-- batches: enrolment is account management, so admin only
drop policy if exists batches_read on batches;
create policy batches_read on batches
  for select to authenticated
  using (
    exam_is_staff()
    or exists (
      select 1 from batch_enrollments be
      where be.batch_id = batches.id and be.student_id = auth.uid()
    )
  );

drop policy if exists batches_staff_write on batches;
drop policy if exists batches_admin_write on batches;
create policy batches_admin_write on batches
  for all to authenticated using (exam_is_admin()) with check (exam_is_admin());

drop policy if exists batch_enrollments_read on batch_enrollments;
create policy batch_enrollments_read on batch_enrollments
  for select to authenticated
  using (exam_is_staff() or student_id = auth.uid());

drop policy if exists batch_enrollments_staff_write on batch_enrollments;
drop policy if exists batch_enrollments_admin_write on batch_enrollments;
create policy batch_enrollments_admin_write on batch_enrollments
  for all to authenticated using (exam_is_admin()) with check (exam_is_admin());

-- questions: staff read and author, only admin may delete. Students never
-- select this table directly, they read sanitized rows through security
-- definer RPCs. Archiving is an update, so instructors can still retire a
-- question without being able to destroy its history.
drop policy if exists questions_staff_all on questions;
drop policy if exists questions_staff_read on questions;
create policy questions_staff_read on questions
  for select to authenticated using (exam_is_staff());

drop policy if exists questions_staff_insert on questions;
create policy questions_staff_insert on questions
  for insert to authenticated with check (exam_is_staff());

drop policy if exists questions_staff_update on questions;
create policy questions_staff_update on questions
  for update to authenticated using (exam_is_staff()) with check (exam_is_staff());

drop policy if exists questions_admin_delete on questions;
create policy questions_admin_delete on questions
  for delete to authenticated using (exam_is_admin());

-- exam composition: instructors build papers, so they may add and remove rows
-- here. This is composition of a draft, not deletion of recorded data.
drop policy if exists exam_questions_staff_all on exam_questions;
create policy exam_questions_staff_all on exam_questions
  for all to authenticated using (exam_is_staff()) with check (exam_is_staff());

drop policy if exists exam_rules_staff_all on exam_rules;
create policy exam_rules_staff_all on exam_rules
  for all to authenticated using (exam_is_staff()) with check (exam_is_staff());

-- exams: staff author, students see published exams assigned to them,
-- only admin may delete an exam and the attempts hanging off it
drop policy if exists exams_read on exams;
create policy exams_read on exams
  for select to authenticated
  using (
    exam_is_staff()
    or (status = 'published' and exam_is_assigned(exams.id))
  );

drop policy if exists exams_staff_write on exams;
drop policy if exists exams_staff_insert on exams;
create policy exams_staff_insert on exams
  for insert to authenticated with check (exam_is_staff());

drop policy if exists exams_staff_update on exams;
create policy exams_staff_update on exams
  for update to authenticated using (exam_is_staff()) with check (exam_is_staff());

drop policy if exists exams_admin_delete on exams;
create policy exams_admin_delete on exams
  for delete to authenticated using (exam_is_admin());

-- assignment is an instructor duty, so staff may write it outright
drop policy if exists exam_assignments_read on exam_assignments;
create policy exam_assignments_read on exam_assignments
  for select to authenticated
  using (
    exam_is_staff()
    or student_id = auth.uid()
    or exists (
      select 1 from batch_enrollments be
      where be.batch_id = exam_assignments.batch_id and be.student_id = auth.uid()
    )
  );

drop policy if exists exam_assignments_staff_write on exam_assignments;
create policy exam_assignments_staff_write on exam_assignments
  for all to authenticated using (exam_is_staff()) with check (exam_is_staff());

-- attempts: students read their own only, instructors read the batches they
-- are assigned to, admins read everything. All writes go through RPCs so a
-- client cannot forge a score.
drop policy if exists attempts_read on attempts;
create policy attempts_read on attempts
  for select to authenticated
  using (student_id = auth.uid() or exam_can_see_student(attempts.student_id));

drop policy if exists attempts_staff_write on attempts;
drop policy if exists attempts_admin_write on attempts;
create policy attempts_admin_write on attempts
  for all to authenticated using (exam_is_admin()) with check (exam_is_admin());

drop policy if exists attempt_answers_read on attempt_answers;
create policy attempt_answers_read on attempt_answers
  for select to authenticated
  using (
    exists (
      select 1 from attempts a
      where a.id = attempt_answers.attempt_id
        and (a.student_id = auth.uid() or exam_can_see_student(a.student_id))
    )
  );

drop policy if exists attempt_answers_staff_write on attempt_answers;
drop policy if exists attempt_answers_admin_write on attempt_answers;
create policy attempt_answers_admin_write on attempt_answers
  for all to authenticated using (exam_is_admin()) with check (exam_is_admin());

-- practice: students read their own, staff read within their scope. Writes go
-- through RPCs, same as attempts.
drop policy if exists practice_sessions_read on practice_sessions;
create policy practice_sessions_read on practice_sessions
  for select to authenticated
  using (student_id = auth.uid() or exam_can_see_student(practice_sessions.student_id));

drop policy if exists practice_sessions_admin_write on practice_sessions;
create policy practice_sessions_admin_write on practice_sessions
  for all to authenticated using (exam_is_admin()) with check (exam_is_admin());

drop policy if exists practice_answers_read on practice_answers;
create policy practice_answers_read on practice_answers
  for select to authenticated
  using (
    exists (
      select 1 from practice_sessions ps
      where ps.id = practice_answers.session_id
        and (ps.student_id = auth.uid() or exam_can_see_student(ps.student_id))
    )
  );

drop policy if exists practice_answers_admin_write on practice_answers;
create policy practice_answers_admin_write on practice_answers
  for all to authenticated using (exam_is_admin()) with check (exam_is_admin());

-- ---------------------------------------------------------------------------
-- 7. Core RPCs
-- ---------------------------------------------------------------------------

-- Fill exam_questions from exam_rules. Raises when a rule cannot be satisfied.
create or replace function generate_exam_questions(p_exam_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rule record;
  v_next integer := 0;
  v_available integer;
  v_inserted integer := 0;
begin
  if not exam_is_staff() then
    raise exception 'Only staff can generate exam questions';
  end if;

  if not exists (select 1 from exams where id = p_exam_id) then
    raise exception 'Exam not found';
  end if;

  delete from exam_questions where exam_id = p_exam_id;

  for v_rule in
    select * from exam_rules where exam_id = p_exam_id order by id
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
      raise exception 'Rule needs % questions but only % are available', v_rule.question_count, v_available;
    end if;

    insert into exam_questions (exam_id, question_id, order_index)
    select p_exam_id, q.id, v_next + row_number() over () - 1
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

    v_next := v_next + v_rule.question_count;
    v_inserted := v_inserted + v_rule.question_count;
  end loop;

  update exams
  set total_marks = v_inserted * marks_per_question
  where id = p_exam_id;

  return v_inserted;
end;
$$;

-- Grade an attempt. Shared by submit_attempt and auto_expire_attempts.
create or replace function exam_grade_attempt(p_attempt_id uuid, p_status attempt_status)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt attempts%rowtype;
  v_exam exams%rowtype;
  v_total integer;
  v_correct integer;
  v_incorrect integer;
  v_deadline timestamptz;
  v_end timestamptz;
begin
  select * into v_attempt from attempts where id = p_attempt_id for update;
  if not found then
    raise exception 'Attempt not found';
  end if;
  if v_attempt.status <> 'in_progress' then
    return;
  end if;

  select * into v_exam from exams where id = v_attempt.exam_id;

  -- Grade every stored answer against the authoritative correct_option
  update attempt_answers aa
  set is_correct = (aa.selected_option is not null and aa.selected_option = q.correct_option)
  from questions q
  where q.id = aa.question_id and aa.attempt_id = p_attempt_id;

  select count(*) into v_total
  from exam_questions where exam_id = v_attempt.exam_id;

  select
    count(*) filter (where aa.is_correct),
    count(*) filter (where aa.selected_option is not null and not aa.is_correct)
  into v_correct, v_incorrect
  from attempt_answers aa
  join exam_questions eq
    on eq.exam_id = v_attempt.exam_id and eq.question_id = aa.question_id
  where aa.attempt_id = p_attempt_id;

  v_correct := coalesce(v_correct, 0);
  v_incorrect := coalesce(v_incorrect, 0);

  v_deadline := exam_attempt_deadline(p_attempt_id);
  v_end := case when p_status = 'submitted' then now() else least(now(), v_deadline) end;

  update attempts
  set status = p_status,
      submitted_at = v_end,
      score = greatest(
        0,
        (v_correct * v_exam.marks_per_question) - (v_incorrect * v_exam.negative_marks)
      ),
      total_questions = v_total,
      correct_count = v_correct,
      incorrect_count = v_incorrect,
      unattempted_count = greatest(0, v_total - v_correct - v_incorrect),
      time_taken_seconds = greatest(0, extract(epoch from (v_end - started_at))::integer)
  where id = p_attempt_id;
end;
$$;

-- Expire any in progress attempt that is past its deadline. Safe to call from
-- pg_cron and also called lazily on every start, save and submit.
create or replace function auto_expire_attempts()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_count integer := 0;
begin
  for v_id in
    select a.id
    from attempts a
    join exams e on e.id = a.exam_id
    where a.status = 'in_progress'
      and now() > least(
        a.started_at + make_interval(mins => e.duration_minutes),
        coalesce(e.closes_at, a.started_at + make_interval(mins => e.duration_minutes))
      )
  loop
    perform exam_grade_attempt(v_id, 'auto_submitted');
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

-- Sanitized question payload for a live attempt. Never exposes correct_option
-- or explanation.
create or replace function exam_attempt_questions(p_attempt_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', t.id,
        'stem', t.stem,
        'option_a', t.option_a,
        'option_b', t.option_b,
        'option_c', t.option_c,
        'option_d', t.option_d,
        'image_url', t.image_url,
        'subject_id', t.subject_id,
        'subject_name', t.subject_name,
        'topic_id', t.topic_id,
        'topic_name', t.topic_name,
        'order_index', t.display_order
      )
      order by t.display_order
    ),
    '[]'::jsonb
  )
  from (
    select
      q.id,
      q.stem,
      q.option_a,
      q.option_b,
      q.option_c,
      q.option_d,
      q.image_url,
      q.subject_id,
      s.name as subject_name,
      q.topic_id,
      tp.name as topic_name,
      row_number() over (
        order by
          case when e.shuffle_questions
            then md5(a.id::text || eq.question_id::text)
            else lpad(eq.order_index::text, 10, '0')
          end
      ) - 1 as display_order
    from attempts a
    join exams e on e.id = a.exam_id
    join exam_questions eq on eq.exam_id = a.exam_id
    join questions q on q.id = eq.question_id
    join subjects s on s.id = q.subject_id
    left join topics tp on tp.id = q.topic_id
    where a.id = p_attempt_id
  ) t;
$$;

-- Start or resume an attempt.
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

create or replace function save_answer(
  p_attempt_id uuid,
  p_question_id uuid,
  p_selected_option char(1),
  p_marked_for_review boolean default false,
  p_time_spent_seconds integer default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt attempts%rowtype;
  v_deadline timestamptz;
begin
  -- auth.uid() is null for an anonymous caller, and `uuid <> null` is null,
  -- not true, so the ownership test below would be skipped. Reject early.
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_attempt from attempts where id = p_attempt_id;
  if not found then
    raise exception 'Attempt not found';
  end if;
  if v_attempt.student_id is distinct from auth.uid() then
    raise exception 'This attempt does not belong to you';
  end if;
  if v_attempt.status <> 'in_progress' then
    raise exception 'This attempt is already closed';
  end if;

  v_deadline := exam_attempt_deadline(p_attempt_id);
  if now() > v_deadline then
    -- Report the expiry as a value, not an exception. Raising here would roll
    -- back the grading we just did in the same transaction.
    perform exam_grade_attempt(p_attempt_id, 'auto_submitted');
    return jsonb_build_object(
      'saved', false,
      'expired', true,
      'message', 'Time is up, the attempt was submitted automatically',
      'server_now', now(),
      'deadline', v_deadline
    );
  end if;

  if p_selected_option is not null and upper(p_selected_option) not in ('A', 'B', 'C', 'D') then
    raise exception 'Invalid option';
  end if;

  if not exists (
    select 1 from exam_questions
    where exam_id = v_attempt.exam_id and question_id = p_question_id
  ) then
    raise exception 'That question is not part of this exam';
  end if;

  insert into attempt_answers (
    attempt_id, question_id, selected_option, marked_for_review, time_spent_seconds, answered_at
  )
  values (
    p_attempt_id,
    p_question_id,
    upper(p_selected_option),
    coalesce(p_marked_for_review, false),
    greatest(0, coalesce(p_time_spent_seconds, 0)),
    case when p_selected_option is null then null else now() end
  )
  on conflict (attempt_id, question_id) do update
  set selected_option = excluded.selected_option,
      marked_for_review = excluded.marked_for_review,
      time_spent_seconds = greatest(attempt_answers.time_spent_seconds, excluded.time_spent_seconds),
      answered_at = excluded.answered_at;

  return jsonb_build_object(
    'saved', true,
    'expired', false,
    'server_now', now(),
    'deadline', v_deadline
  );
end;
$$;

create or replace function record_tab_switch(p_attempt_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  update attempts
  set tab_switch_count = tab_switch_count + 1
  where id = p_attempt_id
    and student_id = auth.uid()
    and status = 'in_progress'
  returning tab_switch_count into v_count;

  return coalesce(v_count, 0);
end;
$$;

create or replace function submit_attempt(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt attempts%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_attempt from attempts where id = p_attempt_id;
  if not found then
    raise exception 'Attempt not found';
  end if;
  if v_attempt.student_id is distinct from auth.uid()
     and not exam_can_see_student(v_attempt.student_id) then
    raise exception 'This attempt does not belong to you';
  end if;

  if v_attempt.status = 'in_progress' then
    if now() > exam_attempt_deadline(p_attempt_id) then
      perform exam_grade_attempt(p_attempt_id, 'auto_submitted');
    else
      perform exam_grade_attempt(p_attempt_id, 'submitted');
    end if;
  end if;

  select * into v_attempt from attempts where id = p_attempt_id;

  return jsonb_build_object(
    'attempt_id', v_attempt.id,
    'status', v_attempt.status,
    'score', v_attempt.score,
    'total_questions', v_attempt.total_questions,
    'correct_count', v_attempt.correct_count,
    'incorrect_count', v_attempt.incorrect_count,
    'unattempted_count', v_attempt.unattempted_count,
    'time_taken_seconds', v_attempt.time_taken_seconds
  );
end;
$$;

-- Full result payload. Solutions are attached only when the attempt is closed
-- and the exam allows review.
create or replace function get_attempt_result(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt attempts%rowtype;
  v_exam exams%rowtype;
  v_is_staff boolean := exam_is_staff();
  v_can_review boolean;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_attempt from attempts where id = p_attempt_id;
  if not found then
    raise exception 'Attempt not found';
  end if;
  if v_attempt.student_id is distinct from auth.uid()
     and not exam_can_see_student(v_attempt.student_id) then
    raise exception 'This attempt does not belong to you';
  end if;
  if v_attempt.status = 'in_progress' then
    raise exception 'This attempt is still in progress';
  end if;

  select * into v_exam from exams where id = v_attempt.exam_id;
  v_can_review := v_is_staff or v_exam.allow_review;

  return jsonb_build_object(
    'attempt', jsonb_build_object(
      'id', v_attempt.id,
      'exam_id', v_attempt.exam_id,
      'status', v_attempt.status,
      'started_at', v_attempt.started_at,
      'submitted_at', v_attempt.submitted_at,
      'score', v_attempt.score,
      'total_questions', v_attempt.total_questions,
      'correct_count', v_attempt.correct_count,
      'incorrect_count', v_attempt.incorrect_count,
      'unattempted_count', v_attempt.unattempted_count,
      'time_taken_seconds', v_attempt.time_taken_seconds,
      'tab_switch_count', v_attempt.tab_switch_count
    ),
    'exam', jsonb_build_object(
      'id', v_exam.id,
      'title', v_exam.title,
      'type', v_exam.type,
      'duration_minutes', v_exam.duration_minutes,
      'total_marks', v_exam.total_marks,
      'marks_per_question', v_exam.marks_per_question,
      'negative_marks', v_exam.negative_marks,
      'allow_review', v_exam.allow_review,
      'show_leaderboard', v_exam.show_leaderboard
    ),
    -- Average across the batches this student belongs to, so the score reads
    -- against its cohort. Falls back to the whole exam when the student is not
    -- enrolled anywhere, which is the case for a one off individual assignment.
    'batch_average', (
      select round(avg(a2.score), 2)
      from attempts a2
      where a2.exam_id = v_attempt.exam_id
        and a2.status <> 'in_progress'
        and (
          exists (
            select 1
            from batch_enrollments mine
            join batch_enrollments theirs on theirs.batch_id = mine.batch_id
            where mine.student_id = v_attempt.student_id
              and theirs.student_id = a2.student_id
          )
          or not exists (
            select 1 from batch_enrollments mine
            where mine.student_id = v_attempt.student_id
          )
        )
    ),
    -- Batch leaderboard, on by default and disableable per exam. Staff always
    -- see it. Emails are never included here, this is a student facing list.
    'leaderboard', case
      when not (v_is_staff or v_exam.show_leaderboard) then '[]'::jsonb
      else coalesce((
        select jsonb_agg(x order by (x ->> 'rank')::bigint)
        from (
          select jsonb_build_object(
            'student_name', p.full_name,
            'score', a2.score,
            'time_taken_seconds', a2.time_taken_seconds,
            'is_you', a2.student_id = v_attempt.student_id,
            'rank', rank() over (
              order by a2.score desc nulls last, a2.time_taken_seconds asc
            )
          ) as x
          from attempts a2
          join profiles p on p.id = a2.student_id
          where a2.exam_id = v_attempt.exam_id
            and a2.status <> 'in_progress'
            and (
              v_is_staff
              or exists (
                select 1
                from batch_enrollments mine
                join batch_enrollments theirs on theirs.batch_id = mine.batch_id
                where mine.student_id = v_attempt.student_id
                  and theirs.student_id = a2.student_id
              )
            )
        ) sub
      ), '[]'::jsonb)
    end,
    'subject_breakdown', coalesce((
      select jsonb_agg(x order by x ->> 'subject_name')
      from (
        select jsonb_build_object(
          'subject_id', s.id,
          'subject_name', s.name,
          'total', count(*),
          'correct', count(*) filter (where aa.is_correct),
          'incorrect', count(*) filter (where aa.selected_option is not null and not aa.is_correct),
          'unattempted', count(*) filter (where aa.selected_option is null)
        ) as x
        from attempt_answers aa
        join questions q on q.id = aa.question_id
        join subjects s on s.id = q.subject_id
        where aa.attempt_id = p_attempt_id
        group by s.id, s.name
      ) sub
    ), '[]'::jsonb),
    'topic_breakdown', coalesce((
      select jsonb_agg(x order by x ->> 'topic_name')
      from (
        select jsonb_build_object(
          'topic_id', tp.id,
          'topic_name', tp.name,
          'subject_name', s.name,
          'total', count(*),
          'correct', count(*) filter (where aa.is_correct)
        ) as x
        from attempt_answers aa
        join questions q on q.id = aa.question_id
        join subjects s on s.id = q.subject_id
        join topics tp on tp.id = q.topic_id
        where aa.attempt_id = p_attempt_id
        group by tp.id, tp.name, s.name
      ) sub
    ), '[]'::jsonb),
    'can_review', v_can_review,
    'questions', case when not v_can_review then '[]'::jsonb else coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', q.id,
          'stem', q.stem,
          'option_a', q.option_a,
          'option_b', q.option_b,
          'option_c', q.option_c,
          'option_d', q.option_d,
          'image_url', q.image_url,
          'correct_option', q.correct_option,
          'explanation', q.explanation,
          'subject_name', s.name,
          'topic_name', tp.name,
          'selected_option', aa.selected_option,
          'is_correct', aa.is_correct,
          'marked_for_review', aa.marked_for_review,
          'time_spent_seconds', aa.time_spent_seconds,
          'order_index', eq.order_index
        )
        order by eq.order_index
      )
      from attempt_answers aa
      join questions q on q.id = aa.question_id
      join exam_questions eq on eq.exam_id = v_attempt.exam_id and eq.question_id = q.id
      join subjects s on s.id = q.subject_id
      left join topics tp on tp.id = q.topic_id
      where aa.attempt_id = p_attempt_id
    ), '[]'::jsonb) end
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Practice mode RPCs
-- ---------------------------------------------------------------------------

-- Opens a practice session and hands back the drawn questions, sanitized the
-- same way an exam is. The session row is what makes practice reportable
-- without letting it near the attempts table.
create or replace function start_practice(
  p_subject_id uuid,
  p_topic_id uuid default null,
  p_count integer default 10,
  p_difficulty question_difficulty default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_limit integer := least(greatest(coalesce(p_count, 10), 1), 100);
  v_session_id uuid;
  v_questions jsonb;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', t.id,
    'stem', t.stem,
    'option_a', t.option_a,
    'option_b', t.option_b,
    'option_c', t.option_c,
    'option_d', t.option_d,
    'image_url', t.image_url,
    'subject_name', t.subject_name,
    'topic_name', t.topic_name,
    'difficulty', t.difficulty
  )), '[]'::jsonb)
  into v_questions
  from (
    select q.id, q.stem, q.option_a, q.option_b, q.option_c, q.option_d,
           q.image_url, s.name as subject_name, tp.name as topic_name, q.difficulty
    from questions q
    join subjects s on s.id = q.subject_id
    left join topics tp on tp.id = q.topic_id
    where q.status = 'active'
      and (p_subject_id is null or q.subject_id = p_subject_id)
      and (p_topic_id is null or q.topic_id = p_topic_id)
      and (p_difficulty is null or q.difficulty = p_difficulty)
    order by random()
    limit v_limit
  ) t;

  insert into practice_sessions (
    student_id, subject_id, topic_id, difficulty, question_count
  )
  values (
    v_uid, p_subject_id, p_topic_id, p_difficulty, jsonb_array_length(v_questions)
  )
  returning id into v_session_id;

  return jsonb_build_object(
    'session_id', v_session_id,
    'questions', v_questions
  );
end;
$$;

-- Instant feedback for practice. Logs the answer against the session, then
-- releases the key and the explanation. Practice is the one place a student
-- sees the answer without an exam level review flag, which is intended.
create or replace function check_practice_answer(
  p_session_id uuid,
  p_question_id uuid,
  p_selected_option char(1)
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_q questions%rowtype;
  v_session practice_sessions%rowtype;
  v_is_correct boolean;
  v_was_new boolean;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_session from practice_sessions where id = p_session_id;
  if not found then
    raise exception 'Practice session not found';
  end if;
  if v_session.student_id is distinct from v_uid then
    raise exception 'This practice session does not belong to you';
  end if;

  select * into v_q from questions where id = p_question_id and status = 'active';
  if not found then
    raise exception 'Question not found';
  end if;

  v_is_correct := upper(coalesce(p_selected_option, '')) = v_q.correct_option;

  insert into practice_answers (session_id, question_id, selected_option, is_correct)
  values (p_session_id, p_question_id, upper(nullif(p_selected_option, '')), v_is_correct)
  on conflict (session_id, question_id) do nothing;

  get diagnostics v_was_new = row_count;

  -- Only the first answer to a question counts, so re-checking cannot inflate
  -- the session totals.
  if v_was_new then
    update practice_sessions
    set answered_count = answered_count + 1,
        correct_count = correct_count + case when v_is_correct then 1 else 0 end
    where id = p_session_id;
  end if;

  return jsonb_build_object(
    'question_id', v_q.id,
    'correct_option', v_q.correct_option,
    'is_correct', v_is_correct,
    'explanation', v_q.explanation
  );
end;
$$;

create or replace function finish_practice(p_session_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session practice_sessions%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  update practice_sessions
  set ended_at = coalesce(ended_at, now())
  where id = p_session_id and student_id = auth.uid()
  returning * into v_session;

  if not found then
    raise exception 'Practice session not found';
  end if;

  return jsonb_build_object(
    'session_id', v_session.id,
    'question_count', v_session.question_count,
    'answered_count', v_session.answered_count,
    'correct_count', v_session.correct_count,
    'accuracy', case
      when v_session.answered_count = 0 then 0
      else round(100.0 * v_session.correct_count / v_session.answered_count, 1)
    end
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 9. Dashboard RPCs
-- ---------------------------------------------------------------------------

create or replace function get_student_dashboard()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  perform auto_expire_attempts();

  return jsonb_build_object(
    'exams', coalesce((
      select jsonb_agg(x order by x ->> 'opens_at' nulls first)
      from (
        select jsonb_build_object(
          'id', e.id,
          'title', e.title,
          'description', e.description,
          'type', e.type,
          'duration_minutes', e.duration_minutes,
          'total_marks', e.total_marks,
          'opens_at', e.opens_at,
          'closes_at', e.closes_at,
          'max_attempts', e.max_attempts,
          'attempts_used', (
            select count(*) from attempts a
            where a.exam_id = e.id and a.student_id = v_uid
          ),
          'in_progress_attempt_id', (
            select a.id from attempts a
            where a.exam_id = e.id and a.student_id = v_uid and a.status = 'in_progress'
            limit 1
          ),
          'last_attempt_id', (
            select a.id from attempts a
            where a.exam_id = e.id and a.student_id = v_uid and a.status <> 'in_progress'
            order by a.submitted_at desc nulls last limit 1
          ),
          'phase', case
            when e.opens_at is not null and now() < e.opens_at then 'upcoming'
            when e.closes_at is not null and now() > e.closes_at then 'closed'
            else 'live'
          end
        ) as x
        from exams e
        where e.status = 'published' and exam_is_assigned(e.id, v_uid)
      ) sub
    ), '[]'::jsonb),
    'stats', (
      select jsonb_build_object(
        'attempts', count(*),
        'questions_answered', coalesce(sum(a.correct_count + a.incorrect_count), 0),
        'correct', coalesce(sum(a.correct_count), 0),
        'accuracy', case
          when coalesce(sum(a.correct_count + a.incorrect_count), 0) = 0 then 0
          else round(
            100.0 * sum(a.correct_count) / sum(a.correct_count + a.incorrect_count), 1
          )
        end,
        'avg_score', coalesce(round(avg(a.score), 2), 0)
      )
      from attempts a
      where a.student_id = v_uid and a.status <> 'in_progress'
    ),
    'subject_accuracy', coalesce((
      select jsonb_agg(x order by (x ->> 'accuracy')::numeric)
      from (
        select jsonb_build_object(
          'subject_id', s.id,
          'subject_name', s.name,
          'answered', count(*) filter (where aa.selected_option is not null),
          'correct', count(*) filter (where aa.is_correct),
          'accuracy', case
            when count(*) filter (where aa.selected_option is not null) = 0 then 0
            else round(
              100.0 * count(*) filter (where aa.is_correct)
              / count(*) filter (where aa.selected_option is not null), 1
            )
          end
        ) as x
        from attempt_answers aa
        join attempts a on a.id = aa.attempt_id
        join questions q on q.id = aa.question_id
        join subjects s on s.id = q.subject_id
        where a.student_id = v_uid and a.status <> 'in_progress'
        group by s.id, s.name
        having count(*) filter (where aa.selected_option is not null) > 0
      ) sub
    ), '[]'::jsonb),
    -- Weakest topics are named, not inferred from the subject rollup. A topic
    -- needs at least three answered questions before it is called weak, so one
    -- unlucky question does not become a revision instruction.
    'weak_topics', coalesce((
      select jsonb_agg(x order by (x ->> 'accuracy')::numeric, x ->> 'topic_name')
      from (
        select jsonb_build_object(
          'topic_id', tp.id,
          'topic_name', tp.name,
          'subject_name', s.name,
          'answered', count(*) filter (where aa.selected_option is not null),
          'correct', count(*) filter (where aa.is_correct),
          'accuracy', round(
            100.0 * count(*) filter (where aa.is_correct)
            / nullif(count(*) filter (where aa.selected_option is not null), 0), 1
          )
        ) as x
        from attempt_answers aa
        join attempts a on a.id = aa.attempt_id
        join questions q on q.id = aa.question_id
        join topics tp on tp.id = q.topic_id
        join subjects s on s.id = q.subject_id
        where a.student_id = v_uid and a.status <> 'in_progress'
        group by tp.id, tp.name, s.name
        having count(*) filter (where aa.selected_option is not null) >= 3
        order by round(
          100.0 * count(*) filter (where aa.is_correct)
          / nullif(count(*) filter (where aa.selected_option is not null), 0), 1
        ), tp.name
        limit 3
      ) sub
    ), '[]'::jsonb),
    'recent_attempts', coalesce((
      select jsonb_agg(x order by x ->> 'submitted_at' desc)
      from (
        select jsonb_build_object(
          'id', a.id,
          'exam_title', e.title,
          'score', a.score,
          'total_marks', e.total_marks,
          'correct_count', a.correct_count,
          'total_questions', a.total_questions,
          'submitted_at', a.submitted_at,
          'status', a.status
        ) as x
        from attempts a
        join exams e on e.id = a.exam_id
        where a.student_id = v_uid and a.status <> 'in_progress'
        order by a.submitted_at desc nulls last
        limit 10
      ) sub
    ), '[]'::jsonb)
  );
end;
$$;

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
    'active_batches', (select count(*) from batches where is_active),
    'total_questions', (select count(*) from questions where status = 'active'),
    'published_exams', (select count(*) from exams where status = 'published'),
    'attempts_this_week', (
      select count(*) from attempts where started_at > now() - interval '7 days'
    ),
    'questions_by_subject', coalesce((
      select jsonb_agg(jsonb_build_object(
        'subject_id', s.id,
        'subject_name', s.name,
        'total', (select count(*) from questions q where q.subject_id = s.id and q.status = 'active')
      ) order by s.order_index)
      from subjects s
    ), '[]'::jsonb),
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
        order by a.started_at desc
        limit 15
      ) sub
    ), '[]'::jsonb)
  );
end;
$$;

-- Live availability counter used by the auto mode rule builder.
create or replace function count_available_questions(
  p_subject_id uuid,
  p_topic_id uuid default null,
  p_difficulty question_difficulty default null
)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select case when exam_is_staff() then (
    select count(*)::integer
    from questions q
    where q.status = 'active'
      and (p_subject_id is null or q.subject_id = p_subject_id)
      and (p_topic_id is null or q.topic_id = p_topic_id)
      and (p_difficulty is null or q.difficulty = p_difficulty)
  ) else 0 end;
$$;

-- Per exam analytics for the results page.
create or replace function get_exam_analytics(p_exam_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exam_is_staff() then
    raise exception 'Staff only';
  end if;

  -- Every per student aggregate below is filtered by exam_can_see_student.
  -- This function is security definer, so RLS does not apply and the scoping
  -- has to be written out here. An admin passes the check for everyone, an
  -- instructor only for students in the batches assigned to it.
  return jsonb_build_object(
    'exam', (
      select jsonb_build_object(
        'id', e.id, 'title', e.title, 'total_marks', e.total_marks,
        'marks_per_question', e.marks_per_question, 'negative_marks', e.negative_marks,
        'duration_minutes', e.duration_minutes, 'status', e.status
      )
      from exams e where e.id = p_exam_id
    ),
    'summary', (
      select jsonb_build_object(
        'attempts', count(*),
        'avg_score', coalesce(round(avg(a.score), 2), 0),
        'high_score', coalesce(max(a.score), 0),
        'low_score', coalesce(min(a.score), 0),
        'avg_time_seconds', coalesce(round(avg(a.time_taken_seconds)), 0)
      )
      from attempts a
      where a.exam_id = p_exam_id and a.status <> 'in_progress'
        and exam_can_see_student(a.student_id)
    ),
    'leaderboard', coalesce((
      select jsonb_agg(x order by (x ->> 'rank')::bigint)
      from (
        select jsonb_build_object(
          'attempt_id', a.id,
          'student_id', p.id,
          'student_name', p.full_name,
          'email', p.email,
          'score', a.score,
          'correct_count', a.correct_count,
          'incorrect_count', a.incorrect_count,
          'unattempted_count', a.unattempted_count,
          'time_taken_seconds', a.time_taken_seconds,
          'tab_switch_count', a.tab_switch_count,
          'submitted_at', a.submitted_at,
          'rank', rank() over (order by a.score desc nulls last, a.time_taken_seconds asc)
        ) as x
        from attempts a
        join profiles p on p.id = a.student_id
        where a.exam_id = p_exam_id and a.status <> 'in_progress'
          and exam_can_see_student(a.student_id)
        order by a.score desc nulls last, a.time_taken_seconds asc
      ) sub
    ), '[]'::jsonb),
    'question_analytics', coalesce((
      select jsonb_agg(x order by (x ->> 'order_index')::integer)
      from (
        select jsonb_build_object(
          'question_id', q.id,
          'order_index', eq.order_index,
          'stem', q.stem,
          'correct_option', q.correct_option,
          'attempted', count(*) filter (where aa.selected_option is not null),
          'correct', count(*) filter (where aa.is_correct),
          'percent_correct', case
            when count(*) filter (where aa.selected_option is not null) = 0 then 0
            else round(
              100.0 * count(*) filter (where aa.is_correct)
              / count(*) filter (where aa.selected_option is not null), 1
            )
          end,
          'option_counts', jsonb_build_object(
            'A', count(*) filter (where aa.selected_option = 'A'),
            'B', count(*) filter (where aa.selected_option = 'B'),
            'C', count(*) filter (where aa.selected_option = 'C'),
            'D', count(*) filter (where aa.selected_option = 'D')
          )
        ) as x
        from exam_questions eq
        join questions q on q.id = eq.question_id
        -- Restrict to answers from attempts on THIS exam. Joining
        -- attempt_answers directly would pull in answers to the same question
        -- from other exams that reuse it.
        left join (
          select aa.question_id, aa.selected_option, aa.is_correct
          from attempt_answers aa
          join attempts a on a.id = aa.attempt_id
          where a.exam_id = p_exam_id and a.status <> 'in_progress'
            and exam_can_see_student(a.student_id)
        ) aa on aa.question_id = q.id
        where eq.exam_id = p_exam_id
        group by q.id, eq.order_index, q.stem, q.correct_option
      ) sub
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function get_student_report(p_student_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  if auth.uid() is distinct from p_student_id
     and not exam_can_see_student(p_student_id) then
    raise exception 'Not permitted to read this student';
  end if;

  return jsonb_build_object(
    'student', (
      select jsonb_build_object(
        'id', p.id, 'full_name', p.full_name, 'email', p.email,
        'phone', p.phone, 'is_active', p.is_active, 'created_at', p.created_at,
        'batches', coalesce((
          select jsonb_agg(jsonb_build_object('id', b.id, 'name', b.name, 'code', b.code))
          from batch_enrollments be join batches b on b.id = be.batch_id
          where be.student_id = p.id
        ), '[]'::jsonb)
      )
      from profiles p where p.id = p_student_id
    ),
    'stats', (
      select jsonb_build_object(
        'attempts', count(*),
        'avg_score', coalesce(round(avg(a.score), 2), 0),
        'accuracy', case
          when coalesce(sum(a.correct_count + a.incorrect_count), 0) = 0 then 0
          else round(100.0 * sum(a.correct_count) / sum(a.correct_count + a.incorrect_count), 1)
        end
      )
      from attempts a
      where a.student_id = p_student_id and a.status <> 'in_progress'
    ),
    'subject_accuracy', coalesce((
      select jsonb_agg(x order by x ->> 'subject_name')
      from (
        select jsonb_build_object(
          'subject_name', s.name,
          'answered', count(*) filter (where aa.selected_option is not null),
          'correct', count(*) filter (where aa.is_correct),
          'accuracy', case
            when count(*) filter (where aa.selected_option is not null) = 0 then 0
            else round(100.0 * count(*) filter (where aa.is_correct)
              / count(*) filter (where aa.selected_option is not null), 1)
          end
        ) as x
        from attempt_answers aa
        join attempts a on a.id = aa.attempt_id
        join questions q on q.id = aa.question_id
        join subjects s on s.id = q.subject_id
        where a.student_id = p_student_id and a.status <> 'in_progress'
        group by s.id, s.name
      ) sub
    ), '[]'::jsonb),
    'attempts', coalesce((
      select jsonb_agg(x order by x ->> 'submitted_at' desc)
      from (
        select jsonb_build_object(
          'id', a.id, 'exam_title', e.title, 'score', a.score,
          'total_marks', e.total_marks, 'correct_count', a.correct_count,
          'total_questions', a.total_questions, 'status', a.status,
          'submitted_at', a.submitted_at, 'time_taken_seconds', a.time_taken_seconds
        ) as x
        from attempts a join exams e on e.id = a.exam_id
        where a.student_id = p_student_id and a.status <> 'in_progress'
      ) sub
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function get_batch_performance(p_batch_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exam_can_see_batch(p_batch_id) then
    raise exception 'Not permitted to read this batch';
  end if;

  return jsonb_build_object(
    'students', coalesce((
      select jsonb_agg(x order by (x ->> 'avg_score')::numeric desc nulls last)
      from (
        select jsonb_build_object(
          'id', p.id,
          'full_name', p.full_name,
          'email', p.email,
          'attempts', (
            select count(*) from attempts a
            where a.student_id = p.id and a.status <> 'in_progress'
          ),
          'avg_score', (
            select round(avg(a.score), 2) from attempts a
            where a.student_id = p.id and a.status <> 'in_progress'
          ),
          'accuracy', (
            select case
              when coalesce(sum(a.correct_count + a.incorrect_count), 0) = 0 then 0
              else round(100.0 * sum(a.correct_count) / sum(a.correct_count + a.incorrect_count), 1)
            end
            from attempts a
            where a.student_id = p.id and a.status <> 'in_progress'
          )
        ) as x
        from batch_enrollments be
        join profiles p on p.id = be.student_id
        where be.batch_id = p_batch_id
      ) sub
    ), '[]'::jsonb)
  );
end;
$$;

-- Batch to batch comparison. Only batches the caller may see are returned, so
-- an instructor compares its own batches and an admin compares all of them.
-- Records the caller's GoTrue session as the one active session for the
-- account. Called right after a successful sign in. Older sessions keep valid
-- tokens but fail the session_current check below and get signed out.
create or replace function claim_active_session()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session uuid := nullif(auth.jwt() ->> 'session_id', '')::uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;
  -- A token without a session claim cannot be pinned, so nothing is enforced
  -- rather than locking the account out.
  if v_session is null then
    return;
  end if;
  update profiles set active_session_id = v_session where id = auth.uid();
end;
$$;

-- Single round trip used by the route middleware: role, active flag, and
-- whether this request carries the account's current session.
create or replace function get_session_context()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'role', p.role,
    'is_active', p.is_active,
    'session_current', (
      nullif(auth.jwt() ->> 'session_id', '') is null
      or p.active_session_id is null
      or p.active_session_id = (auth.jwt() ->> 'session_id')::uuid
    )
  )
  from profiles p
  where p.id = auth.uid();
$$;

create or replace function compare_batches()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exam_is_staff() then
    raise exception 'Staff only';
  end if;

  return coalesce((
    select jsonb_agg(x order by x ->> 'name')
    from (
      select jsonb_build_object(
        'batch_id', b.id,
        'name', b.name,
        'code', b.code,
        'is_active', b.is_active,
        'student_count', (
          select count(*) from batch_enrollments be where be.batch_id = b.id
        ),
        'attempts', (
          select count(*)
          from attempts a
          join batch_enrollments be on be.student_id = a.student_id
          where be.batch_id = b.id and a.status <> 'in_progress'
        ),
        'avg_score', (
          select round(avg(a.score), 2)
          from attempts a
          join batch_enrollments be on be.student_id = a.student_id
          where be.batch_id = b.id and a.status <> 'in_progress'
        ),
        'accuracy', (
          select case
            when coalesce(sum(a.correct_count + a.incorrect_count), 0) = 0 then 0
            else round(
              100.0 * sum(a.correct_count)
              / sum(a.correct_count + a.incorrect_count), 1
            )
          end
          from attempts a
          join batch_enrollments be on be.student_id = a.student_id
          where be.batch_id = b.id and a.status <> 'in_progress'
        )
      ) as x
      from batches b
      where exam_can_see_batch(b.id)
    ) sub
  ), '[]'::jsonb);
end;
$$;

-- ---------------------------------------------------------------------------
-- 10. Grants. Table access stays governed by RLS, RPCs are the write path.
-- ---------------------------------------------------------------------------

-- Table privileges. Supabase ships default privileges that grant new public
-- tables to anon as well as authenticated, so anon is revoked explicitly here.
-- Nothing in this app is world readable, every read is behind a login.
grant select, insert, update, delete on
  profiles, batches, batch_enrollments, instructor_batches, subjects, topics,
  questions, exams, exam_questions, exam_rules, exam_assignments, attempts,
  attempt_answers, practice_sessions, practice_answers
  to authenticated;

revoke all on
  profiles, batches, batch_enrollments, instructor_batches, subjects, topics,
  questions, exams, exam_questions, exam_rules, exam_assignments, attempts,
  attempt_answers, practice_sessions, practice_answers
  from anon;

grant execute on function start_attempt(uuid) to authenticated;
grant execute on function save_answer(uuid, uuid, char, boolean, integer) to authenticated;
grant execute on function submit_attempt(uuid) to authenticated;
grant execute on function record_tab_switch(uuid) to authenticated;
grant execute on function get_attempt_result(uuid) to authenticated;
grant execute on function start_practice(uuid, uuid, integer, question_difficulty) to authenticated;
grant execute on function check_practice_answer(uuid, uuid, char) to authenticated;
grant execute on function finish_practice(uuid) to authenticated;
grant execute on function get_student_dashboard() to authenticated;
grant execute on function get_admin_dashboard() to authenticated;
grant execute on function get_exam_analytics(uuid) to authenticated;
grant execute on function get_student_report(uuid) to authenticated;
grant execute on function get_batch_performance(uuid) to authenticated;
grant execute on function compare_batches() to authenticated;
grant execute on function claim_active_session() to authenticated;
grant execute on function get_session_context() to authenticated;
grant execute on function generate_exam_questions(uuid) to authenticated;
grant execute on function count_available_questions(uuid, uuid, question_difficulty) to authenticated;
grant execute on function auto_expire_attempts() to authenticated;

-- Internal helpers, not callable by clients.
-- Supabase grants EXECUTE on new public functions to anon, authenticated and
-- service_role by default, so anon has to be revoked explicitly or PostgREST
-- would expose these at /rest/v1/rpc. exam_grade_attempt would let a caller
-- close and score any attempt, exam_attempt_questions would dump a live paper.
--
-- Every revoke below says "from public, anon", not "from anon". Postgres also
-- grants EXECUTE on functions to PUBLIC by default and every role inherits
-- from PUBLIC, so revoking anon alone leaves the PUBLIC grant standing and the
-- function stays callable with the anon key. Dropping PUBLIC does not lock out
-- authenticated, which holds its own direct grant from Supabase's default
-- privileges plus the explicit grants above.
revoke execute on function exam_grade_attempt(uuid, attempt_status) from public, anon, authenticated;
revoke execute on function exam_attempt_questions(uuid) from public, anon, authenticated;
revoke execute on function exam_attempt_deadline(uuid) from public, anon, authenticated;
revoke execute on function exam_fill_from_rules(uuid) from public, anon, authenticated;
revoke execute on function exam_normalize_stem(text) from public, anon;
revoke execute on function exam_guard_profile_update() from public, anon, authenticated;
revoke execute on function handle_new_auth_user() from public, anon, authenticated;
revoke execute on function exam_questions_before_write() from public, anon, authenticated;
revoke execute on function exam_touch_updated_at() from public, anon, authenticated;

-- exam_is_staff, exam_is_admin and exam_is_assigned stay executable by
-- authenticated on purpose: they are referenced from RLS policy expressions,
-- which are evaluated in the querying role. Revoking them would break RLS.
revoke execute on function exam_is_staff() from public, anon;
revoke execute on function exam_is_admin() from public, anon;
revoke execute on function exam_is_assigned(uuid, uuid) from public, anon;
revoke execute on function exam_can_see_batch(uuid) from public, anon;
revoke execute on function exam_can_see_student(uuid) from public, anon;

-- The student facing RPCs already reject a null auth.uid(), but anon has no
-- business reaching them at all.
revoke execute on function start_attempt(uuid) from public, anon;
revoke execute on function save_answer(uuid, uuid, char, boolean, integer) from public, anon;
revoke execute on function submit_attempt(uuid) from public, anon;
revoke execute on function record_tab_switch(uuid) from public, anon;
revoke execute on function get_attempt_result(uuid) from public, anon;
revoke execute on function start_practice(uuid, uuid, integer, question_difficulty) from public, anon;
revoke execute on function check_practice_answer(uuid, uuid, char) from public, anon;
revoke execute on function finish_practice(uuid) from public, anon;
revoke execute on function get_student_dashboard() from public, anon;
revoke execute on function get_admin_dashboard() from public, anon;
revoke execute on function get_exam_analytics(uuid) from public, anon;
revoke execute on function get_student_report(uuid) from public, anon;
revoke execute on function get_batch_performance(uuid) from public, anon;
revoke execute on function compare_batches() from public, anon;
revoke execute on function claim_active_session() from public, anon;
revoke execute on function get_session_context() from public, anon;
revoke execute on function generate_exam_questions(uuid) from public, anon;
revoke execute on function count_available_questions(uuid, uuid, question_difficulty) from public, anon;
revoke execute on function auto_expire_attempts() from public, anon;

-- ---------------------------------------------------------------------------
-- 11. Storage bucket for question images
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('question-images', 'question-images', true)
on conflict (id) do nothing;

drop policy if exists question_images_public_read on storage.objects;
create policy question_images_public_read on storage.objects
  for select to public
  using (bucket_id = 'question-images');

drop policy if exists question_images_staff_write on storage.objects;
create policy question_images_staff_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'question-images' and exam_is_staff());

drop policy if exists question_images_staff_update on storage.objects;
create policy question_images_staff_update on storage.objects
  for update to authenticated
  using (bucket_id = 'question-images' and exam_is_staff())
  with check (bucket_id = 'question-images' and exam_is_staff());

drop policy if exists question_images_staff_delete on storage.objects;
create policy question_images_staff_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'question-images' and exam_is_staff());

-- ---------------------------------------------------------------------------
-- 12. Seed subjects
-- ---------------------------------------------------------------------------

insert into subjects (name, code, order_index) values
  ('Air Navigation', 'NAV', 1),
  ('Aviation Meteorology', 'MET', 2),
  ('Air Regulations', 'REG', 3),
  ('Technical General', 'TGN', 4),
  ('Technical Specific', 'TSP', 5),
  ('Radio Telephony', 'RTR', 6)
on conflict (name) do nothing;
