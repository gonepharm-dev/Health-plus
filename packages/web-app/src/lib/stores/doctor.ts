import { writable } from 'svelte/store';
import type { User } from '$lib/types/';

export const availableDoctors = writable<User[]>([]);
export const selectedDoctor = writable<User | null>(null);