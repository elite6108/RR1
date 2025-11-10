import { useState, useRef } from 'react';
import { supabase } from '../../../../lib/supabase';
import { FileData } from '../types/workerDashboardTypes';

export const useFileHandling = () => {
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Signature states
  const [signature, setSignature] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleOpenFile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_files')
        .select('*')
        .eq('is_employee_handbook', true)
        .single();

      if (error) throw error;
      if (!data) {
        alert('Employee handbook has not been set.');
        return;
      }

      setSelectedFile(data);

      if (data.storage_path) {
        const { data: urlData } = await supabase.storage
          .from('company-files')
          .createSignedUrl(data.storage_path, 3600);

        if (urlData?.signedUrl) {
          setFilePreviewUrl(urlData.signedUrl);
        }
      }
      return true; // Success - caller can show modal
    } catch (err) {
      console.error('Error opening file:', err);
      alert('Could not open employee handbook.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAnnualTraining = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_files')
        .select('*')
        .eq('is_annual_training', true)
        .single();

      if (error) throw error;
      if (!data) {
        alert('Annual training document has not been set.');
        return;
      }

      setSelectedFile(data);

      if (data.storage_path) {
        const { data: urlData } = await supabase.storage
          .from('company-files')
          .createSignedUrl(data.storage_path, 3600);

        if (urlData?.signedUrl) {
          setFilePreviewUrl(urlData.signedUrl);
        }
      }
      return true; // Success - caller can show modal
    } catch (err) {
      console.error('Error opening annual training:', err);
      alert('Could not open annual training document.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignatureStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastX(x);
    setLastY(y);
  };

  const handleSignatureStartTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setIsDrawing(true);
    setLastX(x);
    setLastY(y);
  };

  const handleSignatureMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    setLastX(x);
    setLastY(y);
  };

  const handleSignatureMoveTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    setLastX(x);
    setLastY(y);
  };

  const handleSignatureEnd = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const handleSignatureEndTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
    }
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setSignature(null);
    }
  };

  const handleSubmitHandbookSignature = async (onSuccess: () => void, onError: (message: string) => void) => {
    if (!signature || !selectedFile) return;

    try {
      setLoading(true);
      
      // Get the current user's email
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('No authenticated user found');

      // Get the worker's ID from the workers table using the email
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .select('id')
        .eq('email', authUser.email)
        .single();

      if (workerError) throw workerError;
      if (!workerData) throw new Error('Worker not found');

      // Determine which table to use based on the file type
      const isAnnualTraining = selectedFile.is_annual_training;
      const tableName = isAnnualTraining ? 'workers_annual_training' : 'workers_safety_handbook';
      const fileIdField = isAnnualTraining ? 'annual_training_file_id' : 'employee_handbook_file_id';

      const { error } = await supabase
        .from(tableName)
        .upsert({
          worker_id: workerData.id,
          [fileIdField]: selectedFile.id,
          signature_data: signature,
          signed_at: new Date().toISOString()
        }, {
          onConflict: isAnnualTraining ? 'worker_id,annual_training_file_id' : 'worker_id,employee_handbook_file_id'
        });

      if (error) throw error;

      // Clear states
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setSignature(null);
      handleClearSignature();
      
      onSuccess();
    } catch (error) {
      console.error('Error saving signature:', error);
      onError('Failed to save signature. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    // File states
    selectedFile,
    setSelectedFile,
    filePreviewUrl,
    setFilePreviewUrl,
    loading,
    
    // Signature states
    signature,
    setSignature,
    isDrawing,
    canvasRef,
    
    // File handlers
    handleOpenFile,
    handleOpenAnnualTraining,
    
    // Signature handlers
    handleSignatureStart,
    handleSignatureStartTouch,
    handleSignatureMove,
    handleSignatureMoveTouch,
    handleSignatureEnd,
    handleSignatureEndTouch,
    handleClearSignature,
    handleSubmitHandbookSignature
  };
};