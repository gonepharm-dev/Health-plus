<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    
    export let form: ActionData;
</script>

<div class="min-h-screen flex flex-col items-center justify-center px-4">
    <div class="max-w-md w-full space-y-8">
        <div class="text-center">
            <h1 class="text-3xl font-bold">Forgot Password</h1>
            <p class="mt-2 text-gray-600">
                Don't worry! It happens. Please enter the
                <span class="text-blue-600">email address associated with your account</span>.
            </p>
        </div>

         <div class="mt-8 bg-[#A8CCFD] rounded-lg p-8">
            <form 
                method="POST" 
                use:enhance 
                class="space-y-6"
            >
                <div>
                    <label 
                        for="email" 
                        class="block text-left text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {#if form?.error}
                    <div class="text-red-500 text-sm">
                        {form.error}
                    </div>
                {/if}

                <button
                    type="submit"
                    class="w-1/2 mx-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#010097] hover:bg-[#010097]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#010097]"
                >
                    Submit
                </button>
            </form>
        </div>
    </div>
</div>
