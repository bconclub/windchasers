-- ============================================================================
-- Flight Schools schema — reconstruction.
--
-- The original Supabase project (ebxslycxbgvjrkirrizd) is gone (NXDOMAIN —
-- paused-then-deleted or removed), and its schema was never committed to the
-- repo. This migration reconstructs the four tables exactly as the code uses
-- them, derived from:
--   scripts/seed-flight-schools-supabase.mjs  (column writes)
--   lib/flight-schools/queries.ts             (public reads)
--   app/admin/flight-schools/page.tsx         (admin reads)
--   scripts/resolve-google-photos.mjs         (photo url backfill)
--
-- After running this in the new project:
--   1. node --env-file=.env.local scripts/seed-flight-schools-supabase.mjs
--   2. node --env-file=.env.local scripts/resolve-google-photos.mjs --verified-only
--   3. point NEXT_PUBLIC_SUPABASE_URL / keys at the new project (local + VPS)
-- ============================================================================

create table if not exists public.countries (
  code text primary key,          -- ISO-3166 alpha-2, e.g. "IN"
  name text not null
);

create table if not exists public.flight_schools (
  id text primary key,            -- e.g. "google-ChIJ..." from Places import
  slug text unique,
  name text not null,
  country_code text references public.countries(code),
  city text,
  lat double precision,
  lng double precision,
  formatted_address text,
  short_formatted_address text,
  utc_offset_minutes integer,

  website text,
  phone text,
  national_phone_number text,
  international_phone_number text,

  certifications text[] default '{}',
  dgca_approved boolean,
  dgca_convertible boolean,
  is_partner boolean not null default false,
  training_focus text[] default '{}',

  fleet_size integer,
  duration_months integer,
  approx_cost_usd numeric,
  cost_min_usd numeric,
  cost_max_usd numeric,

  rating numeric,
  google_rating numeric,
  google_review_count integer,

  google_place_id text,
  google_maps_url text,
  business_status text,
  google_types text[] default '{}',
  google_primary_type text,
  editorial_summary text,
  regular_opening_hours jsonb,
  current_opening_hours jsonb,

  source_status text default 'google_found',        -- google_found | curated | partner
  verification_status text default 'unreviewed',    -- unreviewed | verified | rejected
  wc_score numeric,
  wc_classification text,
  wc_score_reasons text[] default '{}',
  notes text,

  discovery_query text,
  first_discovered_at timestamptz,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists flight_schools_country_idx on public.flight_schools (country_code);
create index if not exists flight_schools_verification_idx on public.flight_schools (verification_status);
create index if not exists flight_schools_wc_score_idx on public.flight_schools (wc_score desc nulls last);

create table if not exists public.flight_school_photos (
  id bigint generated always as identity primary key,
  school_id text not null references public.flight_schools(id) on delete cascade,
  url text,                       -- public URL once resolved into Storage
  google_photo_name text,         -- Places photo resource name (pre-resolve)
  source text default 'google',   -- google | admin
  position integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists flight_school_photos_school_idx
  on public.flight_school_photos (school_id, position);

create table if not exists public.flight_school_reviews (
  id bigint generated always as identity primary key,
  school_id text not null references public.flight_schools(id) on delete cascade,
  source text default 'google',
  external_id text,
  author_name text,
  author_avatar_url text,
  rating numeric,
  text text,
  language text,
  published_at timestamptz,
  relative_published_text text,
  created_at timestamptz not null default now()
);

create index if not exists flight_school_reviews_school_idx
  on public.flight_school_reviews (school_id);

-- ----------------------------------------------------------------------------
-- RLS — public (anon) sees ONLY verified or partner schools; service role
-- (admin pages, seed scripts) bypasses RLS entirely.
-- ----------------------------------------------------------------------------
alter table public.countries enable row level security;
alter table public.flight_schools enable row level security;
alter table public.flight_school_photos enable row level security;
alter table public.flight_school_reviews enable row level security;

create policy "countries are public" on public.countries
  for select using (true);

create policy "public sees verified or partner schools" on public.flight_schools
  for select using (verification_status = 'verified' or is_partner);

create policy "photos visible for visible schools" on public.flight_school_photos
  for select using (
    exists (
      select 1 from public.flight_schools s
      where s.id = school_id
        and (s.verification_status = 'verified' or s.is_partner)
    )
  );

create policy "reviews visible for visible schools" on public.flight_school_reviews
  for select using (
    exists (
      select 1 from public.flight_schools s
      where s.id = school_id
        and (s.verification_status = 'verified' or s.is_partner)
    )
  );

-- ----------------------------------------------------------------------------
-- Storage bucket for resolved Google photos (public read).
-- scripts/resolve-google-photos.mjs uploads to school-photos/{school_id}/...
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('school-photos', 'school-photos', true)
on conflict (id) do nothing;
