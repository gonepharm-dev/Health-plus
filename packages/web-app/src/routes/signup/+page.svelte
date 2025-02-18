<script lang="ts">
    import { enhance } from '$app/forms';
    import { slide } from 'svelte/transition';
    
    let loading = false;
    let error = '';
    let success = '';
    
    interface FormData {
        username: string;
        full_name: string;
        email: string;
        password: string;
        confirmPassword: string;
        role: 'patient' | 'doctor';
        contact_number: string;
        specialization?: string;
    }
    
    let formData: FormData = {
        username: '',
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'patient',
        contact_number: '',
        specialization: ''
    };
    
    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        loading = true;
        error = '';
        success = '';
        
        try {
            const response = await fetch('http://localhost:3001/api/collections/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    emailVisibility: true,
                    passwordConfirm: formData.confirmPassword,
                    active: true
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            
            success = 'Registration successful! Please check your email for verification.';
            formData = {
                username: '',
                full_name: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'patient',
                contact_number: '',
                specialization: ''
            };
        } catch (err: any) {
            error = err.message || 'An error occurred during registration';
        } finally {
            loading = false;
        }
    };

    $: isPasswordMatch = formData.password === formData.confirmPassword;
    $: isPasswordValid = formData.password.length >= 8;
    $: isFormValid = isPasswordMatch && isPasswordValid && formData.username && formData.email && 
                     formData.full_name && formData.contact_number && 
                     (formData.role !== 'doctor' || (formData.role === 'doctor' && formData.specialization));
</script>

<div class="flex min-h-screen">
    <!-- Left Panel - Hidden on mobile -->
    <div class="hidden p-8 md:block md:w-1/3">
        <div class="flex h-full flex-col justify-between rounded-2xl bg-[#1D5DEC] p-8 text-white">
            <div class="px-2 pt-12">
                <h1 class="font-sm mb-14 text-xl">GONEP</h1>
                <p class="pt-12 text-5xl leading-tight">
                    Start your <br /> journey with us.
                </p>
                <p class="mt-8 text-lg font-thin leading-snug text-gray-300">
                    Get access to the best healthcare <br /> services and professional doctors <br /> in kenya
                </p>
            </div>

            <div class="w-full p-2">
                <div class="h-full rounded-lg bg-blue-700 p-6 dark:bg-gray-800">
                    <p class="mb-6 leading-relaxed text-gray-200 dark:text-gray-300">
                        Clinic at Hand brought quality healthcare right to my doorstep. It's a game-changer for
                        rural communities like mine.
                    </p>
                    <div class="inline-flex items-center">
                        <img src="/doc.jpg" alt="" class="mr-3 h-10 w-10 rounded-xl" />
                        <div class="flex flex-grow flex-col">
                            <span class="title-font font-medium text-gray-200">John Mutiso</span>
                            <span class="text-sm text-gray-200 dark:text-gray-400">Doctor</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Right Panel -->
    <div class="flex w-full flex-col p-8 md:w-2/3 md:p-16">
        <div class="w-full max-w-2xl mx-auto mt-10">
            <div class="mb-12">
                <h2 class="text-3xl font-meduim text-gray-900">Create an Account</h2>
            </div>
            
            {#if error}
                <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600" transition:slide>
                    {error}
                </div>
            {/if}
            
            {#if success}
                <div class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600" transition:slide>
                    {success}
                </div>
            {/if}
            
            <form class="space-y-6" on:submit={handleSubmit}>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="username" class="block text-base font-thin text-gray-600">Username</label>
                        <input
                            type="text"
                            id="username"
                            bind:value={formData.username}
                            class="mt-1 block w-full rounded-md border border-gray-400 bg-transparent px-3 py-3 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                            required
                        />
                    </div>
                    
                    <div>
                        <label for="full_name" class="block text-base font-thin text-gray-700">Full Name</label>
                        <input
                            type="text"
                            id="full_name"
                            bind:value={formData.full_name}
                            class="mt-1 block w-full rounded-md border bg-transparent border-gray-400 px-3 py-3  focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                            required
                        />
                    </div>
                </div>
                
                <div>
                    <label for="email" class="block text-base font-thin text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        bind:value={formData.email}
                        class="mt-1 block w-full rounded-md border bg-transparent border-gray-400 px-3 py-3  focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                        required
                    />
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label for="password" class="block text-base font-thin text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            bind:value={formData.password}
                            class="mt-1 block w-full rounded-md border bg-transparent border-gray-400 px-3 py-3  focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                            required
                            minlength="8"
                        />
                        {#if formData.password && !isPasswordValid}
                            <p class="mt-1 text-sm text-red-600">Password must be at least 8 characters long</p>
                        {/if}
                    </div>
                    
                    <div>
                        <label for="confirmPassword" class="block text-base font-thin text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            bind:value={formData.confirmPassword}
                            class="mt-1 block w-full rounded-md border bg-transparent border-gray-400 px-3 py-3  focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                            required
                        />
                        {#if formData.confirmPassword && !isPasswordMatch}
                            <p class="mt-1 text-base text-red-600">Passwords do not match</p>
                        {/if}
                    </div>
                </div>
                
                <div>
                    <label for="contact_number" class="block text-base font-thin text-gray-700">Contact Number</label>
                    <input
                        type="tel"
                        id="contact_number"
                        bind:value={formData.contact_number}
                        class="mt-1 block w-full rounded-md border bg-transparent border-gray-400 px-3 py-3  focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                        required
                        pattern="[0-9]+"
                        title="Please enter a valid phone number"
                    />
                </div>
                
                <div>
                    <label for="account type" class="block text-base font-thin text-gray-700">Account Type</label>
                    <div class="mt-2 grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            class="flex items-center justify-center px-4 py-3 border rounded-lg {formData.role === 'patient' ? 'border-[#3b82f6] bg-blue-50 text-[#3b82f6]' : 'border-gray-400 text-gray-700'}"
                            on:click={() => formData.role = 'patient'}
                        >
                            <span class="font-medium">Patient</span>
                        </button>
                        
                        <button
                            type="button"
                            class="flex items-center justify-center px-4 py-5 border rounded-lg {formData.role === 'doctor' ? 'border-[#3b82f6] bg-blue-50 text-[#3b82f6]' : 'border-gray-400 text-gray-700'}"
                            on:click={() => formData.role = 'doctor'}
                        >
                            <span class="font-medium">Doctor</span>
                        </button>
                    </div>
                </div>
                
                {#if formData.role === 'doctor'}
                    <div transition:slide>
                        <label for="specialization" class="block text-sm font-medium text-gray-700">Specialization</label>
                        <input
                            type="text"
                            id="specialization"
                            bind:value={formData.specialization}
                            class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-3  focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                            required
                        />
                    </div>
                {/if}
                
                <div>
                    <button
                        type="submit"
                        class="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1D5DEC] hover:bg-[#1D5DEC]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || !isFormValid}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </div>
                
                <div class="text-center text-sm text-gray-600">
                    Already have an account?
                    <a href="/login" class="font-medium text-[#3b82f6] hover:text-[#3b82f6]/90">Sign in</a>
                </div>
            </form>
        </div>
    </div>
</div>