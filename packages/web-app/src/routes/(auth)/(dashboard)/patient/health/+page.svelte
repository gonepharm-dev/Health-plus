<script lang="ts">
    import { format } from 'date-fns';
    import { FileText, Download, Search, X } from 'lucide-svelte';
    
    export let data;
    
    let searchTerm = '';
    
    $: filteredRecords = data.records.filter(record => {
      const searchTermLower = searchTerm.toLowerCase();
      const diagnosis = record.diagnosis?.toLowerCase() || '';
      const prescription = record.prescription?.toLowerCase() || '';
      const doctorName = record.expand?.doctor?.full_name?.toLowerCase() || '';
      
      return !searchTerm || 
        diagnosis.includes(searchTermLower) || 
        prescription.includes(searchTermLower) ||
        doctorName.includes(searchTermLower);
    });
  </script>
  
  <div class="space-y-8 animate-fade-in-up">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">My Health Records</h1>
    </div>
    
    {#if data.error}
      <div class="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded">
        {data.error}
      </div>
    {/if}
    
    <!-- Search -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div class="relative">
        <Search class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          bind:value={searchTerm}
          placeholder="Search your medical records"
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
    
    <!-- Records List -->
    {#if filteredRecords.length === 0}
      <div class="bg-gray-50 p-6 rounded-lg text-center">
        <p class="text-gray-600">
          {data.records.length === 0 
            ? 'No medical records found' 
            : 'No records match your search'}
        </p>
        
        {#if searchTerm}
          <button 
            on:click={() => searchTerm = ''}
            class="mt-2 text-blue-500 underline"
          >
            Clear search
          </button>
        {/if}
      </div>
    {:else}
      <div class="space-y-4">
        {#each filteredRecords as record}
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-4">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-bold text-lg">
                    {record.diagnosis || 'Medical Record'}
                  </h3>
                  <p class="text-gray-600">
                    {format(new Date(record.Date), 'MMMM d, yyyy')}
                  </p>
                </div>
                
                {#if record.expand?.doctor}
                  <div class="text-right">
                    <p class="text-sm text-gray-500">Doctor</p>
                    <p class="font-medium">Dr. {record.expand.doctor.full_name}</p>
                  </div>
                {/if}
              </div>
              
              {#if record.prescription}
                <div class="mt-4">
                  <h4 class="font-medium text-gray-700">Prescription</h4>
                  <p class="text-gray-600 mt-1">{record.prescription}</p>
                </div>
              {/if}
              
              {#if record.attachments && Object.keys(record.attachments).length > 0}
                <div class="mt-4">
                  <h4 class="font-medium text-gray-700">Attachments</h4>
                  <div class="mt-2 flex flex-wrap gap-2">
                    {#each Object.values(record.attachments) as attachment}
                      <div class="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                        <FileText class="h-4 w-4 mr-1" />
                        <span class="text-sm mr-1">{attachment.name || 'File'}</span>
                        <a href="#" class="text-blue-500 hover:text-blue-700">
                          <Download class="h-4 w-4" />
                        </a>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
              
              <div class="mt-4 text-right">
                <a 
                  href={`/patient/health/${record.id}`}
                  class="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  View details
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>