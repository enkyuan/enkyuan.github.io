<script lang="ts">
import Tooltip from "../ui/tooltip.svelte";
import Button from "../ui/button.svelte";
import { sidebarState } from "$lib/stores/sidebar.svelte";
import { navigationLinks } from "$lib/stores/navigation";

let { pathname } = $props();
</script>

<nav class="sidebar">
    <ul>
        {#each navigationLinks.filter((i) => !i.position) as icon, i}
            <li>
                <Tooltip
                    text={icon.label.toLowerCase()}
                    placement="right"
                    disabled={sidebarState.hoveredIndex === i}
                >
                    <a
                        href={icon.href}
                        aria-label={icon.label}
                        class:selected={pathname === icon.href ||
                            sidebarState.hoveredIndex === i}
                    >
                        <icon.component focused={pathname === icon.href} />
                    </a>
                </Tooltip>
            </li>
        {/each}
    </ul>
    <div class="bottom-link">
        {#each navigationLinks.filter((i) => i.position === "bottom") as icon}
            <Tooltip text={icon.label} placement="right">
                <Button
                    href={icon.href}
                    target={icon.external ? "_blank" : undefined}
                    rel={icon.external ? "noopener noreferrer" : undefined}
                    aria-label={icon.label}
                    variant="primary"
                    size="icon"
                    class="icon-button"
                >
                    <icon.component color="var(--white)" />
                </Button>
            </Tooltip>
        {/each}
    </div>
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
        padding: 0 0 2rem 0;
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
    .bottom-link {
        margin-top: auto;
    }
    :global(.icon-button) {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        border: 1.5px solid var(--gray1);
        display: grid;
        place-items: center;
    }
</style>
