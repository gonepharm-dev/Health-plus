<script lang="ts">
  import { goto } from '$app/navigation';
  
  function joinConsultation() {
    goto('/appointment?role=patient');
  }
  function home() {
    goto('/');
  }
</script>

<div class=" p-8">
  <div class="max-w-3xl mx-auto text-center">
    <h1 class="text-4xl font-bold mb-10">I am the Patient</h1>
    
    <img 
      src="patient.gif" 
      alt="Patient" 
      class="w-72 h-72 rounded-lg mx-auto mb-8 shadow-lg"
    />
    
    <div class="space-y-6">
      <button
        on:click={joinConsultation}
        class="w-full max-w-md px-6 py-4 bg-amber-500 text-white rounded-xl font-medium
          hover:bg-amber-600 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        Join Consultation
      </button>
      
      <a 
        href="/doctor" 
        class="block text-lg text-amber-600 hover:text-amber-700 underline"
      >
       Take me to the Doctor
      </a>
      <button on:click={home}>
        Home
      </button>
    </div>
  </div>
</div>