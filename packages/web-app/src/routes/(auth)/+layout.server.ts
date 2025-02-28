import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {

  if (!locals.user) {
    throw redirect(303, `/login?redirectTo=${url.pathname}`);
  }
  
  const user = locals.user;
  
  const pathRole = url.pathname.startsWith('/doctor') ? 'doctor' : 'patient';
  if (user.role !== pathRole && !url.pathname.startsWith('/profile')) {
    throw redirect(303, `/${user.role}`);
  }
  
  return {
    user
  };
};