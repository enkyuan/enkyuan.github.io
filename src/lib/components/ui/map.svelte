<script lang="ts">
	import { onMount } from "svelte";
	import { blur } from "svelte/transition";
	import { TextMorph } from "torph";
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
	import "$lib/styles/location-morph.css";

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
		$location.failure?.retryable === true,
	);
	const locationCells = $derived(
		$location.highlightedCells.flatMap((id, index) => {
			const cell = cellsById.get(id);
			const color = $location.highlightedCellColors.get(id);
			return cell && color ? [{ ...cell, color, index }] : [];
		}),
	);

	let dismissed = $state(false);
	$effect(() => {
		if ($location.state !== "error") dismissed = false;
	});
	let reducedMotion = $state(false);
	let keyboardRetry = $state(false);
	onMount(() => {
		const preference = matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => {
			reducedMotion = preference.matches;
		};
		update();
		preference.addEventListener("change", update);
		return () => preference.removeEventListener("change", update);
	});
	const title = $derived(
		$location.state === "located" ? $location.place
			: $location.state === "error" ? $location.failure?.title ?? "Location unavailable"
				: "Finding your spot on the map…",
	);
	const hint = $derived($location.failure?.hint ?? "");

	function morphText(node: HTMLElement, text: string) {
		let clear: Animation | undefined;
		let disabled = !animate || keyboardRetry;
		const create = () => new TextMorph({
			element: node,
			duration: 240,
			ease: "cubic-bezier(0.23, 1, 0.32, 1)",
			disabled,
			onAnimationStart: () => {
				if (!animate || reducedMotion || keyboardRetry) return;
				clear?.cancel();
				clear = node.animate(
					[{ filter: "blur(2px)" }, { filter: "blur(0px)" }],
					{ duration: 220, easing: "cubic-bezier(0.23, 1, 0.32, 1)" },
				);
			},
		});
		let morph = create();
		morph.update(text);
		return {
			update(value: string) {
				if (disabled !== (!animate || keyboardRetry)) {
					clear?.cancel();
					morph.destroy();
					disabled = !animate || keyboardRetry;
					morph = create();
				}
				morph.update(value);
			},
			destroy() {
				clear?.cancel();
				morph.destroy();
			},
		};
	}

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
			<div class="shared-pill" class:dismissed={dismissed} inert={dismissed} aria-hidden={dismissed} bind:this={sharedPill}>
				<Badge
					class="location-badge"
					onclick={(event) => {
						keyboardRetry = event.detail === 0;
						if (canRetryLocation) void locate();
					}}
					disabled={!canRetryLocation}
					ariaLabel={canRetryLocation ? "Try finding your location again" : undefined}
					ariaLive="polite"
					title={canRetryLocation ? "Try again" : undefined}
				>
					<div class="pill-state">
<span class="pill-icon-frame">						{#if $location.state === "located" && $location.latitude !== undefined && $location.longitude !== undefined}
								<Flags countryCode={$location.countryCode} />
						{:else if $location.state === "error"}
								<span class="error-field"
 in:blur={{ duration: animate && !reducedMotion && !keyboardRetry ? 180 : 0, amount: 4 }}
 out:blur={{ duration: animate && !reducedMotion && !keyboardRetry ? 120 : 0, amount: 4 }} aria-hidden="true">
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
						{:else}
								<span class="loading-field"
 in:blur={{ duration: animate && !reducedMotion && !keyboardRetry ? 180 : 0, amount: 4 }}
 out:blur={{ duration: animate && !reducedMotion && !keyboardRetry ? 120 : 0, amount: 4 }} aria-hidden="true">
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

						{/if}</span>
						<div class="pill-copy">
							<h1 id="location-title"><span use:morphText={title}>Finding your spot on the map…</span></h1>
							<p class="state-hint" class:empty={!hint}><span use:morphText={hint}></span></p>
							{#if hasLocatedPosition && $location.latitude !== undefined && $location.longitude !== undefined}
								<p class="coordinates">{formatCoordinate($location.latitude, "N", "S", 3)} · {formatCoordinate($location.longitude, "E", "W", 3)}</p>
							{/if}
						</div>
					</div>
				</Badge>
				{#if $location.state === "error"}
					<button
						class="toast-dismiss"
						type="button"
						aria-label="Dismiss location error"
						onclick={(event) => {
						event.stopPropagation();
						dismissed = true;
					}}
					>
						Dismiss
					</button>
				{/if}
			</div>
		</div>
	</div>
	<p class="sr-only" aria-live="polite">{$location.statusMessage}</p>
</section>
