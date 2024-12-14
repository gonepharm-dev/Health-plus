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

	const toolsItem = {
		name: 'Health Tools',
		subItems: [
			{ name: 'BMI Calculator', href: '/bmi' },
			{ name: 'Diet Recommendation', href: '/meals' }
		]
	};

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
	{#if showBanner}
		<div class="bg-blue-200 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 lg:px-4">
			<div class="px-4 mx-auto flex items-center justify-between">
				<div class="flex-grow text-center py-2">
					<span class="text-sm mr-1 text-red-500">Disclaimer:</span>
					<span class="text-sm">Clinic at hand device is at final stage of development</span>
					<a href="/clinic-at-hand" class="ml-1 text-sm underline hover:text-blue-800 dark:hover:text-blue-300">Learn More</a>
				</div>
				<button on:click={closeBanner} class="text-blue-700 dark:text-blue-200 hover:text-blue-800 dark:hover:text-blue-300 flex-shrink-0">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
					</svg>
				</button>
			</div>
		</div>
	{/if}
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
					<div class="relative group">
						<button
							class="inline-block text-base font-medium text-gray-900 dark:text-gray-100 hover:text-[#007EFF] dark:hover:text-[#007EFF] transition-colors duration-300 border-l border-gray-400 dark:border-gray-500 px-4"
						>
							{toolsItem.name}
						</button>
						{#if toolsItem.subItems}
							<div class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 invisible group-hover:visible transition-all duration-200">
								{#each toolsItem.subItems as subItem}
									<a href={subItem.href} class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
										{subItem.name}
									</a>
								{/each}
							</div>
						{/if}
					</div>
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
				<button
					on:click={toggleMenu}
					class="inline-flex items-center justify-center p-2 rounded-md text-[#007EFF] hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#007EFF]"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					</svg>
				</button>
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
					<button
						on:click={toggleMenu}
						class="absolute top-4 right-4 text-[#007EFF] hover:text-blue-700"
					>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</button>
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
						<div>
							<button 
								class="flex justify-between items-center w-full rounded-lg px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-100 hover:text-[#007EFF] dark:hover:text-[#007EFF] transition-colors duration-200" 
								on:click={toggleDropdown}
							>
								{toolsItem.name}
								<svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
								</svg>
							</button>
							{#if isDropdownOpen}
								<div transition:slide="{{ duration: 300 }}" class="ml-4 mt-2 space-y-2">
									{#each toolsItem.subItems as subItem}
										<a 
											class="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#007EFF] dark:hover:text-[#007EFF] transition-colors duration-200" 
											href={subItem.href} 
											on:click={toggleMenu}
										>
											{subItem.name}
										</a>
									{/each}
								</div>
							{/if}
						</div>
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