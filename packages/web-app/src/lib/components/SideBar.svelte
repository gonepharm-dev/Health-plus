<script lang="ts">
    import { page } from '$app/stores';
    import { HomeIcon, InfoIcon as AboutIcon } from 'lucide-svelte';
  
    const menuItems = [
      { href: '/home', label: 'Home', icon: HomeIcon },
      { href: '/about', label: 'About', icon: AboutIcon },
      // Add more menu items as needed
    ];
  </script>
  
  <nav class="w-64 bg-gray-50 dark:bg-gray-800 p-4 space-y-2 min-h-screen">
    {#each menuItems as item}
      <a
        href={item.href}
        class={`block px-4 py-2 rounded-lg transition-colors flex items-center gap-2
          hover:bg-gray-100 dark:hover:bg-gray-700
          ${$page.url.pathname === item.href ? 'bg-primary-500 text-white dark:bg-primary-700' : 'text-gray-900 dark:text-gray-300'}
        `}
        aria-current={$page.url.pathname === item.href ? 'page' : undefined}
      >
        <svelte:component this={item.icon} class="w-5 h-5" />
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>
  

  
