import { base } from "$app/paths";

export const prerender = true;

export const load = () => {
  return {
    metadata: {
      title: "Enkang Yuan",
      description: "my corner of the internet",
      openGraph: {
        title: "Enkang Yuan",
        description: "my corner of the internet",
        url: `${base}/`,
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
