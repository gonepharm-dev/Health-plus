<script lang="ts">
    import { format } from 'date-fns';
    import { Video, Clock } from 'lucide-svelte';
    
    export let data;
    
    // Group consultations by status
    $: upcomingConsultations = data.consultations.filter(consultation => {
      const appointment = consultation.expand?.appointment;
      return appointment && appointment.status !== 'completed' && appointment.status !== 'cancelled';
    });
    
    $: pastConsultations = data.consultations.filter(consultation => {
      const appointment = consultation.expand?.appointment;
      return appointment && (appointment.status === 'completed' || appointment.status === 'cancelled');
    });
  </script>
  
  <div class="space-y-8 animate-fade-in-up">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">My Consultations</h1>
    </div>
    
    {#if data.error}
      <div class="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded">
        {data.error}
      </div>
    {/if}
    
    <!-- Upcoming Consultations -->
    <section>
      <h2 class="text-xl font-bold mb-4">Upcoming Consultations</h2>
      
      {#if upcomingConsultations.length === 0}
        <div class="bg-gray-50 p-6 rounded-lg text-center">
          <p class="text-gray-600">No upcoming consultations</p>
          <a href="/patient/doctors" class="mt-4 inline-block btn-primary">Find a Doctor</a>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each upcomingConsultations as consultation}
            {@const appointment = consultation.expand?.appointment}
            {@const doctor = appointment?.expand?.doctor_id}
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div class="p-4">
                <div class="flex items-start">
                  <div class="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                    <Video class="h-6 w-6 text-white" />
                  </div>
                  
                  <div class="flex-1">
                    <h3 class="font-bold text-lg">
                      Consultation with Dr. {doctor?.full_name || 'Unknown'}
                    </h3>
                    
                    <div class="flex items-center text-gray-600 mt-1">
                      <Clock class="h-4 w-4 mr-1" />
                      <span>
                        {appointment?.appointment_date
                          ? format(new Date(appointment.appointment_date), 'MMMM d, yyyy - h:mm a')
                          : 'Time not specified'}
                      </span>
                    </div>
                    
                    {#if appointment?.status === 'scheduled'}
                      <div class="mt-4">
                        <a 
                          href={`/patient/consultations/${consultation.id}`}
                          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Join Consultation
                        </a>
                      </div>
                    {:else if appointment?.status === 'in_progress'}
                      <div class="mt-4">
                        <a 
                          href={`/patient/consultations/${consultation.id}`}
                          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Join Ongoing Consultation
                        </a>
                        <p class="text-sm text-green-600 mt-1">Consultation in progress</p>
                      </div>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </section>
    
    <!-- Past Consultations -->
    <section>
      <h2 class="text-xl font-bold mb-4">Past Consultations</h2>
      
      {#if pastConsultations.length === 0}
        <div class="bg-gray-50 p-6 rounded-lg text-center">
          <p class="text-gray-600">No past consultations</p>
        </div>
      {:else}
        <div class="bg-white rounded-xl shadow overflow-hidden">
          <table class="w-full">
            <thead class="bg-gray-50 text-gray-700">
              <tr>
                <th class="py-3 px-4 text-left">Date & Time</th>
                <th class="py-3 px-4 text-left">Doctor</th>
                <th class="py-3 px-4 text-left">Status</th>
                <th class="py-3 px-4 text-center">Duration</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              {#each pastConsultations as consultation}
                {@const appointment = consultation.expand?.appointment}
                {@const doctor = appointment?.expand?.doctor_id}
                
                <tr class="hover:bg-gray-50">
                  <td class="py-3 px-4">
                    <div class="font-medium">
                      {appointment?.appointment_date
                        ? format(new Date(appointment.appointment_date), 'MMM dd, yyyy')
                        : 'Date not specified'}
                    </div>
                    <div class="text-sm text-gray-500">
                      {appointment?.appointment_date
                        ? format(new Date(appointment.appointment_date), 'h:mm a')
                        : ''}
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <div class="font-medium">
                      Dr. {doctor?.full_name || 'Unknown'}
                    </div>
                    <div class="text-sm text-gray-500">
                      {doctor?.specialization || ''}
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-1 text-xs rounded-full 
                      {appointment?.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                      }"
                    >
                      {appointment?.status || 'Unknown'}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-center">
                    {#if consultation.startedAt && consultation.endedAt}
                      <span class="text-gray-700">
                        {Math.round((new Date(consultation.endedAt) - new Date(consultation.startedAt)) / 60000)} min
                      </span>
                    {:else}
                      <span class="text-gray-500">N/A</span>
                    {/if}
                  </td>
                  <td class="py-3 px-4 text-right">
                    <a href={`/patient/consultations/${consultation.id}`} class="text-blue-600 hover:text-blue-800">
                      View Summary
                    </a>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </section>
  </div>