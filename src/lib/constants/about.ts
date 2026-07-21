import { socials } from "$lib/constants/socials";

export const about = {
  mapNote:
    "this map is drawn from a 64 × 32 grid. the coordinates you share place one continuous gradient near you; this page doesn't store or send them.",
  heading: "hey, i'm enkang",
  rolePrefix: "i'm currently an",
  role: "associate software engineer @ t-mobile",
  contactPrefix: "you can reach me via",
  contacts: {
    email: socials.find(({ text }) => text === "Email"),
    x: socials.find(({ text }) => text === "Twitter"),
  },
} as const;
