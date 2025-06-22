<script lang="ts">
    import "../app.css";
    import { page } from "$app/state";
    import Sidebar from "../lib/components/navigation/sidebar.svelte";
    import Hamburger from "../lib/components/navigation/hamburger.svelte";

    export const prerender = true;
</script>

<div class="desktop-only">
    <Sidebar pathname={page.url.pathname} />
</div>

<div class="mobile-only">
    <Hamburger />
</div>

<main>
    <slot />
</main>

<style>
    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100vw;
        max-width: 100vw;
        box-sizing: border-box;
    }
</style>
