import { pb } from '$lib/pocketbase';
import type { User, DoctorProfile } from '$lib/types/';

/**
 * Get all doctors
 */
export async function getAllDoctors(limit: number = 50): Promise<User[]> {
  try {
    const doctorsResult = await pb.collection('users').getList(1, limit, {
      filter: 'role="doctor" && active=true',
      sort: '-created'
    });
    
    return doctorsResult.items as unknown as User[];
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    throw new Error('Unable to load doctors. Please try again.');
  }
}

/**
 * Get doctor profile by ID
 */
export async function getDoctorProfile(doctorId: string): Promise<DoctorProfile> {
  try {
    const profiles = await pb.collection('DoctorProfile').getList(1, 1, {
      filter: `user="${doctorId}"`,
      expand: 'user'
    });
    
    if (profiles.items.length === 0) {
      throw new Error('Doctor profile not found');
    }
    
    return profiles.items[0] as unknown as DoctorProfile;
  } catch (error) {
    console.error('Failed to fetch doctor profile:', error);
    throw new Error('Unable to load doctor profile. Please try again.');
  }
}

/**
 * Get doctor availability
 */
export async function getDoctorAvailability(doctorId: string): Promise<any[]> {
  try {
    const availability = await pb.collection('DoctorAvailability').getList(1, 100, {
      filter: `doctor="${doctorId}" && isAvailable=true`,
      sort: 'dayOfWeek,startTime'
    });
    
    return availability.items as unknown as any[];
  } catch (error) {
    console.error('Failed to fetch doctor availability:', error);
    throw new Error('Unable to load doctor availability. Please try again.');
  }
}