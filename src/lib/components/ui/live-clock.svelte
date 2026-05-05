<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { scale } from "svelte/transition";

const { showLeader = false } = $props<{ showLeader?: boolean }>();

let hours = $state("00");
let minutes = $state("00");
let seconds = $state("00");
let datetime = $state("");
let reducedMotion = $state(false);
/** Skip the first keyed transition so the clock doesn’t animate on page load */
let allowSecondMotion = $state(false);

/**
 * Y at linear time `t` for CSS `cubic-bezier(x1,y1,x2,y2)` (used by animate-text specs).
 */
function cubicBezierYAtX(
	t: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
): number {
	function xAt(u: number) {
		const i = 1 - u;
		return 3 * i * i * u * x1 + 3 * i * u * u * x2 + u * u * u;
	}
	function yAt(u: number) {
		const i = 1 - u;
		return 3 * i * i * u * y1 + 3 * i * u * u * y2 + u * u * u;
	}
	let low = 0;
	let high = 1;
	let u = t;
	for (let k = 0; k < 14; k++) {
		u = (low + high) * 0.5;
		if (xAt(u) < t) low = u;
		else high = u;
	}
	return yAt(u);
}

/** `micro-scale-fade` enter.signature_easing — animate-text skill */
function easeMicroScaleFadeIn(linearT: number): number {
	return cubicBezierYAtX(linearT, 0.32, 0.72, 0, 1);
}

/** `micro-scale-fade` exit.easing — animate-text skill */
function easeMicroScaleFadeOut(linearT: number): number {
	return cubicBezierYAtX(linearT, 0.7, 0, 0.84, 0);
}

function pad(n: number) {
	return n.toString().padStart(2, "0");
}

function updateClock() {
	const now = new Date();
	hours = pad(now.getHours());
	minutes = pad(now.getMinutes());
	seconds = pad(now.getSeconds());
	datetime = now.toISOString();
}

let intervalId: ReturnType<typeof setInterval>;

onMount(() => {
	reducedMotion =
		globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
		false;
	updateClock();
	intervalId = globalThis.setInterval(updateClock, 1000);
	globalThis.requestAnimationFrame(() => {
		globalThis.requestAnimationFrame(() => {
			allowSecondMotion = true;
		});
	});
});

onDestroy(() => {
	globalThis.clearInterval(intervalId);
});

/** Spec enter/exit durations scaled for a 1s cadence (base 600ms / 400ms) */
const enterMs = $derived(reducedMotion || !allowSecondMotion ? 0 : 220);
const exitMs = $derived(reducedMotion || !allowSecondMotion ? 0 : 160);
/** `micro-scale-fade` swap.overlap_ms=0 + micro_delay_ms=20 — animate-text skill */
const enterDelayMs = $derived(
	reducedMotion || !allowSecondMotion ? 0 : exitMs + 20,
);
/** Convert animation time to visible dot ticks (keep count high enough for smooth time flow). */
const leaderTickCount = $derived(
	reducedMotion || !allowSecondMotion ? 1 : Math.max(18, Math.round(enterMs / 12)),
);
const leaderTravelPx = $derived(leaderTickCount * 6);
const leaderMotionStyle = $derived(
	`animation-duration:${enterMs}ms;animation-delay:${enterDelayMs}ms;animation-timing-function:steps(${leaderTickCount}, end);--clock-dot-travel:${leaderTravelPx}px`,
);
</script>

<div class:live-clock-row={showLeader}>
	{#if showLeader}
		<span class="clock-leader" aria-hidden="true">
			{#if !reducedMotion && allowSecondMotion}
				{#key seconds}
					<span
						class="clock-leader-motion"
						style={leaderMotionStyle}
					></span>
				{/key}
			{/if}
		</span>
	{/if}

	<time
		class="live-clock grid items-baseline justify-items-center gap-x-0 text-sm font-medium tracking-normal text-gray-800 [grid-template-columns:2ch_0.45em_2ch_0.45em_2ch] [font-family:var(--font-mono)]"
		{datetime}
		title="Your local time"
	>
		<span class="block w-full text-center">{hours}</span>
		<span class="block w-full text-center select-none text-gray-300" aria-hidden="true"
			>:</span
		>
		<span class="block w-full text-center">{minutes}</span>
		<span class="block w-full text-center select-none text-gray-300" aria-hidden="true"
			>:</span
		>
		<span class="relative block w-full text-center leading-none">
			<span class="invisible block">{seconds}</span>
			{#key seconds}
				<span
					class="absolute inset-0 block leading-none"
					in:scale={{
						delay: enterDelayMs,
						duration: enterMs,
						start: 0.96,
						opacity: 0,
						easing: easeMicroScaleFadeIn,
					}}
					out:scale={{
						duration: exitMs,
						start: 0.96,
						opacity: 0,
						easing: easeMicroScaleFadeOut,
					}}
				>{seconds}</span>
			{/key}
		</span>
	</time>
</div>

<style>
	.live-clock-row {
		display: flex;
		width: 100%;
		align-items: baseline;
		gap: 0.75rem;
	}

	.clock-leader {
		position: relative;
		flex: 1;
		min-width: 1.5rem;
		height: 2px;
		align-self: center;
		overflow: hidden;
		background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
		background-size: 6px 2px;
		background-position: 0 0;
		background-repeat: repeat-x;
	}

	.clock-leader-motion {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(circle, #9ca3af 1px, transparent 1px);
		background-size: 6px 2px;
		background-position: 0 0;
		background-repeat: repeat-x;
		animation-name: clock-dots-tick;
		animation-fill-mode: both;
	}

	@keyframes clock-dots-tick {
		from {
			background-position: 0 0;
			opacity: 0.35;
		}

		to {
			background-position: var(--clock-dot-travel, 6px) 0;
			opacity: 0.78;
		}
	}
</style>
