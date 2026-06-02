<script lang="ts">
import { onDestroy, onMount } from "svelte";

const { showLeader = false } = $props<{ showLeader?: boolean }>();

let hours = $state("00");
let minutes = $state("00");
let seconds = $state("00");
let datetime = $state("");
let reducedMotion = $state(false);
/** Skip the first keyed transition so the clock doesn’t animate on page load */
let allowSecondMotion = $state(false);
type ClockSegment = {
	key: "hours" | "minutes" | "seconds";
	value: string;
};

type NumberSwapParams = {
	delay?: number;
	duration?: number;
	easing?: (t: number) => number;
	start?: number;
	blur?: number;
	distance?: number;
	direction?: -1 | 1;
};

/**
 * Number-flow-inspired digit swap: directional vertical roll + blur + opacity.
 */
function numberSwap(_node: Element, params: NumberSwapParams = {}) {
	const {
		delay = 0,
		duration = 180,
		easing = (t: number) => t,
		start = 0.94,
		blur: blurPx = 8,
		distance = 1,
		direction = -1,
	} = params;

	return {
		delay,
		duration,
		easing,
		css: (t: number, u: number) =>
			`opacity:${0.15 + 0.85 * t};transform:translate3d(0, ${direction * u * distance}em, 0) scale(${start + (1 - start) * t});filter:blur(${u * blurPx}px);`,
	};
}

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
const enterMs = $derived(reducedMotion || !allowSecondMotion ? 0 : 260);
const exitMs = $derived(reducedMotion || !allowSecondMotion ? 0 : 180);
const enterDelayMs = $derived(0);
const segments = $derived<ClockSegment[]>([
	{ key: "hours", value: hours },
	{ key: "minutes", value: minutes },
	{ key: "seconds", value: seconds },
]);
</script>

<div class:live-clock-row={showLeader}>
	{#if showLeader}
		<span class="clock-leader" aria-hidden="true"></span>
	{/if}

	<time
		class="live-clock grid items-baseline justify-items-center gap-x-0 text-sm font-medium tracking-normal text-gray-800 [grid-template-columns:2ch_0.45em_2ch_0.45em_2ch] [font-family:var(--font-mono)]"
		{datetime}
		title="Your local time"
	>
		{#each segments as segment, index (segment.key)}
			<span class="grid w-full grid-cols-2 justify-items-center text-center leading-none">
				{#each Array.from(segment.value) as digit, digitIndex}
					<span class="relative block w-[1ch] overflow-hidden leading-none">
						<span class="invisible block">0</span>
						{#key `${segment.key}:${digitIndex}:${digit}`}
							<span
								class="absolute inset-0 block leading-none"
								in:numberSwap={{
									delay: enterDelayMs,
									duration: enterMs,
									start: 0.94,
									blur: 9,
									distance: 1.05,
									direction: -1,
									easing: easeMicroScaleFadeIn,
								}}
								out:numberSwap={{
									duration: exitMs,
									start: 0.94,
									blur: 9,
									distance: 1.05,
									direction: 1,
									easing: easeMicroScaleFadeOut,
								}}
							>{digit}</span>
						{/key}
					</span>
				{/each}
			</span>
			{#if index < segments.length - 1}
				<span class="block w-full text-center select-none text-gray-300" aria-hidden="true"
					>:</span
				>
			{/if}
		{/each}
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
		background-size: 8px 2px;
		background-position: 0 0;
		background-repeat: repeat-x;
	}

</style>
