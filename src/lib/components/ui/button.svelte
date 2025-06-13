<script lang="ts">
export let variant:
	| "primary"
	| "secondary"
	| "outline"
	| "ghost"
	| "link"
	| "destructive" = "primary";
export let size: "sm" | "md" | "lg" | "icon" = "md";
export let disabled: boolean = false;
export let loading: boolean = false;
export let href: string | undefined = undefined;
export let type: "button" | "submit" | "reset" = "button";
</script>

{#if href}
    <a
        {href}
        class="btn {variant} {size} {disabled ? 'disabled' : ''}"
        tabindex={disabled ? -1 : 0}
        aria-disabled={disabled}
    >
        <span class="btn-inner">
            {#if loading}
                <span class="loader"></span>
            {/if}
            <slot />
            <span class="btn-icon"><slot name="icon" /></span>
        </span>
    </a>
{:else}
    <button
        {type}
        class="btn {variant} {size} {disabled ? 'disabled' : ''}"
        disabled={disabled || loading}
    >
        <span class="btn-inner">
            {#if loading}
                <span class="loader"></span>
            {/if}
            <slot />
            <span class="btn-icon"><slot name="icon" /></span>
        </span>
    </button>
{/if}

<style>
    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        font-family: var(--font-body);
        font-weight: 500;
        border-radius: 9999px;
        border: none;
        outline: none;
        cursor: pointer;
        transition:
            background 0.15s,
            color 0.15s,
            border 0.15s,
            box-shadow 0.15s;
        user-select: none;
        position: relative;
        text-decoration: none;
        background: rgba(
            33,
            37,
            45,
            0.7
        ); /* fallback for var(--gray) with opacity */
        backdrop-filter: blur(2px);
    }
    .btn.disabled,
    .btn:disabled {
        cursor: not-allowed;
        opacity: 0.6;
        pointer-events: none;
    }
    .btn .btn-inner {
        display: flex;
        align-items: center;
        gap: 0.5em;
    }

    /* Variants */
    .btn.primary {
        background: color-mix(in srgb, var(--gray) 70%, transparent 30%);
        color: var(--fg);
        border: 1.5px solid var(--gray1);
    }
    .btn.primary:hover:not(.disabled) {
        background: color-mix(in srgb, var(--gray) 85%, transparent 15%);
        filter: brightness(1.1);
    }
    .btn.secondary {
        background: var(--gray1);
        color: var(--fg);
    }
    .btn.secondary:hover:not(.disabled) {
        background: var(--gray2);
    }
    .btn.outline {
        background: transparent;
        color: var(--fg);
        border: 1.5px solid var(--blue-type);
    }
    .btn.outline:hover:not(.disabled) {
        background: var(--blue-type);
        color: var(--white);
    }
    .btn.ghost {
        background: transparent;
        color: var(--fg);
    }
    .btn.ghost:hover:not(.disabled) {
        background: var(--visual-select-bg);
    }
    .btn.link {
        background: none;
        color: var(--blue-type);
        text-decoration: underline;
        padding: 0;
        border: none;
    }
    .btn.link:hover:not(.disabled) {
        color: var(--accent);
    }
    .btn.destructive {
        background: var(--red-err);
        color: var(--white);
    }
    .btn.destructive:hover:not(.disabled) {
        background: var(--red-key-w);
    }

    /* Sizes */
    .btn.sm {
        font-size: 0.92em;
        padding: 0.3em 0.8em;
        min-height: 32px;
    }
    .btn.md {
        font-size: 1em;
        padding: 0.5em 1.2em;
        min-height: 40px;
    }
    .btn.lg {
        font-size: 1.12em;
        padding: 0.7em 1.6em;
        min-height: 48px;
    }
    .btn.icon {
        padding: 0.5em;
        width: 40px;
        height: 40px;
        justify-content: center;
    }

    /* Loader */
    .loader {
        border: 2px solid var(--white1);
        border-top: 2px solid var(--blue-type);
        border-radius: 50%;
        width: 1em;
        height: 1em;
        animation: spin 0.8s linear infinite;
        display: inline-block;
    }
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .btn-icon {
        display: flex;
        align-items: center;
        margin-left: 0.25em;
        transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn:hover .btn-icon {
        transform: translateX(3px);
    }
</style>
