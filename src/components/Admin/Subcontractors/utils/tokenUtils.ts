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
