import type { PageLoad } from './$types';
import { getPatientProfile } from '$lib/services/patientService';

export const load: PageLoad = async ({ parent }) => {
    const data = await parent();
  const { user } = await parent();

    // const user = data.user;
    const profile = await getPatientProfile(user.id)
  
  try {
    
    return {
      profile
    };
  } catch (error) {
    console.error('Error loading patient profile:', error);
    return {
      profile: null,
      error: 'Failed to load patient profile'
    };
  }
};