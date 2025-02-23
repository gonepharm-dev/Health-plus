// src/lib/stores/meeting.ts
import { writable } from 'svelte/store';

interface MeetingState {
  isLoading: boolean;
  error: string | null;
  role: 'doctor' | 'patient' | null;
  meetingId: string | null;
  mediaPreferences: {
    isCameraOn: boolean;
    isMicOn: boolean;
  };
}

function createMeetingStore() {
  const { subscribe, set, update } = writable<MeetingState>({
    isLoading: false,
    error: null,
    role: null,
    meetingId: null,
    mediaPreferences: {
      isCameraOn: true,
      isMicOn: true
    }
  });

  return {
    subscribe,
    setLoading: (loading: boolean) =>
      update(state => ({ ...state, isLoading: loading })),
    
    setError: (error: string | null) =>
      update(state => ({ ...state, error })),
    
    setRole: (role: 'doctor' | 'patient') =>
      update(state => ({ ...state, role })),
    
    setMeetingId: (meetingId: string) =>
      update(state => ({ ...state, meetingId })),
    
    updateMediaPreferences: (preferences: Partial<MeetingState['mediaPreferences']>) =>
      update(state => ({
        ...state,
        mediaPreferences: { ...state.mediaPreferences, ...preferences }
      })),
    
    reset: () => set({
      isLoading: false,
      error: null,
      role: null,
      meetingId: null,
      mediaPreferences: {
        isCameraOn: true,
        isMicOn: true
      }
    })
  };
}

export const meetingStore = createMeetingStore();