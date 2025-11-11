## RR Stonepad – Health & Safety Forms (What I built and where things are)

I rebuilt the Health & Safety inspection forms into proper multi‑step forms inside Stonepad, wired them to Supabase, added PDF exports, and hooked them into the existing dashboards and notifications. The goal was to capture the same questions and responses as the A4 sheets while making them usable inside the CRM.

### What’s included
- PPE Inspection (HS065)
- Crane Operators Inspection (HS076)
- Forklift Truck Daily Inspection (HS051)
- Motor Vehicle Inspection (HS021)
- Weekly Site Inspection Report (HS047)
- Workshop General Inspection Checklist (HS017)
- Guarding Inspection (Emergency Stops)

Each form:
- Uses the same questions/rows you’re used to on the paper versions
- Is multi‑step (Details → Items → Notes/Summary)
- Can be saved, edited later, and exported to PDF
- Has due/overdue notifications aligned with existing logic

### Where to find the screens in the app
- PPE Inspections: Health & Safety → Equipment → PPE Inspections → “New PPE Inspection”
- Crane / Forklift / Guarding: Health & Safety → Equipment → Inspections → pick an equipment item → “New Crane” / “New Forklift” / “New Guarding”
- Motor Vehicle Inspections: Health & Safety → Vehicles → Inspections → pick a vehicle → “New Inspection”
- Site Inspections: Health & Safety → Equipment → Site Inspections → pick site → “New Inspection”
- Workshop Inspections: Health & Safety → Equipment → Workshop Inspections → pick site → “New Inspection”

Tip: If a page looks empty, add a record first (Equipment, Vehicle, or Site) so there’s something to attach the inspection to.

### What the forms capture (mapped to your sheets)
- PPE (HS065)
  - Items pre‑filled: Hard Hat, Ear Defenders, Safety Glasses/Goggles, Dust Mask, High‑Vis, Gloves (rubber/textile/other), Gauntlet (rubber), Safety Boots, Body Harness (work at height)
  - Per item: Condition (Excellent/Good/Average/Poor/Replace/N/A), Date Ordered (optional), Notes
  - New columns available (if SQL run): `department`, `line_manager_name`, `operative_signature_url`, `line_manager_signature_url`
- Crane (HS076)
  - Header: Inspection Date, Operator’s Name, Crane ID, Building
  - Items pre‑filled: inspection tag, disconnect switch, pendant(s), wire ropes/chains, hooks, upper limit switch, braking, trolley/bridge travel, hoist gearing noises, rails, lubrication, tackle used
  - New columns: `operator_name`, `crane_identifier`, `building`
- Forklift Daily (HS051)
  - Header: Week Start, Meter Start/End
  - Daily checks (Mon–Sun) and Weekly checks exactly as on the sheet
  - New columns: `week_start`, `meter_reading_start`, `meter_reading_end`
- Motor Vehicle (HS021)
  - Items grouped: External, Internal, Fluids, Function checks (as listed on the form)
  - Optional: `inspector_signature_url`
- Site Weekly (HS047)
  - Hazards list matches the sheet (Access & Egress, Tools & Equipment, PPE, Housekeeping, Dust Control, Hazardous Substances, Adjacent Work, Manual Handling, Toolbox Talk, PAT Testing, Other Hazards 1–3)
  - Optional: `inspector_signature_url`
- Workshop General (HS017)
  - Full list (Premises Security, Fences/Gates, Traffic/Parking, Pedestrian Routes, Lighting, Signs/Posters, Accident Book, FLT, Portable Electrical Equipment, Storage, Electrical RCDs, Hazardous Substances & PPE, Fixed Machines, Racking/T‑racks, PPE condition/use, Floors tidy, Fire Exits, Firefighting Equipment, Emergency Procedures, Machinery Guarding, First Aid Facilities, Sufficient First Aiders?, Welfare, LEV units, Ladders/Steps, Crane/Lifting Gear)
  - Optional: `company`, `inspector_signature_url`

### Database tables (Supabase)
- `ppe_inspections`
- `crane_operator_inspections`
- `forklift_daily_inspections`
- `site_inspections`
- `motor_vehicle_inspections`
- `guarding_inspections`
- `workshop_inspections`

Nothing was removed from your DB. I added optional columns for the headers (see above). If you haven’t yet, run the provided ALTER statements to persist those extra header fields.

### Notifications
I piggybacked the new forms onto the existing notifications workflow so “due soon” and “overdue” behave like the others. This is based on `check_date` and `frequency` where applicable.

### PDFs
- Generated with `jspdf` + `jspdf-autotable`
- Style stays consistent with our existing documents
- From each list, click the PDF button on a row to generate on the fly

### Code map (for the owner)
- PPE UI: `src/components/HealthSafety/PPE/HSPPE.tsx`
- Equipment Inspections UI (Crane/Forklift/Guarding): `src/components/HealthSafety/Equipment/HSEquipmentInspections.tsx`
- Vehicle Inspections UI (Motor): `src/components/HealthSafety/Vehicles/Inspections/HSMotorVehicleInspections.tsx`
- Site Inspections UI: `src/components/HealthSafety/SiteInspections/HSSiteInspections.tsx`
- Workshop Inspections UI: `src/components/HealthSafety/Workshop/HSWorkshop.tsx`
- Shared form shell: `src/utils/form/components/*` (FormContainer, FormHeader, FormFooter, StepIndicator, inputs)
- Notifications wiring: `src/components/Dashboard/Main/utils/notifications.ts`
- Supabase client: `src/lib/supabase.ts`
- Dashboard routing:
  - `src/components/Dashboard/SubDashboard/HealthSafetyDashboard.tsx`
  - `src/components/Dashboard/Main/components/DashboardSections.tsx`

### Running the app locally
1) Set your env (from Supabase):
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
2) Install & run
```
npm install
npm run dev
```
App runs at http://localhost:3000

### Small notes
- If a form looks “empty”, it usually means there’s no Equipment/Vehicle/Site yet. Add one first so the form can attach to it.
- I normalized a couple of date/number fields so blank inputs save as null (not empty strings) to avoid database type errors.

If you want these mirrored for OPG next, I can clone the UI and run the same SQL on the other project/database. 
