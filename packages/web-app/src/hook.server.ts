// import type { Handle } from '@sveltejs/kit';

// export const handle: Handle = async ({ event, resolve }) => {
//     // Handle authentication token from cookies
//     const token = event.cookies.get('auth_token');
    
//     if (token) {
//         event.locals.token = token;
//         event.locals.isAuthenticated = true;
//     }

//     const response = await resolve(event);
//     return response;
// };