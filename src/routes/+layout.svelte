
<script >
	import '../app.postcss';
	import { onMount } from 'svelte';
	import Sidebar from "$lib/components/Sidebar.svelte";
	onMount(async () => {
	});
</script>
<svelte:head>
    <title>Direcbase | Backend for your side projects</title>
	<meta name="description" content="Boostrap your SaaS in weekend with Direcbase">
</svelte:head>   
<div class="flex bg-blueGray-100 h-full content-center" >
	<Sidebar />
	<slot />
</div>
