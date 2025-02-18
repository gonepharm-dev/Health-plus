<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/stores';

	// Set up theme subscription on component mount
	onMount(() => {
		return theme.subscribe((value) => {
			document.documentElement.classList.toggle('dark', value === 'dark');
		});
	});
</script>

<!-- Main layout structure -->
<div
	class="flex min-h-screen flex-col bg-gradient-to-br from-blue-100 to-blue-100 text-gray-800 dark:from-gray-900 dark:to-gray-900 dark:text-white"
>

	<main class="flex-grow">
		<slot />
	</main>
	<!-- <Footer/> -->
</div>
