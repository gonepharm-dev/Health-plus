
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Eye, EyeOff } from 'lucide-svelte';

  export let type = 'text';
  export let value = '';
  export let label = '';
  export let placeholder = '';
  export let disabled = false;
  export let required = false;
  export let error = '';
  export let min = '';
  export let max = '';
  export let togglePassword = false;
  export let showPassword = false;

  const dispatch = createEventDispatcher();

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    dispatch('input', value);
  }

  function togglePasswordVisibility() {
    showPassword = !showPassword;
  }

  $: inputType = togglePassword && showPassword ? 'text' : type;
</script>

<div class="form-control w-full">
  {#if label}
    <label class="block text-sm font-medium text-gray-700 mb-1" for={label}>
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}

  <div class="relative">
    <input
      {placeholder}
      class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2
             focus:ring-[#064b67] focus:border-transparent disabled:bg-gray-100
             disabled:cursor-not-allowed {error ? 'border-red-500' : 'border-gray-300'}"
      type={inputType}
      id={label}
      {disabled}
      {required}
      {min}
      {max}
      {value}
      on:input={handleInput}
      on:blur
      on:focus
      {...$$restProps}
    />

    {#if togglePassword}
      <button
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400
               hover:text-gray-600"
        on:click={togglePasswordVisibility}
      >
        {#if showPassword}
          <EyeOff size={20} />
        {:else}
          <Eye size={20} />
        {/if}
      </button>
    {/if}
  </div>

  {#if error}
    <p class="mt-1 text-sm text-red-500">{error}</p>
  {/if}

  {#if $$slots.hint}
    <div class="mt-1">
      <slot name="hint" />
    </div>
  {/if}
</div>