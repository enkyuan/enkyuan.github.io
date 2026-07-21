<script lang="ts">
	import Badge from "$lib/components/ui/badge.svelte";
	import Flags from "$lib/components/ui/flags.svelte";
	import { useMapLocation } from "$lib/hooks/use-map-location.svelte";
	import {
		createWorldGrid,
		formatCoordinate,
		WORLD_GRID_COLUMNS,
		WORLD_GRID_ROWS,
	} from "$lib/hooks/use-map";
	import "$lib/styles/map.css";

	let { animate = true } = $props<{ animate?: boolean }>();

	const cells = createWorldGrid();
	const LOADER_GRID = 12;
	const LOADER_DOTS = Array.from({ length: LOADER_GRID }, (_, index) => index);
	const LOADER_STEP = 34 / LOADER_GRID;
	let sharedPill: HTMLDivElement | undefined = $state();
	const { location, locate } = useMapLocation(cells, () => animate, () => sharedPill);

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
			aria-label={location.state === "located"
				? `Pixel world map highlighting your current location near ${location.place}`
				: location.state === "error"
					? "Pixel world map; current location not found"
					: "Pixel world map awaiting your location"}
		>
			{#each cells as cell}
				{@const locationColor = location.highlightedCellColors.get(cell.id)}
				<span
					class:location-cell={locationColor !== undefined}
					class:location-anchor={cell.id === location.highlightedCells[0]}
					class="map-cell"
					style={cellStyle(cell.row, cell.column, locationColor)}
					aria-hidden="true"
				></span>
			{/each}
		</div>

		<div
			class:error={location.state === "error"}
			class:locating={location.state === "locating"}
			class:bottom-state={location.state !== "located"}
			class:located={location.state === "located" &&
				location.latitude !== undefined &&
				location.longitude !== undefined}
			class:opens-right={location.longitude === undefined || location.longitude < 0}
			class:opens-left={location.longitude !== undefined && location.longitude >= 0}
			class:opens-below={location.latitude === undefined || location.latitude >= 0}
			class:opens-above={location.latitude !== undefined && location.latitude < 0}
			class="location-badge-anchor"
			style={pillPosition(location.latitude, location.longitude)}
		>
			<div class="shared-pill" bind:this={sharedPill}>
				<Badge
					class="location-badge"
					onclick={location.state === "error" ? () => void locate() : undefined}
					ariaLabel={location.state === "error" ? "Try finding your location again" : undefined}
					ariaLive="polite"
					title={location.state === "error" ? "Try again" : undefined}
				>
					{#key location.state}
						<div class="pill-state">
							{#if location.state === "located" && location.latitude !== undefined && location.longitude !== undefined}
								<Flags countryCode={location.countryCode} />
								<div class="pill-copy">
									<h1 id="location-title">{location.place}</h1>
									<p class="coordinates">
										{formatCoordinate(location.latitude, "N", "S", 3)} · {formatCoordinate(location.longitude, "E", "W", 3)}
									</p>
								</div>
							{:else if location.state === "error"}
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
						</div>
					{/key}
				</Badge>
			</div>
		</div>
	</div>
	<p class="sr-only" aria-live="polite">{location.statusMessage}</p>
</section>
