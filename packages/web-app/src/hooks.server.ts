// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.pb = new PocketBase('https://gonep-app.pockethost.io/');

  const authCookie = event.request.headers.get('cookie')?.match(/pb_auth=([^;]+)/)?.[1];
  
  if (authCookie) {
    try {
      const authData = JSON.parse(decodeURIComponent(authCookie));
      event.locals.pb.authStore.save(authData.token, authData.model);
     
      if (event.locals.pb.authStore.isValid) {
        event.locals.user = event.locals.pb.authStore.model;
      }
    } catch (err) {
      console.error('Error parsing auth cookie:', err);
    }
  }
  const response = await resolve(event);
  
  if (event.locals.pb?.authStore) {
    const token = event.locals.pb.authStore.token;
    const model = event.locals.pb.authStore.model;
    
    if (token) {
      const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
      const encodedAuthData = encodeURIComponent(JSON.stringify({ token, model }));
      response.headers.append(
        'set-cookie', 
        `pb_auth=${encodedAuthData}; Path=/; HttpOnly${secure}; SameSite=Lax; Max-Age=1209600`
      );
    }
  }
  
  return response;
};