// src/lib/services/videoSDK.ts
import { browser } from '$app/environment';
import type { VideoSDK as VideoSDKType } from '@videosdk.live/js-sdk';

const API_BASE_URL = 'https://api.videosdk.live/v2';

let VideoSDK: typeof VideoSDKType;

async function loadVideoSDK() {
  if (browser && !VideoSDK) {
    const module = await import('@videosdk.live/js-sdk');
    VideoSDK = module.VideoSDK;
  }
  return VideoSDK;
}
export async function getToken(type: 'api' | 'rtc' = 'rtc', roomId?: string) {
  try {
    const url = new URL('/api/token', window.location.origin);
    url.searchParams.set('type', type);
    if (roomId) {
      url.searchParams.set('roomId', roomId);
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get token: ${errorText}`);
    }
    
    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
}
export async function getRtcToken(roomId: string) {
  return getToken('rtc', roomId);
}

export async function validateRoom(roomId: string) {
  try {
    const token = await getToken('api');
    const response = await fetch(`${API_BASE_URL}/rooms/validate/${roomId}`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Room validation failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating room:', error);
    return false;
  }
}

export async function initializeSDK(token: string) {
  if (!browser) return;
  
  try {
    const sdk = await loadVideoSDK();
    
    console.log('Initializing SDK');
    sdk.config(token);
    return sdk;
  } catch (error) {
    console.error('Error initializing SDK:', error);
    throw error;
  }
}
export async function getMeetingToken(roomId?: string) {
  try {
    const url = new URL('/api/token', window.location.origin);
    url.searchParams.set('type', roomId ? 'rtc' : 'api');
    if (roomId) {
      url.searchParams.set('roomId', roomId);
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get token: ${errorText}`);
    }
    
    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
}

export async function createRoom() {
  try {
    const token = await getMeetingToken();
    
    console.log('Creating room with API token');

    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Room creation failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      throw new Error(`Failed to create room: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.roomId) {
      throw new Error('Room ID not found in response');
    }
    
    console.log('Room created successfully:', data.roomId);
    return data.roomId;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
}
export async function validateMeeting(roomId: string) {
  try {
    const token = await getMeetingToken();
    const response = await fetch(`${API_BASE_URL}/rooms/validate/${roomId}`, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Room validation failed:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error validating room:', error);
    return false;
  }
}

export async function initializeVideoSDK(token: string) {
  if (!browser) return null;
  
  try {
    const sdk = await loadVideoSDK();
    console.log('Initializing VideoSDK');
    sdk.config(token);
    return sdk;
  } catch (error) {
    console.error('Error initializing SDK:', error);
    throw error;
  }
}


// Types
export interface ParticipantMap {
  [participantId: string]: {
    displayName?: string;
    isLocal: boolean;
    audioStream?: MediaStream;
    videoStream?: MediaStream;
  };
}

export type { VideoSDKType as VideoSDK };