// packages/web-app/src/lib/stores/session.ts
import { writable } from 'svelte/store';

const SESSION_EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes

function createSessionStore() {
  const { subscribe, set, update } = writable<{ user: any; expiry: number } | null>(null);

  const login = (user: any) => {
    const expiry = Date.now() + SESSION_EXPIRY_TIME;
    set({ user, expiry });
    startSessionTimer(expiry);
  };

  const logout = () => {
    set(null);
    clearTimeout(sessionTimeout);
  };

  let sessionTimeout: NodeJS.Timeout;

  const startSessionTimer = (expiry: number) => {
    const remainingTime = expiry - Date.now();
    if (remainingTime > 0) {
      sessionTimeout = setTimeout(() => {
        logout();
      }, remainingTime);
    }
  };

  const checkSession = () => {
    subscribe((session) => {
      if (session && Date.now() > session.expiry) {
        logout();
      }
    })();
  };

  return {
    subscribe,
    login,
    logout,
    checkSession,
  };
}

export const sessionStore = createSessionStore();