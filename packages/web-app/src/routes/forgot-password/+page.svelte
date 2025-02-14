<script lang="ts">
    // Importing enhance function from $app/forms for form enhancements
    import { enhance } from '$app/forms';
    // Importing ActionData type from './$types' for action data typing
    import type { ActionData } from './$types';
    
    // Exporting form state as ActionData type
    export let form: ActionData;

    // Initializing loading and successMessage state
    let loading = false;
    let successMessage = '';

    // Function to handle form submission
    async function handleSubmit(event: SubmitEvent) {
        // Setting loading state to true and resetting successMessage
        loading = true;
        successMessage = '';
        
        try {
            // Creating a new FormData object from the event target
            const formData = new FormData(event.target as HTMLFormElement);
            // Extracting email from the formData
            const email = formData.get('email');

            // Sending a POST request to the forgot-password API endpoint
            const response = await fetch('https://gonep-app.pockethost.io/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            // Parsing the response data
            const data = await response.json();

            // If the response is not OK, throwing an error
            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset email');
            }

            // Setting success message if the response is OK
            successMessage = 'Reset instructions have been sent to your email';
            // Resetting the form
            (event.target as HTMLFormElement).reset();
        } catch (error: any) {
            // Setting form error if an error occurs
            form = { error: error.message };
        } finally {
            // Setting loading state to false after the operation is complete
            loading = false;
        }
    }
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
            on:submit|preventDefault={handleSubmit}
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

            {#if successMessage}
                <div class="text-green-600 text-sm">
                    {successMessage}
                </div>
            {/if}

            <button
                type="submit"
                disabled={loading}
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {loading ? 'Sending...' : 'Reset Password'}
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
