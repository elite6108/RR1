import { ChartData } from '../types';

export const downloadChart = (companyLogo: string | null) => {
  const chartElement = document.querySelector('.chart-container');
  if (chartElement) {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas dimensions with extra space for logo and title
    const element = chartElement as HTMLElement;
    canvas.width = element.offsetWidth;
    canvas.height = element.offsetHeight + 100; // Extra space for logo and title
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Function to add logo and title
    const addLogoAndTitle = (callback: () => void) => {
      if (companyLogo) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.onload = () => {
          // Calculate logo dimensions maintaining aspect ratio
          const maxLogoSize = 80;
          const logoAspectRatio = logoImg.width / logoImg.height;
          
          let logoWidth, logoHeight;
          if (logoAspectRatio > 1) {
            // Wider than tall - constrain width
            logoWidth = maxLogoSize;
            logoHeight = maxLogoSize / logoAspectRatio;
          } else {
            // Taller than wide - constrain height
            logoHeight = maxLogoSize;
            logoWidth = maxLogoSize * logoAspectRatio;
          }
          
          // Draw logo in top-left corner with proper aspect ratio
          ctx.drawImage(logoImg, 20, 20, logoWidth, logoHeight);
          
          // Add title next to logo with proper spacing
          const titleX = 20 + logoWidth + 20; // 20px margin after logo
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 24px Arial';
          ctx.fillText('Annual Accident Statistics Report', titleX, 45);
          
          // Add timestamp
          ctx.font = '14px Arial';
          ctx.fillStyle = '#666666';
          const timestamp = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          ctx.fillText(`Generated: ${timestamp}`, titleX, 65);
          
          callback();
        };
        logoImg.onerror = () => {
          // If logo fails to load, just add title
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 24px Arial';
          ctx.fillText('Annual Accident Statistics Report', 20, 45);
          
          ctx.font = '14px Arial';
          ctx.fillStyle = '#666666';
          const timestamp = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          ctx.fillText(`Generated: ${timestamp}`, 20, 65);
          
          callback();
        };
        logoImg.src = companyLogo;
      } else {
        // No logo, just add title
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Annual Accident Statistics Report', 20, 45);
        
        ctx.font = '14px Arial';
        ctx.fillStyle = '#666666';
        const timestamp = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        ctx.fillText(`Generated: ${timestamp}`, 20, 65);
        
        callback();
      }
    };
    
    // Convert SVG to canvas and add to main canvas
    const svgElements = chartElement.querySelectorAll('svg');
    if (svgElements.length > 0) {
      const svgData = new XMLSerializer().serializeToString(svgElements[0]);
      const img = new Image();
      const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        // Draw chart below logo/title area
        ctx.drawImage(img, 0, 100);
        
        // Add logo and title
        addLogoAndTitle(() => {
          // Download as JPG
          canvas.toBlob((blob) => {
            if (blob) {
              const link = document.createElement('a');
              link.download = `accidents-annual-stats-${new Date().toISOString().split('T')[0]}.jpg`;
              link.href = URL.createObjectURL(blob);
              link.click();
              URL.revokeObjectURL(url);
            }
          }, 'image/jpeg', 0.9);
        });
      };
      
      img.src = url;
    }
  }
};
