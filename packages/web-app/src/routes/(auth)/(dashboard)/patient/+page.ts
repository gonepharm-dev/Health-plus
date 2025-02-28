// (auth)/(dashboard)/patient/+page.ts
import type { PageLoad } from './$types';
import { getPatientAppointments } from '$lib/services/appointmentService';
import { getPatientProfile } from '$lib/services/patientService';
import { getUserNotifications } from '$lib/services/notificationService';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ parent }) => {
  const { user } = await parent();
  
  // User is guaranteed to exist because of +layout.server.ts
  
  try {
    // Load data in parallel
    const [appointments, profile, notifications] = await Promise.all([
      getPatientAppointments(user.id, { limit: 5 }).catch(() => []),
      getPatientProfile(user.id).catch(() => null),
      getUserNotifications(user.id, true).catch(() => [])
    ]);
    
    return {
      upcomingAppointments: appointments,
      profile,
      notifications,
      error: null
    };
  } catch (err) {
    console.error('Error loading dashboard data:', err);
    return {
      upcomingAppointments: [],
      profile: null,
      notifications: [],
      error: 'Failed to load dashboard data'
    };
  }
};