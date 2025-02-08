<script lang="ts">
    let isSidebarOpen = true;
    let isSidebarCompact = false;

    function toggleSidebar() {
        isSidebarCompact = !isSidebarCompact;
    }
</script>

<div 
    class={`w-full ${isSidebarCompact ? 'w-20' : 'lg:w-1/5'} min-w-[34px] max-w-[300px] ${isSidebarCompact ? 'bg-light-blue-200' : 'bg-[#E8F1F2]'} h-auto lg:h-screen p-4 sidebar lg:sidebar-hidden relative overflow-hidden`} 
    id="sidebar"
>
    <!-- Close Button -->
    <button on:click={toggleSidebar} class="absolute top-4 right-4 p-2 rounded-full" aria-label="Toggle sidebar size">
        {isSidebarCompact ? 'Expand' : 'Collapse'}
    </button>

    <!-- Logo Section -->
    <div class="pt-6 pb-8 flex justify-center">
        <img 
            alt="Company Logo" 
            class="w-auto h-16 md:h-20 object-contain" 
            src="../../../static/logo.png"/>
    </div>

    {#if isSidebarOpen}
        <!-- Navigation Menu -->
        <div class="space-y-4 pb-4 px-4 md:px-6">
            <!-- Main Menu Items -->
            <div class="space-y-4">
                <a href="#" class={`flex items-center w-full p-2.5 md:p-3 rounded-lg hover:bg-[#DBEAFE] ${isSidebarCompact ? 'bg-transparent' : 'bg-white'}`}>
                    <span class="material-icons w-6 md:w-8 h-6 md:h-8 mr-3">home</span>
                    <span class={`font-medium text-[#010097] ${isSidebarCompact ? 'hidden' : ''}`}>Overview</span>
                </a>
                <a href="#" class="flex items-center w-full p-2.5 md:p-3 bg-white rounded-lg hover:bg-gray-50">
                    <span class="material-icons w-6 md:w-8 h-6 md:h-8 mr-3">event</span>
                    <span class={`font-medium text-gray-500 ${isSidebarCompact ? 'hidden' : ''}`}>Appointment</span>
                </a>
                <a href="#" class="flex items-center w-full p-2.5 md:p-3 bg-white rounded-lg hover:bg-gray-50">
                    <span class="material-icons w-6 md:w-8 h-6 md:h-8 mr-3">person</span>
                    <span class={`font-medium text-gray-500 ${isSidebarCompact ? 'hidden' : ''}`}>Patients</span>
                </a>
                <a href="#" class="flex items-center w-full p-2.5 md:p-3 bg-white rounded-lg hover:bg-gray-50">
                    <span class="material-icons w-6 md:w-8 h-6 md:h-8 mr-3">calendar_today</span>
                    <span class={`font-medium text-gray-500 ${isSidebarCompact ? 'hidden' : ''}`}>Schedule</span>
                </a>
                <a href="#" class="flex items-center w-full p-2.5 md:p-3 bg-white rounded-lg hover:bg-gray-50">
                    <span class="material-icons w-6 md:w-8 h-6 md:h-8 mr-3">description</span>
                    <span class={`font-medium text-gray-500 ${isSidebarCompact ? 'hidden' : ''}`}>Documents</span>
                </a>
                <a href="#" class="flex items-center w-full p-2.5 md:p-3 bg-white rounded-lg hover:bg-gray-50">
                    <span class="material-icons w-6 md:w-8 h-6 md:h-8 mr-3">mail</span>
                    <div class="flex items-center">
                        <span class={`font-medium text-gray-500 ${isSidebarCompact ? 'hidden' : ''}`}>Messages</span>
                        <span class="ml-3 bg-red-500 text-white text-xs md:text-sm rounded-full px-2 py-1">04</span>
                    </div>
                </a>
                <a href="#" class="flex items-center w-full p-2.5 md:p-3 bg-white rounded-lg hover:bg-gray-50">
                    <span class="material-icons w-6 md:w-8 h-6 md:h-8 mr-3">medication</span>
                    <span class={`font-medium text-gray-500 ${isSidebarCompact ? 'hidden' : ''}`}>Medication</span>
                </a>
            </div>

            <!-- Dividers -->
            <div class="border-t border-gray-200 my-4"></div>

            <!-- Notification Item -->
            <div class="space-y-4">
                <a href="#" class="flex items-center w-full p-2.5 md:p-3 bg-white rounded-lg hover:bg-gray-50">
                    <span class="material-icons w-6 md:w-8 h-6 md:h-8 mr-3">notifications</span>
                    <div class="relative">
                        <span class={`font-medium text-gray-500 ${isSidebarCompact ? 'hidden' : ''}`}>Notification</span>
                        <span class="absolute top-0 right-0 bg-red-500 text-white text-xs md:text-sm rounded-full px-2 py-1">12</span>
                    </div>
                </a>
                <a href="#" class="flex items-center w-full p-2.5 md:p-3 bg-white rounded-lg hover:bg-gray-50">
                    <span class="material-icons w-6 md:w-8 h-6 md:h-8 mr-3">settings</span>
                    <span class={`font-medium text-gray-500 ${isSidebarCompact ? 'hidden' : ''}`}>Settings</span>
                </a>
            </div>
        </div>

        <!-- Profile Section -->
        <div class="absolute bottom-4 left-0 right-0 bg-white p-4 border-t border-blue-500">
            <div class="flex items-center px-4 md:px-6">
                <img 
                    alt="Doctor's Profile Picture" 
                    class="w-10 md:w-12 h-10 md:h-12 rounded-full mr-3 object-cover" 
                    src="https://storage.googleapis.com/a1aa/image/rGYm3MWMGp8gwLont-wFBU2iOeGbXx7DwSpDCRhUCrY.jpg"
                />
                <div class="flex flex-col">
                    <p class="font-bold text-black mb-1">Dr James Martin</p>
                    <p class="text-sm md:text-base text-gray-500">Cardiac Surgeon</p>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Ensure consistent icon sizing */
    .material-icons {
        font-size: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    /* Style for section dividers */
    .border-t {
        border-top: 1px solid #E8F1F2;
    }
</style>