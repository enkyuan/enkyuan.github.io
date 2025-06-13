import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: "build",
			assets: "build",
			fallback: "404.html",
			precompress: false,
			strict: true,
		}),
		paths: {
			base: "/enkyuan.github.io",
		},
		prerender: {
			handleHttpError: ({ path, message }) => {
				// Ignore 404s for favicon assets
				if (path.startsWith('/favicon')) {
					return;
				}

				// For all other 404s, let the build fail
				throw new Error(message);
			}
		}
	},
	preprocess: vitePreprocess(),
};

export default config;
