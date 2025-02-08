<script lang="ts">
  import { fade, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { MessageSquare, Paperclip, Smile, Send, Search, MoreVertical, Phone, Video } from 'lucide-svelte';
  import type { Chat, Message } from './types';

  let selectedChat: number | null = 2;
  let searchQuery = '';
  let newMessage = '';
  let messageRef: HTMLDivElement;

  let chats: Chat[] = [
    {
      id: 1,
      name: 'Oleg Rhatrov',
      lastMessage: 'Is the plan of the general meeting already known?',
      time: 'Now',
      avatar: '/prof1.jpeg',
      online: true,
      unread: true,
      status: 'available'
    },
    {
      id: 2,
      name: 'Regina Polyakova',
      lastMessage: 'Oh, there is such a bunch of emails. I just...',
      time: '15m',
      avatar: '/prof2.jpeg',
      online: true,
      unread: false,
      status: 'busy'
    },
    {
      id: 3,
      name: 'Yakov Shaikin',
      lastMessage: 'I came up with this idea after visiting an exhibition...',
      time: '2h',
      avatar: '/prof3.jpeg',
      online: false,
      unread: true,
      status: 'away'
    }
  ];

  let messages: Message[] = [
    {
      id: 1,
      sender: 'Regina Polyakova',
      content: 'Hello! Have you already prepared financial statements for the first month? I need this in analytics. Tomorrow it will be really nice to discuss all the documents and hand them over to the customer at the meeting.',
      time: 'Today, 06:30 pm',
      isOwn: false
    },
    {
      id: 2,
      sender: 'You',
      content: "Hi, of course I've made it! I sent you all the documents two days ago by email. This is what happens when you do not read messages for several days. But it's ok, now you got them! Here:",
      time: 'Today, 10:11 pm',
      isOwn: true,
      attachment: {
        name: 'finalrep.doc',
        size: '2.3 MB',
        type: 'document'
      }
    }
  ];

  function handleSendMessage() {
    if (newMessage.trim()) {
      messages.push({
        id: messages.length + 1,
        sender: 'You',
        content: newMessage,
        time: 'Just now',
        isOwn: true
      });
      newMessage = '';
      setTimeout(() => {
        messageRef?.scrollTo({ top: messageRef.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  }

  function getStatusColor(status: Chat['status']) {
    switch (status) {
      case 'available':
        return 'bg-green-400';
      case 'busy':
        return 'bg-red-400';
      case 'away':
        return 'bg-yellow-400';
      default:
        return 'bg-gray-400';
    }
  }

  $: filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<div class="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
  <!-- Left Sidebar -->
  <div class="w-80 bg-white/80 backdrop-blur-lg border-r border-gray-200/50 flex flex-col shadow-lg rounded-r-xl overflow-hidden">
    <!-- Search Header -->
    <div class="p-6 border-b border-gray-200/50 bg-white/50">
      <div class="relative">
        <input
          type="text"
          placeholder="Search messages..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all placeholder-gray-400 text-gray-700"
          bind:value={searchQuery}
        />
        <div class="absolute left-3 top-3 text-gray-400">
          <Search size={18} />
        </div>
      </div>
    </div>

    <!-- Chat List -->
    <div class="flex-1 overflow-y-auto p-4">
      {#each filteredChats as chat (chat.id)}
        <div
          transition:slide
          class="flex items-center p-3 cursor-pointer hover:bg-gray-50/50 rounded-lg transition-colors duration-200
          {selectedChat === chat.id ? 'bg-blue-50/50 hover:bg-blue-50/50' : ''}"
          on:click={() => selectedChat = chat.id}
        >
          <div class="relative">
            <img
              src={chat.avatar}
              alt={chat.name}
              class="w-10 h-10 rounded-full object-cover shadow-sm"
            />
            <div class="absolute bottom-0 right-0 w-3 h-3 {getStatusColor(chat.status)} rounded-full border-2 border-white"/>
          </div>
          <div class="ml-3 flex-1">
            <div class="flex justify-between items-start">
              <span class="font-semibold text-gray-900">{chat.name}</span>
              <span class="text-xs text-gray-500">{chat.time}</span>
            </div>
            <p class="text-sm text-gray-500 truncate mt-0.5">{chat.lastMessage}</p>
          </div>
          {#if chat.unread}
            <div class="w-2 h-2 bg-blue-500 rounded-full ml-2"/>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <!-- Main Chat Area -->
  <div class="flex-1 flex flex-col bg-white/80 backdrop-blur-lg rounded-l-xl shadow-lg overflow-hidden">
    <!-- Chat Header -->
    <div class="flex items-center p-6 border-b border-gray-200/50 bg-white/50">
      <img
        src="/prof1.jpeg"
        alt="Current chat"
        class="w-10 h-10 rounded-full object-cover shadow-sm"
      />
      <div class="ml-3 flex-1">
        <h2 class="font-semibold text-gray-900">Regina Polyakova</h2>
        <p class="text-sm text-green-500">Online</p>
      </div>
      <div class="flex items-center gap-4">
        <button class="p-2 hover:bg-gray-100/50 rounded-full transition-colors">
          <Phone size={20} class="text-gray-600" />
        </button>
        <button class="p-2 hover:bg-gray-100/50 rounded-full transition-colors">
          <Video size={20} class="text-gray-600" />
        </button>
        <button class="p-2 hover:bg-gray-100/50 rounded-full transition-colors">
          <MoreVertical size={20} class="text-gray-600" />
        </button>
      </div>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50" bind:this={messageRef}>
      {#each messages as message (message.id)}
        <div
          class="flex {message.isOwn ? 'justify-end' : 'justify-start'}"
          transition:fade={{ duration: 200 }}
        >
          <div class="max-w-[70%] {message.isOwn ? 'bg-blue-500 text-white' : 'bg-white'} 
            rounded-2xl p-4 shadow-sm backdrop-blur-lg">
            <div class="flex items-center justify-between mb-1">
              <span class="text-sm font-medium {message.isOwn ? 'text-blue-100' : 'text-gray-600'}">
                {message.sender}
              </span>
              <span class="text-xs {message.isOwn ? 'text-blue-100' : 'text-gray-500'}">
                {message.time}
              </span>
            </div>
            <p class="text-sm leading-relaxed">{message.content}</p>
            {#if message.attachment}
              <div class="mt-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2 
                {message.isOwn ? 'text-white' : 'text-gray-700'}">
                <Paperclip size={16} />
                <div class="flex flex-col">
                  <span class="text-sm font-medium">{message.attachment.name}</span>
                  {#if message.attachment.size}
                    <span class="text-xs opacity-75">{message.attachment.size}</span>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>

    <!-- Message Input -->
    <div class="p-6 border-t border-gray-200/50 bg-white/50">
      <div class="flex items-center gap-3">
        <button class="p-2 hover:bg-gray-100/50 rounded-full transition-colors">
          <Paperclip size={20} class="text-gray-500" />
        </button>
        <input
          type="text"
          placeholder="Type your message..."
          class="flex-1 p-3 rounded-xl bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-blue-400 
            transition-all text-gray-700 placeholder-gray-500"
          bind:value={newMessage}
          on:keypress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button class="p-2 hover:bg-gray-100/50 rounded-full transition-colors">
          <Smile size={20} class="text-gray-500" />
        </button>
        <button 
          class="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
          on:click={handleSendMessage}
        >
          <Send size={20} class="text-white" />
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  /* Custom Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
</style>