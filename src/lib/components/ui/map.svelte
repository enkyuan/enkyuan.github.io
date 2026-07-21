<script lang="ts">
	import { onMount, tick } from "svelte";
	import Badge from "$lib/components/ui/badge.svelte";
	import Flags from "$lib/components/ui/flags.svelte";
	import "./map.css";
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
	type SharedViewTransition = { finished: Promise<void> };
	type ViewTransitionDocument = Document & {
		startViewTransition?: (update: () => Promise<void>) => SharedViewTransition;
	};

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
	let sharedPill: HTMLDivElement | undefined = $state();
	let sharedPillAnimation: Animation | undefined;

	onMount(() => {
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		const updateMotionPreference = () => {
			prefersReducedMotion = reducedMotion.matches;
		};

		updateMotionPreference();
		reducedMotion.addEventListener("change", updateMotionPreference);
		void locate();

		return () => reducedMotion.removeEventListener("change", updateMotionPreference);
	});

	async function updateLocationState(update: () => void) {
		const viewTransitionDocument = document as ViewTransitionDocument;
		if (!animate || prefersReducedMotion) {
			update();
			await tick();
			return;
		}

		if (viewTransitionDocument.startViewTransition) {
			const transition = viewTransitionDocument.startViewTransition(async () => {
				update();
				await tick();
			});
			await transition.finished.catch(() => undefined);
			return;
		}

		const firstRect = sharedPill?.getBoundingClientRect();
		update();
		await tick();
		const lastRect = sharedPill?.getBoundingClientRect();
		if (!sharedPill || !firstRect || !lastRect || lastRect.width === 0 || lastRect.height === 0) return;

		sharedPillAnimation?.cancel();
		sharedPillAnimation = sharedPill.animate(
			[
				{
					opacity: 0.86,
					filter: "blur(4px)",
					transform: `translate(${firstRect.left - lastRect.left}px, ${firstRect.top - lastRect.top}px) scale(${firstRect.width / lastRect.width}, ${firstRect.height / lastRect.height})`,
				},
				{ opacity: 1, filter: "blur(0)", transform: "translate(0, 0) scale(1)" },
			],
			{
				duration: 520,
				easing: "cubic-bezier(0.22, 1, 0.36, 1)",
				fill: "both",
			},
		);
		await sharedPillAnimation.finished.catch(() => undefined);
	}

	async function locate() {
		if (!("geolocation" in navigator)) {
			await updateLocationState(() => {
				locationState = "error";
				statusMessage = "Location is not available in this browser.";
			});
			return;
		}

		if (locationState === "locating") {
			statusMessage = "Finding your spot on the map.";
		} else {
			await updateLocationState(() => {
				locationState = "locating";
				statusMessage = "Finding your spot on the map.";
			});
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				void updateLocationState(() => {
					latitude = position.coords.latitude;
					longitude = position.coords.longitude;
					const nearest = nearestLocation(latitude, longitude);
					place = nearest.name;
					countryCode = nearest.countryCode;
					const cluster = findLocationCluster(cells, latitude, longitude);
					highlightedCells = cluster;
					highlightedCellColors = createLocationGradient(cells, cluster);
					locationState = "located";
					statusMessage = `Current location found near ${place}.`;
				});
			},
			() => {
				void updateLocationState(() => {
					locationState = "error";
					statusMessage = "Location not found.";
				});
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
		>
			<div class="shared-pill" bind:this={sharedPill}>
				<Badge
					class="location-badge"
					onclick={locationState === "error" ? () => void locate() : undefined}
					ariaLabel={locationState === "error" ? "Try finding your location again" : undefined}
					ariaLive="polite"
					title={locationState === "error" ? "Try again" : undefined}
				>
					{#key locationState}
						<div class="pill-state">
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
						</div>
					{/key}
				</Badge>
			</div>
		</div>
	</div>
	<p class="sr-only" aria-live="polite">{statusMessage}</p>
</section>
