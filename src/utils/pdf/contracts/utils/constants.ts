/*
 * Constants and contract sections content for contract PDF generation
 */

import {
  Contract,
  CompanySettings,
  CustomerData,
  PaymentTermsData,
  SubcontractorDetails,
  ContractDates,
} from '../types';

export const themeColor = '#000000';

/**
 * Generate all standard contract sections
 */
export function getStandardContractSections(
  contract: Contract,
  companySettings: CompanySettings,
  customerData: CustomerData | null,
  subcontractorDetails: SubcontractorDetails[],
  paymentTermsData: PaymentTermsData | null,
  quoteNumber: string | null,
  contractDates: ContractDates | null,
  siteManager: string | null
) {
  return [
    {
      title: 'AGREEMENT',
      content: `This agreement is between the Supplier/Builder (${companySettings.name}) and Client (${customerData?.company_name || contract.other_party_name}), dated on ${new Date(contract.contract_date).toLocaleDateString()}.

The Builder has been appointed as contractor for the works/oversight of ${[
        contract.manufacturing ? 'manufacturing' : null,
        contract.installing ? 'installing' : null,
        contract.delivery ? 'delivery' : null
      ].filter(Boolean).join(', ') || 'the works'}. Please see the section Builder's Responsibilities for additional and detailed works.`,
    },
    {
      title: 'SUBCONTRACTORS',
      content: `The following subcontractors have been appointed for this project:

${subcontractorDetails.length > 0 ? 
  subcontractorDetails.map((sub: SubcontractorDetails, index: number) => 
    `${index + 1}. ${sub.companyName}
       Subcontractor Manager: ${sub.manager}
       Responsibilities: ${sub.responsibilities}`
  ).join('\n\n')
  : 
  'No subcontractors have been appointed for this project.'}`,
    },
    {
      title: 'DEFINITIONS',
      content: `This Agreement relies on the following definitions and rules of interpretation:

Agreement: Refers to this Building Construction Agreement.

Applicable Laws: All laws, statutes, regulations, and codes in force at any given time that apply to the contract.

Business Day: Any day (other than a Saturday, Sunday, or public holiday) when banks are open for business in England and Wales.

Builder's Equipment: Any equipment, tools, systems, cabling, or facilities provided by the Builder for use in completing the Works, except for items that are covered under a separate agreement where the title passes to the Client.

Building Site: The location where the construction work will take place, as specified in this Agreement.

Change: A modification to the scope, nature, volume, or execution of the Works, or any other change to the terms of this Agreement.

Change Control: The process for recording, evaluating, and approving or rejecting any proposed changes to the Works or Charges.

Change Order: A document detailing the proposed changes to the Works.

Charges: The amounts the Client agrees to pay the Builder for performing the Works.

Control: As defined in section 1124 of the Corporation Tax Act 2010.

Deliverables: Any outputs or results from the Works (e.g., design drawings, proposals, etc.) that the Builder is to provide to the Client.

Intellectual Property Rights: Rights related to patents, copyrights, trademarks, service marks, business names, domain names, design rights, database rights, and confidential information (including know-how), as well as any similar rights that exist now or in the future, whether registered or unregistered.

Party or Parties: The Client and the Builder in this Agreement.

Works: The construction works described in this Agreement.`,
    },
    {
      title: 'CONTRACT PRICE AND PAYMENTS',
      content: `The total contract price is £${Number(contract.payment_amount).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.

${contract.deposit_required 
  ? `The deposit amount is £${Number(contract.deposit_amount).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`
  : 'No deposits required for this contract.'
}

${contract.installments_required 
  ? contract.custom_installments 
    ? `Installments will be required as per custom schedule: ${contract.custom_installments}`
    : `Installments will be required, on a ${contract.installment_frequency} basis.`
  : 'No installments have been selected.'
}

Payment terms are as specified in the submitted quotation (${quoteNumber || contract.quote_id || 'N/A'}).`,
    },
    {
      title: 'CHARGES & PAYMENTS',
      content: `(1) The Client agrees to pay the Charges for the Works as outlined in the quotation.

(2) The Builder will charge the Client a sum of £${Number(contract.payment_amount).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} for the Works. This amount will either be paid in full or in installments as per the payment terms outlined in the Quote/Contract

(3) The Charges will cover the costs of travel and any other reasonable ancillary expenses incurred by the Builder's staff in connection with the Works.

(4) The Charges will also include any costs the Builder incurs for materials or services sourced from third parties for the provision of the Works.

(5) With 20 days' notice, the Builder may review the Charges to reflect changes in material prices, adjustments to the Works, or any other factors affecting the Work. The Client may negotiate the revised charges, and if both parties agree, the new charges will apply. Any increase in Charges will be limited to a maximum of 5%.

(6) Any increase in Charges due to changes in material prices, changes to the Works, or other related matters will be capped at 5% of the original Charges.

(7) The Builder will issue invoices for the Charges as outlined in the quotation.

(8) The Client must pay each invoice within 7 days of receiving it, to the following bank account: 

All payments to be made to: ${
        paymentTermsData
          ? `
${paymentTermsData.bank_name}
Account Number: ${paymentTermsData.account_number}
Sort Code: ${paymentTermsData.sort_code}`
          : companySettings.bank_details
          ? companySettings.bank_details
          : '[Bank details to be provided]'
      }

(9) If the Client fails to pay any amount due under this Agreement by the specified due date, without affecting any other rights the Builder may have, the Builder has the right to suspend all or part of the Works until full payment is received.

(10) All amounts payable to the Builder under this Agreement:

(11) Are exclusive of VAT. The Client must also pay any VAT applicable on these sums upon receiving a VAT invoice.

(12) Shall be paid in full, subject to a 5% retention. The Client may assess the completed works and approve them by signing the Builder's completion documentation. 
    
(13) Late payments will be subject to ${contract.statutory_interest_rate || '8% plus the Bank of England base rate for business to business transactions'}. `,
    },
    {
      title: 'CHARGES',
      content: 'Additional charges may apply for work outside the scope of services detailed in this agreement.',
    },
    {
      title: 'DESCRIPTION OF WORKS',
      content: `The Builder will provide the following as per quote number (${
        quoteNumber || contract.quote_id || 'N/A'
      })
        
(1) The Builder shall provide the Client with the following Works: 

      ${contract.description_of_works || 'No description provided'}

(2)Full set of drawings showing the locations of the works along with dimensions and layouts of surrounding works. This will be provided upon signing of this agreement.`,
    },
    {
      title: "BUILDER'S RESPONSIBILITIES",
      content: `(1) The Builder agrees to perform the Works and deliver the Deliverables to the Client in accordance with accepted industry standards and in all material aspects. The Deliverables to be provided under this Agreement include:
    
    (a) Schedule of Works
    
    (b) Risk Assessments and Method Statements (RAMS)
    
    (c) Build Plan
    
    (d) Project Manager Assignment
    
    (e) Site Setup and Access Plan
    
    (f) Machinery Usage and Lift Plans
    
    (g) Proof of Adequate Insurance Coverage

These documents must be provided to the Client for approval before work on the site begins.

(3) The Builder will use all reasonable efforts to complete the Works within the agreed timelines. However, any dates provided are estimates, and the time for performance will not be considered essential to this Agreement. (Refer to Section 2 d/e for further details.)

(4) The Builder will bring its own tools, equipment, and machinery to the Building Site and will use them for completing the Works as outlined in this Agreement.

(5) The Builder will appoint a qualified Site/Project Manager for the duration of the contract.

${
  siteManager
    ? siteManager
    : contract.site_manager
    ? contract.site_manager
    : 'Project Manager'
} has been appointed as the Project Manager.

The Builder is contractually bound by the decisions and actions of the appointed Project Manager regarding the Works. If necessary, the Builder may replace the Project Manager with someone of equal experience and qualifications.

(6) The Building Site will adhere to all applicable health and safety regulations. The Builder is required to follow these regulations and use all reasonable efforts to comply with them at all times.

(7) The Builder is responsible for supplying all necessary materials and ensuring quality control throughout the duration of the Works. If any issues arise that could compromise quality, the Builder will promptly inform the Client to seek a suitable resolution.

(8) Additional responsibilities:

${contract.builder_responsibilities || 'No additional responsibilities'}`,
    },
    {
      title: 'COMMENCEMENT AND DURATION',
      content: `(1) This Agreement shall commence on ${new Date(
        contract.contract_date
      ).toLocaleDateString()}

(2) This Agreement shall come to an end either through earlier termination in accordance with this Agreement; or when the Works have been fully completed by the Builder and Signed off by the Client.

(3) The works are scheduled to begin ${
        contractDates?.project_start_date
          ? new Date(contractDates.project_start_date).toLocaleDateString()
          : new Date(contract.contract_date).toLocaleDateString()
      } and will last until ${
        contractDates?.estimated_end_date
          ? new Date(contractDates.estimated_end_date).toLocaleDateString()
          : new Date(
              new Date(contract.contract_date).setMonth(
                new Date(contract.contract_date).getMonth() + 3
              )
            ).toLocaleDateString()
      }. Deviations in dates may occur but the client will be informed at all times of changes in writing.

(4) In the event that the Builder cannot complete the works in the agreed time frame then the Client will be informed in writing and a new time line will be agreed for the most convenient date for all parties. The Builder may be permitted to delay the works by no more than 120 days without penalties from the initial agreed start date in this contract.`,
    },
    {
      title: "CLIENT'S OBLIGATIONS",
      content: `(1) The Client agrees to:
    
    (a) Cooperate with the Builder on all reasonable matters related to the Works.
    
    (b) Provide the Builder, as well as its agents, subcontractors, consultants, and employees, with timely access to the Building Site and any other facilities the Builder reasonably requires. This access will be provided at no cost to the Builder.
    
    (c) Supply the Builder with all necessary documents and information required to perform the Works, ensuring that everything provided is complete and accurate.
    
    (d) Inform the Builder of all relevant health and safety requirements that apply at the Building Site.

(2) If the Builder is unable to fulfil its obligations under this Agreement due to any action or inaction of the Client, its agents, subcontractors, consultants, or employees, the Builder may extend the time for performing its obligations by an amount equal to the delay caused by the Client. Any such extension must be agreed in writing by both parties.`,
    },
    {
      title: 'CHANGE CONTROL',
      content: `(1) Either party may suggest changes to the agreed Works, but the change will only be valid when both parties sign a Change Order. A valid Change Order must include the following:
    
    (a) A description of the proposed changes to the Works.
    
    (b) The Builder's proposed net charges for the variation.
    
    (c) The net time impact of the proposed change.
    
    (d) Any adjustments to the terms of this Agreement.

(2) If the Builder proposes a change to the Works, it must provide the Client with a draft Change Order.

(3) If the Client proposes a change to the Works:
    
    (a) The Client must inform the Builder and provide all necessary details regarding the proposed changes, including any time expectations.
    
    (b) After receiving the Client's proposed changes, the Builder must provide a draft Change Order as soon as reasonably possible.

(4) If both parties agree to a Change Order, they must sign it, and this Agreement will be amended accordingly.

(5) If a Change Order cannot be agreed upon, either party may request that the disagreement be resolved using the dispute resolution process outlined in this Agreement.`,
    },
    {
      title: 'DISPUTE RESOLUTION PROCEDURES',
      content: `If the Builder and Client are unable to resolve any issues relating to the contracted works amicably, legal advice may be sought to resolve the dispute.

Either party may give written notice to the other party to refer a dispute under this Agreement to adjudication.

The parties can mutually agree on the identity of the adjudicator. If no agreement is reached within 2 days of the notice being given, the party referring the dispute (the "Referring Party") must apply to the Chartered Institute of Arbitrators to nominate an adjudicator. The nominated adjudicator will be communicated to the parties within 5 days of the application.

Within 7 days of giving the notice, the Referring Party must refer the dispute to the adjudicator. The adjudicator will make a decision within 28 days of the referral, or longer if both parties agree.

The adjudicator may extend the decision period by up to 14 days, with the consent of the referring party. The adjudicator must act impartially and may take the initiative in gathering facts and the law.

The adjudicator's decision is binding until the dispute is finally resolved by legal proceedings, arbitration (if agreed upon by the parties or provided for in the contract), or mutual agreement.

The adjudicator is not liable for any action or omission in carrying out their role unless done in bad faith. The same protection applies to any employee or agent of the adjudicator.`,
    },
    {
      title: 'INTELLECTUAL PROPERTY RIGHTS',
      content: `(1) Any Intellectual Property created or developed under this Agreement in the course of providing the Works will be fully owned by the Client, with no restrictions on its use.

(2) The Builder may only use the Intellectual Property for the purpose outlined in this Agreement, unless given written consent by the Client. The Builder is responsible for any damages resulting from the unauthorised use of the Intellectual Property.

(3) However, the Builder retains ownership of any Intellectual Property it owned prior to this Agreement.`,
    },
    {
      title: 'COMPLIANCE WITH LAWS AND POLICIES',
      content: `(1) The Builder must comply with all applicable laws and planning approvals while fulfilling its obligations under this Agreement.

(2) If there are changes to the applicable laws that require adjustments to the Works, these changes must be agreed upon through the Change Control process.`,
    },
    {
      title: 'CONFIDENTIALITY',
      content: `(1a) Each party agrees not to disclose any confidential information related to the business, affairs, customers, clients, or suppliers of the other party, except as allowed by this Agreement. This confidentiality obligation applies at all times.

(2) A party may disclose the other party's confidential information only:

    (a) To its employees, officers, representatives, builders, subcontractors, or advisers who need to know the information to exercise the party's rights or meet its obligations under this Agreement. The disclosing party must ensure that these individuals also comply with this confidentiality clause.  

    (b) As required by law, a court of competent jurisdiction, or any government or regulatory authority.

(3) Neither party may use the other party's confidential information for any purpose other than to fulfil its rights and obligations under this Agreement.`,
    },
    {
      title: 'LIMITATION OF LIABILITY',
      content: `(1) The Builder holds insurance to cover its legal liability for individual claims, with a maximum of £5,000,000 per claim. This insurance is limited as outlined in this clause. The Client is responsible for obtaining any additional insurance needed to cover losses beyond this amount.

(2) The term "liability" in this clause includes any type of liability that may arise under or in connection with this Agreement, including but not limited to:

    (a) Tortious liability (including negligence);

    (b) Misrepresentation;

    (c) Restitution;

    (d Deliberate default.

(3) The following types of liability are covered by the Builder's insurance:

${[
  companySettings.public_liability ? `    Public Liability: £${companySettings.public_liability}` : null,
  companySettings.employers_liability ? `    Employers Liability: £${companySettings.employers_liability}` : null,
  companySettings.products_liability ? `    Products Liability: £${companySettings.products_liability}` : null,
  companySettings.professional_indemnity ? `    Professional Indemnity: £${companySettings.professional_indemnity}` : null,
  companySettings.contractors_risk ? `    Contractors' All Risk: £${companySettings.contractors_risk}` : null,
  companySettings.plant_machinery ? `    Plant & Machinery: £${companySettings.plant_machinery}` : null,
  companySettings.owned_plant ? `    Owned Plant Insurance: £${companySettings.owned_plant}` : null,
  companySettings.hired_plant ? `    Hired Plant Insurance: £${companySettings.hired_plant}` : null,
  companySettings.environmental_liability ? `    Environmental Liability: £${companySettings.environmental_liability}` : null,
  companySettings.latent_defects ? `    Latent Defects Insurance: £${companySettings.latent_defects}` : null,
  companySettings.other_insurances ? `    Other Insurances: ${companySettings.other_insurances}` : null
].filter(Boolean).join('\n')}

(4) The Client's payment obligations under this Agreement are not limited by anything in this clause.

(5) Liabilities that cannot be limited by this Agreement include, but are not limited to:

    (a) Death or personal injury caused by negligence; and

    (b) Fraud or fraudulent misrepresentation.

(6) Subject to the limitation clauses in this Agreement, the Builder's total liability to the Client:
  
    (a) For property damage caused by the negligence of its employees or agents in connection with this Agreement will be chargeable for any single or connected events;
  
    (7) Subject to the limitation clauses in this Agreement, the Client's total liability to the Builder:
    
    (a) For damage to the Builder's equipment or property caused by the negligence of its employees or agents in connection with this Agreement will be chargeable.;
    
(8) Any caps on the Client's liability will not be reduced by any amounts awarded by a court or arbitrator for costs or interest related to late payment.

    (a) Subject to the limitations in this Agreement, the following types of liability are excluded:
    
    (b) Loss of profits;
    
    (c) Loss of sales or business;
    
    (d) Loss of or damage to goodwill; and
    
    (e) Indirect or consequential loss.

    (f) The Builder will not be liable for any event unless the Client notifies the Builder within the notice period. The notice period starts on the day the Client became, or should have reasonably become, aware of the grounds for a claim, and ends 6 years from that date. The notice must be in writing and must include details of the event and the claim.`,
    },
    {
      title: 'TERMINATION',
      content: `(1) Either party may terminate this Agreement immediately by giving written notice to the other party if any of the following occur:
    
    (a) The other party commits a serious breach of any term of this Agreement and, if the breach can be fixed, fails to do so within 60 days of being notified in writing.
    
    (b) The other party repeatedly breaches the terms of this Agreement to the extent that it reasonably appears they are unable or unwilling to comply with it.
    
    (c) The other party takes any action that could lead to bankruptcy, administration, liquidation, or any similar legal process.
    
    (d) The other party suspends or threatens to suspend its business activities.
    
    (e) The other party's financial situation deteriorates to the point where it is reasonably believed they cannot fulfil their obligations under this Agreement.

(2) The Builder may terminate this Agreement immediately by giving written notice to the Client if the Client fails to pay any amount due under this Agreement within 30 days of receiving a notice to make the payment.`,
    },
    {
      title: 'SURVIVAL',
      content: `The rights, remedies, obligations, or liabilities of the parties that have arisen up to the date of termination or expiry will not be affected by the end of this Agreement. This includes the right to claim damages for any breach that occurred before or at the time of termination or expiry.`,
    },
    {
      title: 'FORCE MAJEURE',
      content: `Neither party will be in breach of this Agreement, nor liable for failure to meet their obligations, if such failure is caused by events or circumstances beyond their reasonable control. The time for fulfilling obligations will be extended accordingly. If the delay or non-performance lasts for more than 1 month, the unaffected party may terminate this Agreement by providing 30 days' written notice to the affected party.`,
    },
    {
      title: 'ASSIGNMENT AND TRANSFER',
      content: `(1) The Client is not allowed to assign, transfer, mortgage, charge, subcontract, delegate, or create a trust over any of its rights or obligations under this Agreement.
        
(2) The Builder is free to assign, mortgage, charge, create a trust over, or deal with any or all of its rights under this Agreement at any time.`,
    },
    {
      title: 'VARIATION',
      content: `Unless allowed under the Change Control clause of this Agreement, no changes to this Agreement will be valid unless made in writing and signed by both parties (or their authorised representatives).`,
    },
    {
      title: 'WAIVER',
      content: `(1) For a waiver to be valid, it must be provided in writing and will not be seen as a waiver of any future rights or remedies.

(2) If a party fails to act on, or delays in exercising, any right or remedy, this does not mean they are waiving that right or remedy. It also does not prevent them from using that right or remedy in the future.`,
    },
    {
      title: 'RIGHTS AND REMEDIES',
      content: `A party's rights and remedies under this Agreement are in addition to, and not a replacement for, any rights or remedies it may have under the law.`,
    },
    {
      title: 'SEVERANCE',
      content: `(1) If any part of this Agreement is found to be invalid, illegal, or unenforceable, it will be treated as deleted. This will not affect the validity of the remaining parts of the Agreement.

(2) If any part is deleted, the parties will negotiate in good faith to agree on a replacement provision that closely matches the original intent and commercial purpose of the deleted provision.`,
    },
    {
      title: 'ENTIRE AGREEMENT',
      content: `(1) This Agreement represents the full and complete understanding between the parties.

(2) Each party confirms that, in entering this Agreement, they are not relying on any statements, promises, or assurances not included in this document. No party will have any claim for innocent or negligent misrepresentation based on anything said or implied outside of what is written in this Agreement.`,
    },
    {
      title: 'NO PARTNERSHIP OR AGENCY',
      content: `(1) Nothing in this Agreement is intended to, or shall be deemed to, establish any partnership or joint venture between any of the Parties, constitute any party the agent of another party, or authorise any party to make or enter into any commitments for or on behalf of any other party.

(2) Each party confirms it is acting on its own behalf and not for the benefit of any other person.`,
    },
    {
      title: 'THIRD PARTY RIGHTS',
      content: `(1) No one other than the people or organisations who have signed this Agreement has any right to enforce any part of it under the Contracts (Rights of Third Parties) Act 1999.

(2) The parties involved can change or cancel this Agreement at any time without needing approval from anyone else.`,
    },
    {
      title: 'NOTICES',
      content: `(1) Any notice relating to this Agreement must be in writing and can be delivered in either of the following ways:
        
    (a) By hand to the recipient's registered office or main place of business.

    (b) By email, using the following addresses (or any new address provided in writing by the relevant party):

Supplier/ Builder: richard@onpointgroundworks.co.uk

(2) A notice will be considered received:
    
    (a) Immediately, if delivered by hand to the correct address.
    
    (b) At the time it is sent by email. If the email is sent outside of normal business hours, it will be treated as received when business hours resume.

(3) This clause does not cover the delivery of legal documents related to court, arbitration, or other formal dispute processes.`,
    },
    {
      title: 'SIGNED COPIES',
      content: `(1) This Agreement can be signed in multiple copies. Each signed copy will be treated as an original, but together, all copies will make up a single agreement.

(2) The Agreement will not be valid until each party has provided at least one signed copy to the other.`,
    },
    {
      title: 'GOVERNING LAW',
      content: `The laws of England and Wales will apply to this Agreement. Any issues or claims that arise—whether directly from the contract or related to it in any way, including those not based on the contract itself—will be handled under these laws.`,
    },
    {
      title: 'JURISDICTION',
      content: `Both parties agree that any disagreements or claims—whether related to the contract itself or matters connected to it, including those not based on the contract—will be dealt with only by the courts of England and Wales. This decision cannot be changed.`,
    },
    {
      title: 'ACKNOWLEDGMENT',
      content: `This Agreement has been made with the understanding that both parties fully accept and will follow the terms outlined in this contract.`,
    },
  ];
}
