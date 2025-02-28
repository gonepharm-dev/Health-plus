<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import GoogleIcon from '$lib/assets/google.svg';
  import { login, loginWithGoogle } from '$lib/services/authService';
  import { auth } from '$lib/stores/auth';
  import { slide } from 'svelte/transition';

  export let data;

  let loading = false;
  let error: string | null = null;
  let success: string | null = null;
  let showPassword = false;
  let rememberMe = false;

  let formData = {
    email: '',
    password: ''
  };

  $: isFormValid = formData.email?.trim() && formData.password?.trim();

  // Handle email/password login
  async function handleSubmit(event: Event) {
    event.preventDefault();
    if (!isFormValid || loading) return;

    loading = true;
    error = null;

    try {
      const response = await login(formData.email, formData.password);
      success = 'Login successful!';

      // Redirect based on user role
      const userRole = response.record.role;
      if (userRole === 'doctor') {
        goto('/doctor');
      } else if (userRole === 'patient') {
        goto('/patient');
      } else {
        throw new Error('Unknown user role');
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('credentials')) {
          error = 'Invalid email or password';
        } else if (err.message.includes('unverified')) {
          error = 'Please verify your email before logging in';
        } else {
          error = err.message;
        }
      } else {
        error = 'Login failed. Please try again.';
      }
    } finally {
      loading = false;
    }
  }

  // Handle Google login
  async function handleGoogleLogin() {
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
      error = err.message || 'Google login failed';
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

        // Redirect based on user role
        const userRole = response.data.record.role;
        if (userRole === 'doctor') {
          goto('/doctor');
        } else if (userRole === 'patient') {
          goto('/patient');
        } else {
          throw new Error('Unknown user role');
        }
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

  // Toggle password visibility
  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }
</script>

<div class="flex min-h-screen">
  <!-- Left Panel - Hidden on mobile -->
  <div class="hidden p-8 md:block md:w-1/3">
    <div class="flex h-full flex-col justify-between rounded-2xl bg-[#1D5DEC] p-8 text-white">
      <div class="px-2 pt-12">
        <h1 class="font-sm mb-14 text-xl">GONEP</h1>
        <p class="pt-12 text-5xl leading-tight">
          Welcome <br /> back.
        </p>
        <p class="mt-8 text-lg font-thin leading-snug text-gray-300">
          Access your healthcare services <br /> and manage your appointments <br /> with ease
        </p>
      </div>

      <div class="w-full p-2">
        <div class="h-full rounded-lg bg-blue-700 p-6">
          <p class="mb-6 leading-relaxed text-gray-200">
            I love how easy it is to schedule appointments and consult with my doctor online. It saves me so much time!
          </p>
          <div class="inline-flex items-center">
            <img src="/doc.jpg" alt="" class="mr-3 h-10 w-10 rounded-xl" />
            <div class="flex flex-grow flex-col">
              <span class="title-font font-medium text-gray-200">Sarah Kamau</span>
              <span class="text-sm text-gray-200">Patient</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Right Panel: Login Form -->
  <div class="flex w-full flex-col p-8 md:w-2/3 md:p-16 max-w-4xl mx-auto">
    <h1 class="text-4xl mb-10">Sign In</h1>

    {#if error}
      <div class="mb-6 rounded-md bg-red-50 p-4 text-red-700" transition:slide>
        {error}
      </div>
    {/if}

    {#if success}
      <div class="mb-6 rounded-md bg-green-50 p-4 text-green-700" transition:slide>
        {success}
      </div>
    {/if}

    <form class="space-y-6" on:submit={handleSubmit}>
      <div>
        <label for="email" class="block text-base font-thin text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          bind:value={formData.email}
          class="mt-1 block w-full rounded-md border bg-transparent border-gray-400 px-3 py-3 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
          required
        />
      </div>

      <div>
        <label for="password" class="block text-base font-thin text-gray-700">Password</label>
        <div class="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            bind:value={formData.password}
            class="mt-1 block w-full rounded-md border bg-transparent border-gray-400 px-3 py-3 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
            required
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
            on:click={togglePasswordVisibility}
          >
            {#if showPassword}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            {/if}
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            bind:checked={rememberMe}
            class="h-4 w-4 rounded border-gray-300 text-[#3b82f6] focus:ring-[#3b82f6]"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <a href="/forgot-password" class="text-sm font-medium text-[#3b82f6] hover:text-[#3b82f6]/90">
          Forgot your password?
        </a>
      </div>

      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1D5DEC] hover:bg-[#1D5DEC]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !isFormValid}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </div>

      <div class="flex items-center justify-center">
        <span class="w-full border-t border-gray-300"></span>
        <span class="mx-4 text-sm text-gray-500">or</span>
        <span class="w-full border-t border-gray-300"></span>
      </div>

      <button
        type="button"
        on:click={handleGoogleLogin}
        class="w-full flex items-center justify-center gap-3 py-4 px-4 border border-gray-400 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        disabled={loading}
      >
        <img src={GoogleIcon} alt="Google icon" class="w-6 h-6">
        Continue with Google
      </button>

      <div class="text-center text-sm text-gray-600">
        Don't have an account?
        <a href="/signup" class="font-medium text-[#3b82f6] hover:text-[#3b82f6]/90">Sign up</a>
      </div>
    </form>
  </div>
</div>