<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    onMount(async () => {
        goto('/dashboard');
    });
</script>
<div>
    Hello!
</div>