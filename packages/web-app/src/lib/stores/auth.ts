// src/lib/stores/auth.ts
import { writable, derived } from 'svelte/store';
import type { User } from '$lib/types/';
import { browser } from '$app/environment';
import pb from '$lib/pocketbase';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean; 
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialState);

  async function initialize() {
    if (!browser) return;
    
    update(s => ({ ...s, loading: true }));
    
    try {
      // Check if PocketBase has valid auth
      if (pb.authStore.isValid) {
        const user = pb.authStore.model as unknown as User;
        const token = pb.authStore.token;
        
        set({
          user,
          token,
          isAuthenticated: true,
          loading: false,
          error: null
        });
        
        // Optionally refresh the auth if needed
        try {
          await pb.collection('users').authRefresh();
        } catch (refreshError) {
          console.warn('Auth refresh failed:', refreshError);
          // Don't log out - the token might still be valid
        }
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: 'Failed to initialize auth state'
      });
    }
  }

  return {
    subscribe,
    
    initialize,
    
    authenticate: (user: User, token: string) => {
      // This critical step saves the session to PocketBase AND our store
      pb.authStore.save(token, user);
      
      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
        error: null
      });
      
      // Make sure to create a cookie as well (if we need additional client-side storage)
      if (browser) {
        const authData = JSON.stringify({ token, model: user });
        document.cookie = `pb_auth=${encodeURIComponent(authData)}; Path=/; Max-Age=1209600; SameSite=Lax`;
      }
    },
    
    updateUser: (updatedData: Partial<User>) => {
      update(state => {
        if (!state.user) return state;
        
        const updatedUser = { ...state.user, ...updatedData } as User;
        
        // Important: Update the PocketBase auth store with the new user data
        if (pb.authStore.isValid && state.token) {
          pb.authStore.save(state.token, updatedUser);
        }
        
        return { ...state, user: updatedUser };
      });
    },
    
    logout: () => {
      // Clear PocketBase auth
      pb.authStore.clear();
      
      // Clear the cookie
      if (browser) {
        document.cookie = 'pb_auth=; Path=/; Max-Age=0; SameSite=Lax';
      }
      
      // Reset store state
      set(initialState);
    },
    
    setError: (error: string | null) => {
      update(state => ({ ...state, error }));
    }
  };
}

export const auth = createAuthStore();

// Derived stores for easy subscription
export const currentUser = derived(auth, $auth => $auth.user);
export const isAuthenticated = derived(auth, $auth => $auth.isAuthenticated);
export const authLoading = derived(auth, $auth => $auth.loading);
export const authError = derived(auth, $auth => $auth.error);