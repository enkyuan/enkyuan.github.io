<script lang="ts">
import { tick } from "svelte";
import About from "$lib/components/about.svelte";
import Map from "$lib/components/ui/map.svelte";
import { experiences } from "$lib/constants/experiences";
import { projects } from "$lib/constants/projects";
import "./portfolio-entries.css";

type Tab = "name" | "timeline" | "work";

const tabs: { id: Tab; label: string }[] = [
	{ id: "name", label: "袁恩康" },
	{ id: "timeline", label: "Timeline" },
	{ id: "work", label: "Work" },
];
const timelineEntries = experiences.map(({ company, ...entry }) => ({ title: company, ...entry }));
const workEntries = projects.map(({ name, ...entry }) => ({ title: name, ...entry }));

let activeTab = $state<Tab>("name");
let suppressTransition = $state(false);
let animateContent = $state(true);
let tabButtons: HTMLButtonElement[] = [];
let activeEntries = $derived(
	activeTab === "timeline" ? timelineEntries : activeTab === "work" ? workEntries : [],
);

function staggerDelay(entryIndex: number, itemIndex: number) {
	return Math.min(entryIndex * 70 + itemIndex * 35, 280);
}

async function selectTab(tab: Tab, fromKeyboard = false) {
	if (tab === activeTab) return;
	suppressTransition = fromKeyboard;
	animateContent = !fromKeyboard;
	activeTab = tab;
	await tick();
	if (fromKeyboard) {
		requestAnimationFrame(() => {
			suppressTransition = false;
		});
	}
}

function handleTabKeydown(event: KeyboardEvent, index: number) {
	let nextIndex: number | undefined;
	if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
	if (event.key === "ArrowLeft") {
		nextIndex = (index - 1 + tabs.length) % tabs.length;
	}
	if (event.key === "Home") nextIndex = 0;
	if (event.key === "End") nextIndex = tabs.length - 1;
	if (nextIndex === undefined) return;

	event.preventDefault();
	void selectTab(tabs[nextIndex].id, true);
	tabButtons[nextIndex]?.focus();
}
</script>

<div
	class:suppress-transition={suppressTransition}
	class="portfolio-shell"
>
	<div class="portfolio-frame">
		<div class="tab-list" aria-label="Portfolio" role="tablist">
			{#each tabs as tab, index}
				<button
					bind:this={tabButtons[index]}
					class:identity-tab={tab.id === "name"}
					class:secondary-tab={tab.id !== "name"}
					class:active={activeTab === tab.id}
					id={`${tab.id}-tab`}
					type="button"
					role="tab"
					aria-label={tab.label}
					aria-selected={activeTab === tab.id}
					aria-controls={`${tab.id}-panel`}
					tabindex={activeTab === tab.id ? 0 : -1}
					onclick={() => selectTab(tab.id)}
					onkeydown={(event) => handleTabKeydown(event, index)}
				>
					{#if tab.id === "name"}
						<span class="hanzi-name" aria-hidden="true">袁恩康</span>
					{:else}
						{tab.label}
					{/if}
				</button>
			{/each}
		</div>

		<div
			id="name-panel"
			role="tabpanel"
			aria-labelledby="name-tab"
			hidden={activeTab !== "name"}
		>
			<Map animate={animateContent} />
			<About />
		</div>

		{#if activeTab !== "name"}
			<div
				class="tab-panel"
				class:animate-content={animateContent}
				id={`${activeTab}-panel`}
				role="tabpanel"
				aria-labelledby={`${activeTab}-tab`}
			>
				{#each activeEntries as entry, entryIndex}
					<article class="timeline-entry">
						<p
							class="entry-date stagger-item"
							style={`--stagger-delay: ${staggerDelay(entryIndex, 0)}ms`}
						>
							{entry.dates}
						</p>
						<div class="entry-copy">
							<h2
								class="stagger-item"
								style={`--stagger-delay: ${staggerDelay(entryIndex, 1)}ms`}
							>
								{entry.title}
							</h2>
							<p
								class="stagger-item"
								style={`--stagger-delay: ${staggerDelay(entryIndex, 2)}ms`}
							>
								{entry.description}
							</p>
							{#each entry.achievements as achievement, itemIndex}
								<p
									class="stagger-item"
									style={`--stagger-delay: ${staggerDelay(entryIndex, itemIndex + 3)}ms`}
								>
									{achievement.text}
								</p>
							{/each}
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	@font-face {
		font-family: "Ndot 77 JP Extended Name";
		src: url("/fonts/ndot-77-jp-extended/name.woff2") format("woff2");
		font-display: block;
		font-style: normal;
		font-weight: 400;
	}

	@font-face {
		font-family: "Portfolio Rounded";
		src: url("/fonts/nunito/regular-latin.woff2") format("woff2");
		font-display: block;
		font-style: normal;
		font-weight: 400;
	}

	:global(:root) {
		--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
	}

	:global(body) {
		min-width: 320px;
		min-height: 100vh;
		height: auto;
		background: oklch(1 0 0);
		color: oklch(0.213 0.008 264.379);
	}

	:global(button),
	:global(a) {
		-webkit-tap-highlight-color: transparent;
	}

	.portfolio-shell {
		position: relative;
		min-height: 100svh;
		background: oklch(1 0 0);
		overflow: hidden;
	}

	.portfolio-frame {
		width: min(100% - 3rem, 38rem);
		min-height: 100svh;
		margin-inline: auto;
		padding-block: clamp(4rem, 11vh, 7.5rem) 6rem;
	}

	.tab-list {
		display: flex;
		align-items: center;
		gap: clamp(1.25rem, 4vw, 1.75rem);
		min-height: 44px;
	}

	.tab-list button {
		position: relative;
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		border: 0;
		padding: 0;
		background: transparent;
		color: oklch(0.213 0.008 264.379 / 0.48);
		font-size: 1rem;
		font-weight: 400;
		letter-spacing: -0.018em;
		cursor: pointer;
		transition:
			color 160ms ease,
			transform 140ms var(--ease-out);
	}

	.tab-list button.active,
	.tab-list button:focus-visible {
		color: oklch(0.213 0.008 264.379);
	}

	.tab-list button:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 5px;
		border-radius: 2px;
	}

	.tab-list button:active {
		transform: scale(0.96);
	}

	.tab-list .identity-tab {
		flex: 0 0 auto;
		transform-origin: left center;
	}

	.hanzi-name {
		display: block;
		background: linear-gradient(
			145deg,
			oklch(0.151 0.03 261.872) 2%,
			oklch(0.373 0.13 262.31) 52%,
			oklch(0.702 0.088 253.74) 82%,
			oklch(0.922 0.016 239.116) 100%
		);
		background-clip: text;
		color: transparent;
		font-family: "Ndot 77 JP Extended Name", sans-serif;
		font-size: 1.125rem;
		font-weight: 400;
		font-synthesis: none;
		line-height: 1;
		transform: translateY(1px);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.tab-list .identity-tab:focus-visible {
		outline-color: oklch(0.373 0.13 262.31);
	}

	.secondary-tab {
		font-family: ".SF NS Rounded", "SF Pro Rounded", "Portfolio Rounded", sans-serif;
		animation: secondary-tab-enter 240ms var(--ease-out) 180ms both;
	}

	.secondary-tab:nth-child(3) {
		animation-delay: 250ms;
	}

	@keyframes secondary-tab-enter {
		from {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	.suppress-transition .tab-list button {
		transition-duration: 0ms;
	}

	@media (hover: hover) and (pointer: fine) {
		.tab-list button:hover {
			color: oklch(0.213 0.008 264.379);
		}
	}

	@media (max-width: 560px) {
		.portfolio-frame {
			width: min(100% - 2.25rem, 38rem);
			padding-block: 2.75rem 4.5rem;
		}

		.tab-list {
			gap: 1.1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tab-list button {
			transition-duration: 0ms;
		}

		.secondary-tab {
			animation: none;
		}
	}
</style>
