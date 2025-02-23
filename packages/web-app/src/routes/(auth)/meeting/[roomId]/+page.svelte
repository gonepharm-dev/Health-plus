<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
  import type { PageData } from './$types';

    import { getMeetingToken, initializeVideoSDK } from '$lib/services/videoSDK.service';
    import { goto } from '$app/navigation';
    import { slide } from 'svelte/transition';
    import { flip } from 'svelte/animate';
  
    interface Participant {
      id: string;
      displayName: string;
      isLocal: boolean;
      role: 'doctor' | 'patient';
    }
  
    export let data: PageData;
  
    // Core state management
    let meeting: any;
    let participants: Record<string, Participant> = {};
    let localParticipantId: string | undefined;
    let isMicOn = data.initialMicState;
    let isCameraOn = data.initialCameraState;
    let isLoading = true;
    let error: string | undefined;
    let consultationDetails = '';
    let isWaiting = true;
    let isChatOpen = false;
    let isJoiningNotification = false;
  
    // Reference to our video container
    let videoContainer: HTMLDivElement;
  
    function setupVideoElement(participantId: string, displayName: string, isLocal: boolean) {
      const videoElement = document.createElement('video');
      videoElement.id = `video-${participantId}`;
      videoElement.autoplay = true;
      videoElement.playsInline = true;
      videoElement.muted = isLocal;
      videoElement.className = 'w-full h-full object-cover rounded-lg';
  
      const containerDiv = document.createElement('div');
      containerDiv.id = `video-container-${participantId}`;
      containerDiv.className = 'relative bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl';
      
      // Enhanced participant info section
      const infoDiv = document.createElement('div');
      infoDiv.className = 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4';
      
      const nameDiv = document.createElement('div');
      nameDiv.className = 'flex items-center space-x-2';
      
      const roleIcon = document.createElement('span');
      roleIcon.className = 'w-2 h-2 rounded-full';
      roleIcon.classList.add(isLocal ? 'bg-blue-400' : 'bg-green-400');
      
      const nameSpan = document.createElement('span');
      nameSpan.className = 'text-white font-medium';
      nameSpan.textContent = `${displayName} ${isLocal ? '(You)' : ''}`;
      
      nameDiv.appendChild(roleIcon);
      nameDiv.appendChild(nameSpan);
      infoDiv.appendChild(nameDiv);
  
      // Status indicators
      const statusDiv = document.createElement('div');
      statusDiv.className = 'absolute top-4 right-4 flex space-x-2';
      
      const micStatus = document.createElement('div');
      micStatus.id = `mic-${participantId}`;
      micStatus.className = 'p-1.5 rounded-full bg-black/50';
      micStatus.innerHTML = `<svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>`;
  
      const cameraStatus = document.createElement('div');
      cameraStatus.id = `camera-${participantId}`;
      cameraStatus.className = 'p-1.5 rounded-full bg-black/50';
      cameraStatus.innerHTML = `<svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>`;
  
      statusDiv.appendChild(micStatus);
      statusDiv.appendChild(cameraStatus);
  
      containerDiv.appendChild(videoElement);
      containerDiv.appendChild(statusDiv);
      containerDiv.appendChild(infoDiv);
      
      if (videoContainer) {
        videoContainer.appendChild(containerDiv);
      }
  
      return videoElement;
    }
  
    function setupAudioElement(participantId: string) {
      const audioElement = document.createElement('audio');
      audioElement.id = `audio-${participantId}`;
      audioElement.autoplay = true;
      document.body.appendChild(audioElement);
      return audioElement;
    }
  
    function connectMediaStream(stream: MediaStreamTrack, participantId: string, kind: 'video' | 'audio') {
      const mediaStream = new MediaStream([stream]);
      const elementId = `${kind}-${participantId}`;
      const element = document.getElementById(elementId) as HTMLMediaElement;
  
      if (element) {
        element.srcObject = mediaStream;
        element.play().catch(error => {
          console.error('Media playback error:', error);
        });
      }
    }
  
    async function initializeMeeting() {
      try {
        if (!browser || !data.roomId) return;
  
        const token = data.token || await getMeetingToken(data.roomId);
        const sdk = await initializeVideoSDK(token);
        if (!sdk) throw new Error('Failed to initialize video SDK');
  
        const isDoctor = !!consultationDetails;
        const role = isDoctor ? 'doctor' : 'patient';
  
        meeting = await sdk.initMeeting({
          meetingId: data.roomId,
          name: role,
          micEnabled: isMicOn,
          webcamEnabled: isCameraOn,
        });
  
        setupEventListeners();
        await meeting.join();
  
        localParticipantId = meeting.localParticipant.id;
        participants[localParticipantId] = {
          id: localParticipantId,
          displayName: role,
          isLocal: true,
          role: role
        };
  
        setupVideoElement(localParticipantId, role, true);
        isLoading = false;
  
      } catch (err) {
        error = err instanceof Error ? err.message : 'Failed to initialize meeting';
        isLoading = false;
      }
    }
  
    function setupEventListeners() {
      if (!meeting) return;
  
      meeting.on("participant-joined", (participant: any) => {
        participants[participant.id] = {
          id: participant.id,
          displayName: participant.displayName,
          isLocal: false,
          role: participant.displayName.toLowerCase()
        };
        participants = { ...participants };
  
        setupVideoElement(participant.id, participant.displayName, false);
        setupAudioElement(participant.id);
  
        participant.on("stream-enabled", (stream: any) => {
          connectMediaStream(stream.track, participant.id, stream.kind);
        });
  
        if (Object.keys(participants).length > 1) {
          isWaiting = false;
          if (consultationDetails) {
            showJoiningNotification();
          }
        }
      });
  
      meeting.on("participant-left", (participant: any) => {
        const videoContainer = document.getElementById(`video-container-${participant.id}`);
        const audioElement = document.getElementById(`audio-${participant.id}`);
        if (videoContainer) videoContainer.remove();
        if (audioElement) audioElement.remove();
  
        delete participants[participant.id];
        participants = { ...participants };
  
        if (Object.keys(participants).length <= 1) {
          endMeeting();
        }
      });
  
      meeting.localParticipant.on("stream-enabled", (stream: any) => {
        connectMediaStream(stream.track, meeting.localParticipant.id, stream.kind);
      });
    }
  
    function showJoiningNotification() {
      isJoiningNotification = true;
      setTimeout(() => {
        isJoiningNotification = false;
      }, 5000);
    }
  
    async function endMeeting() {
      try {
        if (meeting) await meeting.leave();
  
        Object.keys(participants).forEach(participantId => {
          const videoContainer = document.getElementById(`video-container-${participantId}`);
          const audioElement = document.getElementById(`audio-${participantId}`);
          if (videoContainer) videoContainer.remove();
          if (audioElement) audioElement.remove();
        });
  
        await goto('/');
      } catch (err) {
        console.error('Error ending meeting:', err);
      }
    }
  
    async function toggleMic() {
      if (!meeting) return;
      try {
        if (isMicOn) {
          await meeting.muteMic();
        } else {
          await meeting.unmuteMic();
        }
        isMicOn = !isMicOn;
      } catch (err) {
        console.error('Mic toggle error:', err);
      }
    }
  
    async function toggleCamera() {
      if (!meeting) return;
      try {
        if (isCameraOn) {
          await meeting.disableWebcam();
        } else {
          await meeting.enableWebcam();
        }
        isCameraOn = !isCameraOn;
      } catch (err) {
        console.error('Camera toggle error:', err);
      }
    }
  
    onMount(() => {
      if (browser) {
        consultationDetails = localStorage.getItem(`consultation_${data.roomId}`) || '';
        isWaiting = !consultationDetails;
        initializeMeeting();
      }
    });
  
    onDestroy(() => {
      endMeeting();
    });
  </script>
  
  <div class="flex h-screen bg-gray-100">
    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Bar -->
      {#if isJoiningNotification && consultationDetails}
        <div
          class="bg-green-500 text-white p-4 text-center"
          transition:slide
        >
          Patient has joined the consultation
        </div>
      {/if}
  
      <!-- Video Grid -->
      <div class="flex-1 p-6">
        <div 
          bind:this={videoContainer}
          class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full max-h-[calc(100vh-12rem)]"
        >
        </div>
      </div>
  
      <!-- Controls Bar -->
      <div class="bg-white p-6 shadow-lg">
        <div class="max-w-4xl mx-auto flex items-center justify-center space-x-6">
          <button
            on:click={toggleMic}
            class="p-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            class:bg-blue-500={isMicOn}
            class:bg-red-500={!isMicOn}
            class:hover:bg-blue-600={isMicOn}
            class:hover:bg-red-600={!isMicOn}
            disabled={!meeting}
          >
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d={isMicOn ? 
                  "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" :
                  "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                }
              />
            </svg>
          </button>
  
          <button
            on:click={toggleCamera}
            class="p-4 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            class:bg-blue-500={isCameraOn}
            class:bg-red-500={!isCameraOn}
            class:hover:bg-blue-600={isCameraOn}
            class:hover:bg-red-600={!isCameraOn}
            disabled={!meeting}
          >
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d={isCameraOn ?
                  "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" :
                  "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                }
              />
            </svg>
          </button>
  
          <button
            on:click={() => isChatOpen = !isChatOpen}
            class="p-4 rounded-full bg-gray-500 hover:bg-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
  
          <button
            on:click={endMeeting}
            class="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
            disabled={!meeting}
          >
            <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  
    <!-- Chat Panel -->
    {#if isChatOpen}
      <div 
        class="w-80 bg-white border-l border-gray-200 flex flex-col"
        transition:slide={{ duration: 300 }}
      >
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-800">Chat</h2>
          <button
            on:click={() => isChatOpen = false}
            class="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <!-- Chat Messages -->
        <div class="flex-1 p-4 overflow-y-auto">
          <div class="space-y-4">
            <!-- Placeholder for chat messages -->
            <div class="flex justify-center">
              <span class="text-sm text-gray-500">Chat messages will appear here</span>
            </div>
          </div>
        </div>
  
        <!-- Message Input -->
        <div class="p-4 border-t border-gray-200">
          <div class="flex space-x-2">
            <input
              type="text"
              placeholder="Type a message..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              class="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    {/if}
  
    <!-- Loading State -->
    {#if isLoading}
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm">
          <div class="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p class="mt-4 text-gray-700 font-medium">Setting up your meeting...</p>
        </div>
      </div>
    {/if}
  
    <!-- Error State -->
    {#if error}
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-xl shadow-xl text-center max-w-md">
          <div class="text-red-500 mb-4">
            <svg class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Meeting Error</h3>
          <p class="text-gray-600 mb-6">{error}</p>
          <button 
            class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            on:click={() => goto('/')}
          >
            Return to Home
          </button>
        </div>
      </div>
    {/if}
  
    <!-- Waiting Room -->
    {#if isWaiting}
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-xl shadow-xl text-center max-w-md">
          <div class="animate-pulse mb-6">
            <svg class="h-16 w-16 mx-auto text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            {consultationDetails ? 'Waiting for Patient' : 'Waiting for Doctor'}
          </h3>
          <p class="text-gray-600 mb-4">
            {consultationDetails ? 
              'Please wait while the patient joins the consultation...' : 
              'The doctor will start the consultation shortly...'}
          </p>
          {#if consultationDetails}
            <div class="mt-6 p-4 bg-gray-50 rounded-lg text-left">
              <h4 class="font-medium text-gray-900 mb-2">Consultation Details:</h4>
              <p class="text-gray-600">{consultationDetails}</p>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
  
  <style>
    /* Smooth transitions for media toggles */
    button {
      transition: all 0.2s ease-in-out;
    }
  
    button:hover:not(:disabled) {
      transform: scale(1.05);
    }
  
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  
    /* Improve scrollbar styling for chat */
    :global(.overflow-y-auto) {
      scrollbar-width: thin;
      scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
    }
  
    :global(.overflow-y-auto::-webkit-scrollbar) {
      width: 6px;
    }
  
    :global(.overflow-y-auto::-webkit-scrollbar-track) {
      background: transparent;
    }
  
    :global(.overflow-y-auto::-webkit-scrollbar-thumb) {
      background-color: rgba(156, 163, 175, 0.5);
      border-radius: 3px;
    }
  
    /* Ensure proper video layout */
    :global(video) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  
    /* Video container hover effects */
    :global(.video-container) {
      transition: transform 0.2s ease-in-out;
    }
  
    :global(.video-container:hover) {
      transform: scale(1.02);
    }
  </style>