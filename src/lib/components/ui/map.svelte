<script lang="ts">
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import Badge from "$lib/components/ui/badge.svelte";
	import Flags from "$lib/components/ui/flags.svelte";
	import {
		createLocationGradient,
		createWorldGrid,
		findLocationCluster,
		formatCoordinate,
		nearestLocation,
		WORLD_GRID_COLUMNS,
		WORLD_GRID_ROWS,
	} from "$lib/map";

	type LocationState = "locating" | "located" | "error";

	let { animate = true } = $props<{ animate?: boolean }>();

	const cells = createWorldGrid();
	const LOADER_GRID = 12;
	const LOADER_DOTS = Array.from({ length: LOADER_GRID }, (_, index) => index);
	const LOADER_STEP = 34 / LOADER_GRID;

	let locationState: LocationState = $state("locating");
	let place = $state("Current location");
	let countryCode = $state("");
	let latitude: number | undefined = $state();
	let longitude: number | undefined = $state();
	let highlightedCells: string[] = $state([]);
	let highlightedCellColors: Map<string, string> = $state(new Map());
	let statusMessage = $state("Finding your spot on the map.");
	let prefersReducedMotion = $state(false);

	onMount(() => {
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		const updateMotionPreference = () => {
			prefersReducedMotion = reducedMotion.matches;
		};

		updateMotionPreference();
		reducedMotion.addEventListener("change", updateMotionPreference);
		locate();

		return () => reducedMotion.removeEventListener("change", updateMotionPreference);
	});

	function locate() {
		if (!("geolocation" in navigator)) {
			locationState = "error";
			statusMessage = "Location is not available in this browser.";
			return;
		}

		locationState = "locating";
		statusMessage = "Finding your spot on the map.";

		navigator.geolocation.getCurrentPosition(
			(position) => {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				const nearest = nearestLocation(latitude, longitude);
				place = nearest.name;
				countryCode = nearest.countryCode;
				const cluster = findLocationCluster(
					cells,
					latitude,
					longitude,
				);
				highlightedCells = cluster;
				highlightedCellColors = createLocationGradient(cells, cluster);
				locationState = "located";
				statusMessage = `Current location found near ${place}.`;
			},
			() => {
				locationState = "error";
				statusMessage = "Location not found.";
			},
			{ enableHighAccuracy: true, maximumAge: 0 },
		);
	}

	function cellStyle(row: number, column: number, color: string | undefined) {
		const delay = Math.min(column * 3 + Math.abs(row - (WORLD_GRID_ROWS - 1) / 2) * 2, 220);
		return `grid-column:${column + 1};grid-row:${row + 1};--cell-delay:${delay}ms;--cell-color:${color ?? "#e7e8ea"}`;
	}

	function pillPosition(currentLatitude: number | undefined, currentLongitude: number | undefined) {
		if (currentLatitude === undefined || currentLongitude === undefined) return undefined;
		const x = ((currentLongitude + 180) / 360) * 100;
		const y = ((90 - currentLatitude) / 180) * 100;
		return `--anchor-x:${x}%;--anchor-y:${y}%`;
	}

	function isLoadingDotVisible(row: number, column: number) {
		const center = (LOADER_GRID - 1) / 2;
		return (column - center) ** 2 + (row - center) ** 2 <= 31;
	}

	function loadingDotDelay(row: number, column: number) {
		const center = (LOADER_GRID - 1) / 2;
		return Math.round(Math.hypot(column - center, row - center) * 64);
	}

	function isErrorDotVisible(row: number, column: number) {
		const center = (LOADER_GRID - 1) / 2;
		const x = Math.abs(column - center);
		const y = Math.abs(row - center);
		return x ** 2 + y ** 2 <= 26 && Math.abs(x - y) <= 1;
	}
</script>

<section class:animate class="map" aria-labelledby="location-title">
	<div class="map-stage">
		<div
			class="map-grid"
			role="img"
			aria-label={locationState === "located"
				? `Pixel world map highlighting your current location near ${place}`
				: locationState === "error"
					? "Pixel world map; current location not found"
					: "Pixel world map awaiting your location"}
		>
			{#each cells as cell}
				{@const locationColor = highlightedCellColors.get(cell.id)}
				<span
					class:location-cell={locationColor !== undefined}
					class:location-anchor={cell.id === highlightedCells[0]}
					class="map-cell"
					style={cellStyle(cell.row, cell.column, locationColor)}
					aria-hidden="true"
				></span>
			{/each}
		</div>

		{#key locationState}
			<div
				class:error={locationState === "error"}
				class:locating={locationState === "locating"}
				class:bottom-state={locationState !== "located"}
				class:located={locationState === "located" && latitude !== undefined && longitude !== undefined}
				class:opens-right={longitude === undefined || longitude < 0}
				class:opens-left={longitude !== undefined && longitude >= 0}
				class:opens-below={latitude === undefined || latitude >= 0}
				class:opens-above={latitude !== undefined && latitude < 0}
				class="location-badge-anchor"
				style={pillPosition(latitude, longitude)}
				in:fade={{ duration: animate && !prefersReducedMotion ? 180 : 0 }}
				out:fade={{ duration: animate && !prefersReducedMotion ? 120 : 0 }}
			>
				<Badge
					class="location-badge"
					onclick={locationState === "locating" ? undefined : () => locate()}
					ariaLabel={locationState === "error"
						? "Try finding your location again"
						: locationState === "located"
							? "Refresh your current location"
							: undefined}
					ariaLive="polite"
					title={locationState === "error"
						? "Try again"
						: locationState === "located"
							? "Refresh location"
							: undefined}
				>
				{#if locationState === "located" && latitude !== undefined && longitude !== undefined}
					<Flags {countryCode} />
					<div class="pill-copy">
						<h1 id="location-title">{place}</h1>
						<p class="coordinates">
							{formatCoordinate(latitude, "N", "S", 3)} · {formatCoordinate(longitude, "E", "W", 3)}
						</p>
					</div>
				{:else if locationState === "error"}
					<span class="error-field" aria-hidden="true">
						<svg viewBox="0 0 34 34" focusable="false">
							{#each LOADER_DOTS as row}
								{#each LOADER_DOTS as column}
									{#if isLoadingDotVisible(row, column)}
										<circle
											class:error-mark={isErrorDotVisible(row, column)}
											cx={column * LOADER_STEP + LOADER_STEP / 2}
											cy={row * LOADER_STEP + LOADER_STEP / 2}
											r="1.15"
										/>
									{/if}
								{/each}
							{/each}
						</svg>
					</span>
					<h1 id="location-title">Location not found</h1>
				{:else}
					<span class="loading-field" aria-hidden="true">
						<svg viewBox="0 0 34 34" focusable="false">
							{#each LOADER_DOTS as row}
								{#each LOADER_DOTS as column}
									{#if isLoadingDotVisible(row, column)}
										<circle
											cx={column * LOADER_STEP + LOADER_STEP / 2}
											cy={row * LOADER_STEP + LOADER_STEP / 2}
											r="1.15"
											style={`--loader-delay:${loadingDotDelay(row, column)}ms`}
										/>
									{/if}
								{/each}
							{/each}
						</svg>
					</span>
					<h1 id="location-title">Finding your spot on the map…</h1>
				{/if}
				</Badge>
			</div>
		{/key}
	</div>
	<p class="sr-only" aria-live="polite">{statusMessage}</p>
</section>

<style>
	.map {
		position: relative;
		isolation: isolate;
		padding-top: clamp(2.75rem, 7vh, 4.25rem);
		padding-bottom: 7.5rem;
	}

	.map-stage {
		position: relative;
	}

	.map-grid {
		display: grid;
		grid-template-columns: repeat(64, minmax(0, 1fr));
		grid-template-rows: repeat(32, minmax(0, 1fr));
		gap: clamp(2px, 0.45vw, 3px);
		width: 100%;
		aspect-ratio: 2 / 1;
	}

	.map-cell {
		aspect-ratio: 1;
		border-radius: clamp(1px, 0.24vw, 2px);
		background: var(--cell-color);
		transition: transform 220ms var(--ease-out);
	}

	.animate .map-cell {
		animation: map-cell-enter 300ms var(--ease-out) var(--cell-delay) backwards;
	}

	.map-cell.location-cell {
		transform: scale(1.08);
	}

	.animate .map-cell.location-anchor {
		z-index: 2;
		animation: location-cell-drop 420ms var(--ease-out) 60ms both;
	}

	.location-badge-anchor {
		position: absolute;
		z-index: 3;
		width: fit-content;
		max-width: calc(100% - 1.5rem);
		bottom: clamp(0.75rem, 3vw, 1.5rem);
		left: clamp(1rem, 7vw, 3.5rem);
	}

	.location-badge-anchor.located {
		top: var(--anchor-y);
		bottom: auto;
		left: var(--anchor-x);
	}

	.location-badge-anchor.bottom-state {
		position: fixed;
		top: auto;
		right: auto;
		bottom: max(1.5rem, env(safe-area-inset-bottom));
		left: 50%;
		z-index: 20;
		transform: translateX(-50%);
	}

	.location-badge-anchor.located.opens-right.opens-below {
		transform: translate(14px, 12px);
	}

	.location-badge-anchor.located.opens-left.opens-below {
		transform: translate(calc(-100% - 14px), 12px);
	}

	.location-badge-anchor.located.opens-right.opens-above {
		transform: translate(14px, calc(-100% - 12px));
	}

	.location-badge-anchor.located.opens-left.opens-above {
		transform: translate(calc(-100% - 14px), calc(-100% - 12px));
	}

	.pill-copy {
		min-width: 0;
	}

	.location-badge-anchor h1,
	.coordinates {
		margin: 0;
	}

	.location-badge-anchor h1 {
		font-family: "Portfolio Rounded", sans-serif;
		font-size: 0.875rem;
		font-weight: 400;
		letter-spacing: -0.015em;
		line-height: 1.2;
		white-space: nowrap;
	}

	.loading-field,
	.error-field {
		display: block;
		flex: 0 0 34px;
		width: 34px;
		height: 34px;
		transform: translateY(-0.5px);
	}

	.loading-field svg,
	.error-field svg {
		display: block;
		width: 100%;
		height: 100%;
	}

	.loading-field circle {
		fill: currentColor;
		opacity: 0.16;
		animation: loading-dot 900ms var(--ease-out) infinite;
		animation-delay: calc(var(--loader-delay) - 900ms);
	}

	.error-field {
		border-radius: 50%;
	}

	.error-field circle {
		fill: rgba(255, 184, 186, 0.42);
	}

	.error-field circle.error-mark {
		fill: #ff5c63;
	}

	.coordinates {
		margin-top: 0.18rem;
		color: rgba(247, 248, 250, 0.62);
		font-size: 0.75rem;
		letter-spacing: -0.01em;
		line-height: 1.2;
		white-space: nowrap;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@keyframes map-cell-enter {
		from {
			opacity: 0;
			transform: scale(0.72);
		}

		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes location-cell-drop {
		from {
			opacity: 0;
			transform: translateY(-18px) scale(0.92);
		}

		to {
			opacity: 1;
			transform: translateY(0) scale(1.08);
		}
	}

	@keyframes loading-dot {
		0%,
		60%,
		100% {
			opacity: 0.16;
		}

		30% {
			opacity: 0.88;
		}
	}

	@media (max-width: 560px) {
		.map {
			padding-top: 2.5rem;
			padding-bottom: 4.5rem;
		}

		.location-badge-anchor {
			max-width: calc(100% - 1rem);
			bottom: 0.5rem;
			left: 0.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.map-cell,
		.map-cell.location-anchor,
		.location-badge-anchor {
			animation: none;
			transition-duration: 0ms;
		}

		.loading-field circle {
			animation: loading-dot-reduced 1.4s ease-in-out infinite;
			animation-delay: calc(var(--loader-delay) - 1.4s);
		}
	}

	@keyframes loading-dot-reduced {
		0%,
		100% {
			opacity: 0.35;
		}

		50% {
			opacity: 1;
		}
	}
</style>
