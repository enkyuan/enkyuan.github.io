type TooltipData = {
	id: string;
	text: string;
	variant: "default" | "info" | "warning" | "link-preview";
	previewTitle: string;
	previewDescription: string;
	previewImage: string;
	previewUrl: string;
	targetRect: DOMRect | null;
	placement: "right" | "left" | "top" | "bottom" | "auto";
};

class TooltipState {
	activeTooltip = $state<TooltipData | null>(null);
	isTransitioning = $state(false);
	private clearTimeoutId: number | null = null;

	setActive(tooltip: TooltipData | null) {
		// Cancel any pending clear operation
		if (this.clearTimeoutId !== null) {
			clearTimeout(this.clearTimeoutId);
			this.clearTimeoutId = null;
		}

		if (tooltip && this.activeTooltip && tooltip.id !== this.activeTooltip.id) {
			// Transitioning between tooltips
			this.isTransitioning = true;
			this.activeTooltip = tooltip;
			// Reset transitioning flag after animation (increased for smoother feel)
			setTimeout(() => {
				this.isTransitioning = false;
			}, 350);
		} else {
			this.activeTooltip = tooltip;
			this.isTransitioning = false;
		}
	}

	clear() {
		// Add a small delay before clearing to allow smooth transitions
		this.clearTimeoutId = window.setTimeout(() => {
			this.activeTooltip = null;
			this.isTransitioning = false;
			this.clearTimeoutId = null;
		}, 100);
	}
}

export const tooltipState = new TooltipState();
