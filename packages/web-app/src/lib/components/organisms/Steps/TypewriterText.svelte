<script lang="ts">
    import { onMount, createEventDispatcher, onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';

    const dispatch = createEventDispatcher();

    export let text: string;
    export let speed: number = 40;
    export let startDelay: number = 0;

    let displayText = '';
    let isComplete = false;
    let interval: ReturnType<typeof setInterval>;
    let timeout: ReturnType<typeof setTimeout>;

    function startTyping() {
        const characters = text.split('');
        let currentIndex = 0;

        displayText = '';
        isComplete = false;

        timeout = setTimeout(() => {
            interval = setInterval(() => {
                if (currentIndex < characters.length) {
                    displayText = text.substring(0, currentIndex + 1);
                    currentIndex++;
                } else {
                    isComplete = true;
                    if (interval) clearInterval(interval);
                    dispatch('complete');
                }
            }, speed);
        }, startDelay);
    }

    onMount(() => {
        startTyping();
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
        if (timeout) clearTimeout(timeout);
    });
</script>

<span class="inline-block" in:fade|local={{ duration: 400 }}>
    {displayText}
    {#if !isComplete}
        <span class="cursor">|</span>
    {/if}
</span>

<style>
    .cursor {
        animation: blink 1s step-end infinite;
    }

    @keyframes blink {
        from, to { opacity: 1; }
        50% { opacity: 0; }
    }
</style>