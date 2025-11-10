import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import { generatePurchaseOrderPDF } from '../../../../utils/pdf/purchaseorders/pdfGenerator';
import type { PurchaseOrder, Project, Supplier } from '../types';

interface UsePurchaseOrdersListProps {
  orders: PurchaseOrder[];
  onOrderChange: () => void;
  preselectedProject?: Project | null;
  disableProjectSelection?: boolean;
}

export function usePurchaseOrdersList({ 
  orders, 
  onOrderChange, 
  preselectedProject, 
  disableProjectSelection 
}: UsePurchaseOrdersListProps) {
  const [showPurchaseOrderModal, setShowPurchaseOrderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [orderToEdit, setOrderToEdit] = useState<PurchaseOrder | null>(null);
  const [generatingPdfId, setGeneratingPdfId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [companyPrefix, setCompanyPrefix] = useState('');
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(orders);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanySettings();
    fetchOrdersWithSuppliers();
  }, [orders]);

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

  const fetchOrdersWithSuppliers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          supplier:suppliers(*),
          project:projects(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchaseOrders(data || []);

      // Extract unique suppliers and projects
      const uniqueSuppliers = Array.from(
        new Map(data?.map(order => [order.supplier?.id, order.supplier]).filter(([id, supplier]) => id && supplier) || []).values()
      ) as Supplier[];
      
      const uniqueProjects = Array.from(
        new Map(data?.map(order => [order.project?.id, order.project]).filter(([id, project]) => id && project) || []).values()
      ) as Project[];

      setSuppliers(uniqueSuppliers);
      setProjects(uniqueProjects);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  const handleEditOrder = (order: PurchaseOrder) => {
    setOrderToEdit(order);
    setShowPurchaseOrderModal(true);
  };

  const handleGeneratePDF = async (order: PurchaseOrder) => {
    setGeneratingPdfId(order.id);
    setPdfError(null);

    try {
      // Fetch company settings
      const { data: companySettings, error: companyError } = await supabase
        .from('company_settings')
        .select('*')
        .single();

      if (companyError) throw companyError;

      // Find supplier and project data
      const supplier = suppliers.find(s => s.id === order.supplier_id);
      const project = projects.find(p => p.id === order.project_id);

      if (!supplier) throw new Error('Supplier not found');
      if (!project) throw new Error('Project not found');

      // Prepare supplier address
      const supplierAddress = [
        supplier.address_line1,
        supplier.address_line2,
        `${supplier.town}, ${supplier.county}`,
        supplier.post_code
      ].filter(Boolean).join('\n');

      // Generate PDF with all required data
      const pdfDataUrl = await generatePurchaseOrderPDF({
        order,
        companySettings,
        supplierName: supplier.name,
        supplierAddress,
        projectName: project.name
      });

      // Open PDF in new window
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Purchase Order ${order.order_number}</title>
            </head>
            <body style="margin: 0; padding: 0;">
              <iframe src="${pdfDataUrl}" width="100%" height="100%" frameborder="0"></iframe>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      setPdfError('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPdfId(null);
    }
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('purchase_orders')
        .delete()
        .eq('id', orderToDelete);

      if (error) throw error;
      onOrderChange();
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      setPdfError('Failed to delete order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = () => {
    setOrderToEdit(null);
    setShowPurchaseOrderModal(true);
  };

  const closePurchaseOrderModal = () => {
    setShowPurchaseOrderModal(false);
    setOrderToEdit(null);
  };

  const handleOrderSuccess = () => {
    onOrderChange();
    closePurchaseOrderModal();
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setOrderToDelete(null);
  };

  const getSupplierName = (supplierId: string): string => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier?.name || 'Unknown Supplier';
  };

  const getProjectName = (projectId: string): string => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return {
    // State
    showPurchaseOrderModal,
    showDeleteModal,
    orderToDelete,
    orderToEdit,
    generatingPdfId,
    pdfError,
    searchQuery,
    companyPrefix,
    purchaseOrders,
    suppliers,
    projects,
    loading,

    // Actions
    setSearchQuery,
    setPdfError,
    handleDeleteOrder,
    handleEditOrder,
    handleGeneratePDF,
    confirmDelete,
    handleAddOrder,
    closePurchaseOrderModal,
    handleOrderSuccess,
    cancelDelete,
    getSupplierName,
    getProjectName,
    formatDate,
    formatNumber,
  };
}