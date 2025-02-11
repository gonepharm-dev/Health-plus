<script lang="ts">
  import { goto } from '$app/navigation';
  
  function startInstantConsultation() {
    goto('/appointment?role=doctor');
  }
</script>

<div class=" p-8">
  <div class="max-w-3xl mx-auto text-center">
    <h1 class="text-4xl font-bold mb-10">I am the Doctor</h1>
    
    <img 
      src="medic.webp" 
      alt="Doctor" 
      class="w-72 h-72 rounded-lg mx-auto mb-8 shadow-lg"
    />
    
    <div class="space-y-6">
      <button
        on:click={startInstantConsultation}
        class="w-full max-w-md px-6 py-4 bg-green-500 text-white rounded-xl font-medium
          hover:bg-green-600 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Start Instant Consultation
      </button>
      
      <a 
        href="/patient" 
        class="block text-lg text-green-600 hover:text-green-700 underline"
      >
       Lemme see some patients
      </a>
    </div>
  </div>
</div>