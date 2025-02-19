import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Writable } from 'svelte/store';

export interface User {
    id: string;
    email: string;
    username: string;
    role: 'admin' | 'patient' | 'doctor';
    verified: boolean;
    full_name: string;
    contact_number: string;
    specialization?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null
};

function createAuthStore() {
    let currentState: AuthState;  // Add this line
    const storedAuth = browser ? localStorage.getItem('auth') : null;
    const initialAuth: AuthState = storedAuth ? JSON.parse(storedAuth) : initialState;

    const { subscribe, set, update }: Writable<AuthState> = writable(initialAuth);

    // Keep track of current state
    subscribe(state => {
        currentState = state;
    });

    return {
        subscribe,
        setUser: (user: User | null) => 
            update(state => {
                const newState = { ...state, user };
                if (browser) localStorage.setItem('auth', JSON.stringify(newState));
                return newState;
            }),
        setToken: (token: string | null) => 
            update(state => {
                const newState = { ...state, token };
                if (browser) localStorage.setItem('auth', JSON.stringify(newState));
                return newState;
            }),
        getToken: () => currentState?.token ?? null,
        setLoading: (loading: boolean) => 
            update(state => ({ ...state, loading })),
        setError: (error: string | null) => 
            update(state => ({ ...state, error })),
        logout: () => {
            set(initialState);
            if (browser) localStorage.removeItem('auth');
        }
    };
}

export const auth = createAuthStore();