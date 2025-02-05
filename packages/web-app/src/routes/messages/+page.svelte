<script lang="ts">
  import { MessageSquare } from 'lucide-svelte';

  // Sample message history data
  interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
  }

  interface User {
    id: string;
    name: string;
    avatar: string;
    role: string;
  }

  const currentUser = {
    id: 'patient-1',
    name: 'Jane Doe',
    avatar: '/avatar-placeholder.png',
    role: 'Patient'
  };

  const users: User[] = [
    {
      id: 'doc-1',
      name: 'Dr Rose Jane',
      avatar: '/doctor-avatar.png', 
      role: 'Doctor'
    }
  ];

  const messages: Message[] = [
    {
      id: '1',
      senderId: 'doc-1',
      receiverId: 'patient-1',
      content: 'Hello, how are you feeling today?',
      timestamp: '10:00am'
    },
    {
      id: '2',
      senderId: 'patient-1',
      receiverId: 'doc-1',
      content: 'Much better, thank you for asking!',
      timestamp: '10:00am'
    },
    {
      id: '3',
      senderId: 'doc-1',
      receiverId: 'patient-1',
      content: 'That's great to hear. Remember to take your medications.',
      timestamp: '10:00am'
    },
    {
      id: '4',
      senderId: 'patient-1',
      receiverId: 'doc-1',
      content: 'Yes, I will. Thanks doctor!',
      timestamp: '10:00am'
    }
  ];

  let selectedUserId: string | null = null;
  let newMessage: string = '';

  function selectUser(userId: string) {
    selectedUserId = userId;
  }

  function getMessagesByUser(userId: string) {
    return messages.filter(
      msg => (msg.senderId === userId && msg.receiverId === currentUser.id) ||
             (msg.senderId === currentUser.id && msg.receiverId === userId)
    );
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
  <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="grid grid-cols-[300px,1fr] h-[600px]">
      <!-- Users List -->
      <div class="border-r border-gray-200 overflow-y-auto">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">Messages</h2>
        </div>
        <div class="divide-y divide-gray-200">
          {#each users as user}
            <button
              class="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
              class:bg-blue-50={selectedUserId === user.id}
              on:click={() => selectUser(user.id)}
            >
              <div class="relative w-12 h-12">
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  class="w-full h-full rounded-full object-cover border-2 border-gray-200"
                />
                <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p class="font-medium text-gray-900">{user.name}</p>
                <p class="text-sm text-gray-500">{user.role}</p>
              </div>
