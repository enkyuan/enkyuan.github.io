<script lang="ts">
import StickyNoteIcon from "../icons/sticky-note.svelte";
import GlobeIcon from "../icons/globe.svelte";
import NoteIcon from "../icons/note.svelte";
import Tooltip from "../ui/tooltip.svelte";
import { base } from "$app/paths";

let active = 0;
const icons = [
	{ component: NoteIcon, label: "Whoami", href: `${base}/` },
	{ component: GlobeIcon, label: "Works", href: `${base}/works` },
	{ component: StickyNoteIcon, label: "Writing", href: `${base}/writing` },
];
</script>

<nav class="sidebar">
    <ul>
        {#each icons as icon, i}
            <li>
                <Tooltip text={icon.label.toLowerCase()} placement="right">
                    <a
                        href={icon.href}
                        aria-label={icon.label}
                        class:selected={active === i}
                        on:click={() => (active = i)}
                    >
                        <svelte:component
                            this={icon.component}
                            focused={active === i}
                        />
                    </a>
                </Tooltip>
            </li>
        {/each}
    </ul>
</nav>

<style>
    .sidebar {
        width: 72px;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--bg);
        border-right: 1px solid var(--vsplit-bg);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 10;
    }
    .sidebar ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    .sidebar li {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .sidebar a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        transition: background 0.2s;
    }
    .sidebar a.selected,
    .sidebar a:hover {
        background: var(--visual-select-bg);
    }
</style>
