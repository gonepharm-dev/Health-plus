// packages/web-app/src/routes/(auth)/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const protectedRoutes = [
  '/dashboard/doctor', 
  '/dashboard/patient', 
  '/appointment', 
  '/meeting/[roomId]' // This will match any roomId
]; // Specify protected routes here

export const handle: Handle = async ({ event, resolve }) => {
  const isAuthenticated = /* your logic to check if the user is authenticated */;

  // Check if the requested route is protected
  if (protectedRoutes.some(route => event.url.pathname.startsWith(route)) && !isAuthenticated) {
    throw redirect(302, '/login'); // Redirect to login if not authenticated
  }

  return await resolve(event);
};