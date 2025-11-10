import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import type { Customer, Quote } from '../../../types/database';

export function useCustomersList(customers: Customer[], onCustomerChange: () => void) {
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerQuotes, setCustomerQuotes] = useState<Quote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showCustomerModal || showDeleteModal;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showCustomerModal, showDeleteModal]);

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.company_name?.toLowerCase().includes(query) ||
      customer.customer_name.toLowerCase().includes(query)
    );
  });

  const handleDeleteCustomer = async (customerId: string) => {
    setCustomerToDelete(customerId);
    setShowDeleteModal(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCustomerToEdit(customer);
    setShowCustomerModal(true);
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddCustomer = () => {
    setCustomerToEdit(null);
    setShowCustomerModal(true);
    
    // Scroll to top on mobile when modal opens
    if (window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCustomerClick = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setLoadingQuotes(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('quotes')
        .select(
          `
          *,
          customer:customers(customer_name, company_name)
        `
        )
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomerQuotes(data || []);
    } catch (err) {
      console.error('Error fetching customer quotes:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching quotes'
      );
    } finally {
      setLoadingQuotes(false);
    }
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerToDelete);

      if (error) throw error;
      onCustomerChange();
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    } catch (err) {
      console.error('Error deleting customer:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting the customer'
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCustomerToDelete(null);
  };

  const closeCustomerModal = () => {
    setShowCustomerModal(false);
    setCustomerToEdit(null);
  };

  const handleCustomerSuccess = () => {
    onCustomerChange();
    closeCustomerModal();
  };

  return {
    // State
    showCustomerModal,
    showDeleteModal,
    customerToEdit,
    loading,
    error,
    selectedCustomer,
    customerQuotes,
    loadingQuotes,
    searchQuery,
    filteredCustomers,
    
    // Actions
    setSearchQuery,
    handleDeleteCustomer,
    handleEditCustomer,
    handleAddCustomer,
    handleCustomerClick,
    confirmDelete,
    cancelDelete,
    closeCustomerModal,
    handleCustomerSuccess,
    setSelectedCustomer
  };
}