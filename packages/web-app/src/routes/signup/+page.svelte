<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth';
  import { verificationStore } from '$lib/stores/verification';
  import { register, verifyEmail, loginWithGoogle } from '$lib/api/auth';
  import GoogleIcon from '$lib/assets/google.svg';

  export let data; // Get the data from +page.ts

  let step = 1;
  let loading = false;
  let error: string | null = null;
  let success: string | null = null;
  let verificationToken = '';
  // Add this at the top of your script
type UserRole = 'patient' | 'doctor' | 'admin';
let userEmail = ''; // Store email for display


  // Form validation states
  let formData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient' as UserRole, // Use the UserRole type
    contact_number: '',
    specialization: '',
    full_name: ''
};

  // Improved validation
  $: isPasswordValid = formData.password.length >= 8;
  $: isPasswordMatch = formData.password === formData.confirmPassword;
  $: isFormValid = 
      formData.username?.trim() && 
      formData.email?.trim() && 
      isPasswordValid && 
      isPasswordMatch && 
      formData.contact_number?.trim() && 
      formData.full_name?.trim() && 
      (formData.role !== 'doctor' || formData.specialization?.trim());

  // Enhanced registration handler
  async function handleSubmit(event: Event) {
      event.preventDefault();
      if (!isFormValid || loading) return;

      loading = true;
      error = null;
      success = null;

      try {
          const response = await register(formData);
          
          // Store verification data
          verificationStore.setVerificationData(formData.email, response.data?.verificationToken);
          
          // Move to verification step
          step = 2;
          success = 'Please check your email for the verification code.';
      } catch (err: any) {
          error = err.message || 'Registration failed. Please try again.';
          console.error('Registration error:', err);
      } finally {
          loading = false;
      }
  }

  // Enhanced verification handler
  async function handleVerification() {
    if (!verificationToken.match(/^[0-9]{6}$/)) {
        error = 'Please enter a valid 6-digit code';
        return;
    }
    
    if (loading) return;

    loading = true;
    error = null;
    success = null;

    try {
        console.log('Starting verification process...');
        const response = await verifyEmail(verificationToken);
        console.log('Verification response:', response);

        if (response.status === "success") {
            success = response.message || 'Email verified successfully!';
            
            if (response.data) {
                auth.setUser(response.data);
            }
            
            // Clear verification store
            verificationStore.clear();
            
            // Show success message before redirect
            await new Promise(resolve => setTimeout(resolve, 1500));
            goto('/dashboard');
        } else {
            throw new Error(response.message || 'Verification failed');
        }
    } catch (err: any) {
        console.error('Verification error:', err);
        error = err.message || 'Verification failed. Please try again.';
    } finally {
        loading = false;
    }
}
  // Enhanced Google signup handler
  async function handleGoogleSignup() {
      if (loading) return;
      
      loading = true;
      error = null;

      try {
          const params = new URLSearchParams({
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
              response_type: 'code',
              scope: 'email profile',
              access_type: 'offline',
              prompt: 'consent'
          });

          window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      } catch (err: any) {
          error = err.message || 'Google sign-up failed';
          loading = false;
      }
  }

  // Handle Google OAuth callback
  onMount(() => {
      if (data.code) {
          handleGoogleCallback(data.code);
      }
  });

  async function handleGoogleCallback(code: string) {
      loading = true;
      error = null;

      try {
          const response = await loginWithGoogle(code, import.meta.env.VITE_GOOGLE_REDIRECT_URI);
          
          if (response.data?.record) {
              auth.setUser(response.data.record);
              auth.setToken(response.data.token);
              goto('/dashboard');
          } else {
              throw new Error('Invalid response from Google login');
          }
      } catch (err: any) {
          error = err.message || 'Google login failed';
          console.error('Google login error:', err);
      } finally {
          loading = false;
      }
  }

  // Reset error/success messages when switching steps
  $: if (step) {
      error = null;
      success = null;
  }
</script>

<!-- Step 1: Registration Form -->
{#if step === 1}
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
              <div class="h-full rounded-lg bg-blue-700 p-6">
                  <p class="mb-6 leading-relaxed text-gray-200">
                      Clinic at Hand brought quality healthcare right to my doorstep. It's a game-changer for
                      rural communities like mine.
                  </p>
                  <div class="inline-flex items-center">
                      <img src="/doc.jpg" alt="" class="mr-3 h-10 w-10 rounded-xl" />
                      <div class="flex flex-grow flex-col">
                          <span class="title-font font-medium text-gray-200">John Mutiso</span>
                          <span class="text-sm text-gray-200">Doctor</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>

  <!-- Right Panel: Registration Form -->
  <div class="flex w-full flex-col p-8 md:w-2/3 md:p-16 max-w-4xl mx-auto">
    <div>
      
    </div>
    <h1 class="text-4xl mb-10 ">Create Account</h1>
    <form class="space-y-4 " on:submit={handleSubmit}>
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
      <button
      on:click={handleGoogleSignup}
      class="w-full mb-6 flex items-center justify-center gap-3 py-4 px-4 border border-gray-400 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
      disabled={loading}
  >
      <img src={GoogleIcon} alt="icon" class="w-6 h-6">
      Continue with Google
  </button>
  </form>
  </div>
</div>

<!-- Step 2: OTP Verification -->
{:else}
<div class="min-h-screen flex items-center justify-center px-4 bg-gray-50">
    <div class="max-w-md w-full space-y-8">
        <div class="text-center">
            <h2 class="mt-6 text-3xl font-bold text-gray-900">Verify your email</h2>
            <p class="mt-2 text-sm text-gray-600">
                We've sent a verification code to {userEmail}
            </p>
        </div>

        {#if error}
            <div class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600" transition:slide>
                {error}
            </div>
        {/if}

        {#if success}
            <div class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600" transition:slide>
                {success}
            </div>
        {/if}

        <div class="mt-8 space-y-6">
            <div>
                <label for="token" class="sr-only">Verification Code</label>
                <input
                    type="text"
                    id="token"
                    bind:value={verificationToken}
                    placeholder="Enter 6-digit verification code"
                    class="appearance-none relative block w-full px-3 py-4 border border-gray-400 bg-transparent placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#3b82f6] focus:border-[#3b82f6] focus:z-10 sm:text-sm"
                    required
                    maxlength="6"
                    pattern="[0-9]{6}"
                />
            </div>

            <div>
                <button
                    type="button"
                    on:click={handleVerification}
                    class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1D5DEC] hover:bg-[#1D5DEC]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6]"
                    disabled={loading || !verificationToken.match(/^[0-9]{6}$/)}
                >
                    {loading ? 'Verifying...' : 'Verify Email'}
                </button>
            </div>
        </div>
    </div>
</div>
{/if}