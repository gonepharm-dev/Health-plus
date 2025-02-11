<script lang="ts">
  import { page } from '$app/stores';
    import type { SvelteComponent } from 'svelte';
    import { Activity, Users, Calendar, Settings, MessageSquare, LogOut } from 'lucide-svelte';
	import type { NavigationItem } from '$lib/types/navigation';
    
    export let navigation: Array<{
      href: string;
      label: string;
      icon: typeof SvelteComponent;
      roles?: Array<'doctor' | 'patient'>;
    }>;
    
    export let onLogout: () => void = () => {};
    export let userRole: 'doctor' | 'patient' = 'patient';
    
    // Filter navigation items based on role
    $: filteredNavigation = navigation.filter(item => 
      !item.roles || item.roles.includes(userRole)
    );
    const doctorNavigation: NavigationItem[] = [
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

  const patientNavigation = [
    {
      href: '/patient/appointments',
      label: 'My Appointments',
      icon: Calendar,
      roles: ['patient']
    },
    {
      href: '/patient/doctors',
      label: 'Find Doctors',
      icon: Users,
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
      icon: Activity,
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


  function handleLogout() {
    
    console.log('Chill msee');
  }
</script>
<div class="container mx-auto px-4 py-8 max-w-7xl">
  <!-- Mobile Navigation -->
  <div class="lg:hidden px-2">
    <div class="border-b border-gray-300">
      <div class="flex flex-row justify-between md:justify-evenly space-x-1 overflow-x-auto scrollbar-hide">
        {#each filteredNavigation as item}
          <a
            href={item.href}
            class="flex-shrink-0 pb-2 border-b-2 md:text-base text-xs font-medium whitespace-nowrap
              {$page.url.pathname === item.href
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          >
            <div class="flex items-center space-x-1">
              <svelte:component 
                this={item.icon} 
                class="md:w-5 md:h-5 w-3 h-3" 
              />
              <span>{item.label}</span>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </div>

  <div class="mt-8 lg:grid lg:grid-cols-12 lg:gap-x-2">
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:block lg:col-span-2">
      <div class="sticky top-8 items-center flex">
        <nav class="w-full rounded-2xl border bg-white shadow-lg py-6 px-2 space-y-2">
          {#each filteredNavigation as item}
            <a
              href={item.href}
              class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                {$page.url.pathname === item.href
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}"
            >
              <svelte:component 
                this={item.icon} 
                class="mr-3 h-4 w-4 flex-shrink-0
                  {$page.url.pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-400 group-hover:text-gray-500'}"
              />
              <span>{item.label}</span>
            </a>
          {/each}

          <!-- Logout Button -->
          <button
            on:click={onLogout}
            class="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600
              rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut class="mr-3 h-4 w-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="lg:col-span-10 space-y-6">
      <div class="">
        <slot />
      </div>
    </main>
  </div>
</div>

<style>
  /* Hide scrollbar but maintain functionality */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
