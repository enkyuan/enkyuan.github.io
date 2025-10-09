import { writable } from "svelte/store";

interface TooltipState {
	visible: boolean;
	text: string;
	placement: "right" | "left" | "top" | "bottom";
	x: number;
	y: number;
}

function createTooltipStore() {
	const { subscribe, set } = writable<TooltipState>({
		visible: false,
		text: "",
		placement: "right",
		x: 0,
		y: 0,
	});

	let hideTimeout: ReturnType<typeof setTimeout> | null = null;

	return {
		subscribe,
		show: (
			text: string,
			placement: "right" | "left" | "top" | "bottom",
			rect: DOMRect,
		) => {
			if (hideTimeout) {
				clearTimeout(hideTimeout);
				hideTimeout = null;
			}

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

			set({ visible: true, text, placement, x, y });
		},
		hide: () => {
			hideTimeout = setTimeout(() => {
				set({ visible: false, text: "", placement: "right", x: 0, y: 0 });
			}, 100);
		},
	};
}

export const tooltipStore = createTooltipStore();
