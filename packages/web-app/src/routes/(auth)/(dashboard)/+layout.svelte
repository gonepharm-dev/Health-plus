<script lang="ts">
	import { PieChart, Users, Box, MessageCircle, CreditCard, Settings, Shield } from 'lucide-svelte';
	import type { SvelteComponent } from 'svelte';
	import { currentUser } from '$lib/stores/auth';
	import { derived } from 'svelte/store';
	import { auth } from '$lib/stores/auth'; // Import the auth store
	import { goto } from '$app/navigation'; // Import the goto function
  
	export let onLogout: () => void = () => {
		auth.logout(); // Call the logout method from the auth store
		goto('/sign-in'); // Redirect to the sign-in page
	};
  
	const menuItems = [
	  {
		section: 'Overview',
		items: [
		  { href: '/doctor', label: 'Dashboard', icon: Box },
		  { href: '/appointment', label: 'Appointments', icon: MessageCircle },
		  { href: '/statistics', label: 'Doctors', icon: Users },
		  { href: '/customers', label: 'Records', icon: MessageCircle },
		  { href: '/product', label: 'Consultations', icon: CreditCard },
		  { href: '/messages', label: 'Messages', icon: MessageCircle, unreadCount: 5 }
		]
	  },
	  {
		section: 'GENERAL',
		items: [
		  { href: '/settings', label: 'Settings', icon: Settings },
		  { href: '/security', label: 'Security', icon: Shield }
		]
	  }
	];

	// Derived store to get the username in uppercase
	const username = derived(currentUser, $currentUser => $currentUser ? $currentUser.username.toUpperCase() : 'GUEST');
</script>
  
  <div class="flex min-h-screen bg-gray-100">
	<!-- Sidebar -->
	<aside class="w-64 bg-white shadow-lg">
	  <div class="p-6">
		<!-- Logo or Brand Name -->
		<h1 class="text-xl font-bold text-gray-800 flex items-center">
			<img src="/logo.png" alt="HealthPlus Logo" class="h-8 w-auto mr-2" />
			HealthPlus
		</h1>
  
		<!-- Menu Sections -->
		<div class="mt-8">
		  {#each menuItems as section}
			<div class="mb-6">
			  <!-- Section Title -->
			  <h3 class="text-xs font-semibold uppercase text-gray-500 mb-2">{section.section}</h3>
  
			  <!-- Menu Items -->
			  <div class="space-y-1">
				{#each section.items as item}
				  <a
					href={item.href}
					class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200"
				  >
					<svelte:component this={item.icon} class="mr-3 h-5 w-5 text-gray-500" />
					<span>{item.label}</span>
					{#if item.unreadCount > 0}
					  <span class="ml-2 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
						{item.unreadCount}
					  </span>
					{/if}
				  </a>
				{/each}
			  </div>
			</div>
		  {/each}
		</div>
		<hr class="my-4 border-t border-gray-600 w-full" />
		<!-- Employee/Name Link -->
		<div class="mt-6">
		  <a
			href="https://employee/client"
			target="_blank"
			class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200"
		  >
			<strong>{$username}</strong>
		  </a>
		</div>
  
		<!-- Logout Button -->
		<button
		  on:click={onLogout}
		  class="mt-6 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-[5px] hover:bg-blue-700 transition-all duration-200 w-full"
		>
		  <span>Logout</span>
		</button>
	  </div>
	</aside>
  
	<!-- Main Content -->
	<main class="flex-1 p-6">
	  <slot />
	</main>
  </div>