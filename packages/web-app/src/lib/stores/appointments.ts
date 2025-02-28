import { writable } from 'svelte/store';
import type { Appointment } from '$lib/types';

export const upcomingAppointments = writable<Appointment[]>([]);
export const pastAppointments = writable<Appointment[]>([]);
export const activeAppointment = writable<Appointment | null>(null);