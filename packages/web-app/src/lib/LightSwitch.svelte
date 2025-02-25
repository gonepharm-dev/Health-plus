<!-- LightSwitch.svelte -->
<script lang="ts">
    import { writable } from 'svelte/store';
  
    // Create a store with the initial state 'off'
    export const lightOn = writable(false);
  
    function toggleLight() {
      // Update the store by flipping its current value
      lightOn.update(value => !value);
    }
  </script>
  
  <button on:click={toggleLight}>
    Toggle Light
  </button>
  