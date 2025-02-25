import { pb } from '$lib/pocketbase';
import type { Appointment } from '$lib/types';

/**
 * Get upcoming appointments for a patient
 */
export async function getPatientAppointments(
  patientId: string,
  options: { status?: string; limit?: number } = {}
): Promise<Appointment[]> {
  const { status = 'scheduled', limit = 50 } = options;
  
  try {
    const appointments = await pb.collection('Appointment').getList(1, limit, {
      filter: `patient_id="${patientId}" && status="${status}"`,
      sort: 'appointment_date',
      expand: 'doctor_id'
    });
    
    return appointments.items as unknown as Appointment[];
  } catch (error) {
    console.error('Failed to fetch patient appointments:', error);
    throw new Error('Unable to load appointments. Please try again.');
  }
}

/**
 * Book a new appointment
 */
export async function createAppointment(appointmentData: Partial<Appointment>): Promise<Appointment> {
  try {
    const appointment = await pb.collection('Appointment').create(appointmentData);
    return appointment as unknown as Appointment;
  } catch (error) {
    console.error('Failed to create appointment:', error);
    throw new Error('Unable to book appointment. Please try again.');
  }
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(appointmentId: string): Promise<Appointment> {
  try {
    const appointment = await pb.collection('Appointment').update(appointmentId, {
      status: 'cancelled'
    });
    
    return appointment as unknown as Appointment;
  } catch (error) {
    console.error('Failed to cancel appointment:', error);
    throw new Error('Unable to cancel appointment. Please try again.');
  }
}