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

// Simple user authentication without external token verification
export const isUserAuthenticated = (): boolean => {
  // Check for either simple access or Telegram-based access
  return localStorage.getItem('userAccess') === 'true' || 
         localStorage.getItem('telegramUserAccess') === 'true';
};

export const grantUserAccess = (): void => {
  localStorage.setItem('userAccess', 'true');
};

export const grantTelegramUserAccess = (): void => {
  localStorage.setItem('telegramUserAccess', 'true');
};

export const removeUserAccess = (): void => {
  localStorage.removeItem('userAccess');
  localStorage.removeItem('telegramUserAccess');
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

export const setUserToken = (userId: number, expiresAt?: number): void => {
  // Use the provided expiration time or default to 24 hours
  const expiration = expiresAt || (Date.now() + TOKEN_EXPIRATION_TIME);
  localStorage.setItem('userTokenData', JSON.stringify({ userId, expiration }));
};

export const clearUserToken = (): void => {
  localStorage.removeItem('userTokenData');
};

// Determine base URL based on environment
const getApiBaseUrl = () => {
  // Use direct API URL with proper CORS handling
  return 'https://competitive-karly-edumastersuraj-75acc2f2.koyeb.app';
};

export const verifyToken = async (token: string): Promise<TokenVerificationResponse> => {
  try {
    // Log the exact token being sent for debugging
    console.log('Sending token for verification:', token);
    
    // Use direct API URL
    const baseUrl = getApiBaseUrl();
    const encodedToken = encodeURIComponent(token);
    const url = `${baseUrl}/verify-token?token=${encodedToken}`;
    console.log('Making request to:', url);
    
    // Add better error handling for network issues
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
      signal: controller.signal,
      // Add credentials and mode for better CORS handling
      credentials: 'omit',
      mode: 'cors'
    });
    
    clearTimeout(timeoutId);
    
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
    
    // Handle timeout specifically
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        valid: false,
        message: 'Request timeout. Please check your internet connection and try again.',
      };
    }
    
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
    // Use direct API URL
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/check-access?userId=${encodeURIComponent(userId.toString())}`;
    console.log('Making request to:', url);
    
    // Add better error handling for network issues
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
      signal: controller.signal,
      // Add credentials and mode for better CORS handling
      credentials: 'omit',
      mode: 'cors'
    });
    
    clearTimeout(timeoutId);
    
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
    
    // Handle timeout specifically
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        hasAccess: false,
        message: 'Request timeout. Please check your internet connection and try again.',
        expiresAt: null
      };
    }
    
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