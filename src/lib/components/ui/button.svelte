<script lang="ts">
import "$lib/styles/button.css";
import { squircle } from "$lib/actions/squircle";

export const variant:
	| "primary"
	| "secondary"
	| "outline"
	| "ghost"
	| "link"
	| "destructive" = "primary";
export const size: "sm" | "md" | "lg" | "icon" = "md";
export const disabled = false;
export const loading = false;
export const href: string | undefined = undefined;
export const type: "button" | "submit" | "reset" = "button";
</script>

{#if href}
    <a
        use:squircle
        {href}
        class="btn {variant} {size} {disabled ? 'disabled' : ''}"
        tabindex={disabled ? -1 : 0}
        aria-disabled={disabled}
        {...$$restProps}
    >
        <span class="btn-inner">
            {#if loading}
                <span class="loader"></span>
            {/if}
            <slot />
            {#if $$slots.icon}
                <span class="btn-icon"><slot name="icon" /></span>
            {/if}
        </span>
    </a>
{:else}
    <button
        use:squircle
        {type}
        class="btn {variant} {size} {disabled ? 'disabled' : ''}"
        disabled={disabled || loading}
        {...$$restProps}
    >
        <span class="btn-inner">
            {#if loading}
                <span class="loader"></span>
            {/if}
            <slot />
            {#if $$slots.icon}
                <span class="btn-icon"><slot name="icon" /></span>
            {/if}
        </span>
    </button>
{/if}
