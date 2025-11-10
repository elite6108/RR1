import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '../../../lib/supabase';
import type { 
  FormData, 
  Project, 
  Customer, 
  Site, 
  Quote, 
  Subcontractor, 
  SubcontractorData,
  ContractsFormProps 
} from '../types';
import { DEFAULT_BUILDER_RESPONSIBILITIES, DEFAULT_STATUTORY_INTEREST_RATE } from '../utils/constants';

export function useContractsForm({
  contract,
  preSelectedProjectId,
  onSuccess,
  onClose
}: ContractsFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [expandedSubcontractors, setExpandedSubcontractors] = useState<number[]>([]);
  const [siteManager, setSiteManager] = useState<string>('');
  const [siteAddress, setSiteAddress] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [activeDescriptionTab, setActiveDescriptionTab] = useState<'builder' | 'description'>('builder');
  const [selectedSubcontractors, setSelectedSubcontractors] = useState<SubcontractorData[]>([]);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    // Step 1
    contract_date: format(new Date(), 'yyyy-MM-dd'),
    contract_id: '',

    // Step 2
    customer_id: '',
    customer_address: '',
    customer_phone: '',
    customer_email: '',

    // Step 3
    project_id: preSelectedProjectId || '',
    project_manager: '',
    site_id: '',
    site_address: '',
    site_manager: '',
    project_start_date: format(new Date(), 'yyyy-MM-dd'),
    estimated_end_date: '',

    // Step 4
    quote_id: '',
    description_of_works: '',
    builder_responsibilities: DEFAULT_BUILDER_RESPONSIBILITIES,
    manufacturing: false,
    delivery: false,
    installing: false,

    // Step 5
    subcontractor_data: [],

    // Step 6
    payment_amount: '' as string | null,
    deposit_required: false,
    deposit_amount: '' as string | null,
    installments_required: false,
    installment_type: 'none',
    installment_frequency: 'month',
    custom_installments: '',
    statutory_interest_rate: DEFAULT_STATUTORY_INTEREST_RATE,
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchQuotes();
    fetchSites();
    fetchCustomers();
    fetchSubcontractors();

    // Initialize form with contract data if in edit mode
    if (contract) {
      console.log('Initializing with contract data:', contract);
      initializeFormWithContract(contract);
    } else if (preSelectedProjectId) {
      // If no contract but preSelectedProjectId is provided, set the project and fetch its details
      fetchProjectDetails(preSelectedProjectId);
    }
  }, [contract, preSelectedProjectId]);

  const initializeFormWithContract = (contract: any) => {
    // Create a default form state using existing contract data
    console.log('Initializing with contract:', contract);
    console.log('Original contract_date from DB:', contract.contract_date);
    
    // Ensure contract_date is in the correct format (YYYY-MM-DD)
    let formattedContractDate = contract.contract_date || format(new Date(), 'yyyy-MM-dd');
    if (contract.contract_date) {
      // If it's a full datetime string, extract just the date part
      if (contract.contract_date.includes('T')) {
        formattedContractDate = contract.contract_date.split('T')[0];
      } else if (contract.contract_date.length > 10) {
        // If it's a date string longer than YYYY-MM-DD, truncate it
        formattedContractDate = contract.contract_date.substring(0, 10);
      }
    }
    
    console.log('Formatted contract_date for form:', formattedContractDate);
    
    const initialFormData = {
      // Step 1
      contract_date: formattedContractDate,
      contract_id: contract.contract_id || '',

      // Step 2
      customer_id: contract.customer_id || '',
      customer_address: contract.customer_address || '',
      customer_phone: contract.customer_phone || '',
      customer_email: contract.customer_email || '',

      // Step 3
      project_id: contract.project_id || '',
      project_manager: contract.project_manager || '',
      site_id: contract.site_id || '',
      site_address: contract.site_address || '',
      site_manager: contract.site_manager || '',
      project_start_date: contract.project_start_date || format(new Date(), 'yyyy-MM-dd'),
      estimated_end_date: contract.estimated_end_date || '',

      // Step 4
      quote_id: contract.quote_id || '',
      description_of_works: contract.description_of_works || '',
      builder_responsibilities: contract.builder_responsibilities || '',
      manufacturing: contract.manufacturing || false,
      delivery: contract.delivery || false,
      installing: contract.installing || false,

      // Step 5
      subcontractor_data: contract.subcontractor_data || [],

      // Step 6
      payment_amount: contract.payment_amount ? Number(contract.payment_amount).toFixed(2) : '',
      deposit_required: contract.deposit_required || false,
      deposit_amount: contract.deposit_amount ? Number(contract.deposit_amount).toFixed(2) : '',
      installments_required: contract.installments_required || false,
      installment_type: contract.installment_type || 'none',
      installment_frequency: contract.installment_frequency || 'month',
      custom_installments: contract.custom_installments || '',
      statutory_interest_rate: contract.statutory_interest_rate || DEFAULT_STATUTORY_INTEREST_RATE,
    };

    console.log('Setting initial form data:', initialFormData);
    setFormData(initialFormData);

    // Set the customer address state if it exists in the contract
    if (contract.customer_address) {
      setCustomerAddress(contract.customer_address);
    }
    // Set the site address and manager states if they exist in the contract
    if (contract.site_address) {
      setSiteAddress(contract.site_address);
    }
    if (contract.site_manager) {
      setSiteManager(contract.site_manager);
    }
    if (contract.subcontractor_data) {
      setSelectedSubcontractors(contract.subcontractor_data);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, project_manager')
        .order('name');

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('company_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchSites = async () => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('name');

      if (error) throw error;

      const allSites = data || [];
      setSites(allSites);

      console.log('Fetched sites:', allSites); // Debug
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('id, quote_number, customer_id')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const fetchSubcontractors = async () => {
    try {
      const { data, error } = await supabase
        .from('subcontractors')
        .select('*')
        .order('company_name');

      if (error) throw error;
      setSubcontractors(data || []);
    } catch (error) {
      console.error('Error fetching subcontractors:', error);
    }
  };

  const fetchProjectDetails = async (projectId: string) => {
    try {
      const { data: projectData, error } = await supabase
        .from('projects')
        .select('project_manager')
        .eq('id', projectId)
        .single();

      if (!error && projectData) {
        setFormData(prev => ({
          ...prev,
          project_id: projectId,
          project_manager: projectData.project_manager || '',
        }));
      }
    } catch (err) {
      console.error('Error fetching project details:', err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    console.log('Input change:', { name, value }); // Add logging
    
    // Special handling for monetary values to ensure 2 decimal places
    if (name === 'payment_amount' || name === 'deposit_amount') {
      // Only format if there's a value
      if (value) {
        // Parse the input as a float
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue)) {
          // Store the value as a string with 2 decimal places
          setFormData((prev) => ({
            ...prev,
            [name]: numericValue.toFixed(2)
          }));
          return;
        }
      }
    }
    
    // Handle other inputs normally
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      };
      console.log('Updated form data:', newData); // Add logging
      return newData;
    });
  };

  const handleSubmit = async () => {
    try {
      const submissionData = {
        ...formData,
        subcontractor_data: selectedSubcontractors,
      };

      console.log('Initial form data:', submissionData);

      // Convert empty string numeric values to null to avoid database type errors
      if (submissionData.payment_amount === '') submissionData.payment_amount = null;
      if (submissionData.deposit_amount === '') submissionData.deposit_amount = null;

      // Convert string numbers to actual numbers for the database
      if (submissionData.payment_amount)
        submissionData.payment_amount = parseFloat(submissionData.payment_amount as string);
      if (submissionData.deposit_amount)
        submissionData.deposit_amount = parseFloat(submissionData.deposit_amount as string);

      // Ensure all form fields are properly included
      // Debug the contract_date value
      console.log('Original contract_date:', submissionData.contract_date);
      console.log('Contract_date type:', typeof submissionData.contract_date);
      
      // Validate and format contract_date to ensure it meets database constraints
      let validatedContractDate = submissionData.contract_date;
      if (validatedContractDate) {
        // Ensure it's in YYYY-MM-DD format
        if (validatedContractDate.includes('T')) {
          validatedContractDate = validatedContractDate.split('T')[0];
        }
        
        // Check if the date meets the database constraint (>= CURRENT_DATE)
        const contractDate = new Date(validatedContractDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
        
        console.log('Contract date:', contractDate);
        console.log('Today:', today);
        console.log('Date comparison (contract >= today):', contractDate >= today);
        
        // If editing an existing contract and the date is in the past, we need to handle this
        if (contract && contractDate < today) {
          console.warn('Contract date is in the past. This might violate database constraint.');
          // For existing contracts, we might need to update the date to today
          // or handle this differently based on business requirements
          validatedContractDate = format(today, 'yyyy-MM-dd');
          console.log('Updated contract_date to today:', validatedContractDate);
        }
      }
      
      const formFields = {
        contract_date: validatedContractDate,
        customer_id: submissionData.customer_id,
        customer_address: customerAddress,
        customer_phone: submissionData.customer_phone,
        customer_email: submissionData.customer_email,
        project_id: submissionData.project_id,
        project_manager: submissionData.project_manager,
        site_id: submissionData.site_id,
        site_address: submissionData.site_address,
        site_manager: submissionData.site_manager,
        project_start_date: submissionData.project_start_date || null,
        estimated_end_date: submissionData.estimated_end_date || null,
        quote_id: submissionData.quote_id || null,
        description_of_works: submissionData.description_of_works,
        builder_responsibilities: submissionData.builder_responsibilities,
        manufacturing: submissionData.manufacturing,
        delivery: submissionData.delivery,
        installing: submissionData.installing,
        payment_amount: submissionData.payment_amount,
        deposit_required: submissionData.deposit_required,
        deposit_amount: submissionData.deposit_amount,
        installments_required: submissionData.installment_type !== 'none',
        installment_type: submissionData.installment_type,
        installment_frequency: submissionData.installment_frequency,
        custom_installments: submissionData.custom_installments,
        statutory_interest_rate: submissionData.statutory_interest_rate,
        subcontractor_data: submissionData.subcontractor_data,
      };

      console.log('Form fields to be submitted:', formFields);

      let result;
      if (contract) {
        // Update existing contract
        console.log('Updating contract with data:', formFields);
        const { error: updateError } = await supabase
          .from('contracts')
          .update(formFields)
          .eq('id', contract.id);

        if (updateError) {
          console.error('Update error:', updateError);
          throw updateError;
        }

        // Fetch the updated contract
        const { data: updatedData, error: fetchError } = await supabase
          .from('contracts')
          .select('*')
          .eq('id', contract.id)
          .single();

        if (fetchError) {
          console.error('Fetch error:', fetchError);
          throw fetchError;
        }
        result = updatedData;
      } else {
        // Insert new contract
        console.log('Inserting new contract with data:', formFields);
        const { data: newData, error: insertError } = await supabase
          .from('contracts')
          .insert([formFields])
          .select()
          .single();

        if (insertError) {
          console.error('Insert error:', insertError);
          throw insertError;
        }
        result = newData;
      }

      console.log('Contract saved successfully:', result);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Full submission error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return {
    // State
    currentStep,
    loading,
    error,
    formData,
    projects,
    customers,
    sites,
    quotes,
    subcontractors,
    expandedSubcontractors,
    siteManager,
    siteAddress,
    customerAddress,
    activeDescriptionTab,
    selectedSubcontractors,

    // Actions
    setCurrentStep,
    setFormData,
    setExpandedSubcontractors,
    setSiteManager,
    setSiteAddress,
    setCustomerAddress,
    setActiveDescriptionTab,
    setSelectedSubcontractors,
    handleInputChange,
    handleSubmit
  };
}