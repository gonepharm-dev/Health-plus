<script lang="ts">
    import { format } from 'date-fns';
    import { Bell, Check, AlertCircle, Calendar, CreditCard, MessageSquare } from 'lucide-svelte';
    import { markNotificationAsRead, markAllNotificationsAsRead } from '$lib/services/notificationService';
    
    export let data;
    
    let loading = false;
    let error = '';
    
    async function handleMarkAllAsRead() {
      try {
        loading = true;
        error = '';
        await markAllNotificationsAsRead(data.user.id);
      } catch (err) {
        console.error('Error marking notifications as read:', err);
        error = 'Failed to update notifications';
      } finally {
        loading = false;
      }
    }
    
    async function handleMarkAsRead(notificationId: string) {
      try {
        await markNotificationAsRead(notificationId);
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    }
    
    // Group notifications by date
    $: groupedNotifications = data.notifications.reduce((groups, notification) => {
      const date = format(new Date(notification.created), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    }, {});
    
    function getNotificationIcon(type: string) {
      switch (type) {
        case 'appointment':
          return Calendar;
        case 'payment':
          return CreditCard;
        case 'message':
          return MessageSquare;
        default:
          return Bell;
      }
    }
  </script>
  
  <div class="space-y-8 animate-fade-in-up">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Notifications</h1>
      
      {#if data.notifications.some(n => !n.read)}
        <button 
          on:click={handleMarkAllAsRead}
          class="inline-flex items-center text-blue-600 hover:text-blue-800"
          disabled={loading}
        >
          <Check class="h-4 w-4 mr-1" />
          {loading ? 'Updating...' : 'Mark all as read'}
        </button>
      {/if}
    </div>
    
    {#if error}
      <div class="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    {/if}
    
    <!-- Notification List -->
    {#if data.notifications.length === 0}
      <div class="bg-gray-50 p-6 rounded-lg text-center">
        <p class="text-gray-600">No notifications</p>
      </div>
    {:else}
      <div class="space-y-8">
        {#each Object.entries(groupedNotifications) as [date, notifications]}
          <div>
            <h2 class="text-lg font-medium text-gray-700 mb-3">
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </h2>
            
            <div class="space-y-2">
              {#each notifications as notification}
                {@const NotificationIcon = getNotificationIcon(notification.type)}
                
                <div 
                  class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all
                    {notification.read ? 'opacity-70' : 'hover:shadow-md'}"
                >
                  <div class="flex items-start">
                    <div 
                      class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-4
                        {notification.read ? 'bg-gray-100' : 
                          notification.type === 'appointment' ? 'bg-blue-100' :
                          notification.type === 'payment' ? 'bg-green-100' :
                          'bg-purple-100'}"
                    >
                      <NotificationIcon 
                        class="h-5 w-5 
                          {notification.read ? 'text-gray-400' : 
                            notification.type === 'appointment' ? 'text-blue-500' :
                            notification.type === 'payment' ? 'text-green-500' :
                            'text-purple-500'}"
                      />
                    </div>
                    
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <h3 class="font-medium text-gray-900">{notification.title}</h3>
                        <span class="text-xs text-gray-500">
                          {format(new Date(notification.created), 'h:mm a')}
                        </span>
                      </div>
                      
                      <p class="text-gray-600 mt-1">{notification.message}</p>
                      
                      {#if !notification.read}
                        <div class="mt-2 flex justify-between items-center">
                          {#if notification.relatedRecord}
                            <a 
                              href={getRelatedUrl(notification)}
                              class="text-sm text-blue-600 hover:text-blue-800"
                            >
                              View details
                            </a>
                          {/if}
                          
                          <button 
                            on:click={() => handleMarkAsRead(notification.id)}
                            class="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Mark as read
                          </button>
                        </div>
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  
  <script context="module">
    function getRelatedUrl(notification) {
      if (!notification.relatedRecord) return '';
      
      switch (notification.type) {
        case 'appointment':
          return `/patient/appointments/${notification.relatedRecord}`;
        case 'payment':
          return `/patient/payments/${notification.relatedRecord}`;
        case 'message':
          return `/patient/messages/${notification.relatedRecord}`;
        default:
          return '';
      }
    }
  </script>