import type { PageLoad } from './$types';
import { getPatientRecords } from '$lib/services/patientService';

export const load: PageLoad = async ({ parent }) => {
  const { user } = await parent();
  
  try {
    const records = await getPatientRecords(user.id);
    
    return {
      records
    };
  } catch (error) {
    console.error('Error loading medical records:', error);
    return {
      records: [],
      error: 'Failed to load medical records'
    };
  }
};