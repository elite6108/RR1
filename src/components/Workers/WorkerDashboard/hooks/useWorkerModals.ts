import { useState } from 'react';
import { NotificationData, FileData } from '../types/workerDashboardTypes';

export const useWorkerModals = () => {
  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMainQuestionnaireModal, setShowMainQuestionnaireModal] = useState(false);
  const [showShortQuestionnaireModal, setShowShortQuestionnaireModal] = useState(false);
  const [showQRScannerModal, setShowQRScannerModal] = useState(false);
  const [showHealthCheckModal, setShowHealthCheckModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showAnnualLeaveModal, setShowAnnualLeaveModal] = useState(false);

  // QR Scanner related states
  const [scannedSiteId, setScannedSiteId] = useState<string | null>(null);
  const [scannedSiteName, setScannedSiteName] = useState<string>('');
  const [pendingQRScan, setPendingQRScan] = useState(false);

  // File preview states
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);

  // Notification modal state
  const [notificationData, setNotificationData] = useState<NotificationData>({
    type: 'success',
    title: '',
    message: ''
  });

  // Menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Modal handlers
  const handleMyProfile = () => {
    setShowProfileModal(true);
    setIsMenuOpen(false);
  };

  const handleMainQuestionnaire = () => {
    setShowMainQuestionnaireModal(true);
  };

  const handleShortQuestionnaire = () => {
    setShowShortQuestionnaireModal(true);
  };

  const handleQRScanner = () => {
    setShowQRScannerModal(true);
  };

  const handleHealthCheck = () => {
    setShowHealthCheckModal(true);
  };

  const handleAnnualLeave = () => {
    setShowAnnualLeaveModal(true);
  };

  const handleFilePreview = (file: FileData) => {
    setSelectedFile(file);
    setFilePreviewUrl(file.file_url);
    setShowFileModal(true);
  };

  const closeFileModal = () => {
    setShowFileModal(false);
    setSelectedFile(null);
    setFilePreviewUrl(null);
  };

  const showNotification = (type: 'success' | 'error', title: string, message: string) => {
    setNotificationData({ type, title, message });
    setShowNotificationModal(true);
  };

  const closeNotification = () => {
    setShowNotificationModal(false);
  };

  const closeAllModals = () => {
    setShowProfileModal(false);
    setShowMainQuestionnaireModal(false);
    setShowShortQuestionnaireModal(false);
    setShowQRScannerModal(false);
    setShowHealthCheckModal(false);
    setShowFileModal(false);
    setShowNotificationModal(false);
    setShowAnnualLeaveModal(false);
    setIsMenuOpen(false);
  };

  return {
    // Modal states
    showProfileModal,
    setShowProfileModal,
    showMainQuestionnaireModal,
    setShowMainQuestionnaireModal,
    showShortQuestionnaireModal,
    setShowShortQuestionnaireModal,
    showQRScannerModal,
    setShowQRScannerModal,
    showHealthCheckModal,
    setShowHealthCheckModal,
    showFileModal,
    setShowFileModal,
    showNotificationModal,
    setShowNotificationModal,
    showAnnualLeaveModal,
    setShowAnnualLeaveModal,
    isMenuOpen,
    setIsMenuOpen,

    // QR Scanner states
    scannedSiteId,
    setScannedSiteId,
    scannedSiteName,
    setScannedSiteName,
    pendingQRScan,
    setPendingQRScan,

    // File states
    filePreviewUrl,
    setFilePreviewUrl,
    selectedFile,
    setSelectedFile,

    // Notification states
    notificationData,
    setNotificationData,

    // Handlers
    handleMyProfile,
    handleMainQuestionnaire,
    handleShortQuestionnaire,
    handleQRScanner,
    handleHealthCheck,
    handleAnnualLeave,
    handleFilePreview,
    closeFileModal,
    showNotification,
    closeNotification,
    closeAllModals
  };
};