import type { PageLoad } from './$types';
import { getUserNotifications } from '$lib/services/notificationService';

export const load: PageLoad = async ({ parent }) => {
  const { user } = await parent();
  
  try {
    const notifications = await getUserNotifications(user.id);
    
    return {
      notifications
    };
  } catch (error) {
    console.error('Error loading notifications:', error);
    return {
      notifications: [],
      error: 'Failed to load notifications'
    };
  }
};