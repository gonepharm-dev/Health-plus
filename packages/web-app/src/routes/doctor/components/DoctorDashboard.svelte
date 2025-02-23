<script lang="ts">
    import { onMount } from 'svelte';

    let isSidebarOpen = false;
    let expandedScheduleIndex: number | null = null; // Track which schedule item is expanded

    let state = {
        overview: {
            upcomingAppointments: 10,
            cancelledAppointments: 2,
            totalPatients: 120,
            todaySchedule: 8
        },
        upcomingAppointments: [
            {
                patientId: "P001",
                patientName: "Sidney Mwanzia",
                status: "Active",
                time: "10:30 AM",
                date: "2023-07-25",
            },
            {
                patientId: "P002",
                patientName: "Sarah Johnson",
                status: "Cancelled",
                time: "11:15 AM",
                date: "2023-07-25",
            },
            {
                patientId: "P003",
                patientName: "Michael Chen",
                status: "Active",
                time: "01:45 PM",
                date: "2023-07-25",
            },
            {
                patientId: "P004",
                patientName: "Emma Wilson",
                status: "Active",
                time: "02:30 PM",
                date: "2023-07-25",
            },
            {
                patientId: "P005",
                patientName: "John Doe",
                status: "Active",
                time: "04:00 PM",
                date: "2023-07-25",
            },
            {
                patientId: "P006",
                patientName: "Jane Smith",
                status: "Cancelled",
                time: "04:45 PM",
                date: "2023-07-25",
            },
            {
                patientId: "P007",
                patientName: "Alex Brown",
                status: "Active",
                time: "05:30 PM",
                date: "2023-07-25",
            },
            {
                patientId: "P008",
                patientName: "Sophia White",
                status: "Cancelled",
                time: "06:15 PM",
                date: "2023-07-25",
            },
            {
                patientId: "P009",
                patientName: "James Green",
                status: "Active",
                time: "07:00 PM",
                date: "2023-07-25",
            },
            {
                patientId: "P010",
                patientName: "Olivia Wilson",
                status: "Cancelled",
                time: "07:45 PM",
                date: "2023-07-25",
            }
        ],
        upcomingSchedule: [
            {
                time: "8:00 AM",
                title: "Consultation with Dr. Mike",
                details: "Patient: Joy James",
                purpose: "General check-up",
                action: "Begin appointment"
            },
            {
                time: "9:00 AM",
                title: "Consultation with Dr. Smith",
                details: "Patient: Alex Brown",
                purpose: "Follow-up",
                action: "Begin appointment"
            },
            {
                time: "10:00 AM",
                title: "Monthly Checkup",
                details: "Patient: Emma Wilson",
                purpose: "Routine health check",
                action: "Begin appointment"
            },
            {
                time: "11:00 AM",
                title: "Board Meeting",
                details: "Department Heads",
                purpose: "Quarterly review",
                action: "Join meeting"
            },
            {
                time: "12:00 PM",
                title: "Consultation with Dr. Lee",
                details: "Patient: John Doe",
                purpose: "Specialist consultation",
                action: "Begin appointment"
            },
            {
                time: "1:00 PM",
                title: "Surgery Prep",
                details: "Patient: Sarah Johnson",
                purpose: "Pre-surgery briefing",
                action: "Begin preparation"
            },
            {
                time: "2:00 PM",
                title: "Consultation with Dr. Patel",
                details: "Patient: Michael Chen",
                purpose: "Follow-up on treatment",
                action: "Begin appointment"
            },
            {
                time: "3:00 PM",
                title: "Team Meeting",
                details: "Medical Staff",
                purpose: "Weekly updates",
                action: "Join meeting"
            },
            {
                time: "4:00 PM",
                title: "Consultation with Dr. Brown",
                details: "Patient: Olivia Wilson",
                purpose: "New patient consultation",
                action: "Begin appointment"
            },
            {
                time: "5:00 PM",
                title: "Consultation with Dr. Green",
                details: "Patient: James Green",
                purpose: "Routine follow-up",
                action: "Begin appointment"
            }
        ]
    };

    function formatDate(dateString: string): string {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
</script>

<style>
    .aspect-16-9 {
        position: relative;
        width: 100%;
        padding-top: 56.25%; /* 16:9 Aspect Ratio */
    }
    .aspect-16-9 > * {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    /* New styles for table padding */
    table {
        width: 100%;
        border-collapse: collapse; /* Ensure borders collapse */
        margin-top: 1rem; /* Optional: Add margin to the top of the table */
    }
    th, td {
        padding: 0.75rem; /* Add padding to table cells */
        text-align: left; /* Align text to the left */
    }
    th {
        background-color: #f9f9f9; /* Optional: Add a background color to the header */
    }
</style>

<div class="flex min-h-screen text-gray-900 bg-white py-24 aspect-16-9">
    <!-- Main Content -->
    <main class="flex-1 w-full lg:ml-0">
        <div class="lg:hidden fixed top-0 left-0 right-0 bg-white p-4 border-b z-10">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="text-lg font-semibold">HealthPlus</span>
                </div>
                <button class="p-2 hover:bg-gray-100 rounded-lg" on:click={() => isSidebarOpen = !isSidebarOpen}>
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="p-6 mt-16">
            <!-- Search Bar -->
            <div class="relative w-full lg:w-1/3 mb-8">
                <input 
                    type="text" 
                    placeholder="Search Patients" 
                    class="w-full p-2 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
                <span class="material-icons absolute top-3 right-3 text-gray-500">search</span>
            </div>

            <!-- Metric Cards -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                <!-- Appointments Card -->
                <div class="bg-white p-4 rounded-xl shadow">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 class="text-lg font-bold">Appointments</h2>
                            <p class="text-2xl font-bold">{state.overview.upcomingAppointments}</p>
                            <p class="text-green-500">+5.11%</p>
                        </div>
                    </div>
                </div>

                <!-- Cancelled Appointments Card -->
                <div class="bg-white p-4 rounded-xl shadow">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 class="text-lg font-bold">Cancelled</h2>
                            <p class="text-2xl font-bold">{state.overview.cancelledAppointments}</p>
                            <p class="text-red-500">-2.39%</p>
                        </div>
                    </div>
                </div>

                <!-- Total Patients Card -->
                <div class="bg-white p-4 rounded-xl shadow">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 class="text-lg font-bold">Active Patients</h2>
                            <p class="text-2xl font-bold">{state.overview.totalPatients}</p>
                            <p class="text-green-500">+3.44%</p>
                        </div>
                    </div>
                </div>

                <!-- Today's Schedule Card -->
                <div class="bg-white p-4 rounded-xl shadow">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 class="text-lg font-bold">Today's Schedule</h2>
                            <p class="text-2xl font-bold">{state.overview.todaySchedule}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Appointments Table -->
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Appointments Table -->
                <div class="bg-white rounded-xl shadow flex-1">
                    <div class="flex justify-between items-center p-4 border-b">
                        <h2 class="text-lg font-bold">Appointments Today</h2>
                        <a href="/doctor/appointments" class="text-blue-500 hover:underline">View All</a>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="text-left">
                                    <th class="py-2">Status</th>
                                    <th class="py-2">Patient ID</th>
                                    <th class="py-2">Patient Name</th>
                                    <th class="py-2">Date</th>
                                    <th class="py-2">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each state.upcomingAppointments as appointment}
                                    <tr>
                                        <td><span class={`px-2 py-1 rounded-full ${appointment.status === 'Active' ? 'bg-green-500 text-white' : 
                                            appointment.status === 'Cancelled' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'}`}>
                                            {appointment.status}</span></td>
                                        <td>{appointment.patientId}</td>
                                        <td>{appointment.patientName}</td>
                                        <td>{formatDate(appointment.date)}</td>
                                        <td>{appointment.time}</td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Upcoming Schedule -->
                <div class="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-lg font-bold">Upcoming Schedule</h2>
                        <a class="text-blue-500" href="#">View All</a>
                    </div>
                    <div class="text-sm">
                        {#each state.upcomingSchedule as schedule, index}
                            <div class="flex items-center mb-4 whitespace-nowrap">
                                <span class="w-13 text-right">{schedule.time}</span>
                                <button 
                                    class={`ml-4 text-left ${expandedScheduleIndex === index ? 'text-blue-500 underline' : 'text-black'} hover:text-blue-500 hover:underline`} 
                                    on:click={() => expandedScheduleIndex = expandedScheduleIndex === index ? null : index}
                                >
                                    {schedule.title}
                                </button>
                                {#if expandedScheduleIndex === index}
                                    <div class="ml-6">
                                        {#if schedule.details}
                                            <p>Patient: {schedule.details}</p>
                                        {/if}
                                        <p>Time: {schedule.time}</p>
                                        {#if schedule.purpose}
                                            <p>Purpose: {schedule.purpose}</p>
                                        {/if}
                                        <a class="text-blue-500" href="#">{schedule.action}</a>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

{#if isSidebarOpen}
    <div class="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-10" on:click={() => isSidebarOpen = false}></div>
{/if}