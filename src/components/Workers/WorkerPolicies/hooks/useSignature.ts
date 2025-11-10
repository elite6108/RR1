import { useState, useRef } from 'react';
import { supabase } from '../../../../lib/supabase';

export const useSignature = () => {
  const [signature, setSignature] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const submitPolicySignature = async (
    selectedPolicy: any,
    onSuccess: (message: string) => void,
    onError: (message: string) => void
  ) => {
    if (!signature || !selectedPolicy) return;

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

      // Save policy signature - use different field names based on source
      let signatureData: any = {
        worker_id: workerData.id,
        signature_data: signature,
        signed_at: new Date().toISOString()
      };

      // Set the correct policy ID field based on source
      if (selectedPolicy.source === 'other_policy_files') {
        signatureData.other_policy_file_id = selectedPolicy.id;
      } else if (selectedPolicy.source === 'hs_policy_files') {
        signatureData.hs_policy_file_id = selectedPolicy.id;
      }

      const { error } = await supabase
        .from('workers_policy_signatures')
        .upsert(signatureData, {
          onConflict: selectedPolicy.source === 'other_policy_files' 
            ? 'worker_id,other_policy_file_id' 
            : 'worker_id,hs_policy_file_id'
        });

      if (error) throw error;

      onSuccess(`You have successfully signed the policy "${selectedPolicy?.name || 'Unknown Policy'}". Your signature has been recorded.`);
      
      // Clear signature after successful submission
      setSignature(null);
      handleClearSignature();
    } catch (error) {
      console.error('Error saving signature:', error);
      onError('There was an error saving your signature. Please try again. If the problem persists, contact your administrator.');
    } finally {
      setLoading(false);
    }
  };

  return {
    signature,
    isDrawing,
    loading,
    canvasRef,
    handleSignatureStart,
    handleSignatureStartTouch,
    handleSignatureMove,
    handleSignatureMoveTouch,
    handleSignatureEnd,
    handleSignatureEndTouch,
    handleClearSignature,
    submitPolicySignature
  };
};