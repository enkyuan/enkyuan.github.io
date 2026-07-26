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
		createWorldPathWaves,
		formatCoordinate,
		projectLocation,
		WORLD_CELL_OFFSET,
		WORLD_CELL_RADIUS,
		WORLD_CELL_SIZE,
		WORLD_GRID_COLUMNS,
		WORLD_GRID_ROWS,
		type MapCell,
	} from "$lib/hooks/use-map";
	import "$lib/styles/map.css";

	let { animate = true } = $props<{ animate?: boolean }>();

	const cells = createWorldGrid();
	const cellsById = new Map(cells.map((cell) => [cell.id, cell]));
	const worldPathWaves = createWorldPathWaves(cells);
	let sharedPill: HTMLDivElement | undefined = $state();
	const { location, locate } = useLocation(cells, () => animate, () => sharedPill);
	const hasLocatedPosition = $derived(
		$location.state === "located" &&
			$location.latitude !== undefined &&
			$location.longitude !== undefined,
	);
	const canRetryLocation = $derived(
		$location.state === "error" && $location.failure?.retryable === true,
	);
	const locationCells = $derived(
		$location.highlightedCells.flatMap((id, index) => {
			const cell = cellsById.get(id);
			const color = $location.highlightedCellColors.get(id);
			return cell && color ? [{ ...cell, color, index }] : [];
		}),
	);

	function locationCellStyle(cell: MapCell & { color: string; index: number }) {
		return `--cell-delay:${Math.min(cell.index * 18, 160)}ms;--location-color:${cell.color}`;
	}

	function pillPosition(currentLatitude: number | undefined, currentLongitude: number | undefined) {
		if (currentLatitude === undefined || currentLongitude === undefined) return undefined;
		const { xPercent, yPercent } = projectLocation(currentLatitude, currentLongitude);
		return `--anchor-x:${xPercent}%;--anchor-y:${yPercent}%`;
	}

	function loadingDotDelay(row: number, column: number) {
		return Math.round(distanceFromDotFieldCenter(row, column) * 64);
	}
</script>

<section class:animate class="map" aria-labelledby="location-title">
	<div class="map-stage">
		<svg
			class="map-grid"
			viewBox={`0 0 ${WORLD_GRID_COLUMNS} ${WORLD_GRID_ROWS}`}
			preserveAspectRatio="xMidYMid meet"
			role="img"
			aria-label={$location.state === "located"
				? `Pixel world map highlighting your current location near ${$location.place}`
				: $location.state === "error"
					? "Pixel world map; current location not found"
					: "Pixel world map awaiting your location"}
		>
			{#each worldPathWaves as wave}
				<path
					class="map-land-wave"
					d={wave.path}
					style={`--wave-index:${wave.index}`}
					aria-hidden="true"
				></path>
			{/each}
			{#each locationCells as cell (cell.id)}
				<rect
					class:location-anchor={cell.index === 0}
					class="location-cell"
					x={cell.column + WORLD_CELL_OFFSET}
					y={cell.row + WORLD_CELL_OFFSET}
					width={WORLD_CELL_SIZE}
					height={WORLD_CELL_SIZE}
					rx={WORLD_CELL_RADIUS}
					style={locationCellStyle(cell)}
					aria-hidden="true"
				></rect>
			{/each}
		</svg>

		{#if hasLocatedPosition}
			<span
				class="location-point-anchor"
				style={pillPosition($location.latitude, $location.longitude)}
				aria-hidden="true"
			></span>
		{/if}

		<div
			class:error={$location.state === "error"}
			class:locating={$location.state === "locating"}
			class:bottom-state={$location.state !== "located"}
			class:located={hasLocatedPosition}
			class:opens-right={$location.longitude === undefined || $location.longitude < 0}
			class:opens-left={$location.longitude !== undefined && $location.longitude >= 0}
			class:opens-below={$location.latitude === undefined || $location.latitude >= 0}
			class:opens-above={$location.latitude !== undefined && $location.latitude < 0}
			class="location-badge-anchor"
			style={pillPosition($location.latitude, $location.longitude)}
		>
			<div class="shared-pill" bind:this={sharedPill}>
				<Badge
					class="location-badge"
					onclick={canRetryLocation ? () => void locate() : undefined}
					ariaLabel={canRetryLocation ? "Try finding your location again" : undefined}
					ariaLive="polite"
					title={canRetryLocation ? "Try again" : undefined}
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
									<div class="pill-copy">
										<h1 id="location-title">{$location.failure?.title ?? "Location unavailable"}</h1>
										{#if $location.failure?.hint}
											<p class="state-hint">{$location.failure.hint}</p>
										{/if}
									</div>
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
