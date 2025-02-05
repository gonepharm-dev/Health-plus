<script lang="ts">
  // Import necessary icons/components
  import { Calendar, MessageSquare, FileText, History, ChevronUp, User, Bell, Settings, Menu } from 'lucide-svelte';

  // Get current date for calendar
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get first day of month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Create calendar days array
  const calendarDays = Array(42).fill(null).map((_, index) => {
    const dayNumber = index - firstDayOfMonth + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      return dayNumber;
    }
    return null;
  });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Sample appointments data
  const appointments = [
    { date: 15, time: "09:00 AM", doctor: "Dr. John Smith", type: "Check-up" },
    { date: 18, time: "02:30 PM", doctor: "Dr. Sarah Johnson", type: "Follow-up" },
    { date: today.getDate(), time: "11:00 AM", doctor: "Dr. Mike Wilson", type: "Consultation" }
  ];

  // Mobile menu state
  let isMobileMenuOpen = false;
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-2 sm:p-4">
  <div class="h-full max-w-7xl mx-auto flex flex-col">
    <!-- Top Navigation Bar -->
    <div class="flex justify-between items-center mb-4 bg-white rounded-xl p-3 shadow-lg">
      <div class="flex items-center gap-3">
        <button 
          class="lg:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg"
          on:click={() => isMobileMenuOpen = !isMobileMenuOpen}
        >
          <Menu class="w-5 h-5" />
        </button>
        <img src="/logo.png" alt="Logo" class="h-8 w-auto" />
        <h1 class="text-xl font-bold text-gray-900 hidden sm:block">Patient Portal</h1>
      </div>
      
      <div class="flex items-center gap-2 sm:gap-4">
        <button class="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Bell class="w-5 h-5" />
        </button>
        <button class="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
          <Settings class="w-5 h-5" />
        </button>
        <button class="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700">
          <User class="w-4 h-4" />
          <span class="text-sm hidden sm:inline">Profile</span>
        </button>
      </div>
    </div>

    <div class="flex-1 lg:grid lg:grid-cols-[240px,1fr] gap-4 min-h-0">
      <!-- Left Sidebar - Mobile Overlay -->
      <div class={`lg:hidden fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div class={`fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div class="p-4 space-y-4">
            <!-- Mobile Sidebar Content -->
            {#if isMobileMenuOpen}
              <button class="absolute top-2 right-2 p-2 text-gray-600" on:click={() => isMobileMenuOpen = false}>
                ✕
              </button>
              <!-- User Profile -->
              <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold">
                  JD
                </div>
                <div>
                  <p class="font-medium text-gray-900 text-sm">Welcome back,</p>
                  <p class="text-lg text-indigo-600 font-semibold">Jane Doe</p>
                  <p class="text-xs text-gray-600">Patient</p>
                </div>
              </div>

              <!-- Navigation Menu -->
              <nav class="space-y-2">
                <button class="w-full p-3 text-left bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md text-sm">
                  <MessageSquare class="w-4 h-4" />
                  <span class="font-medium">Messages</span>
                </button>

                <button class="w-full p-3 text-left bg-white text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all border border-gray-200 text-sm">
                  <Calendar class="w-4 h-4" />
                  <span class="font-medium">Schedule Visit</span>
                </button>

                <button class="w-full p-3 text-left bg-white text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all border border-gray-200 text-sm">
                  <FileText class="w-4 h-4" />
                  <span class="font-medium">Medical Records</span>
                </button>

                <button class="w-full p-3 text-left bg-white text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all border border-gray-200 text-sm">
                  <History class="w-4 h-4" />
                  <span class="font-medium">Visit History</span>
                </button>

                <button class="w-full p-3 text-left bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg flex items-center gap-2 hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm hover:shadow-md text-sm">
                  <ChevronUp class="w-4 h-4" />
                  <span class="font-medium">Upgrade Care Plan</span>
                </button>
              </nav>
            {/if}
          </div>
        </div>
      </div>

      <!-- Left Sidebar - Desktop -->
      <div class="hidden lg:block mb-4 lg:mb-0">
        <div class="bg-white rounded-xl shadow-lg p-4 space-y-4 h-full">
          <!-- User Profile -->
          <div class="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold">
              JD
            </div>
            <div>
              <p class="font-medium text-gray-900 text-sm">Welcome back,</p>
              <p class="text-lg text-indigo-600 font-semibold">Jane Doe</p>
              <p class="text-xs text-gray-600">Patient</p>
            </div>
          </div>

          <!-- Navigation Menu -->
          <nav class="space-y-2">
            <button class="w-full p-3 text-left bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md text-sm">
              <MessageSquare class="w-4 h-4" />
              <span class="font-medium">Messages</span>
            </button>

            <button class="w-full p-3 text-left bg-white text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all border border-gray-200 text-sm">
              <Calendar class="w-4 h-4" />
              <span class="font-medium">Schedule Visit</span>
            </button>

            <button class="w-full p-3 text-left bg-white text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all border border-gray-200 text-sm">
              <FileText class="w-4 h-4" />
              <span class="font-medium">Medical Records</span>
            </button>

            <button class="w-full p-3 text-left bg-white text-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all border border-gray-200 text-sm">
              <History class="w-4 h-4" />
              <span class="font-medium">Visit History</span>
            </button>

            <button class="w-full p-3 text-left bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg flex items-center gap-2 hover:from-pink-600 hover:to-rose-600 transition-all shadow-sm hover:shadow-md text-sm">
              <ChevronUp class="w-4 h-4" />
              <span class="font-medium">Upgrade Care Plan</span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Calendar Section -->
      <div class="grid grid-rows-[auto,1fr] gap-4">
        <div class="bg-white rounded-xl p-4 shadow-lg">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Upcoming Visits</h2>
              <p class="text-sm text-gray-500">{monthNames[currentMonth]} {currentYear}</p>
            </div>
            <button class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md text-sm">
              <span class="font-medium">Start Virtual Visit</span>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12L9 8V16L15 12Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <!-- Calendar Grid -->
          <div class="rounded-lg border border-gray-200 p-2 bg-gray-50 overflow-x-auto">
            <div class="grid grid-cols-7 gap-1 mb-1 min-w-[280px]">
              {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
                <div class="text-center font-medium text-gray-600 text-xs">{day}</div>
              {/each}
            </div>

            <div class="grid grid-cols-7 gap-0.5 min-w-[280px]">
              {#each calendarDays as day}
                {#if day === null}
                  <div class="aspect-square h-6"></div>
                {:else}
                  <button class="relative aspect-square h-6 text-xs hover:bg-blue-50 rounded-lg transition-all
                    {day === today.getDate() ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-700'}
                    {appointments.some(apt => apt.date === day) ? 'ring-1 ring-blue-400' : ''}">
                    {day}
                    {#if appointments.some(apt => apt.date === day)}
                      <div class="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                        <div class="w-1 h-1 bg-blue-500 rounded-full"></div>
                      </div>
                    {/if}
                  </button>
                {/if}
              {/each}
            </div>
          </div>
        </div>

        <!-- Today's Appointments -->
        <div class="bg-white rounded-xl p-4 shadow-lg overflow-auto">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Today's Visits</h3>
          <div class="space-y-2">
            {#each appointments.filter(apt => apt.date === today.getDate()) as appointment}
              <div class="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <p class="font-medium text-gray-900 text-sm">{appointment.doctor}</p>
                    <p class="text-xs text-gray-500">{appointment.type}</p>
                  </div>
                  <p class="text-blue-600 font-medium text-sm">{appointment.time}</p>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @media (max-width: 1024px) {
    .max-w-7xl {
      max-width: 100%;
    }
  }
</style>