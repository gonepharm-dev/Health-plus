// src/lib/stores/notification.ts
import { writable } from 'svelte/store';
import type { Notification } from '$lib/types/';

export const notifications = writable<Notification[]>([]);
export const unreadCount = writable<number>(0);