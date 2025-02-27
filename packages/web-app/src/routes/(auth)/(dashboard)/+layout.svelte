<script lang="ts">
	import { page } from '$app/stores';
	import type { SvelteComponent } from 'svelte';
	import { Activity, Users, Calendar, Settings, MessageSquare, LogOut, Home, Stethoscope, HeartPulse } from 'lucide-svelte';
	import type { NavigationItem } from '$lib/types/navigation';
	import { auth, currentUser } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	// Define navigation items for doctors and patients
	const doctorNavigation: NavigationItem[] = [
		{
			href: '/doctor/patients',
			label: 'Dashboard',
			icon: Home,
			roles: ['doctor']
		},
		{
			href: '/doctor/appointments',
			label: 'Appointments',
			icon: Calendar,
			roles: ['doctor']
		},
		{
			href: '/doctor/patients',
			label: 'Patients',
			icon: Users,
			roles: ['doctor']
		},
		{
			href: '/doctor/consultations',
			label: 'Consultations',
			icon: MessageSquare,
			roles: ['doctor']
		},
		{
			href: '/doctor/settings',
			label: 'Settings',
			icon: Settings,
			roles: ['doctor']
		}
	];

	const patientNavigation: NavigationItem[] = [
		{
			href: '/patient/appointments',
			label: 'Dashboard',
			icon: Home,
			roles: ['patient']
		},
		{
			href: '/patient/appointments',
			label: 'My Appointments',
			icon: Calendar,
			roles: ['patient']
		},
		{
			href: '/patient/doctors',
			label: 'Find Doctors',
			icon: Stethoscope,
			roles: ['patient']
		},
		{
			href: '/patient/consultations',
			label: 'My Consultations',
			icon: MessageSquare,
			roles: ['patient']
		},
		{
			href: '/patient/health',
			label: 'Health Records',
			icon: HeartPulse,
			roles: ['patient']
		},
		{
			href: '/patient/settings',
			label: 'Settings',
			icon: Settings,
			roles: ['patient']
		}
	];

	// Determine user role based on URL
	$: isDoctor = $page.url.pathname.startsWith('/doctor');
	$: navigation = isDoctor ? doctorNavigation : patientNavigation;
	$: userRole = isDoctor ? 'doctor' : 'patient';

	// Filter navigation items based on role
	$: filteredNavigation = navigation.filter(item => 
		!item.roles || item.roles.includes(userRole)
	);

	// Update logout handler
	async function handleLogout() {
		auth.logout();
		await goto('/login');
	}

	// Add state for mobile sidebar
	let isSidebarOpen = false;

	// Toggle sidebar function
	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}
</script>

<!-- Mobile Header (Only visible on mobile) -->
<div class="md:hidden flex items-center justify-between p-4 bg-background border-b-2 border-[#1D5DEC] border-opacity-30">
	<button on:click={toggleSidebar} class="text-text p-2">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
		</svg>
	</button>
	<div class="flex items-center">
		<img src="/logo.png" alt="HealthPlus Logo" class="h-8 w-auto mr-2" />
		<span class="text-xl font-bold">HealthPlus</span>
	</div>
	<div class="w-6"></div> <!-- Spacer for alignment -->
</div>

<!-- Main container with background color -->
<div class="flex h-[100dvh] bg-background">
	<!-- Sidebar -->
	<aside class="{isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static top-0 left-0 z-40 w-64 h-full transition-transform duration-300 flex flex-col justify-between bg-background text-text border-r-2 border-[#1D5DEC] border-opacity-30">
		<!-- Close button for mobile -->
		<button on:click={toggleSidebar} class="md:hidden absolute right-4 top-4 text-text p-2">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
		<div class="p-6">
			<!-- Logo or Brand Name -->
			<h1 class="text-xl font-bold flex items-center">
				<img src="/logo.png" alt="HealthPlus Logo" class="h-8 w-auto mr-2" />
				HealthPlus
			</h1>

			<!-- Menu Sections -->
			<div class="mt-12">
				<div class="mb-6">
					<!-- Section Title -->
					<h3 class="text-xs font-semibold uppercase mb-2 text-text">
						Overview
					</h3>

					<!-- Menu Items -->
					<div class="space-y-1">
						{#each filteredNavigation as item}
							<a
								href={item.href}
								class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-blue-700 hover:text-white relative {($page.url.pathname === item.href) ? 'bg-blue-700 text-text' : 'text-text'}"
							>
								<svelte:component this={item.icon} class="mr-3 h-5 w-5" />
								<span>{item.label}</span>
								{#if $page.url.pathname === item.href}
									<div class="absolute left-0 top-0 bottom-0 w-1 bg-blue-300 rounded-l-lg"></div>
								{/if}
							</a>
						{/each}
					</div>
				</div>
			</div>
		</div>
		<!-- Horizontal Divider -->
		<div class="border-b-2 border-text mx-6 mt-auto opacity-20"></div>

		<!-- User Info and Logout Button -->
		<div class="p-6">
			<!-- User Info -->
			<div class="flex items-center space-x-3 mb-6">
				<img
					src={$currentUser?.avatar || "https://via.placeholder.com/150"}
					alt="User Avatar"
					class="h-10 w-10 rounded-full object-cover"
				/>
				<div>
					<div class="text-sm font-medium text-text">{$currentUser?.username || 'Unknown User'}</div>
					<div class="text-xs text-text">{$currentUser?.email || 'No email'}</div>
				</div>
			</div>

			<!-- Logout Button -->
			<button
				on:click={handleLogout}
				class="flex items-center justify-center px-3 py-2 text-sm font-bold rounded-lg transition-all duration-200 w-full bg-secondary text-white hover:bg-blue-800"
			>
				<LogOut class="mr-2 h-4 w-4" />
				<span>Logout</span>
			</button>
		</div>
	</aside>

	<!-- Overlay for mobile sidebar -->
	{#if isSidebarOpen}
		<div 
			class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
			on:click={toggleSidebar}
		></div>
	{/if}

	<!-- Main Content -->
	<main class="flex-1 md:ml-0 p-6 bg-background pt-[80px] md:pt-6">
		<slot />
	</main>
</div>

<!-- Update responsive styles -->
<style lang="postcss">
	@media (max-width: 768px) {
		aside {
			height: 100vh;
		}
	}
</style>
