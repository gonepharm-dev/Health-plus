export function generateEmailVerificationToken(): {
  token: string;
  hashedToken: string;
  expiresAt: string;
} {
  // Generate a 6-digit random token
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  
  
  const hashedToken = btoa(token); // Simple encoding for demo purposes
 
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  
  return { token, hashedToken, expiresAt };
}

  export function generatePasswordResetToken(): {
    token: string;
    hashedToken: string;
    expiresAt: string;
  } {
    
    const token = Math.floor(10000 + Math.random() * 90000).toString();
    
 
    const hashedToken = btoa(token);
    
    // Expiration time - 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    
    return { token, hashedToken, expiresAt };
  }
  

  export function verifyToken(plainToken: string, hashedToken: string): boolean {
    return btoa(plainToken) === hashedToken;
  }