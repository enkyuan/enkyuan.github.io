<script lang="ts">
	import { onMount } from "svelte";
	import {
		createWorldGrid,
		findLocationCluster,
		formatCoordinate,
		nearestPlace,
		WORLD_GRID_ROWS,
	} from "$lib/location-map";

	type LocationState = "locating" | "located" | "error";

	let { animate = true } = $props<{ animate?: boolean }>();

	const cells = createWorldGrid();
	const clusterPalette = [
		"#dce7ef",
		"#aac2df",
		"#78a2d5",
		"#426fb4",
		"#173b84",
		"#0c255c",
		"#050b18",
	];

	let locationState: LocationState = $state("locating");
	let place = $state("Current location");
	let latitude: number | undefined = $state();
	let longitude: number | undefined = $state();
	let highlightedCells: string[] = $state([]);
	let statusMessage = $state("Finding your current location.");

	onMount(locate);

	function locate() {
		if (!("geolocation" in navigator)) {
			locationState = "error";
			statusMessage = "Location is not available in this browser.";
			return;
		}

		locationState = "locating";
		statusMessage = "Finding your current location.";

		navigator.geolocation.getCurrentPosition(
			(position) => {
				latitude = Number(position.coords.latitude.toFixed(2));
				longitude = Number(position.coords.longitude.toFixed(2));
				place = nearestPlace(position.coords.latitude, position.coords.longitude);
				highlightedCells = findLocationCluster(
					cells,
					position.coords.latitude,
					position.coords.longitude,
				);
				locationState = "located";
				statusMessage = `Current location found near ${place}.`;
			},
			(error) => {
				locationState = "error";
				statusMessage =
					error.code === error.PERMISSION_DENIED
						? "Location access was not allowed. You can retry whenever you are ready."
						: "Your location could not be found. Check your connection and try again.";
			},
			{ enableHighAccuracy: false, maximumAge: 300_000, timeout: 10_000 },
		);
	}

	function cellStyle(row: number, column: number, rank: number) {
		const delay = Math.min(column * 3 + Math.abs(row - (WORLD_GRID_ROWS - 1) / 2) * 2, 220);
		const color = rank >= 0 ? clusterPalette[Math.min(rank, clusterPalette.length - 1)] : "#e7e8ea";
		return `grid-column:${column + 1};grid-row:${row + 1};--cell-delay:${delay}ms;--cell-color:${color}`;
	}
</script>

<section class:animate class="location-map" aria-labelledby="location-title">
	<div
		class="map-grid"
		role="img"
		aria-label={locationState === "located"
			? `Pixel world map highlighting your current location near ${place}`
			: "Pixel world map awaiting your location"}
	>
		{#each cells as cell}
			{@const rank = highlightedCells.indexOf(cell.id)}
			<span
				class:location-cell={rank >= 0}
				class:location-anchor={rank === 0}
				class="map-cell"
				style={cellStyle(cell.row, cell.column, rank)}
				aria-hidden="true"
			></span>
		{/each}
	</div>

	<div class:error={locationState === "error"} class="location-pill" aria-live="polite">
		<span class="pill-marker" aria-hidden="true"></span>

		{#if locationState === "located" && latitude !== undefined && longitude !== undefined}
			<div class="pill-copy">
				<h1 id="location-title">{place}</h1>
				<p class="coordinates">
					{formatCoordinate(latitude, "N", "S")} · {formatCoordinate(longitude, "E", "W")}
				</p>
			</div>
		{:else if locationState === "error"}
			<h1 id="location-title">Location unavailable</h1>
			<button type="button" onclick={locate}>Try again</button>
		{:else}
			<h1 id="location-title">Finding your location…</h1>
		{/if}
	</div>
	<p class="sr-only" aria-live="polite">{statusMessage}</p>
</section>

<style>
	.location-map {
		position: relative;
		isolation: isolate;
		padding-top: clamp(2.75rem, 7vh, 4.25rem);
		padding-bottom: 7.5rem;
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
		position: relative;
		aspect-ratio: 1;
		border-radius: clamp(1px, 0.24vw, 2px);
		background: var(--cell-color);
		transition:
			background-color 220ms var(--ease-out),
			transform 220ms var(--ease-out);
	}

	.animate .map-cell {
		animation: map-cell-enter 300ms var(--ease-out) var(--cell-delay) backwards;
	}

	.map-cell.location-cell {
		transform: scale(1.08);
	}

	.map-cell.location-anchor {
		z-index: 2;
	}

	.map-cell.location-anchor::after {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 13px;
		height: 13px;
		border: 2px solid #ffffff;
		border-radius: 50% 50% 50% 0;
		background: radial-gradient(circle at center, #ffffff 0 2px, #173b84 2.5px);
		box-shadow: 0 2px 5px rgba(5, 11, 24, 0.24);
		content: "";
		transform: translate(-50%, -95%) rotate(-45deg);
		animation: location-pin-drop 420ms var(--ease-out) 60ms both;
	}

	.location-pill {
		position: relative;
		z-index: 1;
		display: flex;
		width: fit-content;
		max-width: calc(100% - 1.5rem);
		min-height: 54px;
		align-items: center;
		gap: 0.7rem;
		margin-top: clamp(-2.75rem, -5vw, -1.75rem);
		margin-left: clamp(1rem, 7vw, 3.5rem);
		border-radius: 999px;
		padding: 0.55rem 0.75rem;
		background: #111315;
		box-shadow:
			0 1px 2px rgba(5, 11, 24, 0.18),
			0 5px 12px rgba(5, 11, 24, 0.12);
		color: #f7f8fa;
	}

	.animate .location-pill {
		animation: pill-enter 300ms var(--ease-out) 180ms backwards;
	}

	.pill-copy {
		min-width: 0;
	}

	.location-pill h1,
	.coordinates {
		margin: 0;
	}

	.location-pill h1 {
		font-family: "Portfolio Rounded", sans-serif;
		font-size: 0.875rem;
		font-weight: 400;
		letter-spacing: -0.015em;
		line-height: 1.2;
		white-space: nowrap;
	}

	.coordinates {
		margin-top: 0.18rem;
		color: rgba(247, 248, 250, 0.62);
		font-size: 0.75rem;
		letter-spacing: -0.01em;
		line-height: 1.2;
		white-space: nowrap;
	}

	.pill-marker {
		flex: 0 0 auto;
		width: 0.55rem;
		height: 0.55rem;
		border: 1px solid rgba(255, 255, 255, 0.6);
		border-radius: 50%;
		background: #173b84;
	}

	.location-pill.error .pill-marker {
		background: #d77770;
	}

	.location-pill button {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		margin-left: 0.15rem;
		border: 0;
		border-radius: 999px;
		padding: 0.45rem 0.7rem;
		background: #f7f8fa;
		color: #17191d;
		font-family: "Portfolio Rounded", sans-serif;
		font-size: 0.875rem;
		font-weight: 400;
		letter-spacing: -0.015em;
		cursor: pointer;
		transition:
			background-color 160ms ease,
			transform 140ms var(--ease-out);
	}

	.location-pill button:focus-visible {
		outline: 2px solid #78a2d5;
		outline-offset: 3px;
	}

	.location-pill button:active {
		transform: scale(0.96);
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

	@keyframes pill-enter {
		from {
			opacity: 0;
			transform: translateY(0.65rem);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes location-pin-drop {
		from {
			opacity: 0;
			transform: translate(-50%, -260%) rotate(-45deg) scale(0.75);
		}

		70% {
			opacity: 1;
			transform: translate(-50%, -85%) rotate(-45deg) scale(1);
		}

		to {
			opacity: 1;
			transform: translate(-50%, -95%) rotate(-45deg) scale(1);
		}
	}

	@media (hover: hover) and (pointer: fine) {
		.location-pill button:hover {
			background: #e7e8ea;
		}
	}

	@media (max-width: 560px) {
		.location-map {
			padding-top: 2.5rem;
			padding-bottom: 4.5rem;
		}

		.location-pill {
			max-width: calc(100% - 1rem);
			margin-top: 1.25rem;
			margin-left: 0.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.map-cell,
		.map-cell.location-anchor::after,
		.location-pill,
		.location-pill button {
			animation: none;
			transition-duration: 0ms;
		}
	}
</style>
