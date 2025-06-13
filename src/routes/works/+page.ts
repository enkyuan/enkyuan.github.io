import { base } from "$app/paths";

export const prerender = true;

export const load = () => {
	return {
		metadata: {
			title: "Works",
			description: "what i've been working on",
			openGraph: {
				title: "Works",
				description: "what i've been working on",
				url: `${base}/works`,
				type: "website",
				image: `${base}/favicon/favicon-96x96.png`,
			},
			twitter: {
				card: "summary",
				title: "Works",
				description: "what i've been working on",
				image: `${base}/favicon/favicon-96x96.png`,
			},
		},
	};
};
