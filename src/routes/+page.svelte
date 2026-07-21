<script lang="ts">
import { tick } from "svelte";
import { experiences } from "$lib/constants/experiences";
import { projects } from "$lib/constants/projects";
import { socials } from "$lib/constants/socials";

type Tab = "name" | "timeline" | "work";

const tabs: { id: Tab; label: string }[] = [
	{ id: "name", label: "袁恩康" },
	{ id: "timeline", label: "Timeline" },
	{ id: "work", label: "Works" },
];

let activeTab = $state<Tab>("name");
let suppressTransition = $state(false);
let tabButtons: HTMLButtonElement[] = [];

async function selectTab(tab: Tab, fromKeyboard = false) {
	if (tab === activeTab) return;
	suppressTransition = fromKeyboard;
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

		{#if activeTab === "timeline"}
			<div
				class="tab-panel"
				id="timeline-panel"
				role="tabpanel"
				aria-labelledby="timeline-tab"
			>
				{#each experiences as experience}
					<article class="timeline-entry">
						<p class="entry-date">{experience.dates}</p>
						<div class="entry-copy">
							<h2>{experience.company}</h2>
							<p>{experience.description}</p>
							{#each experience.achievements as achievement}
								<p>{achievement.text}</p>
							{/each}
						</div>
					</article>
				{/each}

				<article class="timeline-entry connect-entry">
					<p class="entry-date">Connect</p>
					<div class="entry-copy">
						<div class="social-links">
							{#each socials as social}
								<a href={social.href}>{social.text}</a>
							{/each}
						</div>
					</div>
				</article>
			</div>
		{:else if activeTab === "work"}
			<div
				class="tab-panel"
				id="work-panel"
				role="tabpanel"
				aria-labelledby="work-tab"
			>
				{#each projects as project}
					<article class="timeline-entry">
						<p class="entry-date">{project.dates}</p>
						<div class="entry-copy">
							<h2>{project.name}</h2>
							<p>{project.description}</p>
							{#each project.achievements as achievement}
								<p>{achievement.text}</p>
							{/each}
						</div>
					</article>
				{/each}
			</div>
		{:else}
			<div
				id="name-panel"
				role="tabpanel"
				aria-labelledby="name-tab"
			></div>
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
		background: #ffffff;
		color: #17191d;
	}

	:global(button),
	:global(a) {
		-webkit-tap-highlight-color: transparent;
	}

	.portfolio-shell {
		position: relative;
		min-height: 100svh;
		background: #ffffff;
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
		color: rgba(23, 25, 29, 0.48);
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
		color: #17191d;
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
		background: linear-gradient(145deg, #050b18 2%, #173b84 52%, #78a2d5 82%, #dce7ef 100%);
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
		outline-color: #173b84;
	}

	.secondary-tab {
		font-family: ".SF NS Rounded", "SF Pro Rounded", "Portfolio Rounded", sans-serif;
	}

	.tab-panel {
		padding-top: clamp(3rem, 7vh, 4.25rem);
	}

	.timeline-entry {
		display: grid;
		grid-template-columns: 6.5rem minmax(0, 1fr);
		gap: 1.25rem;
		margin-bottom: clamp(2.75rem, 7vh, 4.5rem);
	}

	.timeline-entry:last-child {
		margin-bottom: 0;
	}

	.entry-date {
		margin: 0;
		color: rgba(23, 25, 29, 0.47);
		font-size: 0.975rem;
		line-height: 1.5;
		letter-spacing: -0.012em;
	}

	.entry-copy {
		min-width: 0;
	}

	.entry-copy h2,
	.entry-copy p {
		margin: 0;
		font-size: 1rem;
		line-height: 1.45;
		letter-spacing: -0.018em;
		text-wrap: pretty;
	}

	.entry-copy h2 {
		font-weight: 500;
	}

	.entry-copy p {
		color: rgba(23, 25, 29, 0.9);
	}

	.entry-copy h2 + p,
	.entry-copy p + p {
		margin-top: 1.15rem;
	}

	.social-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 1.25rem;
	}

	.social-links a {
		position: relative;
		display: inline-flex;
		min-height: 40px;
		align-items: center;
		color: #17191d;
		font-size: 1rem;
		text-decoration-color: rgba(23, 25, 29, 0.22);
		text-underline-offset: 3px;
		transition:
			text-decoration-color 140ms ease,
			transform 140ms var(--ease-out);
	}

	.social-links a:active {
		transform: scale(0.96);
	}

	.suppress-transition .tab-list button {
		transition-duration: 0ms;
	}

	@media (hover: hover) and (pointer: fine) {
		.tab-list button:hover,
		.social-links a:hover {
			color: #17191d;
		}

		.social-links a:hover {
			text-decoration-color: #17191d;
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

		.timeline-entry {
			grid-template-columns: 1fr;
			gap: 0.8rem;
			margin-bottom: 3.25rem;
		}

		.entry-date {
			font-size: 0.875rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tab-list button,
		.social-links a {
			transition-duration: 0ms;
		}

	}
</style>
