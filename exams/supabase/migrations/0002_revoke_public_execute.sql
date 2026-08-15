-- ---------------------------------------------------------------------------
-- 0002. Close the anon RPC surface.
--
-- 0001 revoked EXECUTE "from anon" on the client facing RPCs. That was not
-- enough. Postgres grants EXECUTE on functions to PUBLIC by default and every
-- role inherits from PUBLIC, so revoking anon only removed its direct grant
-- and left the inherited one. All nineteen RPCs stayed callable with the anon
-- key, which is published to every visitor of the main marketing site.
--
-- No data was exposed: fifteen of the nineteen raise "Not authenticated" on a
-- null auth.uid(), and the other four return empty or zero for a caller with
-- no identity. The problem is the reachable surface, and auto_expire_attempts
-- in particular was an unauthenticated write path.
--
-- Dropping the PUBLIC grant does not lock out authenticated, which holds a
-- direct grant from Supabase default privileges and from 0001's explicit
-- grants. The grants are repeated at the end so this is safe on its own.
--
-- Safe to run more than once.
-- ---------------------------------------------------------------------------

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

-- Internal helpers and trigger functions, never callable by any client.
revoke execute on function exam_grade_attempt(uuid, attempt_status) from public, anon, authenticated;
revoke execute on function exam_attempt_questions(uuid) from public, anon, authenticated;
revoke execute on function exam_attempt_deadline(uuid) from public, anon, authenticated;
revoke execute on function exam_guard_profile_update() from public, anon, authenticated;
revoke execute on function handle_new_auth_user() from public, anon, authenticated;
revoke execute on function exam_questions_before_write() from public, anon, authenticated;
revoke execute on function exam_touch_updated_at() from public, anon, authenticated;
revoke execute on function exam_normalize_stem(text) from public, anon;

-- Referenced from RLS policy expressions, which are evaluated as the querying
-- role, so authenticated has to keep EXECUTE on these.
revoke execute on function exam_is_staff() from public, anon;
revoke execute on function exam_is_admin() from public, anon;
revoke execute on function exam_is_assigned(uuid, uuid) from public, anon;
revoke execute on function exam_can_see_batch(uuid) from public, anon;
revoke execute on function exam_can_see_student(uuid) from public, anon;

grant execute on function exam_is_staff() to authenticated;
grant execute on function exam_is_admin() to authenticated;
grant execute on function exam_is_assigned(uuid, uuid) to authenticated;
grant execute on function exam_can_see_batch(uuid) to authenticated;
grant execute on function exam_can_see_student(uuid) to authenticated;

-- Re-assert the client grants so a rerun can never leave the app unable to
-- call its own RPCs.
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

notify pgrst, 'reload schema';
