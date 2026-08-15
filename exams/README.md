# WindChasers Exams

Internal exam and question bank platform for WindChasers Aviation Academy.
Runs at exams.windchasers.in, separate Next.js app from the main marketing site,
sharing the same Supabase project.

Stack: Next.js 14 App Router, TypeScript, Tailwind, Supabase (Postgres, Auth, RLS,
Storage), PM2 on port 3002 behind Nginx.

## What it does

- **Question bank** with subjects, topics, difficulty and status. Rich text stems,
  optional figure per question, Excel and CSV bulk import with a validation preview.
- **Exams** built two ways: pick questions manually, or write rules (subject, topic,
  difficulty, count) and let Postgres draw a random set.
- **Assignment** to whole batches or individual students, with an open and close window.
- **Test runner** with one question per screen, a palette, a server anchored countdown,
  autosave on every change, resume after a reload, auto submit at zero, and tab switch
  tracking.
- **Results** with server side scoring, subject and topic breakdowns, gated solution
  review, batch average, batch leaderboard, score distribution, per question analytics
  and CSV export.
- **Practice mode**, untimed, instant feedback, logged separately from exam attempts
  so it never enters attempt based reporting.
- **Reporting** at student, batch, subject, topic and question level, including a score
  trend over time and batch to batch comparison.

## Roles

| Role | Can do | Cannot do |
| --- | --- | --- |
| admin | Everything: accounts, batches, taxonomy, questions, exams, all reporting | - |
| instructor | Create and assign exams, add and edit questions, read results for its assigned batches | Manage accounts, edit the taxonomy, delete anything |
| student | Take assigned exams, practice, see only its own performance | See anyone else's data |

Instructors are scoped to batches through the `instructor_batches` table. An
instructor with no rows there sees no student results at all, so assign batches when
promoting someone to instructor:

```sql
insert into instructor_batches (instructor_id, batch_id)
select p.id, b.id from profiles p, batches b
where p.email = 'instructor@windchasers.in' and b.code = 'CPL-2026-A';
```

## Security model

Scoring never happens in the browser. Students have no select privilege on the
`questions` table at all. Every live question they see comes from a security definer
RPC that returns a sanitized payload without `correct_option` or `explanation`.
Answers and submissions go through `save_answer` and `submit_attempt`, which verify
ownership and the attempt deadline before writing. Routes that use the service role
key call `requireStaff()` first (see `lib/api-guard.ts`).

Analytics RPCs are security definer, so RLS does not apply inside them. They filter
per student rows through `exam_can_see_student()` instead, which is what keeps an
instructor inside its own batches.

One active session per account is enforced in the route middleware. A login pins its
GoTrue session id onto the profile via `claim_active_session()`, and any older session
is redirected to the login page on its next request.

## Setup

### 1. Environment

```bash
cp .env.example .env.local
```

Fill in the same Supabase values the main site uses. `SUPABASE_SERVICE_ROLE_KEY` is
required for student invites and the question import, and must never be exposed to
the browser.

### 2. Migration

Open the Supabase SQL editor and run the whole of
`supabase/migrations/0001_init.sql`. It creates the enums, the fifteen tables, the
indexes, the RLS policies, every RPC, the `question-images` storage bucket, and seeds
the six DGCA subjects (Air Navigation, Aviation Meteorology, Air Regulations,
Technical General, Technical Specific, Radio Telephony).

The file is written to be re-runnable, so applying it twice is safe.

### 3. First admin

Create the first user through the Supabase dashboard (Authentication, Add user, with
"Auto Confirm User" ticked), then promote the profile:

```sql
update profiles set role = 'admin', is_active = true
where email = 'you@windchasers.in';
```

Every later student is created from `/admin/students`, which sends a Supabase invite
email. Instructors are created the same way, then promoted with the same query using
`role = 'instructor'`, and then given batches (see Roles above).

### 4. Auth redirect URLs

In the Supabase dashboard under Authentication, URL Configuration, add:

- `https://exams.windchasers.in/auth/callback`
- `http://localhost:3002/auth/callback` for local work

### 5. Expiry cron (optional)

`auto_expire_attempts()` is called lazily on every start, save and dashboard load, so
attempts do get closed out without a scheduler. To also run it on a timer, enable
`pg_cron` in Supabase and add:

```sql
select cron.schedule('expire-exam-attempts', '*/5 * * * *', 'select auto_expire_attempts()');
```

### 6. Local development

```bash
npm install
npm run dev
```

Serves on http://localhost:3002. Before any push to main, confirm a clean production
build:

```bash
npm run build
```

## Question import format

Upload an Excel or CSV file with these columns (header names are matched loosely,
spaces become underscores):

| Column | Required | Notes |
| --- | --- | --- |
| subject | yes | Created if it does not exist |
| topic | no | Created under the subject if it does not exist |
| question | yes | Plain text, wrapped in paragraphs on import |
| option_a to option_d | yes | Four options |
| correct_option | yes | A, B, C or D |
| explanation | no | Shown in review |
| difficulty | no | easy, medium or hard, defaults to medium |

Rows with errors are shown in a preview table and can be fixed inline before the
commit. Rows whose text matches an existing question are flagged as duplicates but
still imported, so a deliberate near-duplicate is not blocked. Valid rows are inserted
in chunks of 500. Download a starter file from the Template button on the import page.

## Deploying to the VPS

One time setup:

```bash
cd /var/www/windchasers/exams
npm ci
npm run build
pm2 start ecosystem.config.js
pm2 save
```

Nginx:

```bash
sudo cp /var/www/windchasers/exams/nginx.conf /etc/nginx/sites-available/exams.windchasers.in
sudo ln -s /etc/nginx/sites-available/exams.windchasers.in /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d exams.windchasers.in
```

**Extend the deploy cron.** The VPS runs `/usr/local/bin/wc-deploy.sh` every minute,
which pulls origin/main and rebuilds the main site only. Add the exams app to it so a
push to main deploys both:

```bash
cd /var/www/windchasers/exams
npm ci
rm -rf .next
npm run build
pm2 restart windchasers-exams || pm2 start ecosystem.config.js
```

Put that after the existing `pm2 restart windchasers` line, inside the same
flock guard. Without this change, pushes update the repo but the exams process keeps
serving the old build.

`.github/workflows/deploy-exams.yml` does the same steps over SSH and is kept for
manual or emergency runs from the Actions tab.

## Project layout

```
app/(student)      dashboard, exam runner, results, practice, history
app/(admin)/admin  overview, questions, exams, students, batches, subjects
app/api/admin      service role routes, each guarded by requireStaff()
components/ui      brand styled primitives
components/exam    TestRunner, palette, timer
components/editor  tiptap wrapper and the stem renderer
lib/supabase       browser, server and middleware clients
supabase/migrations
```

## Conventions

No em dashes anywhere in code, comments or UI copy. No emojis, Lucide icons only.
Strict TypeScript with no `any`. All scoring server side.
