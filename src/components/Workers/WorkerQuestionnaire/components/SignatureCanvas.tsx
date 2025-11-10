import React from 'react';
import { useSignature } from '../hooks/useSignature';

interface SignatureCanvasProps {
  onSignatureChange: (signature: string) => void;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  onSignatureChange
}) => {
  const {
    canvasRef,
    startDrawing,
    startDrawingTouch,
    draw,
    drawTouch,
    stopDrawing,
    stopDrawingTouch,
    getSignature,
    clearSignature
  } = useSignature();

  const handleStopDrawing = () => {
    stopDrawing();
    const signature = getSignature();
    onSignatureChange(signature);
  };

  const handleStopDrawingTouch = () => {
    const signature = getSignature();
    onSignatureChange(signature);
  };

  const handleClearSignature = () => {
    clearSignature();
    onSignatureChange('');
  };

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Digital Signature *
      </label>
      <div className="border border-gray-300 rounded-md p-2">
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="border border-gray-200 rounded bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={handleStopDrawing}
          onMouseLeave={handleStopDrawing}
          onTouchStart={startDrawingTouch}
          onTouchMove={drawTouch}
          onTouchEnd={stopDrawingTouch}
          style={{ touchAction: 'none' }}
        />
      </div>
      <button
        type="button"
        onClick={handleClearSignature}
        className="mt-2 text-sm text-red-600 hover:text-red-700"
      >
        Clear Signature
      </button>
    </div>
  );
};
