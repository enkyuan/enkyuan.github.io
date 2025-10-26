<script lang="ts">
import { linkPreviewStore } from "$lib/stores/link-preview.svelte";
import Card from "$lib/components/ui/card.svelte";
import { fly, fade } from "svelte/transition";

const flyConfig = {
	right: { x: -12, y: 0 },
	left: { x: 12, y: 0 },
	top: { x: 0, y: 12 },
	bottom: { x: 0, y: -12 },
};

// Calculate transform based on placement
function getTransform(placement: string) {
	return (
		{
			right: "translateY(-50%)",
			left: "translate(-100%, -50%)",
			top: "translate(-50%, -100%)",
			bottom: "translateX(-50%)",
		}[placement] || "translateX(-50%)"
	);
}
</script>

{#if linkPreviewStore.visible}
    <div
        class="preview-portal {linkPreviewStore.placement}"
        style="left: {linkPreviewStore.x}px; top: {linkPreviewStore.y}px; transform: {getTransform(
            linkPreviewStore.placement,
        )};"
        in:fly={{
            ...flyConfig[linkPreviewStore.placement],
            duration: 200,
            opacity: 0,
        }}
        out:fly={{
            ...flyConfig[linkPreviewStore.placement],
            duration: 150,
            opacity: 0,
        }}
    >
        <Card variant="elevated" padding="none">
            <div class="preview-content">
                {#if linkPreviewStore.loading}
                    <div class="preview-loading" in:fade={{ duration: 150 }}>
                        <div class="skeleton-container">
                            <div class="skeleton skeleton-title"></div>
                            <div class="skeleton skeleton-description"></div>
                            <div
                                class="skeleton skeleton-description short"
                            ></div>
                            <div class="skeleton skeleton-site"></div>
                        </div>
                    </div>
                {:else if linkPreviewStore.metadata}
                    {#key linkPreviewStore.metadata.url}
                        <div in:fade={{ duration: 200, delay: 50 }}>
                            {#if linkPreviewStore.metadata.image}
                                <div class="preview-image">
                                    <img
                                        src={linkPreviewStore.metadata.image}
                                        alt={linkPreviewStore.metadata.title ||
                                            "Preview"}
                                        loading="lazy"
                                        on:error={(e) => {
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />
                                </div>
                            {/if}
                            <div class="preview-text">
                                {#if linkPreviewStore.metadata.title}
                                    <h3 class="preview-title">
                                        {linkPreviewStore.metadata.title}
                                    </h3>
                                {/if}
                                {#if linkPreviewStore.metadata.description}
                                    <p class="preview-description">
                                        {linkPreviewStore.metadata.description}
                                    </p>
                                {/if}
                                {#if linkPreviewStore.metadata.siteName}
                                    <span class="preview-site"
                                        >{linkPreviewStore.metadata
                                            .siteName}</span
                                    >
                                {/if}
                            </div>
                        </div>
                    {/key}
                {/if}
            </div>
        </Card>
    </div>
{/if}

<style>
    .preview-portal {
        position: fixed;
        z-index: 1000;
        pointer-events: none;
        width: 320px;
        max-width: 90vw;
        transition:
            left 0.2s ease-out,
            top 0.2s ease-out;
    }

    .preview-content {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border-radius: 12px;
    }

    .preview-loading {
        padding: 1rem;
    }

    .skeleton-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .skeleton {
        background: linear-gradient(
            90deg,
            var(--gray1) 25%,
            var(--gray2) 50%,
            var(--gray1) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 6px;
    }

    .skeleton-title {
        height: 1.4rem;
        width: 80%;
    }

    .skeleton-description {
        height: 1rem;
        width: 100%;
    }

    .skeleton-description.short {
        width: 60%;
    }

    .skeleton-site {
        height: 0.9rem;
        width: 40%;
    }

    @keyframes shimmer {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }

    .preview-image {
        width: 100%;
        height: 160px;
        overflow: hidden;
        background: var(--gray1);
        position: relative;
    }

    .preview-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .preview-text {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .preview-title {
        font-size: 1.05rem;
        font-weight: 600;
        color: var(--fg);
        margin: 0;
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .preview-description {
        font-size: 0.9rem;
        color: var(--gray2);
        margin: 0;
        line-height: 1.4;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .preview-site {
        font-size: 0.8rem;
        color: var(--comment);
        font-weight: 500;
        text-transform: lowercase;
    }
</style>
