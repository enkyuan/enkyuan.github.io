<script lang="ts">
let { size = 24, color = "currentColor", class: className = "" } = $props();
</script>

<svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class={className}
>
    <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3 9C3 8.44772 3.44772 8 4 8L20 8C20.5523 8 21 8.44772 21 9C21 9.55229 20.5523 10 20 10L4 10C3.44772 10 3 9.55228 3 9Z"
        fill={color}
    />
    <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3 15C3 14.4477 3.44772 14 4 14L14 14C14.5523 14 15 14.4477 15 15C15 15.5523 14.5523 16 14 16L4 16C3.44772 16 3 15.5523 3 15Z"
        fill={color}
    />
</svg>
