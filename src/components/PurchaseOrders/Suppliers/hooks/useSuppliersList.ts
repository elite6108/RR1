import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import type { Supplier } from '../types';

interface UseSuppliersListProps {
  suppliers: Supplier[];
  onSupplierChange: () => void;
}

export function useSuppliersList({ suppliers, onSupplierChange }: UseSuppliersListProps) {
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedSupplierOrders, setSelectedSupplierOrders] = useState<any[]>([]);
  const [selectedSupplierName, setSelectedSupplierName] = useState('');
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Prevent body scroll when modal is open
  useEffect(() => {
    const isModalOpen = showSupplierModal || showDeleteModal || showOrdersModal || showOrderDetails;
    
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSupplierModal, showDeleteModal, showOrdersModal, showOrderDetails]);

  const handleDeleteSupplier = async (supplierId: string) => {
    setSupplierToDelete(supplierId);
    setShowDeleteModal(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSupplierToEdit(supplier);
    setShowSupplierModal(true);
  };

  const handleSupplierClick = async (supplier: Supplier) => {
    setLoadingOrders(true);
    setSelectedSupplierName(supplier.name);
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(
          `
          *,
          project:projects(name),
          supplier:suppliers(*)
        `
        )
        .eq('supplier_id', supplier.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSelectedSupplierOrders(data || []);
      setShowOrdersModal(true);
    } catch (err) {
      console.error('Error fetching supplier orders:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while fetching orders'
      );
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleOrderClick = (order: any) => {
    setShowOrdersModal(false);
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const confirmDelete = async () => {
    if (!supplierToDelete) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', supplierToDelete);

      if (error) throw error;
      onSupplierChange();
      setShowDeleteModal(false);
      setSupplierToDelete(null);
    } catch (err) {
      console.error('Error deleting supplier:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while deleting the supplier'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddSupplier = () => {
    setSupplierToEdit(null);
    setShowSupplierModal(true);
  };

  const closeSupplierModal = () => {
    setShowSupplierModal(false);
    setSupplierToEdit(null);
  };

  const handleSupplierSuccess = () => {
    onSupplierChange();
    closeSupplierModal();
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSupplierToDelete(null);
  };

  const closeOrdersModal = () => {
    setShowOrdersModal(false);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const handleOrderSuccess = () => {
    if (selectedOrder?.supplier) {
      handleSupplierClick(selectedOrder.supplier);
    }
    closeOrderDetails();
  };

  return {
    // State
    showSupplierModal,
    showDeleteModal,
    supplierToDelete,
    supplierToEdit,
    loading,
    error,
    showOrdersModal,
    selectedSupplierOrders,
    selectedSupplierName,
    loadingOrders,
    selectedOrder,
    showOrderDetails,
    searchQuery,

    // Actions
    setError,
    setSearchQuery,
    handleDeleteSupplier,
    handleEditSupplier,
    handleSupplierClick,
    handleOrderClick,
    confirmDelete,
    handleAddSupplier,
    closeSupplierModal,
    handleSupplierSuccess,
    cancelDelete,
    closeOrdersModal,
    closeOrderDetails,
    handleOrderSuccess,
  };
}