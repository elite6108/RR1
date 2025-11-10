-- RR Inspections DDL
-- Notes:
-- - Forklifts are treated as equipment (links to equipment.id)
-- - Guarding is for emergency-stop inspections
-- - Frequencies are optional; when set, limited to daily/weekly/monthly

create extension if not exists pgcrypto;

-- Helper domain for optional frequency
do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'inspection_frequency' and n.nspname = 'public'
  ) then
    create domain inspection_frequency as text
      check (value is null or value in ('daily','weekly','monthly'));
  end if;
end $$;

-- 1) HS076 - Crane Operators Inspection (equipment-linked, optional site/project)
create table if not exists public.crane_operator_inspections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_by_name text,
  equipment_id uuid references public.equipment(id) on delete set null,
  site_id uuid references public.sites(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  crane_type text,
  serial_number text,
  location text,
  check_date date not null default current_date,
  frequency inspection_frequency, -- optional
  status text check (status in ('pass','fail')) not null default 'pass',
  items jsonb not null default '[]'::jsonb, -- [{name,status,notes,image_url}]
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_crane_inspections_check_date on public.crane_operator_inspections(check_date);
create index if not exists idx_crane_inspections_equipment on public.crane_operator_inspections(equipment_id);
create index if not exists idx_crane_inspections_site on public.crane_operator_inspections(site_id);
create index if not exists idx_crane_items_gin on public.crane_operator_inspections using gin (items);

-- 2) HS065 - PPE Inspection (person-focused; allow staff OR worker linkage)
create table if not exists public.ppe_inspections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_by_name text,
  staff_id integer references public.staff(id) on delete set null,
  worker_id uuid references public.workers(id) on delete set null,
  site_id uuid references public.sites(id) on delete set null,
  check_date date not null default current_date,
  frequency inspection_frequency, -- optional
  status text check (status in ('pass','fail')) not null default 'pass',
  items jsonb not null default '[]'::jsonb, -- [{name,condition,compliant:boolean,notes,image_url}]
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_ppe_check_date on public.ppe_inspections(check_date);
create index if not exists idx_ppe_staff on public.ppe_inspections(staff_id);
create index if not exists idx_ppe_worker on public.ppe_inspections(worker_id);
create index if not exists idx_ppe_items_gin on public.ppe_inspections using gin (items);

-- 3) HS051 - Operator Daily Inspection Sheet, Forklift Truck (equipment-linked)
create table if not exists public.forklift_daily_inspections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_by_name text,
  equipment_id uuid references public.equipment(id) on delete set null,
  site_id uuid references public.sites(id) on delete set null,
  check_date date not null default current_date,
  frequency inspection_frequency, -- optional
  status text check (status in ('pass','fail')) not null default 'pass',
  items jsonb not null default '[]'::jsonb, -- [{name,status,notes,image_url}]
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_forklift_check_date on public.forklift_daily_inspections(check_date);
create index if not exists idx_forklift_equipment on public.forklift_daily_inspections(equipment_id);
create index if not exists idx_forklift_items_gin on public.forklift_daily_inspections using gin (items);

-- 4) HS047 - Site Inspection Form (site-linked)
create table if not exists public.site_inspections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_by_name text,
  site_id uuid references public.sites(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  check_date date not null default current_date,
  frequency inspection_frequency, -- optional
  status text check (status in ('pass','fail')) not null default 'pass',
  items jsonb not null default '[]'::jsonb, -- domain questions/findings
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_siteinsp_check_date on public.site_inspections(check_date);
create index if not exists idx_siteinsp_site on public.site_inspections(site_id);
create index if not exists idx_siteinsp_items_gin on public.site_inspections using gin (items);

-- 5) HS021 - Motor Vehicle Inspection Form (vehicle-linked)
create table if not exists public.motor_vehicle_inspections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_by_name text,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  check_date date not null default current_date,
  frequency inspection_frequency, -- optional
  status text check (status in ('pass','fail')) not null default 'pass',
  odometer integer,
  items jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_mv_check_date on public.motor_vehicle_inspections(check_date);
create index if not exists idx_mv_vehicle on public.motor_vehicle_inspections(vehicle_id);
create index if not exists idx_mv_items_gin on public.motor_vehicle_inspections using gin (items);

-- 6) HS020 - Guarding (Emergency Stop) Inspection (equipment/site-linked)
create table if not exists public.guarding_inspections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_by_name text,
  equipment_id uuid references public.equipment(id) on delete set null,
  site_id uuid references public.sites(id) on delete set null,
  check_date date not null default current_date,
  frequency inspection_frequency, -- optional
  status text check (status in ('pass','fail')) not null default 'pass',
  items jsonb not null default '[]'::jsonb, -- emergency stop checks
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_guarding_check_date on public.guarding_inspections(check_date);
create index if not exists idx_guarding_equipment on public.guarding_inspections(equipment_id);
create index if not exists idx_guarding_items_gin on public.guarding_inspections using gin (items);

-- 7) HS017 - Workshop Inspection Checklist (site-linked)
create table if not exists public.workshop_inspections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_by_name text,
  site_id uuid references public.sites(id) on delete set null,
  workshop_name text,
  check_date date not null default current_date,
  frequency inspection_frequency, -- optional
  status text check (status in ('pass','fail')) not null default 'pass',
  items jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_workshop_check_date on public.workshop_inspections(check_date);
create index if not exists idx_workshop_site on public.workshop_inspections(site_id);
create index if not exists idx_workshop_items_gin on public.workshop_inspections using gin (items);


