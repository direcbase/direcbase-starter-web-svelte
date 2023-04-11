<script>
    export let messages;
</script>
<div class="toast toast-start toast-center w-full z-auto">
    {#each messages as msg, i}
        <div class="alert {msg.type==='success'?'alert-success':msg.type==='error'?'alert-error':'alert-info'}">
            <div class="w-auto">
                <span>{msg.message}</span>
            </div>
        </div>
    {/each}
</div>