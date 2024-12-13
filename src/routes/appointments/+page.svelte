<script lang="ts">
    import { fade } from 'svelte/transition';

    type Appointment = {
        id: string;
        date: Date;
        time: string;
        doctorId: string;
        speciality: string;
        type: 'video' | 'audio' | 'chat';
        status: 'pending' | 'confirmed' | 'cancelled';
    };

    type Doctor = {
        id: string;
        name: string;
        speciality: string;
        image: string;
        availability: string[];
    };

    let selectedDate: Date = new Date();
    let selectedTime: string = '';
    let selectedType: 'video' | 'audio' | 'chat' = 'video';
    let selectedDoctor: string = '';
    let step = 1;

    // Mock data - replace with actual API calls
    const doctors: Doctor[] = [
        {
            id: '1',
            name: 'Dr. Sarah Johnson',
            speciality: 'General Physician',
            image: '/doctors/sarah.jpg',
            availability: ['09:00', '10:00', '11:00', '14:00', '15:00']
        },
        // Add more doctors...
    ];

    function getAvailableTimeSlots(date: Date, doctorId: string): string[] {
        // In real app, this would be an API call
        return doctors.find(d => d.id === doctorId)?.availability || [];
    }

    function handleSubmit() {
        // Handle appointment submission
        console.log({
            date: selectedDate,
            time: selectedTime,
            doctorId: selectedDoctor,
            type: selectedType
        });
    }
</script>

<div class="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
    <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Schedule Your Appointment
    </h1>

    <div class="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <!-- Progress Steps -->
        <div class="flex justify-between mb-8">
            {#each Array(3) as _, i}
                <div class="flex items-center">
                    <div class={`w-8 h-8 rounded-full flex items-center justify-center 
                        ${step > i ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                        {i + 1}
                    </div>
                    {#if i < 2}
                        <div class={`h-1 w-full ${step > i ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                    {/if}
                </div>
            {/each}
        </div>

        <!-- Step 1: Select Doctor -->
        {#if step === 1}
            <div transition:fade>
                <h2 class="text-xl font-semibold mb-4">Select Your Doctor</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {#each doctors as doctor}
                        <button
                            class={`p-4 rounded-lg border-2 transition-all
                                ${selectedDoctor === doctor.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                                hover:border-blue-300`}
                            on:click={() => selectedDoctor = doctor.id}
                        >
                            <div class="flex items-center space-x-4">
                                <img
                                    src={doctor.image}
                                    alt={doctor.name}
                                    class="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h3 class="font-semibold">{doctor.name}</h3>
                                    <p class="text-gray-600">{doctor.speciality}</p>
                                </div>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Step 2: Select Date & Time -->
        {#if step === 2}
            <div transition:fade>
                <h2 class="text-xl font-semibold mb-4">Select Date & Time</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            bind:value={selectedDate}
                            class="w-full p-2 border rounded-lg"
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Available Time Slots
                        </label>
                        <div class="grid grid-cols-2 gap-2">
                            {#each getAvailableTimeSlots(selectedDate, selectedDoctor) as time}
                                <button
                                    class={`p-2 rounded-lg border transition-all
                                        ${selectedTime === time ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
                                    on:click={() => selectedTime = time}
                                >
                                    {time}
                                </button>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Step 3: Appointment Type -->
        {#if step === 3}
            <div transition:fade>
                <h2 class="text-xl font-semibold mb-4">Select Appointment Type</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {#each ['video', 'audio', 'chat'] as type}
                        <button
                            class={`p-4 rounded-lg border-2 transition-all
                                ${selectedType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                                hover:border-blue-300`}
                            on:click={() => selectedType = type as typeof selectedType}
                        >
                            <div class="flex flex-col items-center space-y-2">
                                <span class="text-2xl">
                                    {#if type === 'video'}
                                        📹
                                    {:else if type === 'audio'}
                                        🎤
                                    {:else}
                                        💬
                                    {/if}
                                </span>
                                <span class="capitalize">{type}</span>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8">
            {#if step > 1}
                <button
                    class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    on:click={() => step--}
                >
                    Back
                </button>
            {:else}
                <div></div>
            {/if}

            <button
                class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                on:click={() => {
                    if (step < 3) step++;
                    else handleSubmit();
                }}
                disabled={
                    (step === 1 && !selectedDoctor) ||
                    (step === 2 && !selectedTime) ||
                    (step === 3 && !selectedType)
                }
            >
                {step === 3 ? 'Schedule Appointment' : 'Next'}
            </button>
        </div>
    </div>
</div>
