import { pb } from '$lib/pocketbase';
import type { PatientProfile, PatientRecord } from '$lib/types';

/**
 * Get patient profile
 */
export async function getPatientProfile(userId: string): Promise<PatientProfile> {
  try {
    const profiles = await pb.collection('PatientProfile').getList(1, 1, {
      filter: `user="${userId}"`,
      expand: 'user'
    });
    
    if (profiles.items.length === 0) {
      throw new Error('Patient profile not found');
    }
    
    return profiles.items[0] as unknown as PatientProfile;
  } catch (error) {
    console.error('Failed to fetch patient profile:', error);
    throw new Error('Unable to load patient profile. Please try again.');
  }
}

/**
 * Update patient profile
 */
export async function updatePatientProfile(profileId: string, data: Partial<PatientProfile>): Promise<PatientProfile> {
  try {
    const profile = await pb.collection('PatientProfile').update(profileId, data);
    return profile as unknown as PatientProfile;
  } catch (error) {
    console.error('Failed to update patient profile:', error);
    throw new Error('Unable to update profile. Please try again.');
  }
}

/**
 * Get patient medical records
 */
export async function getPatientRecords(patientId: string): Promise<PatientRecord[]> {
  try {
    const records = await pb.collection('PatientRecord').getList(1, 100, {
      filter: `patient="${patientId}"`,
      sort: '-Date',
      expand: 'doctor'
    });
    
    return records.items as unknown as PatientRecord[];
  } catch (error) {
    console.error('Failed to fetch patient records:', error);
    throw new Error('Unable to load medical records. Please try again.');
  }
}