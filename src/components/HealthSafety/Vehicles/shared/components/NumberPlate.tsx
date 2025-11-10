import React from 'react';

interface NumberPlateProps {
  registration: string;
  className?: string;
}

export const NumberPlate = ({ 
  registration, 
  className = '' 
}: NumberPlateProps) => {
  return (
    <span 
      className={`inline-block bg-yellow-400 font-bold text-black text-center px-3 py-2 rounded border-2 border-black whitespace-nowrap min-w-[120px] mr-3 ${className}`}
      style={{
        fontFamily: 'UKNumberPlate, monospace',
        backgroundColor: 'rgb(255, 221, 0)',
        color: 'rgb(0, 0, 0)',
        padding: '8px 12px',
        borderRadius: '4px',
        minWidth: '120px',
        marginRight: '12px'
      }}
    >
      {registration}
    </span>
  );
};
