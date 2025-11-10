export interface RAMSFormData {
  id?: string;
  created_at?: string;
  updated_at?: string;
  rams_number?: string;
  // Project Information
  reference: string;
  client_id?: string;
  client_name: string;
  project_id?: string;
  site_manager: string;
  assessor: string;
  approved_by: string;

  // Site Information
  address_line1: string;
  address_line2: string;
  address_line3: string;
  site_town: string;
  site_county: string;
  post_code: string;
  site_hours: string;
  supervision: string;
  description?: string;
  sequence?: string;
  stability?: string;
  special_permits?: string;
  workers?: string;
  tools_equipment?: string;
  plant_equipment?: string;
  lighting?: string;
  deliveries?: string;
  services?: string;
  access_equipment?: string;
  hazardous_equipment?: string;
  welfare_first_aid?: string;
  nearest_hospital?: string;
  fire_action_plan?: string;
  protection_of_public?: string;
  clean_up?: string;
  order_of_works_safety?: string;
  order_of_works_task?: 'groundworks' | 'custom';
  order_of_works_custom?: string;
  delivery_info?: string;
  groundworks_info?: string;
  additional_info?: string;
  ppe?: string[];
  hazards?: any[];
}

export const ASSESSOR_OPTIONS = [
  'C. Harris',
  'M. Heartgrove',
  'G. Catania',
  'R. Barrett',
  'R. Stewart',
] as const;

export type Assessor = (typeof ASSESSOR_OPTIONS)[number];

// Default values for RAMS form fields
export const RAMS_DEFAULTS = {
  APPROVED_BY: 'R. Stewart',
  SITE_HOURS:
    '8.00 AM – 18.00 PM Monday to Friday, or site specific. Extensions with agreement.',
  DESCRIPTION: 'Template and installation worktop surfaces as per quotation.',
  SEQUENCE: `1. Pre-Site Preparation
Confirm site access and readiness (cabinets installed, surfaces clear).
Ensure Proliner and necessary tools are fully charged and calibrated.
Conduct general site risk assessment (check for trip hazards, restricted access), before beginning work.

2. Templating Process
Set up Proliner on a stable surface and calibrate for accuracy.
Digitally measure the worktop area, ensuring all cutouts (sink, hob) are recorded.
Verify dimensions with the site contact and discuss any potential adjustments.
Export and save the template data for manufacturing.

3. Worktop Fabrication
Transfer digital template to production for CNC cutting and finishing.
Conduct quality checks to ensure accurate sizing and finishing.
Prepare worktops for safe transport, using protective packaging.

4. Pre-Installation Checks
Confirm site is ready (existing worktops removed if applicable).
Ensure correct worktops, fixings, and tools are loaded for installation.

5. Installation Process
Position and dry-fit worktops to confirm correct alignment.
Apply adhesive, secure joints, and seal edges as required.
Clean worktops and remove all installation debris.

6. Final Inspection & Handover
Ensure all worktops are level, secure, and sealed.
Conduct final checks with the client and confirm satisfaction.
Provide maintenance and care instructions.`,
  SUPERVISION:
    'The works will be managed by the site foreman outlined above. Site management will provide authorisation to begin work. All official communication will be through Max Cunningham, especially if there are any adjustments to the project whilst work is being carried out.',
  STABILITY:
    'No structural works will be undertaken during this project to existing buildings.',
  SPECIAL_PERMITS:
    'No special construction permits will be required for this project. Any equipment that is hired will have its own permits from the supplier.',
  WORKERS:
    'Skilled and experienced workers from Rock Revelations (London) Ltd.',

  TOOLS_EQUIPMENT: `For Templating: Proliner Templating Tool.

For Installation: Hand tools (non-powered), 110v Powered tools including drills, chop saw, plunge saw, circular saw, angle grinder, polisher. If 240v tools are required, these will be done with suitable transformers and RCD breaker. Exact tooling dependant on availability at the time. Not all tools will be required..`,

  LIGHTING: 'Room lighting, 110V task lighting if required.',
  DELIVERIES: "Delivery will be made by van only (no HGV's) to site. ",
  SERVICES:
    'Main power will be utilised for the 110V tools using centre tap earth electrical transformers. If 240V is required for construction tools, additional transformers will be used along with an RCD breaker.',
  ACCESS_EQUIPMENT: 'Work will not be carried out on any towers or at heights.',
  HAZARDOUS_EQUIPMENT:
    'Silicones, resins, glues may be used during installing. ',
  WELFARE_FIRST_AID:
    'Welfare & first aid facilities on site to be utilised, to be advised on induction. First Aid Kit Locations: First aid boxes and eye wash kits will be available within site vehicles.',
  FIRE_ACTION_PLAN:
    'Where possible, workers will follow the existing fire safety plan for the site, including using the designated evacuation points. Additionally, templating and installing workops carries a low risk of fire. When raising fire alarm awareness, workers should not use an air horn, klaxon or whistle, as there may be other construction trades who will not be using the same awareness method so they will not understand. However, in the unlikely event of a fire on site—whether originating from a vehicle, machinery, or other trades/equipment not associated with us—the following practices should be observed:',
  PROTECTION_OF_PUBLIC:
    'Site manager to ensure safety of public from workers on site.',
  CLEAN_UP: `1. All waste must be taken back to the van in the appropriate waste boxes to be disposed at commercial waste sites
2. Final checks of the installation area will be carried out to achieve the best possible and highest standard
3. Remove all equipment and leave no waste behind
4. Client site representative or/and Rock Revelations (London) Ltd will sign off on completion of the work`,
  ORDER_OF_WORKS_SAFETY: `1. PPE is required as advised above before entering and working on site
2. Unload from the van and transport the materials to the working area, as instructed below
3. Workers will adhere to site rules and communicate with site manager as required
4. Power cables will be covered down using mats where possible and if required`,
  ORDER_OF_WORKS_TASK: 'groundworks' as const,
  DELIVERY_INFO: `1.	Weight of the stone materials approx. 32K per SQM. Weight of kitchen cabinet units will vary. 
2.	Materials will be loaded onto vans at our fabrication centre. Materials will be strapped onto metal frames or secured by other means within the van to prevent movement and damage.
3.	Our fitting/installation team that is driving will do as safe as possible (see risk assessment for more information).
4.	The driver will park at the pre-arranged designated location or if not disclosed, then the driver will park as close to the building and safe as possible
5.	The driver will contact site managers if the designated parking location is difficult to park, or park in the loading bays provided.
6.	The driver will exit the van and inspect that the van is not parked on any pathways, pedestrian walkways, curbs, grass, single or double yellow lines or any on any area that is required by highway standard to keep free. The van will be will not block or hinder roads or emergency exits
7.	Upon existing the van if required, cones will be placed around the rea to ensure that no vehicle parks behind and for passers-by not to walk behind the van
8.	Before unloading the materials, our team will contact site staff to sign in and obtain their induction
9.	On return to the van, they will: 
a.	Inspect the pathway to the installation area ensuring that the pathway is clear from any object or hazards. If items need to be removed site staff will be informed
b.	Asses the installation is area is also free from any clutter, objects or hazard and report and move any if found
10.	When unloading they will undo the straps that are keeping the material in place on the van. They will undo one bar clamp/strap at a time
11.	They will bring the loading trolley to the rear of the vehicle
12.	They will slide out the material from the frame on to the trolley. Manual handling may be required depending on level of the floor, trolley height, and to guide the material onto the trolley. Hand clamps are to be used to assist grip of material. Gloves to be worn during this step
13.	They will then stroll the trolley into the installation area and keeping an eye on hazards that approach
14.	If the floor level of works is above ground floor, then the stone masons will use the loading bays and commercial delivery elevators to transport above ground
15.	Should there not be any lifts, then the team may use the standard elevators if possible
16.	Where elevators are to be used, the team will calculate given the material weight of 32K PSQM is under the limit of the elevator. Standard low-rise buildings should be capable of 907KG -1134KG
17.	Communication between the team is vital ensuring that all know the hazards that are identified
18.	Once at the installation area the trolley will be parked as close to the unit as possible allowing our team to slide the material onto the unit
19.	They will return to the van to repeat this process whilst checking for any new and additional hazards approach
20.	Once all materials are in place, they will take the trolley back to the van so not to cause a hazard and will then fetch their tools and equipment.`,
  GROUNDWORKS_INFO: `
TEMPLATING:
Site Assessment:
•	Ensure the space is clear and the kitchen cabinets are correctly positioned and secure.
•	Verify that the area is level and free of obstructions that could affect measurements.
•	Discuss any site-specific details with the client, such as specific requirements for sink cutouts, hob placements, or any bespoke features.
Proliner Setup:
•	Ensure that the Proliner digital measuring pen is fully charged and calibrated. Verify that it's working correctly by performing a test measure on a known flat surface.
•	Prepare backup batteries and storage devices (e.g., USB or cloud storage) for saving the measurements.
Initial Marking of Key Points:
•	Using the Proliner, mark the key reference points on the edges of the worktop areas. This includes the corners, sink, hob, and any unusual features such as curved edges or islands.
•	If applicable, use a laser level or another reference point to ensure all key measurements are in line with the installation specifications.
Taking Measurements:
•	Begin the digital measuring process by moving the Proliner pen across the surface of the cabinets, recording the dimensions at multiple points. This process is precise and should account for any variations in the surfaces or walls that may not be perfectly straight.
•	For irregularities, the Proliner will automatically capture those measurements, allowing for easy adjustments in the final template.
Recording Cutouts & Details:
•	Accurately record measurements for any required cutouts (e.g., sink, taps, hobs, drainage areas). Ensure these are marked according to the manufacturer’s specifications.
•	If the worktop will need to accommodate plumbing, wiring, or other fixtures, these measurements should be recorded in detail.
Verification of Measurements (office staff):
•	Double-check measurements with the site contact to ensure everything is correct before proceeding.
•	Make sure that all dimensions are captured, and discuss any potential adjustments required (e.g., if there are discrepancies in wall angles or fitting issues). 
Generating the Digital Template (CAD staff:
•	Once all key measurements are taken, generate a digital template using the Proliner software.
•	Export and save the digital file in the required format for manufacturing. If necessary, email or upload the template to the production team.
Double-Check the Template:
•	Cross-reference the digital template with the physical space to ensure all measurements are accurate.
•	Make any required adjustments before finalizing the template for production.

  
INSTALLTING WORKTOPS:
1.	Templators will measure the worktop area in the designated installation area. They will report back with photos and access requirements to relay on to our team who will return to install the worktops. They will use equipment to measure the surface areas.
2.	It is essential to dry fit the pieces before any adhesives are applied to ensure all levels are correct and that all pieces fit accurately.
3.	Our stone masons will slide the material into place by hand to ensure that the correct joints and overhang measurement is achieved. 
4.	Pieces / Joints will be checked for level accuracy. If the floor or unit is not level site manager will be notified before installation and sealing. Packers may be used to adjust the worktop level from the base unit. 
5.	Once the materials are in position the team will use the seam setter to mechanically bring the joints closer. This step requires the use of masks and gloves as mentioned above due to the epoxy resin that is applied to the joints. Seam Setter to be removed and excess resin to be wiped. 
6.	Any small upstands to be applied will have silicone stuck to the back of the material ready to be placed – gloves and mask to be required during this step.
7.	If required, upstands may need to be trimmed on site. It is essential before this is done to check the surrounding area to ensure that people are not walking in the direction of any airborne dust that is a result of any trimming or grinding or polishing. Such actions should be done outside and all cables for such tools to be taped to the floor to avoid any trips. Cones to place around the area to prevent people walking by.
8.	Apply silicone to the underside of the material to seal between worktop and unit – gloves and mask to be required during this step.
.`,
} as const;

// PPE Constants
export const PRIORITY_PPE: string[] = [
  'Safety Gloves',
  'Safety Footwear',
  'Hi Vis Clothing',
  'Hard Hat',
  'Safety Goggles',
  'Hearing Protection',
  'Protective Clothing',
  'P3 Masks',
  'Face Shield',
  'Respirator Hoods',
];

export const OTHER_PPE: string[] = [
  'Connect an earth terminal to the ground',
  'Disconnect before carrying out maintenance or repair',
  'Disconnect mains plug from electrical outlet',
  'Disinfect surface',
  'Disinfect your hands',
  'Ensure continuous ventilation',
  'Entry only with supervisor outside',
  'General mandatory action sign',
  'Install locks and keep locked',
  'Install or check guard',
  'Opaque eye protection must be worn',
  'Place trash in the bin',
  'Refer to instruction manual',
  'Secure gas cylinders',
  'Sound your horn',
  'Use barrier cream',
  'Use breathing equipment',
  'Use footbridge',
  'Use footwear with antistatic or antispark features',
  'Use gas detector',
  'Use guard to protect from injury from the table saw',
  'Use handrail',
  'Use protective apron',
  'Use this walkway',
  'Ventilate before and during entering',
  'Wash your hands',
  'Wear a safety harness',
  'Wear a welding mask',
  'Wear safety belts',
];

// Map of PPE names to their filenames
export const PPE_FILENAMES = {
  'Safety Gloves': 'wear-protective-gloves.png',
  'Safety Footwear': 'wear-foot-protection.png',
  'Hi Vis Clothing': 'wear-high-visibility-clothing.png',
  'Hard Hat': 'wear-head-protection.png',
  'Safety Goggles': 'wear-eye-protection.png',
  'Hearing Protection': 'wear-ear-protection.png',
  'Protective Clothing': 'wear-protective-clothing.png',
  'P3 Masks': 'wear-a-mask.png',
  'Face Shield': 'wear-a-face-shield.png',
  'Respirator Hoods': 'wear-respiratory-protection.png',
  'Connect an earth terminal to the ground':
    'connect-an-earth-terminal-to-the-ground.png',
  'Disconnect before carrying out maintenance or repair':
    'disconnect-before-carrying-out-maintenance-or-repair.png',
  'Disconnect mains plug from electrical outlet':
    'disconnect-mains-plug-from-electrical-outlet.png',
  'Disinfect surface': 'disinfect-surface.png',
  'Disinfect your hands': 'disinfect-your-hands.png',
  'Ensure continuous ventilation': 'ensure-continuous-ventilation.png',
  'Entry only with supervisor outside':
    'entry-only-with-supervisor-outside.png',
  'General mandatory action sign': 'general-mandatory-action-sign.png',
  'Install locks and keep locked': 'install-locks-and-keep-locked.png',
  'Install or check guard': 'install-or-check-guard.png',
  'Opaque eye protection must be worn':
    'opaque-eye-protection-must-be-worn.png',
  'Place trash in the bin': 'place-trash-in-the-bin.png',
  'Refer to instruction manual': 'refer-to-instruction-manual.png',
  'Secure gas cylinders': 'secure-gas-cylinders.png',
  'Sound your horn': 'sound-your-horn.png',
  'Use barrier cream': 'use-barrier-cream.png',
  'Use breathing equipment': 'use-breathing-equipment.png',
  'Use footbridge': 'use-footbridge.png',
  'Use footwear with antistatic or antispark features':
    'use-footwear-with-anti-static-or-anti-spark-features.png',
  'Use gas detector': 'use-gas-detector.png',
  'Use guard to protect from injury from the table saw':
    'use-guard-to-protect-from-injury-from-the-table-saw.png',
  'Use handrail': 'use-handrail.png',
  'Use protective apron': 'use-protective-apron.png',
  'Use this walkway': 'use-this-walkway.png',
  'Ventilate before and during entering':
    'ventilate-before-and-during-entering.png',
  'Wash your hands': 'wash-your-hands.png',
  'Wear a safety harness': 'wear-a-safety-harness.png',
  'Wear a welding mask': 'wear-a-welding-mask.png',
  'Wear safety belts': 'wear-safety-belts.png',
} as const;

export type PPEItem = string;

// Backward compatibility
export const DEFAULT_SITE_HOURS = RAMS_DEFAULTS.SITE_HOURS;
