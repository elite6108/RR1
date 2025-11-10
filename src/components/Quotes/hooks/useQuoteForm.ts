import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type {
  Quote,
  Project,
  Customer,
  QuoteItem,
  QuoteSection,
} from '../types';
import { FormStep } from '../types';

interface UseQuoteFormProps {
  quoteToEdit?: Quote | null;
  preselectedProject?: Project | null;
  onSuccess: () => void;
  onClose: () => void;
}

export const useQuoteForm = ({
  quoteToEdit,
  preselectedProject,
  onSuccess,
  onClose,
}: UseQuoteFormProps) => {
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.DETAILS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [createdByName, setCreatedByName] = useState('');
  const [includeVat, setIncludeVat] = useState(false);
  const [overrideSubtotal, setOverrideSubtotal] = useState(false);
  const [manualSubtotal, setManualSubtotal] = useState<number>(0);
  const [paymentTerms, setPaymentTerms] = useState<{
    seven_days: string;
    thirty_days: string;
  } | null>(null);
  const [customPaymentTerms, setCustomPaymentTerms] = useState(false);
  // Convert old items format to sections format for backward compatibility
  const initializeSections = (): QuoteSection[] => {
    if (
      quoteToEdit?.sections &&
      Array.isArray(quoteToEdit.sections) &&
      quoteToEdit.sections.length > 0
    ) {
      // New format: use sections directly
      return quoteToEdit.sections.map((section) => ({
        ...section,
        id: crypto.randomUUID(),
        items: section.items.map((item, idx) => ({
          ...item,
          id: crypto.randomUUID(),
          number: item.number || (idx + 1).toString(),
          qty: item.qty ?? 1,
        })),
      }));
    } else if (
      quoteToEdit?.items &&
      Array.isArray(quoteToEdit.items) &&
      quoteToEdit.items.length > 0
    ) {
      // Old format: convert items array to a single section
      return [
        {
          id: crypto.randomUUID(),
          title: '',
          items: quoteToEdit.items.map((item, idx) => ({
            ...item,
            id: crypto.randomUUID(),
            number: item.number || (idx + 1).toString(),
            qty: item.qty ?? 1,
          })),
        },
      ];
    }
    // No quote data: start with one empty section
    return [
      {
        id: crypto.randomUUID(),
        title: '',
        items: [],
      },
    ];
  };

  const [formData, setFormData] = useState({
    project_id: quoteToEdit?.project_id || preselectedProject?.id || '',
    customer_id: quoteToEdit?.customer_id || '',
    project_location: quoteToEdit?.project_location || '',
    status: quoteToEdit?.status || 'new',
    notes: quoteToEdit?.notes || '',
    due_payable: quoteToEdit?.due_payable || '',
    payment_terms: quoteToEdit?.payment_terms || '',
    override_subtotal: quoteToEdit?.override_subtotal || null,
    is_subtotal_overridden: quoteToEdit?.is_subtotal_overridden || false,
    sections: initializeSections(),
  });

  const fetchPaymentTerms = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_terms')
        .select('seven_days, thirty_days')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setPaymentTerms(data);
      }
    } catch (err) {
      console.error('Error fetching payment terms:', err);
    }
  };

  const fetchData = async () => {
    try {
      const [projectsResponse, customersResponse] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .order('name', { ascending: true }),
        supabase
          .from('customers')
          .select('*')
          .order('customer_name', { ascending: true }),
      ]);

      if (projectsResponse.error) throw projectsResponse.error;
      if (customersResponse.error) throw customersResponse.error;

      setProjects(projectsResponse.data || []);
      setCustomers(customersResponse.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching data'
      );
    }
  };

  const fetchUserProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.user_metadata?.display_name) {
        setCreatedByName(user.user_metadata.display_name);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const calculateSubtotal = () => {
    if (overrideSubtotal) {
      return Number(manualSubtotal);
    }
    return formData.sections.reduce((total, section) => {
      // Use manual price if set, otherwise calculate from items
      if (section.manualPrice !== null && section.manualPrice !== undefined) {
        return total + section.manualPrice;
      }
      return (
        total +
        section.items.reduce(
          (sum, item) => sum + (item.price || 0) * (item.qty ?? 1),
          0
        )
      );
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return includeVat ? subtotal * 1.2 : subtotal;
  };

  // Section management functions
  const addSection = () => {
    const newSection: QuoteSection = {
      id: crypto.randomUUID(),
      title: '',
      items: [],
    };

    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const updateSection = (sectionId: string, title: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, title } : section
      ),
    }));
  };

  const updateSectionPrice = (sectionId: string, price: number | null) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, manualPrice: price } : section
      ),
    }));
  };

  const removeSection = (sectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }));
  };

  // Item management functions (now section-aware)
  const addItem = (sectionId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id === sectionId) {
          const newItem: QuoteItem = {
            id: crypto.randomUUID(),
            number: (section.items.length + 1).toString(),
            description: '',
            price: null,
            qty: 1,
          };
          return { ...section, items: [...section.items, newItem] };
        }
        return section;
      }),
    }));
  };

  const updateItem = (
    sectionId: string,
    itemId: string,
    field: keyof QuoteItem,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) => {
              if (item.id === itemId) {
                if (field === 'price') {
                  const numValue = value === '' ? null : parseFloat(value);
                  if (isNaN(numValue)) {
                    return { ...item, price: null };
                  }
                  return { ...item, price: numValue };
                }
                return { ...item, [field]: value };
              }
              return item;
            }),
          };
        }
        return section;
      }),
    }));
  };

  const removeItem = (sectionId: string, itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.filter((item) => item.id !== itemId),
          };
        }
        return section;
      }),
    }));
  };

  const moveItem = (
    itemId: string,
    fromSectionId: string,
    toSectionId: string
  ) => {
    if (fromSectionId === toSectionId) return;

    setFormData((prev) => {
      let itemToMove: QuoteItem | null = null;

      // Find and remove the item from the source section
      const sectionsAfterRemoval = prev.sections.map((section) => {
        if (section.id === fromSectionId) {
          const item = section.items.find((i) => i.id === itemId);
          if (item) {
            itemToMove = item;
            return {
              ...section,
              items: section.items.filter((i) => i.id !== itemId),
            };
          }
        }
        return section;
      });

      // Add the item to the target section
      if (itemToMove) {
        return {
          ...prev,
          sections: sectionsAfterRemoval.map((section) => {
            if (section.id === toSectionId) {
              return {
                ...section,
                items: [...section.items, itemToMove!],
              };
            }
            return section;
          }),
        };
      }

      return { ...prev, sections: sectionsAfterRemoval };
    });
  };

  const nextStep = () => {
    if (currentStep < FormStep.NOTES) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > FormStep.DETAILS) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Clean up sections before sending to the database
      const cleanSections = formData.sections.map(({ id, ...section }) => ({
        ...section,
        items: section.items.map(({ id: itemId, ...item }) => ({
          ...item,
          price: item.price === null ? null : item.price,
        })),
      }));

      // Also flatten to items array for backward compatibility with old reports/queries
      const flattenedItems = formData.sections.flatMap((section) =>
        section.items.map(({ id, ...item }) => ({
          ...item,
          price: item.price === null ? null : item.price,
        }))
      );

      const quoteData = {
        project_id: formData.project_id,
        customer_id: formData.customer_id,
        project_location: formData.project_location || null,
        status: formData.status,
        created_by_name: createdByName,
        quote_date: new Date().toISOString().split('T')[0],
        sections: cleanSections,
        items: flattenedItems, // Keep for backward compatibility
        amount: calculateTotal(),
        notes: formData.notes || null,
        due_payable: formData.due_payable || null,
        payment_terms: formData.payment_terms || null,
        user_id: user.id,
        override_subtotal: overrideSubtotal ? manualSubtotal : null,
        is_subtotal_overridden: overrideSubtotal,
      };

      let error;

      if (quoteToEdit) {
        ({ error } = await supabase
          .from('quotes')
          .update(quoteData)
          .eq('id', quoteToEdit.id));
      } else {
        ({ error } = await supabase.from('quotes').insert([quoteData]));
      }

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Form submission error:', err);
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchUserProfile();
    fetchPaymentTerms();

    if (quoteToEdit) {
      const sections = initializeSections();
      setFormData({
        project_id: quoteToEdit.project_id,
        customer_id: quoteToEdit.customer_id,
        project_location: quoteToEdit.project_location || '',
        status: quoteToEdit.status,
        notes: quoteToEdit.notes || '',
        due_payable: quoteToEdit.due_payable || '',
        payment_terms: quoteToEdit.payment_terms || '',
        override_subtotal: quoteToEdit.override_subtotal || null,
        is_subtotal_overridden: quoteToEdit.is_subtotal_overridden || false,
        sections: sections,
      });
      setOverrideSubtotal(quoteToEdit.is_subtotal_overridden || false);
      setManualSubtotal(quoteToEdit.override_subtotal || 0);
      setIncludeVat(quoteToEdit.amount > calculateSubtotal());
      setCustomPaymentTerms(!!quoteToEdit.payment_terms);
    } else if (preselectedProject) {
      setFormData((prev) => ({
        ...prev,
        project_id: preselectedProject.id,
      }));
    }
  }, [quoteToEdit, preselectedProject]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return {
    currentStep,
    setCurrentStep,
    loading,
    error,
    projects,
    customers,
    createdByName,
    includeVat,
    setIncludeVat,
    overrideSubtotal,
    setOverrideSubtotal,
    manualSubtotal,
    setManualSubtotal,
    paymentTerms,
    customPaymentTerms,
    setCustomPaymentTerms,
    formData,
    setFormData,
    calculateSubtotal,
    calculateTotal,
    addSection,
    updateSection,
    updateSectionPrice,
    removeSection,
    addItem,
    updateItem,
    removeItem,
    moveItem,
    nextStep,
    prevStep,
    handleSubmit,
  };
};
