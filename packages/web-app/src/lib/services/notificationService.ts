import { pb } from '$lib/pocketbase';
import type { Notification } from '$lib/types/';
import { notifications, unreadCount } from '$lib/stores/notification';
import { browser } from '$app/environment';

// Store for unsubscribe functions
let notificationSubscriptions: (() => void)[] = [];

/**
 * Get notifications for a user
 */
export async function getUserNotifications(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
  try {
    const filter = unreadOnly 
      ? `user="${userId}" && read=false`
      : `user="${userId}"`;
      
    const notificationsResult = await pb.collection('Notification').getList(1, 50, {
      filter,
      sort: '-created'
    });
    
    const notificationItems = notificationsResult.items as unknown as Notification[];
    
    // Update the notifications store
    notifications.set(notificationItems);
    
    // Update unread count
    updateUnreadCount(notificationItems);
    
    return notificationItems;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw new Error('Unable to load notifications. Please try again.');
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    await pb.collection('Notification').update(notificationId, {
      read: true
    });
    
    // Update the notifications store
    notifications.update(current => {
      const updated = current.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      });
      
      // Update unread count
      updateUnreadCount(updated);
      
      return updated;
    });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw new Error('Unable to update notification. Please try again.');
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  try {
   
    const unreadNotifications = await pb.collection('Notification').getList(1, 100, {
      filter: `user="${userId}" && read=false`
    });
    
    const updatePromises = unreadNotifications.items.map(notification => 
      pb.collection('Notification').update(notification.id, { read: true })
    );
    
    await Promise.all(updatePromises);
    
    // Update the notifications store
    notifications.update(current => {
      const updated = current.map(notification => ({ ...notification, read: true }));
      
   
      unreadCount.set(0);
      
      return updated;
    });
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
    throw new Error('Unable to update notifications. Please try again.');
  }
}

/**
 * Helper function to update the unread count store
 */
function updateUnreadCount(notificationItems: Notification[]): void {
  const count = notificationItems.filter(item => !item.read).length;
  unreadCount.set(count);
}

/**
 * Subscribe to notifications for a specific user
 */
export async function subscribeToUserNotifications(userId: string): Promise<void> {
  if (!browser || !userId) return;
  
  // Clear any existing subscriptions first
  unsubscribeFromNotifications();
  
  try {
    // Subscribe to all notifications for this user
    const unsubscribe = pb.collection('Notification').subscribe(`user="${userId}"`, async (data) => {
      const action = data.action;
      const record = data.record as unknown as Notification;
      
      console.log(`Notification ${action}:`, record);
      
      // Handle the event based on the action
      if (action === 'create') {
        notifications.update(current => {
          const updated = [record, ...current];
          updateUnreadCount(updated);
          return updated;
        });
        
        if (browser) {
          
        }
      } else if (action === 'update') {
        // Update the existing notification in the store
        notifications.update(current => {
          const updated = current.map(item => 
            item.id === record.id ? record : item
          );
          updateUnreadCount(updated);
          return updated;
        });
      } else if (action === 'delete') {
        // Remove the notification from the store
        notifications.update(current => {
          const updated = current.filter(item => item.id !== record.id);
          updateUnreadCount(updated);
          return updated;
        });
      }
    });
    
    // Store the unsubscribe function
    notificationSubscriptions.push(await unsubscribe);
    
    console.log('Subscribed to notifications for user:', userId);
  } catch (error) {
    console.error('Failed to subscribe to notifications:', error);
  }
}

/**
 * Unsubscribe from all notification subscriptions
 */
export function unsubscribeFromNotifications(): void {
  if (!browser) return;
  
  // Call all unsubscribe functions
  notificationSubscriptions.forEach(unsubscribe => {
    try {
      unsubscribe();
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
    }
  });
  
  // Clear the subscriptions array
  notificationSubscriptions = [];
  
  console.log('Unsubscribed from all notifications');
}

/**
 * Initialize notification system for a user
 * Call this when the app starts or when user logs in
 */
export async function initNotifications(userId: string): Promise<void> {
  if (!browser || !userId) return;
  
  try {
    // Fetch initial notifications
    await getUserNotifications(userId);
    
    // Set up realtime subscriptions
    subscribeToUserNotifications(userId);
  } catch (error) {
    console.error('Failed to initialize notifications:', error);
  }
}