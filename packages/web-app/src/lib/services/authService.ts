import pb from '$lib/pocketbase';
import { auth } from '$lib/stores/auth';
import type { User, RegistrationData, AuthResponse } from '$lib/types/collection';
import { generateEmailVerificationToken } from '$lib/utils/tokenGenerator';
import { emailService } from './emailService'
import { otpService } from './otpService';
/**
 * Register a new user with email verification
 */
export async function registerUser(userData: Omit<RegistrationData, 'hashedRandomToken' | 'emailTokenExpiresAt'>): Promise<{
  user: User;
}> {
  try {
   
    const { token, hashedToken, expiresAt } = generateEmailVerificationToken();
    
    // Prepare user data
    const pbData = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      passwordConfirm: userData.passwordConfirm,
      full_name: userData.full_name,
      role: userData.role || 'patient',
      contact_number: userData.contact_number || '',
      specialization: userData.role === 'doctor' ? userData.specialization : '',
      emailVisibility: true,
      verified: false,
      active: true,
      hashedRandomToken: hashedToken,
      emailTokenExpiresAt: expiresAt
    };
    
    const record = await pb.collection('users').create(pbData);
    const user = record as unknown as User;
    
    
    return { user };
  } catch (error: unknown) {
    console.error('Registration error:', error);
    throw handleAuthError(error);
  }
}


/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password);
    
    // Update auth store
    auth.authenticate(authData.record as unknown as User, authData.token);
    
    return {
      token: authData.token,
      record: authData.record as unknown as User
    };
  } catch (error: unknown) {
    throw handleAuthError(error);
  }
}

/**
 * Login with Google OAuth
 */
export async function loginWithGoogle(code: string, redirectUrl: string): Promise<{
  status: string;
  message: string;
  data: AuthResponse;
}> {
  try {
    const authData = await pb.collection('users').authWithOAuth2({
      provider: 'google',
      code,
      redirectUrl
    });
    
    // Update auth store
    auth.authenticate(authData.record as unknown as User, authData.token);
    
    return {
      status: 'success',
      message: 'Google authentication successful',
      data: {
        token: authData.token,
        record: authData.record as unknown as User
      }
    };
  } catch (error: unknown) {
    console.error('Google login error:', error);
    throw handleAuthError(error);
  }
}

/**
 * Logout current user
 */
export function logout(): void {
  pb.authStore.clear();
  auth.logout();
}

// Helper function to handle auth errors with proper typing
function handleAuthError(error: unknown): Error {
  // PocketBase error format
  if (error && typeof error === 'object') {
    const pbError = error as any;
    
    // Check for data validation errors
    if (pbError.data?.data) {
      const validationErrors = pbError.data.data;
      
      if (validationErrors.email) {
        return new Error('Email is invalid or already in use');
      }
      if (validationErrors.username) {
        return new Error('Username is invalid or already in use');
      }
      if (validationErrors.password) {
        return new Error('Password is invalid. Must be at least 8 characters');
      }
      if (validationErrors.passwordConfirm) {
        return new Error('Passwords do not match');
      }
    }
    
   
    if (pbError.status === 400) {
      return new Error('Invalid data provided. Please check your information.');
    }
    
    if (pbError.status === 403) {
      return new Error('Invalid credentials or unverified email');
    }

    
    if (pbError.message) {
      return new Error(pbError.message);
    }
  }
  
  // Fallback error
  if (error instanceof Error) {
    return error;
  }
  
  return new Error('Authentication failed');
}