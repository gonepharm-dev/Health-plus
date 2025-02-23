<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { auth } from '$lib/stores/auth';
	import { browser } from '$app/environment';
	import pb from '$lib/pocketbase';
	
	
	export let data;
	$: if (data.user && browser) {
	  auth.authenticate(data.user, pb.authStore.token);
	}
	
	onMount(() => {
	  if (browser) {	
		auth.initialize();

		const refreshInterval = setInterval(async () => {
		  if (pb.authStore.isValid) {
			try {
			  await pb.collection('users').authRefresh();
			  auth.initialize(); 
			} catch (error) {
			  console.error('Auth refresh failed:', error);
			
			}
		  }
		}, 20 * 60 * 1000);
		
		pb.authStore.onChange(() => {
		  auth.initialize();
		});
		
	
		return () => {
		  clearInterval(refreshInterval);
		};
	  }
	});
  </script>
  
  <div class="flex min-h-screen flex-col bg-gradient-to-br from-blue-100 to-blue-100 text-gray-800 dark:from-gray-900 dark:to-gray-900 dark:text-white">
	<main class="flex-grow">
	  <slot />
	</main>
  </div>