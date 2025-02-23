<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    
    export let form: ActionData;
</script>

<div class="min-h-screen flex flex-col items-center justify-center bg-blue-50">
    <div class="max-w-md w-full bg-blue-200 rounded-lg shadow-lg p-8">
        <div class="text-center">
            <h1 class="text-2xl font-semibold text-gray-900">Forgot Password</h1>
            <p class="mt-2 text-gray-600">
                We'll send you reset instructions
            </p>
        </div>

        <form 
            method="POST" 
            use:enhance 
            class="mt-8 space-y-6"
        >
            <div>
                <label 
                    for="email" 
                    class="block text-sm font-medium text-gray-700"
                >
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your Email"
                    required
                    class="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            {#if form?.error}
                <div class="text-red-500 text-sm">
                    {form.error}
                </div>
            {/if}

            <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Reset Password
            </button>

            <div class="text-center">
                <a href="/login" class="text-sm text-gray-600 hover:text-blue-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Login
                </a>
            </div>
        </form>
    </div>
</div>
