<script>
  // Benefits data array containing all the information for each card
  const benefits = [
    {
      title: "Increased Accessibility",
      description: "Telehealth eliminates geographic barriers, providing healthcare access to rural, remote, or underserved areas. Patients can consult specialists or general practitioners without the need for travel.",
      image: "telehealth with African people.png"
    },
    {
      title: "Convenience and Time-Saving",
      description: "Patients can schedule and attend consultations from the comfort of their homes, saving time and effort. This also reduces the need to take time off work or arrange childcare.",
      image: "African patient and doctor using a phone for telehealth.png"
    },
    {
      title: "Cost-Effectiveness",
      description: "Telehealth lowers costs for both patients (reduced travel and time off work) and providers (lower operational expenses), making healthcare more affordable overall.",
      image: "telehealth with one patient and a doctor.png"
    }
  ];
</script>

<!--Main Section Container-->
<section class="py-16 ">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <!--Section Header-->
    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-black sm:text-4xl mb-3">
        Benefits of Telehealth
      </h2>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Discover how telehealth is transforming healthcare delivery
      </p>
    </div>

    <!--Benefits Cards Container-->
    <div class="grid gap-8">
      {#each benefits as benefit, index}
        <!-- Individual Benefit Card -->
        <div class="bg-[#A8CCFD] rounded-2xl shadow-lg overflow-hidden">
          <!-- Card Content Layout - Alternating image position based on index -->
          <div class="flex flex-col lg:flex-row {index % 2 === 0 ? '' : 'lg:flex-row-reverse'} items-center">
            <!-- Image Container -->
            <div class="w-full lg:w-2/5 relative">
              <div class="relative h-[300px]">
                <!-- Benefit Image -->
                <img
                  src={benefit.image}
                  alt={benefit.title}
                  class="w-full h-full object-cover"
                />
                <!-- Dark Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
              </div>
            </div>
            
            <!-- Text Content Container -->
            <div class="w-full lg:w-3/5 p-6 lg:p-8">
              <!-- Benefit Title -->
              <h3 class="text-2xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <!-- Benefit Description -->
              <p class="text-base text-gray-600">
                {benefit.description}
              </p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  /* Responsive Design Adjustments */
  @media (max-width: 768px) {
    /* Adjust card spacing for mobile views */
    .grid {
      gap: 1.5rem;
    }
  }
</style>
