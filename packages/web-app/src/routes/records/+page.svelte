<script lang="ts">
    import { User, Bell, Search, Filter } from 'lucide-svelte';
  
    interface PatientRequest {
      name: string;
      type: string;
      amount?: number;
    }
  
    interface PatientData {
      month: string;
      admissions: number;
      capacity: number;
    }
  
    let patientRequests: PatientRequest[] = [
      { name: 'Annual Checkup', type: 'Scheduling', amount: 200 },
      { name: 'X-Ray Consultation', type: 'Diagnostic', amount: 150 },
      { name: 'Vaccination', type: 'Immunization', amount: 100 },
      { name: 'Follow-up', type: 'Consultation', amount: 80 },
      { name: 'Prescription Refill', type: 'Medication', amount: 50 }
    ];
  
    let patientData: PatientData[] = [
      { month: 'Jan', admissions: 250, capacity: 300 },
      { month: 'Feb', admissions: 280, capacity: 300 },
      { month: 'Mar', admissions: 260, capacity: 300 },
      { month: 'Apr', admissions: 290, capacity: 300 },
      { month: 'May', admissions: 270, capacity: 300 },
      { month: 'Jun', admissions: 250, capacity: 300 }
    ];
  
    let patientAdmissions = [
      { month: 'Apr', used: 40, capacity: 60 },
      { month: 'May', used: 50, capacity: 50 },
      { month: 'Jun', used: 70, capacity: 30 }
    ];
  </script>
  
  <div class="min-h-screen bg-gray-100 p-4 md:p-6 font-sans">
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
      <div class="md:col-span-8 space-y-4 md:space-y-6">
        <header class="flex flex-col md:flex-row justify-between items-center">
          <h1 class="text-xl md:text-2xl font-bold mb-4 md:mb-0">Hello, Dr. Alex</h1>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Search patients"
                class="w-full md:w-64 px-3 py-2 rounded-lg bg-white border border-gray-200"
              />
              <Search class="absolute right-3 top-3 text-gray-400" size={20} />
            </div>
            <Bell />
            <User />
          </div>
        </header>
  
        <div class="bg-white p-4 md:p-6 rounded-2xl shadow-md">
          <div class="flex justify-between mb-4">
            <h2 class="text-lg md:text-xl font-semibold">Patient Overview</h2>
            <span class="text-gray-500">See details</span>
          </div>
          <div class="flex space-x-4">
            <div class="flex-1 bg-gray-100 p-4 rounded-lg">
              <div class="text-gray-500">Total Patients</div>
              <div class="text-xl md:text-2xl font-bold">150</div>
            </div>
            <div class="flex-1 bg-gray-100 p-4 rounded-lg">
              <div class="text-gray-500">New Patients</div>
              <div class="text-xl md:text-2xl font-bold">26</div>
            </div>
          </div>
        </div>
  
        <div class="bg-white p-4 md:p-6 rounded-2xl shadow-md">
          <div class="flex justify-between mb-4">
            <h2 class="text-lg md:text-xl font-semibold">Hospital Capacity</h2>
            <Filter />
          </div>
          <div class="space-y-2">
            {#each patientAdmissions as admission}
              <div class="flex items-center space-x-2">
                <div class="w-16">{admission.month}</div>
                <div class="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-orange-500 h-2 rounded-full" 
                    style="width: {admission.used}%"
                  ></div>
                </div>
                <div class="text-gray-500">{admission.used}%</div>
              </div>
            {/each}
          </div>
        </div>
  
        <div class="bg-white p-4 md:p-6 rounded-2xl shadow-md">
          <div class="flex justify-between mb-4">
            <h2 class="text-lg md:text-xl font-semibold">Patient Admissions</h2>
            <Filter />
          </div>
          <div class="h-48">
            <div class="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
              Chart Placeholder
            </div>
          </div>
        </div>
      </div>
  
      <div class="md:col-span-4 space-y-4 md:space-y-6">
        <div class="bg-orange-500 text-white p-4 md:p-6 rounded-2xl flex items-center space-x-4">
          <div>
            <div class="text-2xl md:text-3xl font-bold">7,854</div>
            <div>Total Patients</div>
          </div>
          <img 
            src="/api/placeholder/100/100?text=DR" 
            alt="Profile" 
            class="w-16 h-16 rounded-full object-cover"
          />
        </div>
  
        <div class="bg-white p-4 md:p-6 rounded-2xl">
          <div class="flex justify-between mb-4">
            <h2 class="text-lg md:text-xl font-semibold">Patient Requests</h2>
            <Filter />
          </div>
          <div class="space-y-4">
            {#each patientRequests as request}
              <div class="flex justify-between items-center">
                <div>
                  <div class="font-semibold">{request.name}</div>
                  <div class="text-gray-500">{request.type}</div>
                </div>
                {#if request.amount}
                  <div class="font-semibold">${request.amount}</div>
                {/if}
              </div>
            {/each}
          </div>
          <button class="w-full bg-black text-white py-3 rounded-lg mt-4">
            See all
          </button>
        </div>
      </div>
    </div>
  </div>