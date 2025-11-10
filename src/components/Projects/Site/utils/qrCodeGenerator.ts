import { supabase } from '../../../../lib/supabase';
import { Site } from '../types';

export const downloadQRCode = async (site: Site) => {
  try {
    // Fetch company logo from company settings
    const { data: companySettings, error: companyError } = await supabase
      .from('company_settings')
      .select('name, logo_url')
      .limit(1)
      .maybeSingle();

    if (companyError) {
      console.error('Error fetching company settings:', companyError);
    }

    const companyName = companySettings?.name || 'Company Name';
    const logoUrl = companySettings?.logo_url || null;

    // Create a canvas for the A7 page (74 × 105 mm)
    // A7 at 300 DPI is approximately 874 × 1240 pixels
    const canvas = document.createElement('canvas');
    canvas.width = 874;
    canvas.height = 1240;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set background to white
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw company logo or placeholder
    if (logoUrl) {
      // Create an image element and load the logo
      const logoImg = new Image();
      logoImg.crossOrigin = 'Anonymous';

      // Wait for the logo to load before drawing it
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
        logoImg.src = logoUrl;
      }).catch(() => {
        console.error(
          'Error loading company logo, using placeholder instead'
        );
        // If logo fails to load, draw a placeholder
        ctx.fillStyle = '#f3f4f6'; // Light gray background
        ctx.fillRect(50, 50, canvas.width - 100, 120); // smaller logo area

        ctx.font = 'bold 32px Arial'; // smaller font
        ctx.fillStyle = '#4b5563'; // Gray text
        ctx.textAlign = 'center';
        ctx.fillText(companyName, canvas.width / 2, 120);
      });

      // If logo loaded successfully, draw it
      if (logoImg.complete && logoImg.naturalHeight !== 0) {
        // Calculate dimensions to maintain aspect ratio and fit within area
        const logoArea = {
          width: canvas.width - 100,
          height: 120, // smaller height
          x: 50,
          y: 50,
        };

        const logoRatio = logoImg.width / logoImg.height;
        let drawWidth, drawHeight;

        if (logoRatio > logoArea.width / logoArea.height) {
          // Logo is wider than area
          drawWidth = logoArea.width;
          drawHeight = drawWidth / logoRatio;
        } else {
          // Logo is taller than area
          drawHeight = logoArea.height;
          drawWidth = drawHeight * logoRatio;
        }

        // Center the logo
        const x = logoArea.x + (logoArea.width - drawWidth) / 2;
        const y = logoArea.y + (logoArea.height - drawHeight) / 2;

        ctx.drawImage(logoImg, x, y, drawWidth, drawHeight);
      }
    } else {
      // No logo available, draw placeholder
      ctx.fillStyle = '#f3f4f6'; // Light gray background
      ctx.fillRect(50, 50, canvas.width - 100, 120); // smaller logo area

      ctx.font = 'bold 32px Arial'; // smaller font
      ctx.fillStyle = '#4b5563'; // Gray text
      ctx.textAlign = 'center';
      ctx.fillText(companyName, canvas.width / 2, 120);
    }

    // Add site information
    ctx.font = 'bold 24px Arial'; // smaller font
    ctx.fillStyle = '#1f2937'; // Dark gray
    ctx.textAlign = 'center';
    ctx.fillText(site.name, canvas.width / 2, 220);

    ctx.font = '16px Arial'; // smaller font
    ctx.fillStyle = '#4b5563'; // Gray text
    ctx.fillText(`${site.address}, ${site.town}`, canvas.width / 2, 250);
    ctx.fillText(`${site.county}, ${site.postcode}`, canvas.width / 2, 270);

    // Create QR code data URL
    // QR code will contain a URL to the site check-in page
    // We're using window.location.origin to get the base URL of the current app
    const baseUrl = window.location.origin;
    const appURL = `${baseUrl}/site-checkin/${site.id}`;

    const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
      appURL
    )}`;

    // Create an image element and load the QR code
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    // Wait for the image to load before drawing it on the canvas
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = qrCodeURL;
    });

    // Draw QR code
    const qrSize = 450; // smaller QR code
    const qrX = (canvas.width - qrSize) / 2;
    const qrY = 350;
    ctx.drawImage(img, qrX, qrY, qrSize, qrSize);

    // Add scan instructions
    ctx.font = '20px Arial'; // smaller font
    ctx.fillStyle = '#1f2937'; // Dark gray
    ctx.fillText(
      'Scan QR Code to log in/out of this site',
      canvas.width / 2,
      qrY + qrSize + 50
    );

    // Convert canvas to data URL and download
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `${site.name
      .replace(/\s+/g, '-')
      .toLowerCase()}-qr-code.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
};
