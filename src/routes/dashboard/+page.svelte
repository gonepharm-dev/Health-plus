<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    // SVG Icons as components
    const HomeIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>`;

    const SearchIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>`;

    const LocationIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>`;

    const SettingsIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>`;

    let state = $state({
        health: {
            pulse: 65,
            bloodPressure: '120/80',
            temperature: '36.7°C',
            sleepTime: '8'
        },
        messages: [
            {
                id: 1,
                doctor: 'Dr. John Kioko',
                message: 'How you been everything?',
                time: '14:37',
                avatar: '/confident-professional-man-stockcake.webp'
            },
            {
                id: 2,
                doctor: 'Dr. Jane Njeri',
                message: 'Please make sure to take your medication as directed and don\'t hesitate...',
                time: '14:37',
                avatar: '/confident-professional-man-stockcake.webp'
            },
            {
                id: 3,
                doctor: 'Dr. Patrick Omuga',
                message: 'Let\'s schedule another appointment to discuss your treatment options',
                time: '14:37',
                avatar: '/confident-professional-man-stockcake.webp'
            }
        ],
        appointments: [
            {
                doctor: 'Dr. John Kioko',
                specialty: 'Dentist',
                time: 'Today, 2:00 PM',
                avatar: '/confident-professional-man-stockcake.webp'
            },
            {
                doctor: 'Dr. Patrick Omuga',
                specialty: 'Dentist',
                time: 'June 29, 1:00 PM',
                avatar: '/confident-professional-man-stockcake.webp'
            }
        ]
    });

    // Calendar data
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    function getDaysInMonth(month: number, year: number) {
        return new Date(year, month + 1, 0).getDate();
    }

    function getFirstDayOfMonth(month: number, year: number) {
        return new Date(year, month, 1).getDay();
    }

    function generateCalendarDays(month: number, year: number) {
        const daysInMonth = getDaysInMonth(month, year);
        const firstDay = getFirstDayOfMonth(month, year);
        const days = [];

        // Add empty slots for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: '', isCurrentMonth: false });
        }

        // Add the days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ 
                day: i, 
                isCurrentMonth: true,
                isToday: i === currentDate.getDate() && 
                         month === currentDate.getMonth() && 
                         year === currentDate.getFullYear(),
                hasAppointment: i === 7 // Example: marking day 7 as having an appointment
            });
        }

        return days;
    }

    $effect(() => {
        generateCalendarDays(currentMonth, currentYear);
    });

    function previousMonth() {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
    }

    function nextMonth() {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
    }

    let isMenuOpen = false;
</script>

<!-- Update the main layout structure -->
<div class="flex">
    <!-- Sidebar - Transform to bottom nav on mobile -->
    <div class="fixed md:left-0 md:top-0 md:h-screen md:w-16 h-16 w-full bottom-0 md:bottom-auto bg-[#010097] flex flex-row md:flex-col items-center md:py-8 justify-around md:justify-start text-white z-50">
        <!-- Logo -->
        <div class="hidden md:block mb-8">
            <img src="/logo.png" alt="Logo" class="w-8 h-8">
        </div>

        <!-- Navigation Items -->
        <nav class="flex md:flex-col items-center md:gap-8 w-full md:w-auto justify-around md:justify-start flex-1">
            <button class="w-8 h-8 hover:text-[#00D001] transition-colors">
                {@html HomeIcon}
            </button>
            <button class="w-8 h-8 hover:text-[#00D001] transition-colors">
                {@html SearchIcon}
            </button>
            <button class="w-8 h-8 hover:text-[#00D001] transition-colors">
                {@html LocationIcon}
            </button>
            <button class="w-8 h-8 hover:text-[#00D001] transition-colors md:hidden">
                {@html SettingsIcon}
            </button>
        </nav>

        <!-- Settings at bottom - Only show on desktop -->
        <button class="hidden md:block w-8 h-8 hover:text-[#00D001] transition-colors mt-auto mb-8">
            {@html SettingsIcon}
        </button>
    </div>

    <!-- Main Content -->
    <div class="md:ml-16 p-4 md:p-6 bg-[#DBEAFE] min-h-screen w-full pb-20 md:pb-6">
        <!-- Search Header -->
        <div class="flex flex-col md:flex-row gap-4 md:gap-0 items-start md:items-center justify-between mb-8">
            <div class="relative flex-1 max-w-md w-full">
                <input 
                    type="text" 
                    placeholder="Search" 
                    class="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border-none shadow-sm"
                >
                <span class="absolute left-3 top-2.5 text-gray-400 w-5 h-5">
                    {@html SearchIcon}
                </span>
            </div>
            <div class="flex items-center gap-4 w-full md:w-auto justify-end">
                <div class="flex items-center gap-2 text-gray-600">
                    <span>Kelvin</span>
                    <span class="w-4 h-4">
                        {@html LocationIcon}
                    </span>
                </div>
                <img src="/confident-professional-man-stockcake.webp" alt="Profile" class="w-8 h-8 rounded-full">
            </div>
        </div>

        <!-- Quick Actions -->
        <div>
            <h2 class="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
            <div class="grid grid-cols-2 md:flex gap-3 md:gap-4">
                <button class="flex items-center bg-[#010097] text-white p-3 md:p-4 rounded-xl hover:bg-[#6BAFA5] transition-colors flex-1 md:flex-initial">
                    <div class="mr-2 md:mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div class="text-sm md:text-lg font-semibold">Appointment</div>
                </button>

                <button class="flex items-center bg-[#010097] text-white p-3 md:p-4 rounded-xl hover:bg-[#3A80D2] transition-colors flex-1 md:flex-initial">
                    <div class="mr-2 md:mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div class="text-sm md:text-lg font-semibold">Start Call</div>
                </button>

                <button class="flex items-center bg-[#010097] text-white p-3 md:p-4 rounded-xl hover:bg-[#8B41D0] transition-colors flex-1 md:flex-initial">
                    <div class="mr-2 md:mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div class="text-sm md:text-lg font-semibold">Records</div>
                </button>

                <button class="flex items-center bg-[#00D001] text-white p-3 md:p-4 rounded-xl hover:bg-[#F57C00] transition-colors flex-1 md:flex-initial">
                    <div class="mr-2 md:mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div class="text-sm md:text-lg font-semibold">Billing</div>
                </button>
            </div>
        </div>

        <!-- Main Grid Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <!-- Left Column -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Messages -->
                <div>
                    <h2 class="text-lg font-medium text-gray-800 mb-4">Recent messages</h2>
                    <div class="space-y-3 md:space-y-4">
                        {#each state.messages as message}
                            <div class="flex items-center gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-xl">
                                <img src={message.avatar} alt={message.doctor} class="w-8 md:w-10 h-8 md:h-10 rounded-full">
                                <div class="flex-1 min-w-0">
                                    <h3 class="font-medium text-gray-800 truncate">{message.doctor}</h3>
                                    <p class="text-sm text-gray-500 truncate">{message.message}</p>
                                </div>
                                <span class="text-xs md:text-sm text-gray-400 shrink-0">{message.time}</span>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Right Column -->
            <div class="bg-white rounded-xl p-4 md:p-6">
                <!-- Calendar -->
                <div class="mb-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-medium">July 2023</h3>
                        <div class="flex gap-2">
                            <button class="p-1 hover:bg-gray-100 rounded-full">
                                <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24">
                                    <path d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button class="p-1 hover:bg-gray-100 rounded-full">
                                <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24">
                                    <path d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- Calendar Grid -->
                    <div class="grid grid-cols-7 gap-1 text-sm">
                        {#each daysOfWeek as day}
                            <div class="text-center text-gray-400 py-2">{day}</div>
                        {/each}
                        {#each generateCalendarDays(currentMonth, currentYear) as { day, isCurrentMonth, isToday }}
                            <div class="aspect-square flex items-center justify-center">
                                {#if day !== ''}
                                    <button class="w-8 h-8 rounded-full flex items-center justify-center
                                        {isToday ? 'bg-teal-400 text-white' : 'hover:bg-gray-100'}">
                                        {day}
                                    </button>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Appointments -->
                <div>
                    <h3 class="text-lg font-medium mb-4">Appointments</h3>
                    <div class="space-y-4">
                        {#each state.appointments as appointment}
                            <div class="flex items-center gap-4">
                                <img src={appointment.avatar} alt={appointment.doctor} class="w-12 h-12 rounded-full">
                                <div>
                                    <h4 class="font-medium">{appointment.doctor}</h4>
                                    <p class="text-sm text-gray-500">{appointment.specialty}</p>
                                    <p class="text-sm text-teal-500">{appointment.time}</p>
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
    .aspect-square {
        aspect-ratio: 1 / 1;
    }
</style>
