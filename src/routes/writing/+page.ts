import { base } from "$app/paths";

export const prerender = true;

export const load = () => {
	return {
		metadata: {
			title: "Writing",
			description: "what i've been currently thinking about",
			openGraph: {
				title: "Writing",
				description: "what i've been currently thinking about",
				url: `${base}/writing`,
				type: "website",
				image: `${base}/favicon/favicon-96x96.png`,
			},
			twitter: {
				card: "summary",
				title: "Writing",
				description: "what i've been currently thinking about",
				image: `${base}/favicon/favicon-96x96.png`,
			},
		},
	};
};
