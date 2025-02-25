<script lang="ts">
  import { onMount } from 'svelte';
  import { Search, Bell, Plus, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-svelte';

  let revenueChart: HTMLCanvasElement;
  let performanceChart: HTMLCanvasElement;

  interface Transaction {
    id: number;
    item: string;
    date: string;
    status: 'Completed' | 'Pending';
    icon: string;
  }

  const transactions: Transaction[] = [
    { id: 1, item: 'Consultation with Dr. Smith', date: 'Jul 12th 2024', status: 'Completed', icon: '👨‍⚕️' },
    { id: 2, item: 'Follow-up with Dr. Johnson', date: 'Jul 13th 2024', status: 'Completed', icon: '👩‍⚕️' },
  ];

  let currentMonth: Date = new Date();

  function previousMonth() {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    currentMonth = new Date(currentMonth);
  }

  function nextMonth() {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    currentMonth = new Date(currentMonth);
  }

  function getDaysInMonth(date: Date) {
    const days = [];
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDate; i++) {
      days.push(i);
    }
    return days;
  }
</script>

<div class="min-h-screen bg-gray-50 p-6">
  <header class="flex flex-col md:flex-row justify-between items-center mb-8">
    <h1 class="text-xl font-semibold">Patient</h1>
    <div class="flex items-center gap-4">
      <div class="relative">
        <input type="search" placeholder="Search a Doctor" class="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-[300px]" />
        <Search class="w-4 h-4 absolute left-3 top-3 text-gray-400" />
      </div>
      <button class="p-2 rounded-lg border border-gray-200">
        <Bell class="w-5 h-5" />
      </button>
      <button class="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
        <Plus class="w-4 h-4" />
        Book Appointment
      </button>
    </div>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <div class="col-span-12 md:col-span-8 space-y-6">
      <div class="bg-green-900 text-white p-6 rounded-xl">
        <span class="text-sm">Update</span>
        <p class="text-lg mt-2">Sales revenue increased <span class="text-green-400">40%</span> in 1 week</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-xl">
          <p class="text-gray-600">Net Income</p>
          <h2 class="text-3xl font-semibold mt-1">$193.000</h2>
        </div>
        <div class="bg-white p-6 rounded-xl">
          <p class="text-gray-600">Total Return</p>
          <h2 class="text-3xl font-semibold mt-1">$32.000</h2>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6">
        <h3 class="font-semibold mb-6">Appointments</h3>
        {#each transactions.filter(t => t.status === 'Completed') as transaction}
          <div class="flex items-center justify-between border-b border-gray-200 pb-4">
            <div class="flex items-center gap-4">
              <span class="text-2xl">{transaction.icon}</span>
              <div>
                <p class="font-medium">{transaction.item}</p>
                <p class="text-sm text-gray-500">{transaction.date}</p>
              </div>
            </div>
            <span class="text-sm text-green-600">{transaction.status}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="col-span-12 md:col-span-4 bg-white rounded-xl p-6">
      <div class="flex justify-between items-center mb-4">
        <button class="p-2" on:click={previousMonth}>
          <ChevronLeft class="w-5 h-5 text-gray-400" />
        </button>
        <h2 class="text-lg font-semibold">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
        <button class="p-2" on:click={nextMonth}>
          <ChevronRight class="w-5 h-5 text-gray-400" />
        </button>
      </div>
      <div class="grid grid-cols-7 gap-2 text-center text-gray-600">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>
      <div class="grid grid-cols-7 gap-2 mt-2">
        {#each getDaysInMonth(currentMonth) as day}
          {#if day !== null}
            <div class="p-3 rounded-lg bg-gray-100 text-center">{day}</div>
          {:else}
            <div></div>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  :global(body) {
    @apply bg-gray-50;
  }
</style>
