<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { slide } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { verificationStore } from '$lib/stores/verification';
  import GoogleIcon from '$lib/assets/google.svg';
  import { registerUser } from '$lib/services/authService';
  import { auth } from '$lib/stores/auth';
	import { loginWithGoogle } from '$lib/services/authService';
	import OtpVerification from '$lib/components/OtpVerification.svelte';
  export let data; // Get the data from +page.ts

  let step = 1;
  let loading = false;
  let error: string | null = null;
  let success: string | null = null;
  let verificationToken = '';
  let showResendOption = false
  // Add this at the top of your script
type UserRole = 'patient' | 'doctor' | 'admin';
let userEmail = ''; // Store email for display


let formData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
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

async function handleSubmit(event: Event) {
    event.preventDefault();
    if (!isFormValid || loading) return;
    
    loading = true;
    error = null;
    
    try {
      await registerUser({
        ...formData,
        passwordConfirm: formData.confirmPassword
      });
      
      step = 2;
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('email')) {
          error = 'Email is invalid or already in use';
        } else if (err.message.includes('username')) {
          error = 'Username is invalid or already in use';
        } else if (err.message.includes('password')) {
          error = 'Password doesn\'t meet requirements';
        } else {
          error = err.message;
        }
      } else {
        error = 'Registration failed. Please try again.';
      }
    } finally {
      loading = false;
    }
  }
  
function handleVerificationSuccess() {
    // Redirect to dashboard after successful verification
    setTimeout(() => {
      goto('/patient');
    }, 1500);
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
<OtpVerification 
email={formData.email} 
onVerificationSuccess={handleVerificationSuccess}
/>

{/if}