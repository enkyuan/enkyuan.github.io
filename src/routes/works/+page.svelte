<script lang="ts">
import Button from "../../lib/components/ui/button.svelte";
import ArrowRight from "../../lib/components/icons/arrow-right.svelte";
import { pages, labels } from "$lib/constants";

let current = 1;
const next = (current + 1) % pages.length;
</script>

<div class="top-center-btn">
    <Button href={pages[next]} variant="primary">
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
    .top-center-btn {
        width: 100vw;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        position: absolute;
        top: 2rem;
        left: 0;
        z-index: 20;
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
        letter-spacing: -0.01em;
    }
</style>
