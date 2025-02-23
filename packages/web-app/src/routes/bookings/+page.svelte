<script lang="ts">
  import { writable } from 'svelte/store';
  import { CheckCircle } from 'lucide-svelte';

  type AppointmentData = {
    treatment: string;
    doctor: string;
    time: string;
    patientDetails: {
      name: string;
      email: string;
      phone: string;
    };
  };

  const initialData: AppointmentData = {
    treatment: '',
    doctor: '',
    time: '',
    patientDetails: {
      name: '',
      email: '',
      phone: ''
    }
  };

  const appointmentData = writable<AppointmentData>(initialData);

  const steps = ['Service', 'Time', 'Details', 'Done'];
  let currentStep = 0;

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  function handleNext() {
    if (currentStep < steps.length - 1) {
      currentStep++;
    }
  }

  $: progressWidth = `${((currentStep + 1) / steps.length) * 100}%`;
</script>

<div class="min-h-screen bg-[#DBEAFE] flex flex-col lg:flex-row">
  <!-- Form Section -->
  <div class="w-full lg:w-2/3 p-6 lg:p-12 flex items-start justify-center lg:justify-start">
    <div class="bg-[#A8CCFD] backdrop-blur-sm rounded-3xl p-8 lg:p-12 w-full max-w-md lg:max-w-2xl shadow-xl mt-8 lg:mt-16 lg:ml-16">
      <h1 class="text-3xl lg:text-4xl font-bold mb-8 text-blue-900">Book Appointment</h1>
      
      <!-- Progress Bar -->
      <div class="mb-10">
        <div class="flex justify-between mb-3">
          {#each steps as step, i}
            <span class="text-sm lg:text-base {i === currentStep ? 'text-blue-700 font-semibold' : 'text-gray-400'}">
              {step}
            </span>
          {/each}
        </div>
        <div class="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
            style="width: {progressWidth}"
          ></div>
        </div>
      </div>

      {#if currentStep === 0}
        <!-- Service Selection Form -->
        <form on:submit|preventDefault={handleNext} class="space-y-8">
          <div class="space-y-6">
            <div class="space-y-2">
              <label for="treatment" class="block text-sm font-medium text-gray-700">
                Treatment
              </label>
              <input
                id="treatment"
                type="text"
                bind:value={$appointmentData.treatment}
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                placeholder="Enter treatment"
                required
              />
            </div>

            <div class="space-y-2">
              <label for="doctor" class="block text-sm font-medium text-gray-700">
                Doctor
              </label>
              <input
                id="doctor"
                type="text"
                bind:value={$appointmentData.doctor}
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                placeholder="Enter doctor's name"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            class="w-full lg:w-32 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-semibold"
          >
            Next
          </button>
        </form>
      {:else if currentStep === 1}
        <!-- Time Selection -->
        <form on:submit|preventDefault={handleNext} class="space-y-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {#each timeSlots as time}
              <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="time"
                  value={time}
                  bind:group={$appointmentData.time}
                  class="mr-3"
                  required
                />
                <span class="text-sm">{time}</span>
              </label>
            {/each}
          </div>

          <button
            type="submit"
            class="w-full lg:w-32 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-semibold"
          >
            Next
          </button>
        </form>
      {:else if currentStep === 2}
        <!-- Patient Details Form -->
        <form on:submit|preventDefault={handleNext} class="space-y-8">
          <div class="space-y-6">
            <div class="space-y-2">
              <label for="name" class="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                bind:value={$appointmentData.patientDetails.name}
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                bind:value={$appointmentData.patientDetails.email}
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            <div class="space-y-2">
              <label for="phone" class="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                bind:value={$appointmentData.patientDetails.phone}
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            class="w-full lg:w-32 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-semibold"
          >
            Next
          </button>
        </form>
      {:else}
        <!-- Success Message -->
        <div class="text-center space-y-6">
          <div class="flex justify-center">
            <CheckCircle class="w-20 h-20 text-green-500" />
          </div>
          <h2 class="text-2xl font-bold text-gray-800">Appointment Booked!</h2>
          <p class="text-gray-600">
            Thank you for booking your appointment. We've sent a confirmation email with all the details.
          </p>
          
          <!-- Appointment Summary -->
          <div class="mt-8 text-left bg-gray-50 p-6 rounded-lg">
            <h3 class="font-semibold mb-4 text-lg">Appointment Details:</h3>
            <div class="space-y-3 text-sm">
              <p><span class="text-gray-500">Treatment:</span> {$appointmentData.treatment}</p>
              <p><span class="text-gray-500">Doctor:</span> {$appointmentData.doctor}</p>
              <p><span class="text-gray-500">Time:</span> {$appointmentData.time}</p>
              <p><span class="text-gray-500">Patient:</span> {$appointmentData.patientDetails.name}</p>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Image Section -->
  <div class="hidden lg:block w-full lg:w-1/3 relative">
    <div 
      class="absolute inset-0 bg-cover bg-center"
      style="background-image: url(/doc.jpg);"
    ></div>
    <div class="absolute inset-0 bg-gradient-to-t from-blue-500/30 to-blue-100/20 backdrop-blur-[2px]"></div>
  </div>
</div>