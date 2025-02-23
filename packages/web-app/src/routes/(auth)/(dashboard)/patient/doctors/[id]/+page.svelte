<script lang="ts">
    import { Star, Calendar, Clock, MapPin, Phone, Mail, Award, Globe, Heart } from 'lucide-svelte';
    import { format, parseISO, addDays } from 'date-fns';
    import { createAppointment } from '$lib/services/appointmentService';
    import { getDoctorAvailability } from '$lib/services/doctorService';
    import { onMount } from 'svelte';
    
    export let data;
    
    const { doctorProfile } = data;
    const doctor = doctorProfile.expand?.user || {};
    
    let availabilityData = [];
    let loading = false;
    let error = '';
    let success = '';
    
    // Booking form data
    let selectedDate = '';
    let selectedTime = '';
    let selectedType = 'video';
    let notes = '';
    
    // Available time slots
    let availableSlots = [];
    
    onMount(async () => {
      try {
        loading = true;
        availabilityData = await getDoctorAvailability(doctor.id);
        
        // Set initial date to today or next available date
        const today = new Date();
        selectedDate = format(today, 'yyyy-MM-dd');
        updateAvailableSlots();
      } catch (err) {
        console.error('Error loading availability:', err);
        error = 'Failed to load doctor availability';
      } finally {
        loading = false;
      }
    });
    
    // Update available slots when date changes
    function updateAvailableSlots() {
      if (!selectedDate || !availabilityData.length) return;
      
      const date = parseISO(selectedDate);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      // Find availability for this day of week
      const dayAvailability = availabilityData.find(a => a.dayOfWeek === dayOfWeek);
      
      if (!dayAvailability || !dayAvailability.isAvailable) {
        availableSlots = [];
        return;
      }
      
      // Generate time slots from start to end time
      const startTime = dayAvailability.startTime;
      const endTime = dayAvailability.endTime;
      
      // This is a simplified example - in a real app you'd need more complex logic
      // to handle time parsing and slot generation
      // For demo purposes, we'll just create some sample slots
      availableSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'
      ];
    }
    
    $: if (selectedDate) {
      updateAvailableSlots();
    }
    
    async function handleBooking() {
      if (!selectedDate || !selectedTime || !selectedType) {
        error = 'Please fill in all required fields';
        return;
      }
      
      try {
        loading = true;
        error = '';
        
        // Format appointment date
        const appointmentDateTime = `${selectedDate}T${selectedTime}:00`;
        
        await createAppointment({
          patient_id: data.user.id,
          doctor_id: doctor.id,
          appointment_date: appointmentDateTime,
          status: 'scheduled',
          consultation_type: selectedType,
          notes
        });
        
        success = 'Appointment booked successfully!';
        
        // Reset form
        selectedDate = '';
        selectedTime = '';
        notes = '';
      } catch (err) {
        console.error('Error booking appointment:', err);
        error = 'Failed to book appointment. Please try again.';
      } finally {
        loading = false;
      }
    }
  </script>
  
  <div class="space-y-8 animate-fade-in-up">
    <!-- Doctor Profile -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="md:flex">
        <!-- Doctor Info -->
        <div class="md:w-2/3 p-6">
          <div class="flex items-start">
            <div class="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mr-6 overflow-hidden">
              {#if doctor.avatar}
                <img src={doctor.avatar} alt="Doctor" class="h-full w-full object-cover" />
              {:else}
                <span class="text-3xl font-bold text-blue-600">
                  {doctor.full_name?.charAt(0) || 'D'}
                </span>
              {/if}
            </div>
            
            <div>
              <h1 class="text-2xl font-bold">Dr. {doctor.full_name}</h1>
              <p class="text-blue-600 text-lg">{doctor.specialization}</p>
              
              <div class="flex items-center mt-2">
                <div class="flex">
                  {#each Array(5) as _, i}
                    <Star 
                      class="h-5 w-5 {i < (doctorProfile.ratingAverage || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}"
                    />
                  {/each}
                </div>
                <span class="text-gray-600 ml-2">
                  {doctorProfile.ratingAverage ? doctorProfile.ratingAverage.toFixed(1) : 'New'} 
                  {#if doctorProfile.ratingCount}
                    ({doctorProfile.ratingCount} reviews)
                  {/if}
                </span>
              </div>
            </div>
          </div>
          
          <div class="mt-6 space-y-4">
            <h2 class="text-xl font-bold">About</h2>
            <p class="text-gray-700">{doctorProfile.bio || 'No bio available.'}</p>
            
            <h2 class="text-xl font-bold">Professional Statement</h2>
            <p class="text-gray-700">{doctorProfile.professionalStatement || 'No professional statement available.'}</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {#if doctorProfile.yearsOfExperience}
                <div class="flex items-center">
                  <Award class="h-5 w-5 text-blue-500 mr-2" />
                  <span>{doctorProfile.yearsOfExperience} years of experience</span>
                </div>
              {/if}
              
              {#if doctorProfile.languages && doctorProfile.languages.length}
                <div class="flex items-center">
                  <Globe class="h-5 w-5 text-blue-500 mr-2" />
                  <span>Speaks: {doctorProfile.languages.join(', ')}</span>
                </div>
              {/if}
              
              {#if doctorProfile.consultationFee}
                <div class="flex items-center">
                  <Heart class="h-5 w-5 text-blue-500 mr-2" />
                  <span>Consultation fee: ${doctorProfile.consultationFee}</span>
                </div>
              {/if}
            </div>
            
            {#if doctorProfile.education}
              <div class="mt-6">
                <h2 class="text-xl font-bold">Education</h2>
                <ul class="mt-2 space-y-2">
                  {#each Object.entries(doctorProfile.education) as [key, value]}
                    <li class="flex items-start">
                      <span class="text-blue-500 font-bold mr-2">•</span>
                      <span>{value}</span>
                    </li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Booking Form -->
        <div class="md:w-1/3 bg-blue-50 p-6">
          <h2 class="text-xl font-bold mb-4">Book an Appointment</h2>
          
          {#if success}
            <div class="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
              {success}
              <div class="mt-2">
                <a href="/patient/appointments" class="text-blue-600 underline">View my appointments</a>
              </div>
            </div>
          {:else}
            {#if error}
              <div class="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            {/if}
            
            <form on:submit|preventDefault={handleBooking} class="space-y-4">
              <!-- Date Selection -->
              <div>
                <label for="date" class="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div class="relative">
                  <Calendar class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="date"
                    bind:value={selectedDate}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              
              <!-- Time Selection -->
              <div>
                <label for="time" class="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <div class="relative">
                  <Clock class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <select
                    id="time"
                    bind:value={selectedTime}
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!availableSlots.length}
                    required
                  >
                    <option value="">Select time</option>
                    {#each availableSlots as slot}
                      <option value={slot}>{slot}</option>
                    {/each}
                  </select>
                </div>
                
                {#if selectedDate && !availableSlots.length}
                  <p class="text-red-500 text-sm mt-1">No available slots for this date</p>
                {/if}
              </div>
              
              <!-- Appointment Type -->
              <div>
                <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Type
                </label>
                <select
                  id="type"
                  bind:value={selectedType}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="video">Video Consultation</option>
                  <option value="phone-call">Phone Call</option>
                  <option value="in-person">In-Person Visit</option>
                </select>
              </div>
              
              <!-- Notes -->
              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  bind:value={notes}
                  rows="3"
                  placeholder="Briefly describe your symptoms or reason for visit"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <!-- Submit Button -->
              <button
                type="submit"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </form>
          {/if}
        </div>
      </div>
    </div>
  </div>