// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";
import { about } from "../../../src/lib/constants/about";

test("defines the map note and personal introduction", () => {
  expect(about.mapNote).toContain("this map is drawn from a 64 × 32 grid");
  expect(about.heading).toBe("hey, i'm enkang");
  expect(about.rolePrefix).toBe("i'm currently an associate software engineer intern @");
  expect(about.role).toBe("t-mobile");
  expect(about.contactPrefix).toBe("you can reach me via");
});

test("resolves the public email and X destinations", () => {
  expect(about.contacts.email?.text).toBe("Email");
  expect(about.contacts.email?.href).toBe("mailto:yuan.enkng@gmail.com");
  expect(about.contacts.x?.text).toBe("Twitter");
  expect(about.contacts.x?.href).toBe("https://twitter.com/enkyuan");
});
