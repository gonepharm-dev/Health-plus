<script lang="ts">
  // Import Svelte and UI components
  import { onMount } from 'svelte';
  import { Search, Bell, Plus, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-svelte';

  // Chart canvas references
  let revenueChart: HTMLCanvasElement;
  let performanceChart: HTMLCanvasElement;

  // Types and interfaces
  interface Transaction {
    id: number;
    item: string;
    date: string;
    status: 'Completed' | 'Pending';
    icon: string;
  }

  let showNotifications = false; // State to control notification card visibility
  let showMobileSearch = false; // State to control mobile search visibility

  // Sample notifications data
  const notifications = [
    { id: 1, message: 'You have a new appointment request.', icon: '🔔' },
    { id: 2, message: 'Your prescription has been updated.', icon: '💊' },
    { id: 3, message: 'You have an appointment tomorrow at 2 PM.', icon: '🔔' },
    { id: 4, message: 'Time to take your evening medication.', icon: '💊' },
    { id: 5, message: 'Follow-up appointment scheduled for next week.', icon: '🔔' }
  ];

  function toggleNotifications() {
    showNotifications = !showNotifications;
  }

  function closeNotifications() {
    showNotifications = false;
  }

  function toggleMobileSearch() {
    showMobileSearch = !showMobileSearch;
  }

  // Mock transaction data
  const transactions: Transaction[] = [
    { id: 1, item: 'Consultation with Dr. Smith', date: 'Jul 12th 2024', status: 'Completed', icon: '👨‍⚕️' },
    { id: 2, item: 'Follow-up with Dr. Johnson', date: 'Jul 13th 2024', status: 'Completed', icon: '👩‍⚕️' },
  ];

  // Calendar state
  let currentMonth: Date = new Date();

  // Calendar navigation functions
  function previousMonth() {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    currentMonth = new Date(currentMonth);
  }

  function nextMonth() {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    currentMonth = new Date(currentMonth);
  }

  // Calendar helper function
  function getDaysInMonth(date: Date) {
    const days = [];
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    // Add empty slots for days before first of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Add all days in month
    for (let i = 1; i <= lastDate; i++) {
      days.push(i);
    }
    return days;
  }

  // Typing animation state
  const words = ['Records', 'Appointments', 'Doctors', 'Messages'];
  let currentWord = '';
  let currentWordIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  
  // Typing animation function
  function typeWriter() {
    const word = words[currentWordIndex];
    
    if (isDeleting) {
      currentWord = word.substring(0, currentCharIndex - 1);
      currentCharIndex--;
    } else {
      currentWord = word.substring(0, currentCharIndex + 1);
      currentCharIndex++;
    }
    
    // Determine the typing speed
    let typeSpeed = isDeleting ? 50 : 100; // Faster deletion, slower typing
    
    // If completed typing word
    if (!isDeleting && currentCharIndex === word.length) {
      isDeleting = true;
      typeSpeed = 1000; // Pause at end of word
    }
    
    // If completed deleting word
    if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentWordIndex = (currentWordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before starting new word
    }
    
    setTimeout(typeWriter, typeSpeed);
  }
  
  onMount(() => {
    typeWriter(); // Start the typing animation
  });
</script>

<!-- Main Layout Container -->
<div class="min-h-[calc(100vh-4rem)] bg-background p-6">
  <!-- Header Section -->
  <header class="flex flex-col gap-4 mb-6">
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-semibold">Patient</h1>
      
      <!-- Mobile Menu -->
      <div class="flex md:hidden items-center gap-2">
        <button class="p-2 rounded-lg border border-gray-200" on:click={toggleMobileSearch}>
          <Search class="w-5 h-5" />
        </button>
        <button class="p-2 rounded-lg border border-gray-200" on:click={toggleNotifications}>
          <Bell class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile Search Bar -->
    {#if showMobileSearch}
      <div class="md:hidden w-full">
        <div class="relative">
          <input 
            type="search" 
            placeholder="Search {currentWord.toLowerCase()}..." 
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-background" 
          />
          <Search class="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
    {/if}

    <!-- Desktop Controls -->
    <div class="hidden md:flex items-center gap-4">
      <!-- Search Bar -->
      <div class="relative flex-1 max-w-md">
        <input 
          type="search" 
          placeholder="Search {currentWord.toLowerCase()}..." 
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-background" 
        />
        <Search class="w-4 h-4 absolute left-3 top-3 text-gray-400" />
      </div>
      <!-- Notification Button -->
      <div class="relative">
        <button class="p-2 rounded-lg border border-gray-200" on:click={toggleNotifications}>
          <Bell class="w-5 h-5" />
          {#if notifications.length > 0}
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notifications.length}
            </span>
          {/if}
        </button>
      </div>
      <!-- Appointment Button -->
      <button class="ml-auto bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold whitespace-nowrap">
        <Plus class="w-4 h-4" />
        Book Appointment
      </button>
    </div>

    <!-- Mobile Appointment Button -->
    <button class="md:hidden w-full bg-secondary text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-bold">
      <Plus class="w-4 h-4" />
      Book Appointment
    </button>
  </header>

  <!-- Notifications Panel -->
  {#if showNotifications}
    <div class="fixed inset-0 z-50 bg-black bg-opacity-50 md:bg-transparent md:inset-auto md:absolute md:top-16 md:right-6">
      <div class="bg-white w-full h-full md:h-auto md:w-80 p-6 md:rounded-lg md:shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-lg">Notifications</h3>
          <button class="p-2" on:click={closeNotifications}>✕</button>
        </div>
        <ul class="space-y-3">
          {#each notifications as notification}
            <li class="flex items-center gap-3 text-sm text-gray-700">
              <span class="text-xl">{notification.icon}</span>
              {notification.message}
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}

  <!-- Main Content Grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-[calc(100%-4rem)]">
    <!-- Left Column - Main Content -->
    <div class="col-span-12 md:col-span-8 space-y-4 md:space-y-6">
      <!-- Update Banner -->
      <div class="bg-secondary text-white p-4 md:p-6 rounded-xl">
        <span class="text-lg font-extrabold">Updates</span>
        <p class="text-lg mt-2">Your Records are now available</p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div class="bg-background p-3 md:p-4 rounded-xl border-2 border-[#1D5DEC] flex flex-col items-center">
          <p class="text-text text-center text-sm">Total doctors available</p>
          <h2 class="text-xl md:text-2xl font-semibold text-text">9</h2>
        </div>
        <div class="bg-background p-3 md:p-4 rounded-xl border-2 border-[#1D5DEC] flex flex-col items-center">
          <p class="text-text text-center text-sm">Upcoming appointments</p>
          <h2 class="text-xl md:text-2xl font-semibold text-text">5</h2>
        </div>
      </div>

      <!-- Appointments List -->
      <div class="bg-background rounded-xl p-4 md:p-6">
        <h3 class="font-semibold mb-4 md:mb-6">Appointments</h3>
        <div class="space-y-4">
          {#each transactions.filter(t => t.status === 'Completed') as transaction}
            <div class="flex items-center justify-between border-b border-gray-200 pb-4">
              <div class="flex items-center gap-3 md:gap-4">
                <span class="text-xl md:text-2xl">{transaction.icon}</span>
                <div>
                  <p class="font-medium text-sm md:text-base">{transaction.item}</p>
                  <p class="text-xs md:text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <span class="text-xs md:text-sm text-green-600">{transaction.status}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right Column - Calendar Widget -->
    <div class="col-span-12 md:col-span-4 bg-background rounded-xl p-4 md:p-6 border-2 border-[#1D5DEC]">
      <!-- Calendar Header -->
      <div class="flex justify-between items-center mb-4">
        <button class="p-2" on:click={previousMonth}>
          <ChevronLeft class="w-5 h-5 text-gray-400" />
        </button>
        <h2 class="text-base md:text-lg font-semibold">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button class="p-2" on:click={nextMonth}>
          <ChevronRight class="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <!-- Calendar Days Header -->
      <div class="grid grid-cols-7 gap-1 md:gap-2 text-center text-gray-600 text-xs md:text-sm">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>
      <!-- Calendar Days Grid -->
      <div class="grid grid-cols-7 gap-1 md:gap-2 mt-2">
        {#each getDaysInMonth(currentMonth) as day}
          {#if day !== null}
            <div class="p-2 md:p-3 text-center text-sm">{day}</div>
          {:else}
            <div></div>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</div>

<!-- Global Styles -->
<style lang="postcss">
  :global(body) {
    @apply bg-gray-50;
  }
</style>
