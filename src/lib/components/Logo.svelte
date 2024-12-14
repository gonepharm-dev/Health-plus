<script lang="ts">
    export let animated: boolean = true;
    export let size: string = "w-32 h-10"; // Updated default size
</script>

<div class="logo flex items-center justify-center {size}" class:animated>
    <img src="/logo.png" alt="Gonep logo" class="w-12 h-full p-1 transition-all duration-200 ease-in-out fill-current text-gray-900 dark:text-gray-100 hover:filter hover:drop-shadow-primary">
    <svg
        id="logo-text"
        class="w-full h-full transition-all duration-200 ease-in-out fill-current text-gray-900 dark:text-gray-100 hover:filter hover:drop-shadow-primary"
        viewBox="0 0 160 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <text
            id="text"
            x="0"
            y="48"
            font-family="Helvetica, Arial, sans-serif"
            font-size="48"
            font-weight="500"
            textLength="160"
            lengthAdjust="spacingAndGlyphs"
        >
            GONEP
        </text>
    </svg>
</div>