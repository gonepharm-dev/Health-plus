<script lang="ts">
    import type { UserRegistrationData } from '$lib/types/auth';
    
    export let formData: Partial<UserRegistrationData>;
    let passwordError = '';
    
    function validatePassword() {
        if (formData.password !== formData.confirmPassword) {
            passwordError = 'Passwords do not match';
        } else {
            passwordError = '';
        }
    }
</script>

<div class="space-y-6">
    <div>
        <label for="username" class="block text-sm font-medium text-gray-700">
            Username
        </label>
        <input
            type="text"
            id="username"
            bind:value={formData.username}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
        />
    </div>

    <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
            Email
        </label>
        <input
            type="email"
            id="email"
            bind:value={formData.email}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
        />
    </div>

    <div>
        <label for="password" class="block text-sm font-medium text-gray-700">
            Password
        </label>
        <input
            type="password"
            id="password"
            bind:value={formData.password}
            on:input={validatePassword}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
        />
    </div>

    <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
            Confirm Password
        </label>
        <input
            type="password"
            id="confirmPassword"
            bind:value={formData.confirmPassword}
            on:input={validatePassword}
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
        />
        {#if passwordError}
            <p class="mt-2 text-sm text-red-600">{passwordError}</p>
        {/if}
    </div>
</div>