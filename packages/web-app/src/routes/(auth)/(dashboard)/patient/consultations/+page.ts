import type { PageLoad } from './$types';
import { getPatientConsultations } from '$lib/services/consultationService';

export const load: PageLoad = async ({ parent }) => {
  const { user } = await parent();
  
  try {
    const consultations = await getPatientConsultations(user.id);
    
    return {
      consultations
    };
  } catch (error) {
    console.error('Error loading consultations:', error);
    return {
      consultations: [],
      error: 'Failed to load consultations'
    };
  }
};  