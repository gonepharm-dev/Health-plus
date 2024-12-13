<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    // State Management
    let isSidebarOpen = false;

    // Mock Data State
    let state = {
        overview: {
            upcomingAppointments: 2,
            pastAppointments: 8,
            prescriptions: 3,
            documents: 12
        },
        upcomingAppointments: [
            {
                doctorName: "Dr. Sarah Johnson",
                specialty: "Endocrinologist",
                description: "Follow-up consultation for diabetes management",
                time: "10:30 AM",
                isConfirmed: true,
                thumbnail: "/confident-professional-man-stockcake.webp"
            },
            {
                doctorName: "Dr. Michael Chen",
                specialty: "Physical Therapist",
                description: "Initial consultation for chronic back pain",
                time: "2:15 PM",
                isConfirmed: false,
                thumbnail: "/confident-professional-man-stockcake.webp"
            },
            {
                doctorName: "Dr. Sarah Johnson",
                specialty: "Endocrinologist",
                description: "Follow-up consultation for diabetes management",
                time: "10:30 AM",
                isConfirmed: true,
                thumbnail: "/confident-professional-man-stockcake.webp"
            },
            {
                doctorName: "Dr. Michael Chen",
                specialty: "Physical Therapist",
                description: "Initial consultation for chronic back pain",
                time: "2:15 PM",
                isConfirmed: false,
                thumbnail: "/confident-professional-man-stockcake.webp"
            }
        ]
    };
</script>

<div class="flex min-h-screen bg-gray-50"><!-- or any other gray shade you prefer -->
    <!-- Sidebar - Modified positioning -->
    <aside class="fixed lg:sticky top-0 h-screen w-[240px] border-r bg-white p-6 
        transform transition-transform duration-300 lg:translate-x-0 
        {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:block z-20">
        <!-- Logo Section -->
        <div class="flex items-center gap-2 mb-8">
            
            <span class="text-xl font-semibold">HealthPlus</span>
        </div>

        <!-- Navigation Links -->
        <div class="space-y-4">
            <!-- Quick Action Button -->
            <button class="flex items-center gap-2 text-blue-600 font-medium">
                <span class="text-2xl">+</span>
                Book Appointment
            </button>

            <!-- Main Navigation Menu -->
            <nav class="space-y-2">
                <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Dashboard</a>
                <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Appointments</a>
                <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Medical Records</a>
                <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Prescriptions</a>
                <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Messages</a>
            </nav>
        </div>

        <!-- Bottom Action Button -->
        <div class="absolute bottom-6 left-6 right-6">
            <button class="w-full py-2 text-blue-600 border border-blue-600 rounded-lg">
                Start Virtual Visit
            </button>
        </div>
    </aside>

    <!-- Main Content Wrapper - Modified structure -->
    <main class="flex-1 w-full lg:ml-0">
        <!-- Mobile Header -->
        <div class="lg:hidden fixed top-0 left-0 right-0 bg-white p-4 border-b z-10">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <img src="/healthplus-logo.png" alt="HealthPlus" class="h-6">
                    <span class="text-lg font-semibold">HealthPlus</span>
                </div>
                <!-- Mobile Menu Toggle Button -->
                <button 
                    class="p-2 hover:bg-gray-100 rounded-lg"
                    on:click={() => isSidebarOpen = !isSidebarOpen}
                >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Main Content Area - Adjusted padding and margin -->
        <div class="p-4 lg:p-8 mt-16 lg:mt-0">
            <!-- Welcome Banner -->
            <div class="bg-blue-100 rounded-2xl p-4 lg:p-6 mb-8">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-xl lg:text-2xl font-semibold mb-1">Welcome, John</h1>
                        <p class="text-sm lg:text-base text-gray-600">
                            You have {state.overview.upcomingAppointments} upcoming appointments
                        </p>
                    </div>
                </div>
            </div>

            <!-- Statistics Grid -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <!-- Upcoming Appointments Stat -->
                <div class="bg-blue-100 p-4 rounded-xl">
                    <div class="flex flex-col lg:flex-row lg:items-center gap-2">
                        <span class="text-xl lg:text-2xl font-semibold">{state.overview.upcomingAppointments}</span>
                        <span class="text-xs lg:text-sm">Upcoming Appointments</span>
                    </div>
                </div>
                <!-- Past Appointments Stat -->
                <div class="bg-green-100 p-4 rounded-xl">
                    <div class="flex flex-col lg:flex-row lg:items-center gap-2">
                        <span class="text-xl lg:text-2xl font-semibold">{state.overview.pastAppointments}</span>
                        <span class="text-xs lg:text-sm">Past Appointments</span>
                    </div>
                </div>
                <!-- Active Prescriptions Stat -->
                <div class="bg-purple-100 p-4 rounded-xl">
                    <div class="flex flex-col lg:flex-row lg:items-center gap-2">
                        <span class="text-xl lg:text-2xl font-semibold">{state.overview.prescriptions}</span>
                        <span class="text-xs lg:text-sm">Active Prescriptions</span>
                    </div>
                </div>
                <!-- Medical Documents Stat -->
                <div class="bg-indigo-100 p-4 rounded-xl">
                    <div class="flex flex-col lg:flex-row lg:items-center gap-2">
                        <span class="text-xl lg:text-2xl font-semibold">{state.overview.documents}</span>
                        <span class="text-xs lg:text-sm">Medical Documents</span>
                    </div>
                </div>
            </div>

            <!-- Appointments List -->
            <div class="space-y-4">
                {#each state.upcomingAppointments as appointment}
                    <div class="bg-white p-4 rounded-xl flex flex-col lg:flex-row lg:items-center gap-4">
                        <!-- Doctor's Image -->
                        <img src={appointment.thumbnail} alt={appointment.doctorName} class="w-12 h-12 lg:w-16 lg:h-16 rounded-full object-cover">
                        <!-- Appointment Details -->
                        <div class="flex-1">
                            <h3 class="font-semibold">{appointment.doctorName}</h3>
                            <p class="text-sm text-blue-600">{appointment.specialty}</p>
                            <p class="text-sm text-gray-500">{appointment.description}</p>
                            <p class="text-sm text-gray-400">Appointment time: {appointment.time}</p>
                        </div>
                        <!-- Appointment Status and Actions -->
                        <div class="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-4">
                            <div class="flex items-center gap-2">
                                <span class="text-sm">{appointment.isConfirmed ? 'Confirmed' : 'Pending'}</span>
                                <div class="w-12 h-6 bg-gray-200 rounded-full relative">
                                    <div class={`absolute w-5 h-5 rounded-full top-0.5 transition-all
                                        ${appointment.isConfirmed ? 'bg-green-600 right-0.5' : 'bg-gray-400 left-0.5'}`}>
                                    </div>
                                </div>
                            </div>
                            <button class="p-2 hover:bg-gray-100 rounded-full">
                                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </main>
</div>

<!-- Mobile Overlay -->
{#if isSidebarOpen}
    <div 
        class="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-10"
        on:click={() => isSidebarOpen = false}
    ></div>
{/if}
