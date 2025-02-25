<script lang="ts">
    import { Search, Filter, X, Star } from 'lucide-svelte';
    
    export let data;
    
    let searchTerm = '';
    let specializationFilter = 'all';
    let sortBy = 'rating';
    
    $: filteredDoctors = data.doctors.filter(doctor => {
      const name = doctor.full_name?.toLowerCase() || '';
      const specialization = doctor.specialization?.toLowerCase() || '';
      
      const matchesSearch = !searchTerm || 
        name.includes(searchTerm.toLowerCase()) || 
        specialization.includes(searchTerm.toLowerCase());
        
      const matchesSpecialization = specializationFilter === 'all' || 
        doctor.specialization === specializationFilter;
      
      return matchesSearch && matchesSpecialization;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.ratingAverage || 0) - (a.ratingAverage || 0);
      } else if (sortBy === 'experience') {
        return (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0);
      } else { // name
        return (a.full_name || '').localeCompare(b.full_name || '');
      }
    });
    
    // Get unique specializations
    $: specializations = Array.from(new Set(
      data.doctors.map(doctor => doctor.specialization).filter(Boolean)
    ));
  </script>
  
  <div class="space-y-8 animate-fade-in-up">
    <div>
      <h1 class="text-2xl font-bold">Find a Doctor</h1>
      <p class="text-gray-600">Search and book appointments with our specialists</p>
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
              placeholder="Search by name or specialization"
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
        
        <!-- Specialization Filter -->
        <div class="w-full sm:w-auto">
          <div class="flex items-center space-x-2">
            <Filter class="h-5 w-5 text-gray-500" />
            <select
              bind:value={specializationFilter}
              class="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Specializations</option>
              {#each specializations as specialization}
                <option value={specialization}>{specialization}</option>
              {/each}
            </select>
          </div>
        </div>
        
        <!-- Sort By -->
        <div class="w-full sm:w-auto">
            <div class="flex items-center space-x-2">
              <span class="text-gray-500">Sort by:</span>
              <select
                bind:value={sortBy}
                class="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="rating">Rating</option>
                <option value="experience">Experience</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Doctor List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#if filteredDoctors.length === 0}
          <div class="col-span-full bg-gray-50 p-6 rounded-lg text-center">
            <p class="text-gray-600">No doctors found with the current filters</p>
            <button 
              on:click={() => { searchTerm = ''; specializationFilter = 'all'; }}
              class="mt-2 text-blue-500 underline"
            >
              Clear filters
            </button>
          </div>
        {:else}
          {#each filteredDoctors as doctor}
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div class="p-4">
                <div class="flex items-start">
                  <div class="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4 overflow-hidden">
                    {#if doctor.avatar}
                      <img src={doctor.avatar} alt="Doctor" class="h-full w-full object-cover" />
                    {:else}
                      <span class="text-xl font-bold text-blue-600">
                        {doctor.full_name?.charAt(0) || 'D'}
                      </span>
                    {/if}
                  </div>
                  
                  <div class="flex-1">
                    <h3 class="font-bold text-lg">Dr. {doctor.full_name}</h3>
                    <p class="text-blue-600">{doctor.specialization}</p>
                    
                    <div class="flex items-center mt-1">
                      <div class="flex">
                        {#each Array(5) as _, i}
                          <Star 
                            class="h-4 w-4 {i < (doctor.ratingAverage || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}"
                          />
                        {/each}
                      </div>
                      <span class="text-sm text-gray-600 ml-1">
                        {doctor.ratingAverage ? doctor.ratingAverage.toFixed(1) : 'New'} 
                        {#if doctor.ratingCount}
                          ({doctor.ratingCount})
                        {/if}
                      </span>
                    </div>
                    
                    {#if doctor.yearsOfExperience}
                      <p class="text-sm text-gray-600 mt-1">{doctor.yearsOfExperience} years experience</p>
                    {/if}
                  </div>
                </div>
                
                <div class="mt-4">
                  <a 
                    href={`/patient/doctors/${doctor.id}`}
                    class="w-full block text-center py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>