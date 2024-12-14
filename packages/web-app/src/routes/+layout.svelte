<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
import Navbar from '$lib/components/Navbar.svelte';
import '../app.css';
	let { children } = $props();
</script>
<Navbar />
<div class="flex min-h-screen flex-col">
	{@render children()}

</div>
<Footer	/>