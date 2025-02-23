// src/lib/stores/verification.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface VerificationState {
  email: string | null;
  token: string | null;
}

const initialState: VerificationState = {
  email: null,
  token: null
};

function createVerificationStore() {
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    
    setVerificationData: (email: string, token: string) => {
      update(() => ({ email, token }));
      
      if (browser) {
        sessionStorage.setItem('verificationEmail', email);
        sessionStorage.setItem('verificationToken', token);
      }
    },
    
    getVerificationData: (): VerificationState => {
      if (browser) {
        const email = sessionStorage.getItem('verificationEmail');
        const token = sessionStorage.getItem('verificationToken');
        
        if (email && token) {
          return { email, token };
        }
      }
      
      return initialState;
    },
    
    clear: () => {
      set(initialState);
      
      if (browser) {
        sessionStorage.removeItem('verificationEmail');
        sessionStorage.removeItem('verificationToken');
      }
    }
  };
}

export const verificationStore = createVerificationStore();