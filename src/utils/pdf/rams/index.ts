import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { RAMS, CompanySettings } from '../../../types/database';
import type { RAMSFormData } from '../../../types/rams';
import { DEFAULT_SITE_HOURS } from '../../../types/rams';
import { addCompanyLogo } from './shared/companyLogo';
import { addPageNumbersAndFooter } from './shared/pageNumbering';
import { generateRAMSPDF1 } from './ramsPDF1';
import { generateRAMSPDF2 } from './ramsPDF2';
import { generateRAMSPDF3 } from './ramsPDF3';
import { generateRAMSPDF4 } from './ramsPDF4';
import { generateRAMSPDF5 } from './ramsPDF5';
import { generateRAMSPDF6 } from './ramsPDF6';
import { generateRAMSPDF7 } from './ramsPDF7';

interface GeneratePDFOptions {
  rams: RAMS;
  companySettings: CompanySettings;
}

export async function generateRAMSPDF({
  rams,
  companySettings
}: GeneratePDFOptions): Promise<string> {
  try {
    // Convert RAMS database type to RAMSFormData type
    const ramsData: RAMSFormData = {
      id: rams.id,
      created_at: rams.created_at,
      updated_at: rams.updated_at,
      rams_number: rams.rams_number,
      reference: rams.reference,
      client_id: rams.client_id,
      client_name: rams.client_name,
      project_id: rams.project_id,
      site_manager: rams.site_manager,
      assessor: rams.assessor,
      approved_by: rams.approved_by,
      address_line1: rams.address_line1,
      address_line2: rams.address_line2 || '',
      address_line3: rams.address_line3 || '',
      site_town: rams.site_town,
      site_county: rams.site_county,
      post_code: rams.post_code,
      site_hours: rams.site_hours || DEFAULT_SITE_HOURS,
      supervision: rams.supervision || 'The works will be managed by the site foreman outlined above. Site management will provide authorisation to begin work. All official communication will be through Robert Stewart, especially if there are any adjustments to the project whilst work is being carried out.',
      description: rams.description || 'No description provided',
      sequence: rams.sequence || 'No sequence provided',
      stability: rams.stability || 'No structural works will be undertaken during this project to existing buildings.',
      special_permits: rams.special_permits || 'No special construction permits will be required for this project. Any equipment that is hired will have its own permits from the supplier.',
      workers: rams.workers || 'Skilled and experienced workers from Rock Revelations (London)  Ltd. Groundwork plant equipment machine operators (diggers, dumpers, rollers, Vac Ex) are expected to hold the appropriate training and certification to be able to use the machinery and plant equipment.',
      tools_equipment: rams.tools_equipment || 'Hand tools: (non-powered), 110v Powered tools including drills.',
      plant_equipment: rams.plant_equipment || 'No plant equipment required',
      lighting: rams.lighting || 'Construction will be undertaken outside where adequate daylight is sufficient and there will be no need for additional lighting.',
      deliveries: rams.deliveries || 'Supplier deliveries will be carried out in their licenced HGV, or dumper trucks.',
      services: rams.services || 'Main power will be utilised for the 110V tools using centre tap earth electrical transformers. If 240V is required for construction tools, additional transformers will be used along with an RCD breaker.',
      access_equipment: rams.access_equipment || 'Work will not be carried out on any towers or at heights.',
      hazardous_equipment: rams.hazardous_equipment || 'No hazardous substances will be used.',
      welfare_first_aid: rams.welfare_first_aid || 'Welfare & first aid facilities on site to be utilised, to be advised on induction. First Aider: Connor Harris (certificate to be attached) First Aid Kit Locations: First aid boxes and eye wash kits will be available within site vehicles.',
      nearest_hospital: rams.nearest_hospital || 'To be determined on site',
      fire_action_plan: rams.fire_action_plan || 'Where possible, workers will follow the existing fire safety plan for the site, including using the designated evacuation points. Additionally, the work performed by Rock Revelations (London)  Ltd involves groundworks, where the risk of fire is low. The heavy-duty machinery we hire undergoes servicing and maintenance before use. When raising fire alarm awareness, workers should not use an air horn, klaxon or whistle, as there may be other construction trades who will not be using the same awareness method so they will not understand. However, in the unlikely event of a fire on site—whether originating from a vehicle, machinery, or other trades/equipment not associated with us—the following practices should be observed:',
      protection_of_public: rams.protection_of_public || 'The construction site will be cordoned off and vacant whilst the works are ongoing. Such cordon will be made by site "main/prime contractors" who have hired Rock Revelations (London)  Ltd. "Main/prime contractor" will always ensure the safety of the public, including suitable fencing, cones, and warning signs. The access/egress to the site is destructed to authorised persons only and the site will be manned daily.',
      clean_up: rams.clean_up || '1. All waste must be taken back to the van in the appropriate waste boxes to be disposed at commercial waste sites\n2. Final checks of the installation area will be carried out to achieve the best possible and highest standard\n3. Remove all equipment and leave no waste behind\n4. Client site representative or/and Rock Revelations (London)  Ltd will sign off on completion of the work',
      order_of_works_safety: rams.order_of_works_safety || '1. PPE is required as advised above before entering and working on site\n2. Unload from the van and transport the materials to the working area, as instructed below\n3. Workers will adhere to site rules and communicate with site manager as required\n4. Power cables will be covered down using mats where possible and if required',
      order_of_works_task: rams.order_of_works_task || 'groundworks',
      order_of_works_custom: rams.order_of_works_custom || 'No custom works specified',
      delivery_info: rams.delivery_info || '1. Rock Revelations (London) Ltd workers will inform site management, other trades of material deliveries due in for that day. This communication is vital, so all parties are aware of deliveries for the project.\n2. Once a supplier arrives with their delivery, our workers will guide the vehicle to the working area as near as possible.\n3. Depending on the materials, the driver of the vehicle will either have equipment to unload the materials, to which our workers will then transport to the working area – using trolleys or carts, to minimise manual handling.\n4. If the materials being delivered are sand, concrete or other aggregates, then our workers will lay down tarpaulin to ensure any spillages can be contained. Materials will be poured into dump trucks that our workers will drive to the working area.',
      groundworks_info: rams.groundworks_info || '1. Set out and mark up ring-beam perimeter as per planning drawing.\n2. Cut and break out existing tarmac surface in line with the proposed ring-beam.\n3. Excavate the strip foundation and remove all waste to the designated area for soil/waste collection.\n4. Excavate and install ducting for power to courts. The route for this to be discussed on site with client.\n5. Build timber shuttering and install the footing.\n6. Pour concrete. Tamp and hand finish to ensure suitable surface to take the court structure. Note: the concrete will be taken by dump truck from mixer to the courts where possible to avoid spillage.\n7. Remote shuttering, back fill the ring-beam with hardcore and whacker.\n8. Power wash existing tarmac surface, add keying agent if required.\n9. Lay 30mm of hand finished 6m tarmac ready for the erection of the courts and laying of the astro court surface.\n10. Clean site and remove all waste/rubbish and excess materials in accordance with UK law and correct disposal.',
      additional_info: rams.additional_info || 'No additional information provided',
      ppe: rams.ppe || [],
      hazards: rams.hazards || []
    };

    // Create new PDF document
    const doc = new jsPDF();
    
    // Define theme colors
    const themeColor = '#000000';
    
    // Set default font
    doc.setFont('helvetica');

    // Add company logo
    await addCompanyLogo(doc, companySettings);

    // Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(themeColor);
    doc.text('RAMS', 195, 25, { align: 'right' });
    
    // Reset text color
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    let yPos = 45;

    // Generate each section
    yPos = await generateRAMSPDF1(doc, ramsData, companySettings, yPos);
    
    // Add a new page if needed
    if (yPos > doc.internal.pageSize.height - 100) {
      doc.addPage();
      yPos = 15;
    }
    
    yPos = await generateRAMSPDF2(doc, ramsData, yPos);
    
    if (yPos > doc.internal.pageSize.height - 100) {
      doc.addPage();
      yPos = 15;
    }
    
    yPos = await generateRAMSPDF3(doc, ramsData, yPos);
    
    if (yPos > doc.internal.pageSize.height - 100) {
      doc.addPage();
      yPos = 15;
    }
    
    yPos = await generateRAMSPDF4(doc, ramsData, yPos);
    
    if (yPos > doc.internal.pageSize.height - 100) {
      doc.addPage();
      yPos = 15;
    }
    
    yPos = await generateRAMSPDF5(doc, ramsData, yPos);
    
    if (yPos > doc.internal.pageSize.height - 100) {
      doc.addPage();
      yPos = 15;
    }
    
    yPos = await generateRAMSPDF6(doc, ramsData, yPos);
    
    if (yPos > doc.internal.pageSize.height - 100) {
      doc.addPage();
      yPos = 15;
    }
    
    yPos = await generateRAMSPDF7(doc, ramsData, yPos);

    // Add page numbers and footer
    addPageNumbersAndFooter(doc, companySettings);

    // Return the PDF as a data URL
    return doc.output('dataurlstring');
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}