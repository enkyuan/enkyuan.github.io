let hoveredRouteIndex = $state<number | null>(null);

export const sidebarState = {
	get hoveredIndex() {
		return hoveredRouteIndex;
	},
	setHovered(index: number | null) {
		hoveredRouteIndex = index;
	},
};
