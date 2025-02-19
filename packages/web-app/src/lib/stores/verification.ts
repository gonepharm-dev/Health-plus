import { writable } from 'svelte/store';

interface VerificationState {
    token: string | null;
    email: string | null;
}

function createVerificationStore() {
    const { subscribe, set, update } = writable<VerificationState>({
        token: null,
        email: null
    });

    return {
        subscribe,
        setVerificationData: (email: string, token: string) => 
            update(state => ({ ...state, email, token })),
        clear: () => set({ token: null, email: null })
    };
}

export const verificationStore = createVerificationStore();