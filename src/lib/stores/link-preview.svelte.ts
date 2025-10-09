import {
	fetchLinkMetadata,
	type LinkMetadata,
} from "$lib/services/link-metadata";

interface PreviewState {
	visible: boolean;
	url: string;
	metadata: LinkMetadata | null;
	loading: boolean;
	x: number;
	y: number;
	placement: "top" | "bottom" | "left" | "right";
}

class LinkPreviewStore {
	private state = $state<PreviewState>({
		visible: false,
		url: "",
		metadata: null,
		loading: false,
		x: 0,
		y: 0,
		placement: "top",
	});

	private hideTimeout: ReturnType<typeof setTimeout> | null = null;
	private showTimeout: ReturnType<typeof setTimeout> | null = null;

	get visible() {
		return this.state.visible;
	}

	get url() {
		return this.state.url;
	}

	get metadata() {
		return this.state.metadata;
	}

	get loading() {
		return this.state.loading;
	}

	get x() {
		return this.state.x;
	}

	get y() {
		return this.state.y;
	}

	get placement() {
		return this.state.placement;
	}

	async show(
		url: string,
		placement: "top" | "bottom" | "left" | "right",
		rect: DOMRect,
		delay = 500,
	) {
		// Clear any pending hide
		if (this.hideTimeout) {
			clearTimeout(this.hideTimeout);
			this.hideTimeout = null;
		}

		// Set up delayed show
		this.showTimeout = setTimeout(async () => {
			const { top, left, right, bottom, width, height } = rect;
			let x = 0;
			let y = 0;

			switch (placement) {
				case "right":
					x = right + 10;
					y = top + height / 2;
					break;
				case "left":
					x = left - 10;
					y = top + height / 2;
					break;
				case "top":
					x = left + width / 2;
					y = top - 10;
					break;
				case "bottom":
					x = left + width / 2;
					y = bottom + 10;
					break;
			}

			// Set position and metadata BEFORE making visible
			this.state.url = url;
			this.state.x = x;
			this.state.y = y;
			this.state.placement = placement;

			// Fetch metadata if not already loaded
			if (!this.state.metadata || this.state.metadata.url !== url) {
				this.state.loading = true;
				this.state.metadata = await fetchLinkMetadata(url);
				this.state.loading = false;
			}

			// Make visible AFTER position is set
			this.state.visible = true;
		}, delay);
	}

	hide() {
		// Clear any pending show
		if (this.showTimeout) {
			clearTimeout(this.showTimeout);
			this.showTimeout = null;
		}

		// Delay hiding to allow moving to preview
		this.hideTimeout = setTimeout(() => {
			this.state.visible = false;
			// Don't clear metadata so it can be reused
		}, 100);
	}

	reset() {
		if (this.hideTimeout) {
			clearTimeout(this.hideTimeout);
		}
		if (this.showTimeout) {
			clearTimeout(this.showTimeout);
		}
		this.state.visible = false;
		this.state.metadata = null;
		this.state.loading = false;
	}
}

export const linkPreviewStore = new LinkPreviewStore();
