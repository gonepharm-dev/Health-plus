<script lang="ts">
  import { format } from 'date-fns';
  import { Calendar, Activity, Users, Video, MessageSquare, Bell } from 'lucide-svelte';
  
  export let data;
  
  const { upcomingAppointments, profile, notifications, error } = data;
</script>

<div class="space-y-8 animate-fade-in-up">
  <section>
    <h1 class="text-2xl font-bold mb-6">Welcome back, {data.user.full_name || 'Patient'}</h1>
    
    {#if error}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
        {error}
      </div>
    {/if}
    
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Upcoming Appointment Card -->
      <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <div class="flex items-center mb-3">
          <Calendar class="w-5 h-5 text-blue-500 mr-2" />
          <h3 class="font-semibold text-gray-700">Next Appointment</h3>
        </div>
        
        {#if upcomingAppointments.length === 0}
          <p class="text-sm text-gray-500">No upcoming appointments</p>
          <a href="/patient/doctors" class="text-sm text-blue-500 mt-2 inline-block">Book an appointment</a>
        {:else}
          <div class="mt-2">
            <p class="text-lg font-bold">
              {format(new Date(upcomingAppointments[0].appointment_date), 'MMM dd, yyyy')}
            </p>
            <p class="text-sm text-gray-600">
              {format(new Date(upcomingAppointments[0].appointment_date), 'h:mm a')}
            </p>
            <p class="mt-1">
              Dr. {upcomingAppointments[0].expand?.doctor_id?.full_name || 'Unknown'}
            </p>
            <a 
              href={`/patient/appointments/${upcomingAppointments[0].id}`} 
              class="text-sm text-blue-500 mt-2 inline-block"
            >
              View details
            </a>
          </div>
        {/if}
      </div>
      
      <!-- Notifications Card -->
      <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <div class="flex items-center mb-3">
          <Bell class="w-5 h-5 text-blue-500 mr-2" />
          <h3 class="font-semibold text-gray-700">Notifications</h3>
        </div>
        
        {#if notifications.length === 0}
          <p class="text-sm text-gray-500">No new notifications</p>
        {:else}
          <p class="text-lg font-bold">{notifications.length} unread</p>
          <p class="text-sm text-gray-600 mb-2">
            {notifications[0].title}
          </p>
          <a href="/patient/notifications" class="text-blue-500 text-sm">View all</a>
        {/if}
      </div>
      
      <!-- Health Status Card -->
      <div class="bg-white p-4 rounded-xl shadow-md border border-gray-100">
        <div class="flex items-center mb-3">
          <Activity class="w-5 h-5 text-blue-500 mr-2" />
          <h3 class="font-semibold text-gray-700">Health Records</h3>
        </div>
        <p class="text-sm text-gray-500">Access your medical history</p>
        <a href="/patient/health" class="text-blue-500 text-sm mt-2 inline-block">View records</a>
      </div>
    </div>
  </section>
  
  <!-- Upcoming Appointments Section -->
  <section>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Upcoming Appointments</h2>
      <a href="/patient/appointments" class="text-blue-500 text-sm">View all</a>
    </div>
    
    {#if upcomingAppointments.length === 0}
      <div class="bg-gray-50 p-6 rounded-lg text-center">
        <p class="text-gray-600">No upcoming appointments</p>
        <a href="/patient/doctors" class="mt-4 inline-block btn-primary">Find a Doctor</a>
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
            {#each upcomingAppointments as appointment}
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
                  <a href={`/patient/appointments/${appointment.id}`} class="text-blue-600 hover:text-blue-800">
                    View
                  </a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </section>
  
  <!-- Quick Access Section -->
  <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <!-- Find a Doctor -->
    <div class="bg-blue-50 p-6 rounded-xl">
      <div class="flex items-center mb-3">
        <Users class="w-6 h-6 text-blue-500 mr-2" />
        <h2 class="text-xl font-bold">Find a Doctor</h2>
      </div>
      <p class="mb-4">Schedule an appointment with one of our specialists</p>
      <a href="/patient/doctors" class="btn-primary inline-block">Browse Doctors</a>
    </div>
    
    <!-- Video Consultation -->
    <div class="bg-green-50 p-6 rounded-xl">
      <div class="flex items-center mb-3">
        <Video class="w-6 h-6 text-green-600 mr-2" />
        <h2 class="text-xl font-bold">Video Consultation</h2>
      </div>
      <p class="mb-4">Connect with doctors virtually from the comfort of your home</p>
      <a href="/patient/consultations" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-block">
        My Consultations
      </a>
    </div>
    
    <!-- Messages -->
    <div class="bg-purple-50 p-6 rounded-xl">
      <div class="flex items-center mb-3">
        <MessageSquare class="w-6 h-6 text-purple-600 mr-2" />
        <h2 class="text-xl font-bold">Messages</h2>
      </div>
      <p class="mb-4">Communicate with your healthcare providers</p>
      <a href="/patient/messages" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded inline-block">
        View Messages
      </a>
    </div>
  </section>
</div>