export const ADMIN_CREDENTIALS = {
  username: 'ravi',
  password: '2008'
};

export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem('adminAuth') === 'true';
};

export const adminLogin = (username: string, password: string): boolean => {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem('adminAuth', 'true');
    return true;
  }
  return false;
};

export const adminLogout = (): void => {
  localStorage.removeItem('adminAuth');
};

// Token authentication functions
export const TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export interface TokenVerificationResponse {
  valid: boolean;
  message: string;
  userId?: number;
}

export interface AccessCheckResponse {
  hasAccess: boolean;
  message: string;
  expiresAt?: number | null;
}

export const isUserAuthenticated = (): boolean => {
  const tokenData = localStorage.getItem('userTokenData');
  if (!tokenData) return false;
  
  try {
    const { expiration } = JSON.parse(tokenData);
    return Date.now() < expiration;
  } catch (e) {
    return false;
  }
};

export const setUserToken = (userId: number, expiresAt?: number): void => {
  // Use the provided expiration time or default to 24 hours
  const expiration = expiresAt || (Date.now() + TOKEN_EXPIRATION_TIME);
  localStorage.setItem('userTokenData', JSON.stringify({ userId, expiration }));
};

export const clearUserToken = (): void => {
  localStorage.removeItem('userTokenData');
};

export const verifyToken = async (token: string): Promise<TokenVerificationResponse> => {
  try {
    // Log the exact token being sent for debugging
    console.log('Sending token for verification:', token);
    
    // Using proxy endpoint to avoid CORS issues
    // Properly encode the token parameter
    const encodedToken = encodeURIComponent(token);
    const url = `/api/verify-token?token=${encodedToken}`;
    console.log('Making request to proxy:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-cache'
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const textResponse = await response.text();
    console.log('Raw response text:', textResponse);
    
    // Try to parse JSON, but handle if it's not valid JSON
    let data: TokenVerificationResponse;
    try {
      data = JSON.parse(textResponse);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      throw new Error('Invalid response format from server');
    }
    
    console.log('Token verification response:', data);
    return data;
  } catch (error: unknown) {
    console.error('Token verification error:', error);
    // More specific error messages based on error type
    if (error instanceof TypeError) {
      return {
        valid: false,
        message: 'Network connection failed. Please check your internet connection and try again.',
      };
    } else if (error instanceof Error) {
      return {
        valid: false,
        message: error.message || 'An error occurred during token verification. Please try again.',
      };
    } else {
      return {
        valid: false,
        message: 'An unexpected error occurred during token verification. Please try again.',
      };
    }
  }
};

export const checkAccess = async (userId: number): Promise<AccessCheckResponse> => {
  try {
    // Using proxy endpoint to avoid CORS issues
    // Properly encode the userId parameter
    const url = `/api/check-access?userId=${encodeURIComponent(userId.toString())}`;
    console.log('Making request to proxy:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-cache'
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response body:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const textResponse = await response.text();
    console.log('Raw response text:', textResponse);
    
    // Try to parse JSON, but handle if it's not valid JSON
    let data: AccessCheckResponse;
    try {
      data = JSON.parse(textResponse);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      throw new Error('Invalid response format from server');
    }
    
    console.log('Access check response:', data);
    return data;
  } catch (error: unknown) {
    console.error('Access check error:', error);
    // More specific error messages based on error type
    if (error instanceof TypeError) {
      return {
        hasAccess: false,
        message: 'Network connection failed. Please check your internet connection and try again.',
        expiresAt: null
      };
    } else if (error instanceof Error) {
      return {
        hasAccess: false,
        message: error.message || 'An error occurred during access check. Please try again.',
        expiresAt: null
      };
    } else {
      return {
        hasAccess: false,
        message: 'An unexpected error occurred during access check. Please try again.',
        expiresAt: null
      };
    }
  }
};