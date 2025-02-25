<script lang="ts">
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';
    import { slide } from 'svelte/transition';
    import InputField from './Input.svelte';
    import { otpService } from '$lib/services/otpService';
    
    export let email = '';
    export let onVerificationSuccess = () => {};
    
    const dispatch = createEventDispatcher();
    
    let otp = '';
    let loading = false;
    let sending = false;
    let error = '';
    let success = '';
    let remainingTime = 0;
    let timerInterval: ReturnType<typeof setInterval> | null = null;
    
    async function sendVerificationCode() {
      if (sending || remainingTime > 0) return;
      
      sending = true;
      error = '';
      success = '';
      
      try {
        await otpService.generateEmailOTP(email);
        success = 'Verification code sent. Please check your email.';
        startResendTimer();
      } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to send verification code';
      } finally {
        sending = false;
      }
    }
    
    async function verifyCode() {
      if (loading || !otp || otp.length !== 4) return;
      
      loading = true;
      error = '';
      success = '';
      
      try {
        const isValid = await otpService.verifyOTP(email, otp, 'email');
        
        if (isValid) {
          success = 'Verification successful!';
          onVerificationSuccess();
          dispatch('verified', { email });
        } else {
          error = 'Verification failed. Please try again.';
        }
      } catch (err) {
        error = err instanceof Error ? err.message : 'Verification failed';
      } finally {
        loading = false;
      }
    }
    
    function startResendTimer() {
      remainingTime = 60;
      clearResendTimer();
      
      timerInterval = setInterval(() => {
        remainingTime -= 1;
        if (remainingTime <= 0) {
          clearResendTimer();
        }
      }, 1000);
    }
    
    function clearResendTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
    
    onDestroy(() => {
      clearResendTimer();
    });
    
    onMount(() => {
      sendVerificationCode();
    });
  </script>
  
  <div class="min-h-screen flex items-center justify-center px-4 bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-gray-900">Verify your email</h2>
        <p class="mt-2 text-sm text-gray-600">
          We've sent a verification code to <span class="font-semibold">{email}</span>
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
        <InputField
          type="text"
          label="Verification Code"
          placeholder="Enter 4-digit code"
          value={otp}
          error={error ? '' : ''}
          disabled={loading}
          required={true}
          on:input={(e) => {
            otp = e.detail;
            if (error) error = '';
          }}
        >
          <div slot="hint" class="text-sm text-gray-500">
            Enter the 4-digit code sent to your email
          </div>
        </InputField>
  
        <div>
          <button
            type="button"
            on:click={verifyCode}
            class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1D5DEC] hover:bg-[#1D5DEC]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3b82f6]"
            disabled={loading || !otp || otp.length !== 4}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </div>
  
        <div class="text-center">
          <button
            type="button"
            on:click={sendVerificationCode}
            class="text-[#3b82f6] hover:underline focus:outline-none disabled:opacity-50 
                   disabled:cursor-not-allowed disabled:no-underline"
            disabled={sending || remainingTime > 0}
          >
            {#if remainingTime > 0}
              Resend code in {remainingTime}s
            {:else if sending}
              Sending...
            {:else}
              Resend verification code
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>