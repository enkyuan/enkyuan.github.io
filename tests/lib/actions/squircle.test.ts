// @ts-nocheck -- Minimal DOM/ResizeObserver fixtures exercise the action lifecycle in Bun.
import { expect, test } from "bun:test";
import { squircle } from "../../../src/lib/actions/squircle.ts";

test("redraws the surface after resize and disconnects when its parent is removed", () => {
  const saved = Object.fromEntries(
    ["document", "ResizeObserver", "getComputedStyle"].map((key) => [key, globalThis[key]]),
  );
  let notify,
    disconnected = false;
  const element = () => ({
    attributes: {},
    children: [],
    classes: new Set(),
    removed: false,
    setAttribute(key, value) {
      this.attributes[key] = value;
    },
    append(...children) {
      this.children.push(...children);
    },
    remove() {
      this.removed = true;
    },
    get classList() {
      return { add: (name) => this.classes.add(name), remove: (name) => this.classes.delete(name) };
    },
  });
  globalThis.document = { createElementNS: () => element() };
  globalThis.getComputedStyle = () => ({ getPropertyValue: () => "18" });
  globalThis.ResizeObserver = class {
    constructor(callback) {
      notify = callback;
    }
    observe() {}
    disconnect() {
      disconnected = true;
    }
  };
  try {
    const node = Object.assign(element(), {
      clientWidth: 220,
      clientHeight: 54,
      getBoundingClientRect() {
        return { width: this.clientWidth, height: this.clientHeight };
      },
      prepend(child) {
        this.children.unshift(child);
      },
    });
    const action = squircle(node);
    const surface = node.children[0];
    expect(surface.attributes["aria-hidden"]).toBe("true");
    expect(surface.attributes.viewBox).toBe("0 0 228 62");
    const before = surface.children[0].attributes.d;
    node.clientWidth = 310;
    node.clientHeight = 72;
    notify();
    expect(surface.attributes.viewBox).toBe("0 0 318 80");
    expect(surface.children[0].attributes.d).not.toBe(before);
    // Main and focus surfaces share their center: inset 4 vs inset 1 + 3px expansion.
    expect(surface.children[0].attributes.transform).toBe("translate(4 4)");
    expect(surface.children[1].attributes.transform).toBe("translate(1 1)");
    expect(node.classes.has("squircle-ready")).toBe(true);
    action.destroy();
    expect(disconnected).toBe(true);
    expect(surface.removed).toBe(true);
    expect(node.classes.has("squircle-ready")).toBe(false);
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
    }
  }
});

test("ships the squircle surface styling and upstream license", async () => {
  const root = new URL("../../../", import.meta.url);
  const styles = await Bun.file(
    new URL("../../../src/lib/styles/squircle.css", import.meta.url),
  ).text();
  expect(styles).toContain("pointer-events: none;");
  const shipped = await Bun.file(new URL("static/licenses/figma-squircle.txt", root)).text();
  const upstream = await Bun.file(
    new URL("../../../node_modules/figma-squircle/LICENSE", import.meta.url),
  ).text();
  expect(shipped).toBe(upstream);
});
