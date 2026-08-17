-- ---------------------------------------------------------------------------
-- 0004. Close a privilege escalation on profiles.
--
-- profiles_update_self lets any signed in user update their own row, which is
-- what allows a student to fix their own name and phone. The role and is_active
-- columns are meant to be pinned by exam_guard_profile_update, but that trigger
-- exempted anyone passing exam_is_staff(), and instructors pass it. So an
-- instructor could run
--
--   update profiles set role = 'admin' where id = auth.uid();
--
-- and become an admin, gaining exactly the account management and delete rights
-- the instructor role exists to withhold. Verified against the live database:
-- as a genuine instructor, creating a batch was blocked and deleting a question
-- was blocked, but self promotion succeeded and every other restriction then
-- fell away.
--
-- The exemption should always have been admin only. Service role keeps its
-- bypass through the auth.uid() is null branch, so the admin API routes that
-- legitimately set roles are unaffected.
--
-- Safe to run more than once.
-- ---------------------------------------------------------------------------

create or replace function exam_guard_profile_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Service role and internal triggers carry no auth.uid(). Admins may set
  -- roles deliberately. Everyone else, instructors included, has role and
  -- is_active pinned to their existing values when editing their own row.
  if auth.uid() is null or exam_is_admin() then
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

revoke execute on function exam_guard_profile_update() from public, anon, authenticated;

notify pgrst, 'reload schema';
