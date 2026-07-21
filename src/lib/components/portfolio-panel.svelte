<script lang="ts">
type PortfolioEntry = {
	title: string;
	dates: string;
	description: string;
	achievements: { text: string }[];
};

let { id, labelledBy, entries, animate = true } = $props<{
	id: string;
	labelledBy: string;
	entries: PortfolioEntry[];
	animate?: boolean;
}>();

function staggerDelay(entryIndex: number, itemIndex: number) {
	return Math.min(entryIndex * 70 + itemIndex * 35, 280);
}
</script>

<div
	class="tab-panel"
	class:animate-content={animate}
	{id}
	role="tabpanel"
	aria-labelledby={labelledBy}
>
	{#each entries as entry, entryIndex}
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

<style>
	.tab-panel {
		padding-top: clamp(3rem, 7vh, 4.25rem);
	}

	.animate-content .stagger-item {
		animation: content-enter 260ms var(--ease-out) var(--stagger-delay, 0ms) both;
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

	@keyframes content-enter {
		from {
			opacity: 0;
			transform: translateY(0.45rem);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 560px) {
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
		.animate-content .stagger-item {
			animation: none;
		}
	}
</style>
