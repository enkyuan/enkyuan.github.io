<script lang="ts">
import Button from "../../lib/components/ui/button.svelte";
import ArrowRight from "../../lib/components/icons/arrow-right.svelte";
import { pages, labels } from "$lib/constants";
import { sidebarState } from "$lib/stores/sidebar.svelte";

const current = 1;
const next = 2;
</script>

<div class="top-center-responsive-btn">
    <Button
        href={pages[next]}
        variant="primary"
        onmouseenter={() => sidebarState.setHovered(next)}
        onmouseleave={() => sidebarState.setHovered(null)}
    >
        {labels[current]}
        <span slot="icon"><ArrowRight /></span>
    </Button>
</div>

<div class="geist-bg-full">
    <div class="page-content">
        <h2 class="geist-header">what i've been working on</h2>
    </div>
</div>

<style>
    .top-center-responsive-btn {
        display: none;
    }
    @media (min-width: 1024px) {
        .top-center-responsive-btn {
            position: absolute;
            top: 2rem;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
            display: block;
        }
    }
    .geist-bg-full {
        min-height: 100vh;
        background: var(--bg);
        width: 100vw;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .page-content {
        max-width: 60vw;
        margin: 8.5rem auto 0 auto;
        padding: 0 1.5rem;
    }
    .geist-header {
        font-family: "Geist", var(--font-body), sans-serif;
        font-weight: 700;
        font-size: 2.2rem;
        color: var(--green);
        text-align: left;
        margin-bottom: 0.8rem;
    }

    @media (max-width: 768px) {
        .page-content {
            max-width: 90vw;
            margin-top: 4rem;
        }
        .geist-header {
            font-size: 1.6rem;
        }
    }
</style>
