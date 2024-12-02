<script lang="ts">
    // TypeScript interface for feature items
    interface Feature {
      title: string;
      description: string;
      icon: string;
    }
  
    // Array of features to be displayed in the features grid
    // Each feature contains a title, description, and an icon (currently using emojis as placeholders)
    const features: Feature[] = [
      {
        title: "Virtual Consultations",
        description: "Connect with doctors remotely from the comfort of your home.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>`
      },
      {
        title: "Appointment Scheduling",
        description: "Book and manage your healthcare appointments online.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>`
      },
      {
        title: "Health Records Access",
        description: "View and store your medical records securely.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>`
      }
    ];
  </script>
  
  <main class="min-h-screen">
    <!-- Hero Section: Contains the main landing content -->
    <div class="container mx-auto px-4 py-12 md:py-24">
      <!-- Flex container for hero content - stacks vertically on mobile, horizontal on desktop -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-8">
        
        <!-- Left Section: Decorative Icons -->
        <div class="w-full md:w-1/2">
          <div class="max-w-md mx-auto">
            <img 
              src="/WhatsApp Image 2024-12-02 at 11.08.43_888534f3.jpg" 
              alt="Health Plus Hero" 
              class="w-full h-auto object-contain"
            />
          </div>
        </div>
  
        <!-- Right Section: Main heading and CTA button -->
        <div class="w-full md:w-1/2 text-center md:text-left">
          <!-- Main heading with highlighted "Plus" text and underline -->
          <div class="relative">
            <h1 class="text-4xl md:text-6xl font-bold mb-4">
              Health <span class="text-[#00D001]">Plus</span>
            </h1>
            <!-- Green underline -->
            <div class="absolute -bottom-4 left-0 w-48 h-1 bg-[#00D001]"></div>
          </div>
          
          <!-- CTA Button container -->
          <div class="mt-12 ml-40">
            <a href="/signup" class="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2 w-40">
              Get Started 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
  
      <!-- Features Grid Section -->
      <div class="mt-4 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
        {#each features as feature}
          <div class="text-center p-4 md:p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div class="mb-6 flex justify-center text-black">
              {@html feature.icon}
            </div>
            <h3 class="text-lg md:text-xl font-semibold text-[#1e3a8a] mb-3">{feature.title}</h3>
            <p class="text-sm md:text-base text-gray-600">{feature.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </main>
  
  <style>
    /* Custom styles can be added here if needed */
    /* Currently using Tailwind classes for styling */
  </style>
  