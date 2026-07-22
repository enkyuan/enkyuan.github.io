// @ts-nocheck -- Bun test globals are available at runtime, outside the app's TypeScript config.
import { expect, test } from "bun:test";

const appHtml = await Bun.file(new URL("../src/app.html", import.meta.url)).text();
const appStyles = await Bun.file(new URL("../src/app.css", import.meta.url)).text();

test("uses the Hanzi name as the browser title", () => {
  expect(appHtml).toContain("<title>袁恩康</title>");
  expect(appHtml).not.toContain("<title>Enkang Yuan</title>");
});

test("does not load the removed handwriting typeface", () => {
  expect(appStyles).not.toContain("shantell-sans");
});

test("withholds page content from generated search summaries", () => {
  expect(appHtml).toContain('<meta name="robots" content="nosnippet, noai, noimageai" />');
  expect(appHtml).toContain('<meta name="googlebot" content="nosnippet" />');
  expect(appHtml).toContain('<meta name="applebot" content="nosnippet" />');
  expect(appHtml).not.toContain('content="noindex');
});
