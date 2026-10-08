---
name: current-handoff
description: Active thread handoff — read first in a new thread
metadata: 
  node_type: memory
  type: project
  originSessionId: f8d77198-1ec5-4af6-9611-8626df488095
---

# 🔀 Context Handoff — WindChasers (site + PROXe) — 2026-07-14

## Goal / what we're doing
Flight-schools page is built and LIVE. Current focus has moved to the **PROXe
lead backend**: make flight-school leads flow correctly — right WhatsApp welcome
template, right COURSE label, and fix two live agent bugs (time-blindness,
cabin-crew getting pilot fees). Nothing PROXe-side is shipped yet — blocked on a
GO to edit live `main`.

## Two repos in play
- **SITE:** `C:\Users\user\Builds\Windchasers` — repo `github.com/bconclub/windchasers.git`, branch `main`, local == `origin/main` == `876bbcf`.
  - Deploy: 1-min VPS cron (`wc-deploy.sh`) on app box **72.61.237.244** does `git reset --hard origin/main` + `npm ci` + `npm run build` + pm2 restart. Live URL: https://windchasers.in . `/flight-schools` behind a short nginx page cache.
- **PROXe:** `C:\GO PROXe` — repo `github.com/bconclub/proxe.git`. Current checkout is branch **`migrate/one-core`** (a WIP migration, 17 ahead / 58 behind origin, with OTHER PEOPLE's uncommitted changes: `.claude/launch.json`, `brands/bcon/config.ts` — do NOT disturb).
  - **Production windchasers agent = `origin/main`, path `brands/windchasers/agent/`.** Deploys via GitHub Action `.github/workflows/deploy-windchasers.yml` on **push to `main`** (paths `brands/windchasers/agent/**`) → Vercel project `windhcasers-proxe`. Push = straight to live.
  - Live agent Supabase creds: `brands/windchasers/agent/.env.local` (env `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). PROXe agent dir has NO node_modules — run supabase queries from the SITE repo's node_modules, reading PROXe's .env.local for creds.
  - PROXe inbound lead endpoint (where site leads land): `POST {PROXE_BASE_URL}/api/agent/leads/inbound` with header `x-api-key: PROXE_INBOUND_API_KEY` (both env in SITE `.env.local`). Base = https://proxe.windchasers.in .

## State right now
- SITE: `origin/main` == `876bbcf`. **Uncommitted (NOT pushed):** `app/api/flight-schools-lead/route.ts` — sends `course_interest/course/interest = "Flight School"` + a readable `message`. Holding it because PROXe's inbound course-mapper remaps flight → "Pilot" anyway (see bugs), so pushing it alone doesn't fix the COURSE column.
- PROXe: NO changes made by me — only read/diagnosed. Working tree has others' WIP; I have NOT touched it.
- Build queue: `.claude/state/todo.md` in the SITE repo (flight-schools work, mostly shipped). PROXe work is NOT in that file — it's in this handoff.

## VERIFIED data flow (flight-school lead → PROXe)
Pulled real lead from PROXe DB (`all_leads.unified_context`). For a flight-school lead:
- `raw_form_fields.school_interested` = e.g. "Barcelona Flight School" ✓ stored
- `raw_form_fields.school_country` = e.g. "Spain" ✓ stored
- `attribution.first_touch` = "flight_school", `first_touch_label` = "Flight School" (SOURCE column reads this ✓)
- `windchasers.course_interest` = **"Pilot"** ← BUG. Site sent "Flight School"; PROXe's inbound mapper collapsed it to "Pilot". Dashboard COURSE column reads THIS field.

## PROXe fixes queued (all need GO to edit live `main`, path brands/windchasers/agent/)
1. **Course-mapper**: `leads/inbound/route.ts` remaps flight → "Pilot". Add a `flight_school` case so `windchasers.course_interest` stays "Flight School". (COURSE column fix.)
2. **Flight-school welcome routing**: inbound route's welcome block (`pickWelcomeTemplate` / `sendWelcomeTemplate`) doesn't detect flight-school leads. Route `form_type==flight_school` (or `school_interested` present) → template **`windchasers_flight_school_welcome_v1`**, filling name + school + country from `raw_form_fields`. NOTE: that template uses **NAMED** vars (`{{customer_name}}` + school + country) — PROXe's sender uses POSITIONAL ({{1}}); routing must send named params or it silently fails. Template is **"In review" at Meta** (14 Jul) — can't send until Approved.
3. **Time-awareness (CORE bug)**: agent apologized for a "missed 5 PM call" at 2 PM. System prompt (built in `brands/windchasers/agent/src/lib/agent-core/promptBuilder.ts` → `buildSystemPrompt`, sent via `claudeClient.ts` with `cacheable()` prompt-caching) NEVER injects current time. Fix: inject current IST datetime per-TURN (in the non-cached userPrompt, NOT the cached system block, or caching breaks) + rule: a future booking/callback is upcoming, not missed.
4. **Cabin-crew fee bug (live)**: `brands/windchasers/agent/src/lib/services/quickReplyMap.ts` ~line 101 — a canned trigger fires on bare "fees/cost/how much" and ALWAYS returns the Pilot ₹60–70 lakh, ignoring context (`findQuickReplyFor(message)` gets no context). Called in `app/api/agent/whatsapp/meta/route.ts:774`. Fix: remove/gate that generic cost trigger so bare cost → Claude (prompt already handles per-vertical fees). Keep cabin/pilot/flight-school fee logic strictly separate; when context unclear, offer a callback, don't quote a number.

## Blocked / open decisions for the user
- **GO to edit PROXe live `main`** (auto-deploys to production leads) — and confirm nobody else is mid-push in PROXe (there's active WIP + 17 unpushed commits in the checkout). Plan: work on a clean branch off `origin/main`, apply all fixes, push.
- **Exact variable names** inside template `windchasers_flight_school_welcome_v1` (customer_name + the school var + the country var).
- COURSE label wording: "Flight School" (confirmed by user) — could also be "Flight School Abroad".
- **Delete 4 test leads** from PROXe + the "Flight Schools Lead" Google Sheet: phones **9000000001, 9000000002, 9000000003, 9000000004** (all "QA TEST - DO NOT CALL").

## Re-activate in the new thread
- Caveman mode: nominally ON per global `~/.claude/CLAUDE.md`, but this thread used normal prose due to cross-repo complexity — resume terse per [[feedback_communication_style]].
- /build queue: active — SITE `.claude/state/todo.md`.
- /loop: not active.

## Conventions to carry (from MEMORY.md)
- [[git-push-credential-workaround]] — pushes hang on Windows GUI credential popup; use `git -c credential.helper= -c credential.helper=store push`. Never force-reset origin/main backwards.
- [[feedback_deploy_workflow]] — `npm run build` MUST pass before pushing main (both repos); prod has paid ads.
- [[feedback_no_em_dashes]] · [[feedback_communication_style]].

## ▶️ Start here in the new thread
Get the user's GO to work on PROXe live `main`. Then: create a clean branch off `origin/main`, and in `brands/windchasers/agent/` fix the 4 items above (start with time-awareness in `promptBuilder.ts` — most embarrassing live bug — then the cabin-crew quick-reply, course-mapper, and flight-school template routing). `npm run build` in `brands/windchasers/agent` before pushing. Push to `main` → GH Action deploys to Vercel; verify on WhatsApp.
