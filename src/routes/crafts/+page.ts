import { base } from "$app/paths";

export const prerender = true;

export const load = () => {
	return {
		metadata: {
			title: "Crafts",
			description: "what i've been working on",
			openGraph: {
				title: "Crafts",
				description: "what i've been working on",
				url: `${base}/crafts`,
				type: "website",
				image: `${base}/favicon/favicon-96x96.png`,
			},
			twitter: {
				card: "summary",
				title: "Crafts",
				description: "what i've been working on",
				image: `${base}/favicon/favicon-96x96.png`,
			},
		},
	};
};
