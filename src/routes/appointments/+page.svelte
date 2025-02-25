<script lang="ts">
    import { fade, fly, slide } from 'svelte/transition';

    type Appointment = {
        date: Date;
        time: string;
        doctorId: string;
        type: 'video' | 'audio' | 'chat';
        speciality: string;
        notes: string;
        symptoms: string[];
        isUrgent: boolean;
    };

    type Doctor = {
        id: string;
        name: string;
        speciality: string;
        image: string;
        rating: number;
        experience: string;
        languages: string[];
        availability: string[];
        price: number;
        about: string;
    };

    type TimeSlot = {
        time: string;
        available: boolean;
    };

    let selectedDate: Date = new Date();
    let selectedTime: string = '';
    let selectedType: 'video' | 'audio' | 'chat' = 'video';
    let selectedDoctor: string = '';
    let step = 1;

    // TODO: Replace with API call to /api/doctors
    const doctors: Doctor[] = [
        {
            id: '1',
            name: 'Dr. Sarah Johnson',
            speciality: 'General Physician',
            image: '/doctors/sarah.jpg',
            rating: 4.8,
            experience: '15 years',
            languages: ['English', 'Spanish'],
            availability: ['09:00', '10:00', '11:00', '14:00', '15:00'],
            price: 150,
            about: 'Dr. Sarah Johnson is a board-certified general physician with extensive experience in primary care.'
        },
        {
            id: '2', 
            name: 'Dr. Michael Chen',
            speciality: 'Cardiologist',
            image: '/doctors/michael.jpg',
            rating: 4.9,
            experience: '20 years',
            languages: ['English', 'Mandarin'],
            availability: ['10:00', '11:00', '13:00', '14:00', '16:00'],
            price: 200,
            about: 'Dr. Michael Chen is a leading cardiologist specializing in preventive cardiology and heart disease management.'
        }
    ];

    // TODO: Replace with API call to /api/timeslots
    function getAvailableTimeSlots(date: Date, doctorId: string): TimeSlot[] {
        // This would be an API call like:
        // const response = await fetch(`/api/timeslots?date=${date}&doctorId=${doctorId}`);
        // const slots = await response.json();
        const availableTimes = doctors.find(d => d.id === doctorId)?.availability || [];
        return availableTimes.map(time => ({
            time,
            available: true
        }));
    }

    // TODO: Replace with API call to /api/appointments
    async function handleSubmit() {
        const appointment: Appointment = {
            date: selectedDate,
            time: selectedTime,
            doctorId: selectedDoctor,
            type: selectedType,
            speciality: doctors.find(d => d.id === selectedDoctor)?.speciality || '',
            notes: '',
            symptoms: [],
            isUrgent: false
        };
        
       

        console.log('Appointment submitted:', appointment);
    }

    function formatDate(date: Date): string {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
</script>

<div class="w-full min-h-screen px-4 py-6 md:max-w-4xl md:mx-auto md:py-8 lg:py-10">
    <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">
        Schedule Your Appointment
    </h1>

    <div class="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
        <!-- Progress Steps -->
        <div class="flex justify-between mb-6 md:mb-8 overflow-x-auto" transition:slide>
            {#each Array(4) as _, i}
                <div class="flex items-center min-w-[60px] md:min-w-0">
                    <div class={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm md:text-base transition-all duration-500
                        ${step > i ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                        {i + 1}
                    </div>
                    {#if i < 3}
                        <div class={`h-1 w-full transition-all duration-500 ${step > i ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                    {/if}
                </div>
            {/each}
        </div>

        <!-- Step 1: Select Doctor -->
        {#if step === 1}
            <div 
                class="w-full"
                in:fly={{ x: -100, duration: 500, delay: 300, opacity: 0 }}
                out:fly={{ x: 100, duration: 500, opacity: 0 }}
            >
                <h2 class="text-lg md:text-xl font-semibold mb-3 md:mb-4">Select Your Doctor</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {#each doctors as doctor}
                        <button
                            class={`w-full p-3 md:p-4 rounded-lg border-2 transition-all duration-300
                                ${selectedDoctor === doctor.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                                hover:border-blue-300`}
                            on:click={() => selectedDoctor = doctor.id}
                        >
                            <div class="flex items-center space-x-3 md:space-x-4">
                                <img
                                    src={doctor.image}
                                    alt={doctor.name}
                                    class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                                />
                                <div class="text-left">
                                    <h3 class="font-semibold text-sm md:text-base">{doctor.name}</h3>
                                    <p class="text-gray-600 text-xs md:text-sm">{doctor.speciality}</p>
                                </div>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Step 2: Select Date & Time -->
        {#if step === 2}
            <div 
                class="w-full"
                in:fly={{ x: -100, duration: 500, delay: 300, opacity: 0 }}
                out:fly={{ x: 100, duration: 500, opacity: 0 }}
            >
                <h2 class="text-lg md:text-xl font-semibold mb-3 md:mb-4">Select Date & Time</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div class="w-full">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            bind:value={selectedDate}
                            class="w-full p-2 md:p-3 border rounded-lg text-sm md:text-base"
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div class="w-full">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Available Time Slots
                        </label>
                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
                            {#each getAvailableTimeSlots(selectedDate, selectedDoctor) as slot}
                                <button
                                    class={`p-2 md:p-3 rounded-lg border text-sm md:text-base transition-all duration-300
                                        ${selectedTime === slot.time ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
                                    on:click={() => selectedTime = slot.time}
                                    disabled={!slot.available}
                                >
                                    {slot.time}
                                </button>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Step 3: Appointment Type -->
        {#if step === 3}
            <div 
                class="w-full"
                in:fly={{ x: -100, duration: 500, delay: 300, opacity: 0 }}
                out:fly={{ x: 100, duration: 500, opacity: 0 }}
            >
                <h2 class="text-lg md:text-xl font-semibold mb-3 md:mb-4">Select Appointment Type</h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                    {#each ['video', 'audio', 'chat'] as type}
                        <button
                            class={`p-3 md:p-4 rounded-lg border-2 transition-all duration-300
                                ${selectedType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                                hover:border-blue-300`}
                            on:click={() => selectedType = type as typeof selectedType}
                        >
                            <div class="flex flex-col items-center space-y-2">
                                <span class="text-xl md:text-2xl">
                                    {#if type === 'video'}
                                        📹
                                    {:else if type === 'audio'}
                                        🎤
                                    {:else}
                                        💬
                                    {/if}
                                </span>
                                <span class="capitalize text-sm md:text-base">{type}</span>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Step 4: Review Appointment Details -->
        {#if step === 4}
            <div 
                class="w-full"
                in:fly={{ x: -100, duration: 500, delay: 300, opacity: 0 }}
                out:fly={{ x: 100, duration: 500, opacity: 0 }}
            >
                <h2 class="text-lg md:text-xl font-semibold mb-4 md:mb-6">Review Your Appointment</h2>
                <div class="space-y-4 md:space-y-6 bg-gray-50 p-4 md:p-6 rounded-lg">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <div>
                            <h3 class="text-sm md:text-base font-medium text-gray-700 mb-2">Selected Doctor</h3>
                            {#if selectedDoctor}
                                {@const doctor = doctors.find(d => d.id === selectedDoctor)}
                                <div class="flex items-center space-x-3">
                                    <img
                                        src={doctor?.image}
                                        alt={doctor?.name}
                                        class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p class="font-semibold text-sm md:text-base">{doctor?.name}</p>
                                        <p class="text-xs md:text-sm text-gray-600">{doctor?.speciality}</p>
                                    </div>
                                </div>
                            {/if}
                        </div>
                        <div>
                            <h3 class="text-sm md:text-base font-medium text-gray-700 mb-2">Date & Time</h3>
                            <p class="font-semibold text-sm md:text-base">{formatDate(selectedDate)}</p>
                            <p class="text-xs md:text-sm text-gray-600">{selectedTime}</p>
                        </div>
                        <div>
                            <h3 class="text-sm md:text-base font-medium text-gray-700 mb-2">Appointment Type</h3>
                            <div class="flex items-center space-x-2">
                                <span class="text-lg md:text-xl">
                                    {#if selectedType === 'video'}
                                        📹
                                    {:else if selectedType === 'audio'}
                                        🎤
                                    {:else}
                                        💬
                                    {/if}
                                </span>
                                <span class="capitalize font-semibold text-sm md:text-base">{selectedType}</span>
                            </div>
                        </div>
                        <div>
                            <h3 class="text-sm md:text-base font-medium text-gray-700 mb-2">Estimated Cost</h3>
                            <p class="font-semibold text-sm md:text-base">${doctors.find(d => d.id === selectedDoctor)?.price}</p>
                        </div>
                    </div>
                </div>
            </div>
        {/if}

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-6 md:mt-8" transition:slide>
            {#if step > 1}
                <button
                    class="px-4 md:px-6 py-2 text-sm md:text-base bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-300"
                    on:click={() => step--}
                >
                    Back
                </button>
            {:else}
                <div></div>
            {/if}

            <button
                class="px-4 md:px-6 py-2 text-sm md:text-base bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                on:click={() => {
                    if (step < 4) step++;
                    else handleSubmit();
                }}
                disabled={
                    (step === 1 && !selectedDoctor) ||
                    (step === 2 && !selectedTime) ||
                    (step === 3 && !selectedType)
                }
            >
                {step === 4 ? 'Confirm & Schedule' : 'Next'}
            </button>
        </div>
    </div>
</div>
