// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";
import { projects } from "../../../src/lib/constants/projects";

test("lists CV-backed work chronologically without restoring Ato", () => {
  const milo = projects.find((project) => project.name === "Milo");
  const copy = [
    milo?.description,
    ...milo!.achievements.map((achievement) => achievement.text),
  ].join(" ");

  expect(projects.map((project) => project.name)).toEqual(["Kaji", "Flux", "Milo"]);
  expect(projects.some((project) => project.name === "Ato")).toBeFalse();
  expect(copy).toContain("SwiftUI");
  expect(copy).toContain("WebSockets");
  expect(copy).toContain("Redis Streams");
  expect(copy).toContain("idempotent tool execution");
});

test("retains the verified Flux and Kaji project details", () => {
  const KajiIndex = projects.findIndex((project) => project.name === "Kaji");
  const fluxIndex = projects.findIndex((project) => project.name === "Flux");
  const Kaji = projects[KajiIndex];
  const flux = projects[fluxIndex];
  const copy = [flux.description, ...flux.achievements.map((achievement) => achievement.text)].join(
    " ",
  );

  expect(Kaji.dates).toBe("Present");
  expect("description" in Kaji).toBeFalse();
  expect(flux.dates).toBe("2026");
  expect(copy).toContain("Honorable Mention at HackIllinois");
  expect(copy).toContain("Tavily");
  expect(copy).toContain("Cohere");
  expect(copy).toContain("Gemini");
  expect(copy).toContain("generated OpenAPI reference");
  expect(copy).toContain("offline retrieval A/B evaluation");
  expect(flux.achievements.at(-1)?.link_href).toBe("https://github.com/vedantlbhatt/flux");
});
