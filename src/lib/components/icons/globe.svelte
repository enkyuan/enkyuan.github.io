<script lang="ts">
export let focused: boolean = false;
</script>

<svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style="transform: rotate(20deg)"
>
    <circle
        cx="12"
        cy="12"
        r="10"
        stroke={focused ? "var(--blue-type)" : "var(--fg)"}
        stroke-width="1.5"
    />
    <path
        d="M7.5 12C7.5 18 12 22 12 22C12 22 16.5 18 16.5 12C16.5 6 12 2 12 2C12 2 7.5 6 7.5 12Z"
        stroke={focused ? "var(--blue-type)" : "var(--fg)"}
        stroke-width="1.5"
        stroke-linejoin="round"
    />
    <path
        d="M22 12L2 12"
        stroke={focused ? "var(--blue-type)" : "var(--fg)"}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
    />
</svg>
