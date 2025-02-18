import { writable } from 'svelte/store';

export type RegistrationStep = 'name' | 'email' | 'password' | 'confirmPassword' | 'role';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>({
        token: null,
        isAuthenticated: false
    });

    return {
        subscribe,
        setToken: (token: string) => {
            // Set secure HTTP-only cookie
            document.cookie = `auth_token=${token}; path=/; max-age=604800; secure; samesite=strict`;
            update(state => ({ ...state, token, isAuthenticated: true }));
        },
        logout: () => {
            document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            set({ token: null, isAuthenticated: false });
        }
    };
}

export const authStore = createAuthStore();