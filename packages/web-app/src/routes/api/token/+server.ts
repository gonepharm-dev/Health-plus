import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { PUBLIC_VIDEOSDK_API_KEY } from '$env/static/public';
import { VIDEOSDK_SECRET_KEY } from '$env/static/private';

export async function GET({ url }) {
  try {
    if (!PUBLIC_VIDEOSDK_API_KEY || !VIDEOSDK_SECRET_KEY) {
      return new Response('VideoSDK credentials not configured', { 
        status: 500 
      });
    }

    const type = url.searchParams.get('type') || 'rtc';
    const roomId = url.searchParams.get('roomId');

    let payload = {
      apikey: PUBLIC_VIDEOSDK_API_KEY,
      permissions: ['allow_join', 'allow_mod'],
      version: 2,
      roles: type === 'api' ? ['crawler'] : ['rtc'],
      ...(roomId && { roomId })
    };

    const options: SignOptions = {
      algorithm: 'HS256',
      expiresIn: 86400 // 24 hours in seconds
    };

    const token = jwt.sign(
      payload,
      VIDEOSDK_SECRET_KEY,
      options
    );
    
    console.log('Generated token type:', type);
    
    return json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return new Response('Error generating token', { 
      status: 500 
    });
  }
}