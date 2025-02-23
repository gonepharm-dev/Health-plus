<script lang="ts">
    import type { UserRegistrationData } from '$lib/types/auth';
    
    export let formData: Partial<UserRegistrationData>;
    
    let roleOptions = [
        { value: 'patient', label: 'Patient' },
        { value: 'doctor', label: 'Doctor' }
    ];
</script>

<div class="space-y-6">
    <div>
        <label for="full_name" class="block text-sm font-medium text-gray-700">
            Full Name
        </label>
        <input
            type="text"
            id="full_name"
            bind:value={formData.full_name}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
        />
    </div>

    <div>
        <label for="contact_number" class="block text-sm font-medium text-gray-700">
            Contact Number
        </label>
        <input
            type="tel"
            id="contact_number"
            bind:value={formData.contact_number}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
        />
    </div>

    <div>
        <label for="role" class="block text-sm font-medium text-gray-700">
            Role
        </label>
        <select
            id="role"
            bind:value={formData.role}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
        >
            <option value="">Select a role</option>
            {#each roleOptions as option}
                <option value={option.value}>{option.label}</option>
            {/each}
        </select>
    </div>

    {#if formData.role === 'doctor'}
        <div>
            <label for="specialization" class="block text-sm font-medium text-gray-700">
                Specialization
            </label>
            <input
                type="text"
                id="specialization"
                bind:value={formData.specialization}
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
            />
        </div>
    {/if}
</div>
