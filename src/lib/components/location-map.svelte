<script lang="ts">
	import {
		createWorldGrid,
		findLocationCluster,
		formatCoordinate,
		nearestPlace,
	} from "$lib/location-map";

	type LocationState = "idle" | "locating" | "located" | "error";

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

	let locationState: LocationState = $state("idle");
	let place = $state("Current location");
	let latitude: number | undefined = $state();
	let longitude: number | undefined = $state();
	let highlightedCells: string[] = $state([]);
	let statusMessage = $state("Your location has not been requested.");

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
		const delay = Math.min(column * 4 + Math.abs(row - 11) * 3, 220);
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

	<div class="location-plaque">
		<div class="plaque-copy">
			<p class="eyebrow">Location</p>
			<h1 id="location-title">
				{locationState === "located" ? `${place} · Now` : "Find yourself here"}
			</h1>
			{#if locationState === "located" && latitude !== undefined && longitude !== undefined}
				<p class="coordinates">
					{formatCoordinate(latitude, "N", "S")} · {formatCoordinate(longitude, "E", "W")}
				</p>
			{:else}
				<p class="description">Place your current location on the map.</p>
			{/if}
		</div>

		<button type="button" onclick={locate} disabled={locationState === "locating"}>
			<span class="button-marker" aria-hidden="true"></span>
			{locationState === "locating"
				? "Locating…"
				: locationState === "located"
					? "Update location"
					: locationState === "error"
						? "Try again"
						: "Use current location"}
		</button>

		<p class:error={locationState === "error"} class="privacy-note">
			{locationState === "error"
				? statusMessage
				: "Nearest city and rounded coordinates are computed locally. Nothing is sent."}
		</p>
		<p class="sr-only" aria-live="polite">{statusMessage}</p>
	</div>
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
		grid-template-columns: repeat(48, minmax(0, 1fr));
		grid-template-rows: repeat(24, minmax(0, 1fr));
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

	.map-cell.location-anchor::after {
		position: absolute;
		inset: -4px;
		border: 1px solid rgba(23, 59, 132, 0.48);
		border-radius: 4px;
		content: "";
	}

	.location-plaque {
		position: relative;
		z-index: 1;
		width: min(24rem, calc(100% - 1.5rem));
		margin-top: clamp(-3.5rem, -6vw, -2.25rem);
		margin-left: clamp(1rem, 7vw, 3.5rem);
		border-radius: 14px;
		padding: 1.25rem;
		background: #111315;
		box-shadow:
			0 1px 2px rgba(5, 11, 24, 0.18),
			0 5px 12px rgba(5, 11, 24, 0.12);
		color: #f7f8fa;
	}

	.animate .location-plaque {
		animation: plaque-enter 320ms var(--ease-out) 180ms backwards;
	}

	.plaque-copy {
		min-width: 0;
	}

	.eyebrow,
	.location-plaque h1,
	.coordinates,
	.description,
	.privacy-note {
		margin: 0;
	}

	.eyebrow {
		color: rgba(247, 248, 250, 0.5);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.06em;
		line-height: 1;
		text-transform: uppercase;
	}

	.location-plaque h1 {
		margin-top: 0.7rem;
		font-family: "Portfolio Rounded", sans-serif;
		font-size: clamp(1.25rem, 3vw, 1.5rem);
		font-weight: 400;
		letter-spacing: -0.025em;
		line-height: 1.15;
	}

	.coordinates,
	.description {
		margin-top: 0.55rem;
		color: rgba(247, 248, 250, 0.62);
		font-size: 0.875rem;
		letter-spacing: -0.01em;
		line-height: 1.4;
	}

	.location-plaque button {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		gap: 0.55rem;
		margin-top: 1.25rem;
		border: 0;
		border-radius: 10px;
		padding: 0.65rem 0.85rem;
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

	.location-plaque button:focus-visible {
		outline: 2px solid #78a2d5;
		outline-offset: 3px;
	}

	.location-plaque button:active {
		transform: scale(0.96);
	}

	.location-plaque button:disabled {
		cursor: wait;
		opacity: 0.62;
	}

	.button-marker {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 2px;
		background: #173b84;
	}

	.privacy-note {
		margin-top: 0.8rem;
		color: rgba(247, 248, 250, 0.42);
		font-size: 0.75rem;
		line-height: 1.35;
	}

	.privacy-note.error {
		color: #f2b8b5;
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

	@keyframes plaque-enter {
		from {
			opacity: 0;
			transform: translateY(0.65rem);
		}

		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (hover: hover) and (pointer: fine) {
		.location-plaque button:hover {
			background: #e7e8ea;
		}
	}

	@media (max-width: 560px) {
		.location-map {
			padding-top: 2.5rem;
			padding-bottom: 4.5rem;
		}

		.location-plaque {
			width: calc(100% - 1rem);
			margin-top: 1.25rem;
			margin-left: 0.5rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.map-cell,
		.location-plaque,
		.location-plaque button {
			animation: none;
			transition-duration: 0ms;
		}
	}
</style>
