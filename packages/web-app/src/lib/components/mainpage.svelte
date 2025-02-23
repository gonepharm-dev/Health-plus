<script lang="ts">
  import { ArrowRight } from 'lucide-svelte';
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
  <!-- Background Dots Pattern -->
  <div class="absolute right-0 top-0 w-1/2 h-full">
    <div class="grid grid-cols-10 gap-4">
      {#each Array(100) as _}
        <div class="w-1 h-1 rounded-full bg-blue-100/50"></div>
      {/each}
    </div>
  </div>

  <!-- Curved Line -->
  <div class="absolute bottom-0 left-0 w-full h-full pointer-events-none">
    <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path 
        d="M0,80 Q30,70 60,85 T100,75" 
        fill="none" 
        stroke="#E2E8F0" 
        stroke-width="0.5"
        class="opacity-50"
      />
    </svg>
  </div>

  <!-- Main Content -->
  <main class="container mx-auto px-4 py-12 md:py-24 relative z-10">
    <div class="grid md:grid-cols-2 gap-8 items-center">
      <!-- Left Column -->
      <div class="space-y-6">
        <h1 class="text-4xl md:text-5xl font-bold">
          <span class="text-blue-700">Health</span>
          <span class="text-green-500">Plus</span>
          <div class="w-48 h-1 bg-orange-500 mt-2"></div>
        </h1>
        
        <p class="text-gray-600 text-lg max-w-md">
          Experience convenient, affordable, and reliable care with Gonep. Our tele-health app brings expert consultations and treatment to your homes—anytime, anywhere.
        </p>
        
        <p class="text-gray-500">
          Sign up now to take control of your health with ease.
        </p>
        
        <a href="/signup" class="bg-blue-900 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-blue-800 transition-colors inline-block w-40">
          Get Started
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>
      
      <!-- Right Column -->
      <div class="relative mt-12">
        <div class="w-full aspect-square rounded-full bg-blue-900 overflow-hidden">
          <video
            src="/telehealthvideo.mp4"
            autoplay
            loop
            muted
            playsinline
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </main>
</div>

<style lang="postcss">
  /* Optional: Add any custom styles here if needed */
</style>