<!-- Sidebar.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { 
    BarChart2,
    Users,
    ShoppingBag,
    MessageSquare,
    CreditCard,
    Settings,
    Shield,
  } from 'lucide-svelte';

  const navigationItems = [
    { label: 'Overview', icon: BarChart2, href: '/overview', section: 'MENU' },
    { label: 'Statistics', icon: BarChart2, href: '/statistics', section: 'MENU' },
    { label: 'Customers', icon: Users, href: '/customers', section: 'MENU' },
    { label: 'Product', icon: ShoppingBag, href: '/product', section: 'MENU' },
    { label: 'Messages', icon: MessageSquare, href: '/messages', badge: 13, section: 'MENU' },
    { label: 'Transactions', icon: CreditCard, href: '/transactions', section: 'MENU' },
    { label: 'Settings', icon: Settings, href: '/settings', section: 'GENERAL' },
    { label: 'Security', icon: Shield, href: '/security', section: 'GENERAL' },
  ];

  export let userPhotoUrl = '/path/to/default/photo.jpg';
  export let userName = 'Fandaww Punx';
  export let userEmail = 'fandaww6@gmail.com';
</script>

<aside class="fixed left-0 top-0 z-40 h-screen w-64 bg-[#0F1F17] text-white">
  <!-- Logo -->
  <div class="px-6 py-4">
    <img src="/path/to/logo.svg" alt="Siohioma" class="h-8" />
  </div>

  <!-- Navigation Sections -->
  <nav class="mt-6 px-4">
    <!-- MENU Section -->
    <div class="mb-8">
      <h2 class="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        MENU
      </h2>
      <div class="space-y-1">
        {#each navigationItems.filter(item => item.section === 'MENU') as item}
          <a
            href={item.href}
            class="flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors
              {$page.url.pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'}"
          >
            <svelte:component
              this={item.icon}
              class="mr-3 h-5 w-5 flex-shrink-0"
            />
            <span>{item.label}</span>
            {#if item.badge}
              <span class="ml-auto inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-medium">
                {item.badge}
              </span>
            {/if}
          </a>
        {/each}
      </div>
    </div>

    <!-- GENERAL Section -->
    <div class="mb-8">
      <h2 class="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        GENERAL
      </h2>
      <div class="space-y-1">
        {#each navigationItems.filter(item => item.section === 'GENERAL') as item}
          <a
            href={item.href}
            class="flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-colors
              {$page.url.pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'}"
          >
            <svelte:component
              this={item.icon}
              class="mr-3 h-5 w-5 flex-shrink-0"
            />
            <span>{item.label}</span>
          </a>
        {/each}
      </div>
    </div>

    <!-- User Profile -->
    <div class="absolute bottom-8 left-0 right-0 px-4">
      <div class="flex items-center space-x-3 rounded-lg bg-gray-800 p-3">
        <img
          src={userPhotoUrl}
          alt={userName}
          class="h-10 w-10 rounded-full object-cover"
        />
        <div class="flex-1 truncate">
          <h3 class="truncate text-sm font-medium text-white">{userName}</h3>
          <p class="truncate text-xs text-gray-400">{userEmail}</p>
        </div>
      </div>
    </div>
  </nav>
</aside>

<style>
  /* Add any additional custom styles here */
</style>