<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	let isMenuOpen = false;
	let showBanner = true;
	let isDropdownOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
		if (!isMenuOpen) isDropdownOpen = false;
	}

	function closeBanner() {
		showBanner = false;
	}

	function toggleDropdown() {
		isDropdownOpen = !isDropdownOpen;
	}

	const navItems = [
		{ name: 'Clinic at Hand', href: '/clinic-at-hand' },
		{ name: 'Blog', href: '/blog' },
		{ name: 'About Us', href: '/about' },
	];

	

	let innerWidth: number;

	onMount(() => {
		const updateWidth = () => {
			innerWidth = window.innerWidth;
			if (innerWidth >= 1024) {
				isMenuOpen = false;
				isDropdownOpen = false;
			}
		};

		window.addEventListener('resize', updateWidth);
		updateWidth();

		return () => window.removeEventListener('resize', updateWidth);
	});
</script>

<nav class="fixed font-sans inset-x-0 top-0 z-30 w-full transition-all duration-300 text-gray-900 dark:text-white bg-gradient-to-br from-blue-100 to-blue-100 dark:from-gray-900 dark:to-gray-900 border-b border-gray-300 dark:border-gray-700">
	
	<div class="px-4 lg:px-8 mx-auto py-4">
		<div class="flex items-center justify-between w-full">
			<div class="flex items-center space-x-4 lg:space-x-6">
				<a aria-current="page" class="flex items-center lg:px-0 px-1" href="/">
					<Logo animated={true} size="w-32 h-10" />
				</a>
				
				<div class="hidden lg:flex lg:items-center lg:space-x-6 lg:pl-4">
					{#each navItems as item}
						<div class="relative group">
							<a
								class="inline-block text-base font-medium text-gray-900 dark:text-gray-100 hover:text-[#007EFF] dark:hover:text-[#007EFF]"
								href={item.href}
							>
								{item.name}
							</a>
							<div class="bg-[#007EFF] h-[2px] w-0 group-hover:w-full transition-all duration-500"></div>
						</div>
					{/each}
					
				</div>
			</div>

			<div class="hidden lg:flex items-center justify-end space-x-4">
				<div class="relative group border-r border-gray-400 dark:border-gray-500 pr-4">
					<a
						class="inline-block text-base font-thin text-gray-900 dark:text-gray-100 hover:text-[#007EFF] dark:hover:text-[#007EFF] transition-colors duration-300 underline underline-offset-2"
						href='/results/nearest-facility'
					>
						Find Nearest Facility
					</a>
				</div>
				<a
					class="inline-flex items-center justify-center rounded-full bg-[#007EFF] px-6 py-2 text-sm font-thin text-white shadow-sm transition-all duration-150 hover:bg-blue-500 dark:hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
					href="/about/joinUs">Join Us</a
				>
				<ThemeToggle />
			</div>

			<div class="flex items-center lg:hidden">
				
			</div>
		</div>
	</div>
	
	{#if isMenuOpen && innerWidth < 1024}
		<div 
			transition:fly={{ x: 300, duration: 300 }}
			class="fixed top-0 right-0 bottom-0 w-64 sm:w-80 bg-gradient-to-br from-blue-100 to-blue-100 dark:from-gray-900 dark:to-gray-900 shadow-lg z-50 overflow-y-auto"
		>
			<div class="flex flex-col h-full">
				<div class="p-5">
					<!-- <button
						on:click={toggleMenu}
						class="absolute top-4 right-4 text-[#007EFF] hover:text-blue-700"
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</button> -->
					<div class="mt-8 space-y-4">
						{#each navItems as item}
							<div>
								<a 
									class="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-[#007EFF] dark:hover:text-[#007EFF] transition-colors duration-200" 
									href={item.href} 
									on:click={toggleMenu}
								>
									{item.name}
								</a>
							</div>
						{/each}
						
						<a
							class="block rounded-lg px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-[#007EFF] dark:hover:text-[#007EFF] transition-colors duration-200"
							href='/results/nearest-facility' on:click={toggleMenu}>Find Nearest Facility</a
						>
						<a
							class="block rounded-full px-3 py-2 text-base font-medium text-white bg-[#007EFF] hover:bg-blue-600 transition-colors duration-200 text-center"
							href="/about/joinUs" on:click={toggleMenu}>Join Us</a
						>
					</div>
				</div>
				<div class="mt-auto p-5 border-t border-gray-200 dark:border-gray-700">
					<ThemeToggle />
				</div>
			</div>
		</div>
	{/if}
</nav>

<style>
	@supports (-webkit-touch-callout: none) {
		/* iOS-specific styles */
		nav {
			padding-top: env(safe-area-inset-top);
		}
	}
</style>