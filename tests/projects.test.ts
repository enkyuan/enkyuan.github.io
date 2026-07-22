// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";
import { projects } from "../src/lib/constants/projects";

test("lists Flux directly above AgentKit with its verified project details", () => {
  const agentKitIndex = projects.findIndex((project) => project.name === "AgentKit");
  const fluxIndex = projects.findIndex((project) => project.name === "Flux");
  const flux = projects[fluxIndex];
  const copy = [flux.description, ...flux.achievements.map((achievement) => achievement.text)].join(
    " ",
  );

  expect(fluxIndex).toBe(agentKitIndex - 1);
  expect(flux.dates).toBe("2026");
  expect(copy).toContain("Honorable Mention at HackIllinois");
  expect(copy).toContain("Tavily");
  expect(copy).toContain("Cohere");
  expect(copy).toContain("Gemini");
  expect(copy).toContain("generated OpenAPI reference");
  expect(copy).toContain("offline retrieval A/B evaluation");
  expect(flux.achievements.at(-1)?.link_href).toBe("https://github.com/vedantlbhatt/flux");
});
