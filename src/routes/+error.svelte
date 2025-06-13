<script lang="ts">
import { page } from "$app/state";
</script>

<div class="error-container">
    <div class="error-content">
        <h1>{page.status}</h1>
        <p>{page.error?.message}</p>
        <p><a href="/">Return to Home</a></p>
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
    }

    h1 {
        font-size: 3rem;
        font-weight: 700;
        color: var(--fg);
    }

    p {
        font-size: 1.2rem;
        margin-top: 0.5rem;
        color: var(--comment);
    }

    a {
        color: var(--blue-type);
        text-decoration: none;
        margin-top: 1.5rem;
        display: inline-block;
    }

    a:hover {
        text-decoration: none;
        color: var(--pink);
    }
</style>
