<script lang="ts">
	import Badge from "$lib/components/ui/badge.svelte";
	import Flags from "$lib/components/ui/flags.svelte";
	import {
		distanceFromDotFieldCenter,
		DOT_FIELD_DOTS,
		DOT_FIELD_RADIUS,
		DOT_FIELD_STEP,
		isCircularDotVisible,
		isErrorMarkDot,
	} from "$lib/constants/dot-field";
	import { useLocation } from "$lib/hooks/use-location";
	import {
		createWorldGrid,
		formatCoordinate,
		WORLD_GRID_COLUMNS,
		WORLD_GRID_ROWS,
	} from "$lib/hooks/use-map";
	import "$lib/styles/map.css";

	let { animate = true } = $props<{ animate?: boolean }>();

	const cells = createWorldGrid();
	let sharedPill: HTMLDivElement | undefined = $state();
	const { location, locate } = useLocation(cells, () => animate, () => sharedPill);
	const locationAnchor = $derived(
		cells.find((cell) => cell.id === $location.highlightedCells[0]),
	);

	function cellStyle(row: number, column: number, color: string | undefined) {
		const delay = Math.min(column * 3 + Math.abs(row - (WORLD_GRID_ROWS - 1) / 2) * 2, 220);
		return `grid-column:${column + 1};grid-row:${row + 1};--cell-delay:${delay}ms;--cell-color:${color ?? "oklch(0.931 0.003 264.541)"}`;
	}

	function pillPosition(currentLatitude: number | undefined, currentLongitude: number | undefined) {
		if (currentLatitude === undefined || currentLongitude === undefined) return undefined;
		const x = ((currentLongitude + 180) / 360) * 100;
		const y = ((90 - currentLatitude) / 180) * 100;
		return `--anchor-x:${x}%;--anchor-y:${y}%`;
	}

	function loadingDotDelay(row: number, column: number) {
		return Math.round(distanceFromDotFieldCenter(row, column) * 64);
	}
</script>

<section class:animate class="map" aria-labelledby="location-title">
	<div class="map-stage">
		<div
			class="map-grid"
			role="img"
			aria-label={$location.state === "located"
				? `Pixel world map highlighting your current location near ${$location.place}`
				: $location.state === "error"
					? "Pixel world map; current location not found"
					: "Pixel world map awaiting your location"}
		>
			{#each cells as cell}
				{@const locationColor = $location.highlightedCellColors.get(cell.id)}
				<span
					class:location-cell={locationColor !== undefined}
					class:location-anchor={cell.id === $location.highlightedCells[0]}
					class="map-cell"
					style={cellStyle(cell.row, cell.column, locationColor)}
					aria-hidden="true"
				></span>
			{/each}
		</div>

		<div
			class:error={$location.state === "error"}
			class:locating={$location.state === "locating"}
			class:bottom-state={$location.state !== "located"}
			class:located={$location.state === "located" && locationAnchor !== undefined}
			class:opens-right={locationAnchor === undefined || locationAnchor.longitude < 0}
			class:opens-left={locationAnchor !== undefined && locationAnchor.longitude >= 0}
			class:opens-below={locationAnchor === undefined || locationAnchor.latitude >= 0}
			class:opens-above={locationAnchor !== undefined && locationAnchor.latitude < 0}
			class="location-badge-anchor"
			style={pillPosition(locationAnchor?.latitude, locationAnchor?.longitude)}
		>
			<div class="shared-pill" bind:this={sharedPill}>
				<Badge
					class="location-badge"
					onclick={() => {
						if ($location.state === "error") void locate();
					}}
					disabled={$location.state !== "error"}
					ariaLabel={$location.state === "error" ? "Try finding your location again" : undefined}
					ariaLive="polite"
					title={$location.state === "error" ? "Try again" : undefined}
				>
					<div class="pill-state">
						{#if $location.state === "located" && $location.latitude !== undefined && $location.longitude !== undefined}
								<Flags countryCode={$location.countryCode} />
								<div class="pill-copy">
									<h1 id="location-title">{$location.place}</h1>
									<p class="coordinates">
										{formatCoordinate($location.latitude, "N", "S", 3)} · {formatCoordinate($location.longitude, "E", "W", 3)}
									</p>
								</div>
						{:else if $location.state === "error"}
								<span class="error-field" aria-hidden="true">
									<svg viewBox="0 0 34 34" focusable="false">
										{#each DOT_FIELD_DOTS as row}
											{#each DOT_FIELD_DOTS as column}
												{#if isCircularDotVisible(row, column)}
													<circle
														class:error-mark={isErrorMarkDot(row, column)}
														cx={column * DOT_FIELD_STEP + DOT_FIELD_STEP / 2}
														cy={row * DOT_FIELD_STEP + DOT_FIELD_STEP / 2}
														r={DOT_FIELD_RADIUS}
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
										{#each DOT_FIELD_DOTS as row}
											{#each DOT_FIELD_DOTS as column}
												{#if isCircularDotVisible(row, column)}
													<circle
														cx={column * DOT_FIELD_STEP + DOT_FIELD_STEP / 2}
														cy={row * DOT_FIELD_STEP + DOT_FIELD_STEP / 2}
														r={DOT_FIELD_RADIUS}
														style={`--loader-delay:${loadingDotDelay(row, column)}ms`}
													/>
												{/if}
											{/each}
										{/each}
									</svg>
								</span>
								<h1 id="location-title">Finding your spot on the map…</h1>
						{/if}
					</div>
				</Badge>
			</div>
		</div>
	</div>
	<p class="sr-only" aria-live="polite">{$location.statusMessage}</p>
</section>
