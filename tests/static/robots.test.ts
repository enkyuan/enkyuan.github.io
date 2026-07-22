// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const robots = await Bun.file(new URL("../../static/robots.txt", import.meta.url)).text();

const blockedAiAgents = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Amzn-SearchBot",
  "Amzn-User",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
] as const;

test("blocks known AI training, search, and user-directed crawlers", () => {
  for (const agent of blockedAiAgents) {
    expect(robots, `${agent} should be blocked site-wide`).toContain(
      `User-agent: ${agent}\nDisallow: /`,
    );
  }
});

test("preserves conventional search indexing", () => {
  expect(robots).toContain("User-agent: Googlebot\nAllow: /");
  expect(robots).toContain("User-agent: Bingbot\nAllow: /");
  expect(robots).not.toContain("User-agent: *\nDisallow: /\n");
});
