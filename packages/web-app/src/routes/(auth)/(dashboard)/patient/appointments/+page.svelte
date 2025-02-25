<script lang="ts">
    import { format } from 'date-fns';
    import { Calendar, Search, Filter, X } from 'lucide-svelte';
    
    export let data;
    
    let searchTerm = '';
    let statusFilter = 'all';
    let typeFilter = 'all';
    
    $: filteredUpcoming = data.upcomingAppointments.filter(appointment => {
      const doctorName = appointment.expand?.doctor_id?.full_name?.toLowerCase() || '';
      const matchesSearch = !searchTerm || doctorName.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      const matchesType = typeFilter === 'all' || appointment.consultation_type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
    
    $: filteredPast = data.pastAppointments.filter(appointment => {
      const doctorName = appointment.expand?.doctor_id?.full_name?.toLowerCase() || '';
      const matchesSearch = !searchTerm || doctorName.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      const matchesType = typeFilter === 'all' || appointment.consultation_type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  </script>
  
  <div class="space-y-8 animate-fade-in-up">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">My Appointments</h1>
      <a href="/patient/doctors" class="btn-primary">Book New Appointment</a>
    </div>
    
    <!-- Filters -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div class="flex flex-wrap gap-4">
        <!-- Search -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              bind:value={searchTerm}
              placeholder="Search by doctor name"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {#if searchTerm}
              <button 
                class="absolute right-3 top-2.5" 
                on:click={() => searchTerm = ''}
                aria-label="Clear search"
              >
                <X class="h-5 w-5 text-gray-400" />
              </button>
            {/if}
          </div>
        </div>
        
        <!-- Status Filter -->
        <div class="w-full sm:w-auto">
          <div class="flex items-center space-x-2">
            <Filter class="h-5 w-5 text-gray-500" />
            <select
              bind:value={statusFilter}
              class="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
          </div>
        </div>
        
        <!-- Type Filter -->
        <div class="w-full sm:w-auto">
          <div class="flex items-center space-x-2">
            <Calendar class="h-5 w-5 text-gray-500" />
            <select
              bind:value={typeFilter}
              class="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="video">Video</option>
              <option value="phone-call">Phone Call</option>
              <option value="in-person">In-Person</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Upcoming Appointments -->
    <section>
      <h2 class="text-xl font-bold mb-4">Upcoming Appointments</h2>
      
      {#if filteredUpcoming.length === 0}
        <div class="bg-gray-50 p-6 rounded-lg text-center">
          <p class="text-gray-600">No upcoming appointments found</p>
          
          {#if searchTerm || statusFilter !== 'all' || typeFilter !== 'all'}
            <button 
              on:click={() => { searchTerm = ''; statusFilter = 'all'; typeFilter = 'all'; }}
              class="mt-2 text-blue-500 underline"
            >
              Clear filters
            </button>
          {:else}
            <a href="/patient/doctors" class="mt-4 inline-block btn-primary">Find a Doctor</a>
          {/if}
        </div>
      {:else}
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 text-gray-700">
              <tr>
                <th class="py-3 px-4 text-left">Date & Time</th>
                <th class="py-3 px-4 text-left">Doctor</th>
                <th class="py-3 px-4 text-left">Type</th>
                <th class="py-3 px-4 text-left">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              {#each filteredUpcoming as appointment}
                <tr class="hover:bg-gray-50">
                  <td class="py-3 px-4">
                    <div class="font-medium">{format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}</div>
                    <div class="text-sm text-gray-500">{format(new Date(appointment.appointment_date), 'h:mm a')}</div>
                  </td>
                  <td class="py-3 px-4">
                    <div class="font-medium">
                      Dr. {appointment.expand?.doctor_id?.full_name || 'Unknown'}
                    </div>
                    <div class="text-sm text-gray-500">
                      {appointment.expand?.doctor_id?.specialization || ''}
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-1 text-xs rounded-full 
                      {appointment.consultation_type === 'video' 
                        ? 'bg-blue-100 text-blue-800' 
                        : appointment.consultation_type === 'phone-call'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }"
                    >
                      {appointment.consultation_type}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-1 text-xs rounded-full 
                      {appointment.status === 'scheduled' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : appointment.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }"
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <div class="flex items-center justify-end space-x-3">
                      {#if appointment.status === 'scheduled'}
                        {#if appointment.consultation_type === 'video'}
                          <a 
                            href={`/patient/consultations/${appointment.id}`} 
                            class="text-blue-600 hover:text-blue-800"
                          >
                            Join
                          </a>
                        {/if}
                        <button 
                          class="text-red-600 hover:text-red-800"
                          on:click={() => {
                            // Cancel appointment logic
                            // Would call cancelAppointment service function
                            alert('Cancel appointment feature - To be implemented');
                          }}
                        >
                          Cancel
                        </button>
                      {/if}
                      <a href={`/patient/appointments/${appointment.id}`} class="text-blue-600 hover:text-blue-800">
                        View
                      </a>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </section>
    
    <!-- Past Appointments -->
    <section>
      <h2 class="text-xl font-bold mb-4">Past Appointments</h2>
      
      {#if filteredPast.length === 0}
        <div class="bg-gray-50 p-6 rounded-lg text-center">
          <p class="text-gray-600">No past appointments found</p>
          
          {#if searchTerm || statusFilter !== 'all' || typeFilter !== 'all'}
            <button 
              on:click={() => { searchTerm = ''; statusFilter = 'all'; typeFilter = 'all'; }}
              class="mt-2 text-blue-500 underline"
            >
              Clear filters
            </button>
          {/if}
        </div>
      {:else}
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 text-gray-700">
              <tr>
                <th class="py-3 px-4 text-left">Date & Time</th>
                <th class="py-3 px-4 text-left">Doctor</th>
                <th class="py-3 px-4 text-left">Type</th>
                <th class="py-3 px-4 text-left">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              {#each filteredPast as appointment}
                <tr class="hover:bg-gray-50">
                  <td class="py-3 px-4">
                    <div class="font-medium">{format(new Date(appointment.appointment_date), 'MMM dd, yyyy')}</div>
                    <div class="text-sm text-gray-500">{format(new Date(appointment.appointment_date), 'h:mm a')}</div>
                  </td>
                  <td class="py-3 px-4">
                    <div class="font-medium">
                      Dr. {appointment.expand?.doctor_id?.full_name || 'Unknown'}
                    </div>
                    <div class="text-sm text-gray-500">
                      {appointment.expand?.doctor_id?.specialization || ''}
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-1 text-xs rounded-full 
                      {appointment.consultation_type === 'video' 
                        ? 'bg-blue-100 text-blue-800' 
                        : appointment.consultation_type === 'phone-call'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }"
                    >
                      {appointment.consultation_type}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-1 text-xs rounded-full 
                      {appointment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }"
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-right">
                    <div class="flex items-center justify-end space-x-3">
                      <a href={`/patient/appointments/${appointment.id}`} class="text-blue-600 hover:text-blue-800">
                        View
                      </a>
                      {#if appointment.status === 'completed' && !appointment.isReviewed}
                        <a href={`/patient/reviews/new?appointment=${appointment.id}`} class="text-green-600 hover:text-green-800">
                          Review
                        </a>
                      {/if}
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </section>
  </div>