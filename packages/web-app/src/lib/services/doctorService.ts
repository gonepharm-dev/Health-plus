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

/**
 * Helper function to filter allowed fields in an object
 */
const filteredObj = (obj: { [key: string]: any }, ...allowedFields: string[]) => {
  let newObj: { [key: string]: any } = {};
  Object.keys(obj).forEach((key) => {
      if (allowedFields.includes(key)) {
          newObj[key] = obj[key];
      }
  });
  return newObj;
};

/**
* Update doctor profile by ID with proper handling for JSON fields
*/
export async function updateDoctorProfile(doctorId: string, updatedData: Partial<DoctorProfile>): Promise<DoctorProfile> {
  try {
    // Fetch the existing doctor profile
    const profiles = await pb.collection('DoctorProfile').getList(1, 1, {
      filter: `user="${doctorId}"`,
    });

    if (profiles.items.length === 0) {
      throw new Error('Doctor profile not found');
    }

    const profileId = profiles.items[0].id;

    // Filter the allowed fields before updating
    const filteredData = filteredObj(
      updatedData, 
      "specialization", 
      "bio", 
      "professionalStatement", 
      "yearsOfExperience", 
      "education", 
      "languages", 
      "ratingCount", 
      "ratingAverage", 
      "consultationFee", 
      "onboardingCompleted"
    );

    if (Object.keys(filteredData).length === 0) {
      throw new Error("No valid fields provided for update");
    }

    // Ensure `education` and `languages` are stored as JSON
    if (filteredData.education && typeof filteredData.education !== "object") {
      try {
        filteredData.education = JSON.parse(filteredData.education);
      } catch {
        throw new Error("Invalid JSON format for education");
      }
    }

    if (filteredData.languages && typeof filteredData.languages !== "object") {
      try {
        filteredData.languages = JSON.parse(filteredData.languages);
      } catch {
        throw new Error("Invalid JSON format for languages");
      }
    }

    // Update the doctor profile with filtered data
    const updatedProfile = await pb.collection('DoctorProfile').update(profileId, filteredData);

    return updatedProfile as unknown as DoctorProfile;
  } catch (error) {
    throw new Error('Unable to update doctor profile. Please try again.');
  }
}

/**
 * Delete doctor profile by user ID(make sure only the admin can delete user)
 */
export async function deleteDoctorProfile(doctorId: string): Promise<void> {
  try {
    const profiles = await pb.collection('DoctorProfile').getList(1, 1, {
      filter: `user="${doctorId}"`,
    });

    if (profiles.items.length === 0) {
      throw new Error("Doctor profile not found");
    }

    const profileId = profiles.items[0].id;

    await pb.collection('DoctorProfile').delete(profileId);

  } catch (error) {
    throw new Error("Unable to delete doctor profile. Please try again.");
  }
}