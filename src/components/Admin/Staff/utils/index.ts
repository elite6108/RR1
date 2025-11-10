export const validatePhoneNumber = (phone: string): string => {
  if (phone.length > 10) {
    return 'Phone number must be 10 digits after +44';
  }
  if (!/^\d{10}$/.test(phone)) {
    return 'Phone number must be 10 digits';
  }
  return '';
};

export const validateNINumber = (ni: string): string => {
  const niRegex = /^(?!BG)(?!GB)(?!NK)(?!KN)(?!TN)(?!NT)(?!ZZ)(?!.*[DFIQUV])[A-CEGHJ-NPR-TW-Z]{2}\d{6}[A-D]$/;
  if (!niRegex.test(ni)) {
    return 'Invalid National Insurance number format';
  }
  return '';
};

export const generateToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let token = '';
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 4) token += '-';
  }
  return token;
};

export const handleCopyToken = async (token: string): Promise<{ success: boolean; message: string }> => {
  try {
    await navigator.clipboard.writeText(token);
    return { success: true, message: 'Token copied to clipboard' };
  } catch (error) {
    console.error('Error copying token:', error);
    return { success: false, message: 'Failed to copy token' };
  }
};

export const formatPhoneNumber = (phone?: string): string => {
  if (!phone) return 'N/A';
  return phone.startsWith('0') ? phone : `0${phone}`;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB');
};
