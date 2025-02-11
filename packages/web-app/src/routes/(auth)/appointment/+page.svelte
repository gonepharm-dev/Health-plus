<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';
    import { createRoom, getRtcToken } from '$lib/services/videoSDK.service';
    import { meetingStore } from '$lib/stores/meeting';
    import { writable } from 'svelte/store';
    import { fade, fly, slide } from 'svelte/transition';
    export let data;
  
  // Initialize role from route data
  $: {
    if (data.role === 'doctor' || data.role === 'patient') {
      meetingStore.setRole(data.role);
    }
  }
    // Step management
    const steps = {
    SETUP: 'setup',
    FINAL: 'final'
  };
    
    const currentStep = writable(steps.SETUP);
    
    // Enhanced media state store
    interface MediaState {
    isCameraOn: boolean;
    isMicOn: boolean;
    selectedCamera: string;
    selectedMic: string;
    devices: {
      cameras: MediaDeviceInfo[];
      mics: MediaDeviceInfo[];
    };
    isInitializing: boolean;
  }
  
  const mediaState = writable<MediaState>({
    isCameraOn: true,
    isMicOn: true,
    selectedCamera: '',
    selectedMic: '',
    devices: { cameras: [], mics: [] },
    isInitializing: true
  });

    let videoStream: MediaStream | null = null;
    let videoElement: HTMLVideoElement;
    let isJoining = false;
    let meetingCode = '';
    let error: string | null = null;
    let isDoctor = false;
    let consultationDetails = '';
    let copySuccess = false;
    
    let redirectTimer: ReturnType<typeof setInterval> | null = null;
    let redirectCountdown = 5;
  
    // Media handling functions
    async function getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        mediaState.update(s => ({
          ...s,
          devices: {
            cameras: devices.filter(d => d.kind === 'videoinput'),
            mics: devices.filter(d => d.kind === 'audioinput')
          }
        }));
      } catch (err) {
        error = 'Unable to enumerate devices';
      }
    }
  
    async function initializeMedia(cameraId?: string, micId?: string) {
      mediaState.update(s => ({ ...s, isInitializing: true }));
      error = null;
      
      try {
        if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
        }
  
        const stream = await navigator.mediaDevices.getUserMedia({
          video: cameraId ? { deviceId: { exact: cameraId } } : true,
          audio: micId ? { deviceId: { exact: micId } } : true
        });
        
        videoStream = stream;
        if (videoElement) videoElement.srcObject = stream;
        await getDevices();
      } catch (err) {
        error = 'Could not access camera or microphone. Please check your permissions.';
        mediaState.update(s => ({
          ...s,
          isCameraOn: false,
          isMicOn: false
        }));
      } finally {
        mediaState.update(s => ({ ...s, isInitializing: false }));
      }
    }
  
    const toggleMedia = (type: 'camera' | 'mic') => {
      if (!videoStream) return;
      const track = videoStream[type === 'camera' ? 'getVideoTracks' : 'getAudioTracks']()[0];
      if (track) {
        track.enabled = !track.enabled;
        mediaState.update(s => ({
          ...s,
          [type === 'camera' ? 'isCameraOn' : 'isMicOn']: track.enabled
        }));
      }
    };
  
    // Navigation functions
    const selectRole = (role: 'doctor' | 'patient') => {
      isDoctor = role === 'doctor';
      currentStep.set(steps.SETUP);
      // Initialize media after role selection
      if (browser) initializeMedia();
    };
  
    function startRedirectCountdown(roomId: string, token: string) {
    redirectTimer = setInterval(() => {
      redirectCountdown--;
      if (redirectCountdown <= 0) {
        clearInterval(redirectTimer!);
        const url = new URL(`/meeting/${roomId}`, window.location.origin);
        url.searchParams.set('token', token);
        url.searchParams.set('camera', $mediaState.isCameraOn.toString());
        url.searchParams.set('mic', $mediaState.isMicOn.toString());
        url.searchParams.set('role', $meetingStore.role || '');
        goto(url.pathname + url.search);
      }
    }, 1000);
  }

    // Enhanced consultation creation
    const createConsultation = async () => {
    if (!consultationDetails.trim() && $meetingStore.role === 'doctor') {
      error = 'Please enter consultation details';
      return;
    }

    meetingStore.setLoading(true);
    error = null;
    
    try {
      const roomId = await createRoom();
      const rtcToken = await getRtcToken(roomId);
      meetingStore.setMeetingId(roomId);
      
      // Save consultation data
      const consultationData = {
        details: consultationDetails,
        createdAt: new Date().toISOString(),
        doctorPreferences: {
          camera: $mediaState.isCameraOn,
          mic: $mediaState.isMicOn
        },
        role: $meetingStore.role
      };
      
      localStorage.setItem(`consultation_${roomId}`, JSON.stringify(consultationData));
      currentStep.set(steps.FINAL);
      
      startRedirectCountdown(roomId, rtcToken);
    } catch (err) {
      error = 'Failed to create consultation. Please try again.';
    } finally {
      meetingStore.setLoading(false);
    }
  };

  
    // Join consultation
    const joinConsultation = async () => {
      if (!meetingCode.trim()) {
        error = 'Please enter a valid consultation code';
        return;
      }
  
      isJoining = true;
      error = null;
      
      try {
        const rtcToken = await getRtcToken(meetingCode);
        currentStep.set(steps.FINAL);
        
        // Start redirect countdown
        redirectTimer = setInterval(() => {
          redirectCountdown--;
          if (redirectCountdown <= 0) {
            clearInterval(redirectTimer!);
            const url = new URL(`/meeting/${meetingCode}`, window.location.origin);
            url.searchParams.set('token', rtcToken);
            url.searchParams.set('camera', $mediaState.isCameraOn.toString());
            url.searchParams.set('mic', $mediaState.isMicOn.toString());
            goto(url.pathname + url.search);
          }
        }, 1000);
      } catch (err) {
        error = 'Invalid consultation code. Please check and try again.';
        isJoining = false;
      }
    };
  
    const copyMeetingCode = async () => {
      try {
        await navigator.clipboard.writeText(meetingCode);
        copySuccess = true;
        setTimeout(() => copySuccess = false, 2000);
      } catch (err) {
        error = 'Failed to copy code';
      }
    };
  
    onMount(() => {
    if (browser) {
      initializeMedia();
      // Set media preferences from store
      mediaState.update(s => ({
        ...s,
        isCameraOn: $meetingStore.mediaPreferences.isCameraOn,
        isMicOn: $meetingStore.mediaPreferences.isMicOn
      }));
    }

    return () => {
      if (redirectTimer) clearInterval(redirectTimer);
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
    };
  });
  
    $: ({ isLoading } = $meetingStore);
    $: isDoctor = $meetingStore.role === 'doctor';
  </script>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 flex items-center justify-center">
    <div class="w-full max-w-6xl">
   
      <!-- Setup Step -->
      {#if $currentStep === steps.SETUP}
        <div
          class=" overflow-hidden"
          in:fly="{{ y: 20, duration: 300 }}"
          out:fade
        >
          <div class="p-8 border-b border-gray-100">
            <h2 class="text-2xl font-bold text-gray-800 text-center">
              {isDoctor ? 'Create New Consultation' : 'Join Consultation'}
            </h2>
          </div>
  
          <div class="p-8 grid md:grid-cols-2 gap-8">
            <!-- Video Preview Section -->
            <div class="space-y-6">
              <div class="relative bg-gray-900 rounded-xl aspect-video overflow-hidden shadow-inner">
                {#if $mediaState.isInitializing}
                  <div class="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                {/if}
                
                <video
                  bind:this={videoElement}
                  autoplay
                  playsinline
                  muted
                  class="w-full h-full object-cover"
                />
                
                {#if !$mediaState.isCameraOn}
                  <div 
                    class="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-90"
                    transition:fade
                  >
                    <div class="text-center">
                      <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span class="block mt-2 text-gray-400 font-medium">Camera Off</span>
                    </div>
                  </div>
                {/if}
              </div>
  
              <div class="flex justify-center gap-4">
                <button
                  on:click={() => toggleMedia('mic')}
                  class="p-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  class:bg-blue-500={$mediaState.isMicOn}
                  class:bg-red-500={!$mediaState.isMicOn}
                  class:hover:bg-blue-600={$mediaState.isMicOn}
                  class:hover:bg-red-600={!$mediaState.isMicOn}
                  aria-label={$mediaState.isMicOn ? 'Mute microphone' : 'Unmute microphone'}
                >
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d={$mediaState.isMicOn ? 
                        "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" :
                        "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      }
                    />
                  </svg>
                </button>
  
                <button
                  on:click={() => toggleMedia('camera')}
                  class="p-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  class:bg-blue-500={$mediaState.isCameraOn}
                  class:bg-red-500={!$mediaState.isCameraOn}
                  class:hover:bg-blue-600={$mediaState.isCameraOn}
                  class:hover:bg-red-600={!$mediaState.isCameraOn}
                  aria-label={$mediaState.isCameraOn ? 'Turn off camera' : 'Turn on camera'}
                >
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d={$mediaState.isCameraOn ?
                        "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" :
                        "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      }
                    />
                  </svg>
                </button>
              </div>
  
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Camera</label>
                  <select
                    bind:value={$mediaState.selectedCamera}
                    on:change={() => initializeMedia($mediaState.selectedCamera, $mediaState.selectedMic)}
                    class="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {#each $mediaState.devices.cameras as camera}
                      <option value={camera.deviceId}>{camera.label || `Camera ${camera.deviceId.slice(0,4)}`}</option>
                    {/each}
                  </select>
                </div>
  
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Microphone</label>
                  <select
                    bind:value={$mediaState.selectedMic}
                    on:change={() => initializeMedia($mediaState.selectedCamera, $mediaState.selectedMic)}
                    class="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {#each $mediaState.devices.mics as mic}
                      <option value={mic.deviceId}>{mic.label || `Microphone ${mic.deviceId.slice(0,4)}`}</option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>
  
            <!-- Action Section -->
            <div class="space-y-6">
              {#if error}
                <div 
                  class="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg"
                  role="alert"
                  transition:fly="{{ y: 20, duration: 300 }}"
                >
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              {/if}
  
              {#if isDoctor}
                <div class="space-y-4">
                  <textarea
                    bind:value={consultationDetails}
                    placeholder="Enter consultation details and instructions for the patient..."
                    class="w-full p-4 border border-gray-300 rounded-xl shadow-sm resize-none h-40 
                      focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
  
                  <button
                    on:click={createConsultation}
                    disabled={isLoading || !consultationDetails.trim()}
                    class="w-full px-6 py-4 bg-blue-500 text-white rounded-xl font-medium
                      hover:bg-blue-600 transition-all duration-200
                      disabled:bg-blue-300 disabled:cursor-not-allowed
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {#if isLoading}
                      <div class="flex items-center justify-center">
                        <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Creating consultation...
                      </div>
                    {:else}
                      Create Consultation
                    {/if}
                  </button>
                </div>
              {:else}
                <div class="space-y-6">
                  <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-blue-700">
                          Enter the consultation code provided by your doctor to join the session.
                        </p>
                      </div>
                    </div>
                  </div>
  
                  <div class="flex gap-3">
                    <input
                      type="text"
                      bind:value={meetingCode}
                      placeholder="Enter consultation code"
                      class="flex-1 px-4 py-3 border border-gray-300 rounded-xl shadow-sm 
                        placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      on:click={joinConsultation}
                      disabled={isJoining || !meetingCode.trim()}
                      class="px-8 py-3 bg-blue-500 text-white rounded-xl font-medium
                        hover:bg-blue-600 transition-all duration-200
                        disabled:bg-blue-300 disabled:cursor-not-allowed
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {#if isJoining}
                        <div class="flex items-center">
                          <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          Joining...
                        </div>
                      {:else}
                        Join Consultation
                      {/if}
                    </button>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/if}
  
      <!-- Final Step -->
      {#if $currentStep === steps.FINAL}
        <div
          class=" p-8 text-center space-y-6"
          in:fly="{{ y: 20, duration: 300 }}"
          out:fade
        >
          {#if isDoctor}
            <div class="space-y-6">
              <h2 class="text-2xl font-bold text-gray-800">Consultation Created Successfully!</h2>
              
              <div class="max-w-md mx-auto">
                <div class="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-500">Share this code with your patient:</span>
                    <button
                      on:click={copyMeetingCode}
                      class="p-2 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      {#if copySuccess}
                        <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      {:else}
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      {/if}
                    </button>
                  </div>
                  
                  <code class="block w-full p-4 bg-white rounded-lg border border-gray-200 font-mono text-lg">
                    {meetingCode}
                  </code>
                </div>
              </div>
            </div>
          {:else}
            <div class="space-y-4">
              <h2 class="text-2xl font-bold text-gray-800">Joining Consultation</h2>
              <p class="text-gray-600">Please wait while we connect you to your doctor...</p>
            </div>
          {/if}
  
          <div class="pt-4">
            <div class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-50 text-blue-500">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Redirecting in {redirectCountdown} seconds...
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>