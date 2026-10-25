import { getSvgPath } from "figma-squircle";
import "../styles/squircle.css";

const SVG_NS = "http://www.w3.org/2000/svg";
const RING_OFFSET = 3;

/** Paint a Figma-style continuous corner without clipping content, shadows or focus. */
export function squircle(node: HTMLElement) {
  const surface = document.createElementNS(SVG_NS, "svg");
  const background = document.createElementNS(SVG_NS, "path");
  const ring = document.createElementNS(SVG_NS, "path");
  surface.classList.add("squircle-surface");
  surface.setAttribute("aria-hidden", "true");
  surface.setAttribute("focusable", "false");
  background.classList.add("squircle-background");
  ring.classList.add("squircle-focus");
  surface.append(background, ring);
  node.prepend(surface);

  function draw() {
    // Layout dimensions exclude press/hover transforms, keeping the curve stable.
    const { width, height } = node.getBoundingClientRect();
    const layoutWidth = node.clientWidth;
    const layoutHeight = node.clientHeight;
    if (!width || !height || !layoutWidth || !layoutHeight) return;
    const radius = Math.min(
      Number.parseFloat(getComputedStyle(node).getPropertyValue("--surface-radius")) || 16,
      layoutWidth / 2,
      layoutHeight / 2,
    );
    const shape = { cornerSmoothing: 0.6, preserveSmoothing: true };
    surface.setAttribute("viewBox", `0 0 ${layoutWidth + 8} ${layoutHeight + 8}`);
    background.setAttribute("transform", "translate(4 4)");
    background.setAttribute(
      "d",
      getSvgPath({ ...shape, width: layoutWidth, height: layoutHeight, cornerRadius: radius }),
    );
    // Shared center: outer radius = parent radius + outward inset.
    ring.setAttribute("transform", "translate(1 1)");
    ring.setAttribute(
      "d",
      getSvgPath({
        ...shape,
        width: layoutWidth + RING_OFFSET * 2,
        height: layoutHeight + RING_OFFSET * 2,
        cornerRadius: radius + RING_OFFSET,
      }),
    );
    node.classList.add("squircle-ready");
  }

  const observer = new ResizeObserver(draw);
  observer.observe(node);
  draw();
  return {
    destroy() {
      observer.disconnect();
      surface.remove();
      node.classList.remove("squircle-ready");
    },
  };
}
