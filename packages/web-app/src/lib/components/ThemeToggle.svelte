<script lang="ts">
    import { Sun, Moon } from 'lucide-svelte';
    import { theme } from '$lib/stores/theme';
    import { fade, fly } from 'svelte/transition';
  
    function toggleTheme() {
      theme.update(t => t === 'light' ? 'dark' : 'light');
    }
  </script>
  
  <button
  on:click={toggleTheme}
  class="relative p-2 rounded-2xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 
         dark:hover:bg-gray-700 transition-all duration-200 ease-in-out"
  aria-label="Toggle theme"
>

    {#if $theme === 'light'}
      <div in:fly={{ y: 20, duration: 400 }} >
        <Moon class="w-8 h-8 text-blue-400 dark:text-[#72fa93]" />
      </div>
    {:else}
      <div in:fly={{ y: -20, duration: 400 }} >
        <Sun class="w-8 h-8 text-[#f6c445]" />
      </div>
    {/if}
  </button>