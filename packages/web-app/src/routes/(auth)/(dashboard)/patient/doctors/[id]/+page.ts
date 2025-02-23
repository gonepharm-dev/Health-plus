import type { PageLoad } from './$types';
import { getDoctorProfile } from '$lib/services/doctorService';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params }) => {
  try {
    const doctorId = params.id;
    const doctorProfile = await getDoctorProfile(doctorId);
    
    return {
      doctorProfile
    };
  } catch (err) {
    console.error('Error loading doctor profile:', err);
    throw error(404, 'Doctor not found');
  }
};