import { auth, type User } from '$lib/stores/auth';
import { verificationStore } from '$lib/stores/verification';
import crypto from 'crypto';

const API_URL = 'http://localhost:3001/api/collections/users';

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
};

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'patient' | 'doctor';
    contact_number: string;
    specialization?: string;
    full_name: string;
}

export async function register(data: RegisterData) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
    }

    const result = await response.json();
    
    // Store the token and email if successful
    if (result.data?.verificationToken) {
        verificationStore.setVerificationData(data.email, result.data.verificationToken);
    }

    return result;
}

export async function verifyEmail(emailToken: string) {
    console.log('Attempting verification with token:', emailToken);
    
    try {
        // Add better error logging
        console.log('Making verification request to:', `${API_URL}/request-verification/${emailToken}`);
        
        const response = await fetch(`${API_URL}/request-verification/${emailToken}`, {
            method: 'PATCH',
            headers: {
                ...DEFAULT_HEADERS,
                // Add these headers to help with CORS
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            credentials: 'include'
        });

        // Log the response status
        console.log('Verification response status:', response.status);

        const data = await response.json();
        console.log('Verification response data:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Verification failed');
        }

        return data;
    } catch (error: any) {
        console.error('Verification error details:', error);
        // Throw a more specific error
        throw new Error(error.message || 'Failed to verify email. Please try again.');
    }
}
export async function login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth-with-password`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }

    return response.json();
}

export async function loginWithGoogle(code: string, redirectURL: string) {
    const response = await fetch(`${API_URL}/auth-with-oauth2/${code}`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        credentials: 'include',
        body: JSON.stringify({ provider: 'google', code, redirectURL }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Google login failed');
    }

    return response.json();
}