<script lang="ts">
import { page } from "$app/state";
import { goto } from "$app/navigation";
import Button from "../lib/components/ui/button.svelte";
</script>

<div class="error-container">
    <div class="error-content">
        <h2>{page.status}</h2>
        <h3 class="font-medium">{page.error?.message}</h3>
        <div style="margin-top: 1.5rem;">
            <Button onclick={() => goto("/")}>Return home</Button>
        </div>
    </div>
</div>

<style>
    .error-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: var(--bg);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999; /* High z-index to cover the sidebar and other content */
    }

    .error-content {
        text-align: center;
        color: var(--fg);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
</style>
