import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { generateOrderNumber } from '../utils/constants';
import type { PurchaseOrder, Project, Supplier, PurchaseOrderItem } from '../types';
import { FormStep } from '../types';

interface UsePurchaseOrderFormProps {
  onClose: () => void;
  onSuccess: () => void;
  orderToEdit?: PurchaseOrder | null;
  preselectedProject?: Project | null;
  disableProjectSelection?: boolean;
}

export function usePurchaseOrderForm({
  onClose,
  onSuccess,
  orderToEdit,
  preselectedProject,
  disableProjectSelection = false,
}: UsePurchaseOrderFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.DETAILS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [createdByName, setCreatedByName] = useState('');
  const [includeVat, setIncludeVat] = useState(false);
  const [companyPrefix, setCompanyPrefix] = useState('');
  const [formData, setFormData] = useState({
    project_id: orderToEdit?.project_id || preselectedProject?.id || '',
    supplier_id: orderToEdit?.supplier_id || '',
    delivery_to: orderToEdit?.delivery_to || '',
    notes: orderToEdit?.notes || '',
    items: orderToEdit?.items || [] as PurchaseOrderItem[],
  });

  useEffect(() => {
    fetchProjects();
    fetchSuppliers();
    fetchCompanySettings();
    fetchCreatedByName();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('name');

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');

      if (error) throw error;
      setSuppliers(data || []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const fetchCompanySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('prefix')
        .single();

      if (error) throw error;
      setCompanyPrefix(data?.prefix || 'COMP');
    } catch (err) {
      console.error('Error fetching company settings:', err);
      setCompanyPrefix('COMP');
    }
  };

  const fetchCreatedByName = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        setCreatedByName(user.user_metadata.full_name);
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const projectId = e.target.value;
    setFormData(prev => ({
      ...prev,
      project_id: projectId
    }));
  };

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const supplierId = e.target.value;
    setFormData(prev => ({
      ...prev,
      supplier_id: supplierId
    }));
  };

  const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addItem = () => {
    const newItem: PurchaseOrderItem = {
      description: '',
      quantity: 1,
      price: 0,
      per: 'Each'
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, FormStep.NOTES));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, FormStep.DETAILS));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < FormStep.NOTES) {
      nextStep();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Calculate totals
      const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      const vat = includeVat ? subtotal * 0.2 : 0;
      const total = subtotal + vat;

      const orderData = {
        ...formData,
        order_number: orderToEdit?.order_number || generateOrderNumber(companyPrefix),
        amount: total,
        subtotal,
        vat,
        status: orderToEdit?.status || 'pending',
        created_by: user.id,
        created_at: orderToEdit ? undefined : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      let result;
      if (orderToEdit) {
        result = await supabase
          .from('purchase_orders')
          .update(orderData)
          .eq('id', orderToEdit.id);
      } else {
        result = await supabase
          .from('purchase_orders')
          .insert([orderData]);
      }

      if (result.error) throw result.error;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving purchase order:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    currentStep,
    loading,
    error,
    projects,
    suppliers,
    createdByName,
    includeVat,
    companyPrefix,
    formData,

    // Actions
    setIncludeVat,
    handleInputChange,
    handleProjectChange,
    handleSupplierChange,
    handleItemChange,
    addItem,
    removeItem,
    nextStep,
    prevStep,
    handleSubmit,
  };
}