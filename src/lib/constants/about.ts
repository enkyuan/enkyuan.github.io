import { socials } from "$lib/constants/socials";

export const about = {
  mapNote:
    "this map is drawn from a 64 × 32 grid. your browser shares your coordinates with a geocoder to name the location and place one continuous gradient near you; this page doesn't store them.",
  heading: "hey, i'm enkang",
  rolePrefix: "i'm currently an associate software engineer intern @",
  role: "t-mobile",
  contactPrefix: "you can reach me via",
  contacts: {
    email: socials.find(({ text }) => text === "Email"),
    x: socials.find(({ text }) => text === "Twitter"),
  },
} as const;
