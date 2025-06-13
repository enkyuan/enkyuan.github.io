// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;

import { base } from "$app/paths";
import type { PageLoad } from "./$types";

export const load: PageLoad = () => {
	return {
		metadata: {
			title: "Enkang Yuan",
			description: "my corner of the internet",
			openGraph: {
				title: "Enkang Yuan",
				description: "my corner of the internet",
				url: `${base}`,
				type: "website",
				image: `${base}/favicon/favicon-96x96.png`,
			},
			twitter: {
				card: "summary",
				title: "Enkang Yuan",
				description: "my corner of the internet",
				image: `${base}/favicon/favicon-96x96.png`,
			},
		},
	};
};
