// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const badgeComponent = await Bun.file(
  new URL("../../../../src/lib/components/ui/badge.svelte", import.meta.url),
).text();
const badgeStyles = await Bun.file(
  new URL("../../../../src/lib/styles/badge.css", import.meta.url),
).text();

test("renders an interactive badge only when an action is supplied", () => {
  expect(badgeComponent).toContain("onclick?: (event: MouseEvent) => void;");
  expect(badgeComponent).toContain("{#if onclick}");
  expect(badgeComponent).toContain("<button");
  expect(badgeComponent).toContain("{:else}");
  expect(badgeComponent).toContain('<div class="badge {className}"');
});

test("keeps the reusable pill concentric and tactile", () => {
  expect(badgeComponent).toContain("children: Snippet;");
  expect(badgeComponent).toContain('class="badge {className}"');
  expect(badgeStyles).toContain("border-radius: 999px;");
  expect(badgeStyles).toContain("button.badge:hover:not(:disabled)");
  expect(badgeStyles).toContain("transform: scale(0.96);");
});
