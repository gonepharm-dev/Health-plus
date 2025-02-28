import { pb } from '$lib/pocketbase';
import type { Consultation } from '$lib/types';

/**
 * Get consultations for a patient
 */
export async function getPatientConsultations(patientId: string): Promise<Consultation[]> {
  try {
    // First get appointments for this patient
    const appointments = await pb.collection('Appointment').getList(1, 100, {
      filter: `patient_id="${patientId}"`,
    });
    
    // If no appointments, return empty array
    if (appointments.items.length === 0) {
      return [];
    }
    
    // Extract appointment IDs
    const appointmentIds = appointments.items.map(app => app.id);
    
    // Get consultations for these appointments
    const consultations = await pb.collection('Consultation').getList(1, 100, {
      filter: `appointment IN ("${appointmentIds.join('","')}")`,
      expand: 'appointment'
    });
    
    return consultations.items as unknown as Consultation[];
  } catch (error) {
    console.error('Failed to fetch patient consultations:', error);
    throw new Error('Unable to load consultations. Please try again.');
  }
}

/**
 * Get a single consultation by ID
 */
export async function getConsultation(consultationId: string): Promise<Consultation> {
  try {
    const consultation = await pb.collection('Consultation').getOne(consultationId, {
      expand: 'appointment,appointment.doctor_id,appointment.patient_id'
    });
    
    return consultation as unknown as Consultation;
  } catch (error) {
    console.error('Failed to fetch consultation:', error);
    throw new Error('Unable to load consultation. Please try again.');
  }
}

/**
 * Join a consultation meeting
 */
export async function joinConsultation(consultationId: string, isPatient: boolean): Promise<Consultation> {
  try {
    const updateData = isPatient ? { joinedByPatient: true } : { joinedByDoctor: true };
    
    const consultation = await pb.collection('Consultation').update(consultationId, updateData);
    
    return consultation as unknown as Consultation;
  } catch (error) {
    console.error('Failed to join consultation:', error);
    throw new Error('Unable to join consultation. Please try again.');
  }
}