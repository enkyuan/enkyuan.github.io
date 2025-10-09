import {
  fetchLinkMetadata,
  type LinkMetadata,
} from "$lib/services/link-metadata";

interface PreviewState {
  visible: boolean;
  url: string;
  metadata: LinkMetadata | null;
  loading: boolean;
  x: number;
  y: number;
  placement: "top" | "bottom" | "left" | "right";
}

class LinkPreviewStore {
  private state = $state<PreviewState>({
    visible: false,
    url: "",
    metadata: null,
    loading: false,
    x: 0,
    y: 0,
    placement: "top",
  });

  private hideTimeout: ReturnType<typeof setTimeout> | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;

  get visible() {
    return this.state.visible;
  }

  get url() {
    return this.state.url;
  }

  get metadata() {
    return this.state.metadata;
  }

  get loading() {
    return this.state.loading;
  }

  get x() {
    return this.state.x;
  }

  get y() {
    return this.state.y;
  }

  get placement() {
    return this.state.placement;
  }

  async show(
    url: string,
    placement: "top" | "bottom" | "left" | "right",
    rect: DOMRect,
    delay = 500,
  ) {
    // Clear any pending hide
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }

    // Set up delayed show
    this.showTimeout = setTimeout(async () => {
      const { top, left, right, bottom, width, height } = rect;

      // Fetch metadata first to calculate accurate preview height
      let metadata = this.state.metadata;
      if (!metadata || metadata.url !== url) {
        this.state.loading = true;
        metadata = await fetchLinkMetadata(url);
        this.state.metadata = metadata;
        this.state.loading = false;
      }

      // Calculate preview dimensions based on metadata
      const previewWidth = 320;
      const padding = 12;

      // Estimate height based on content
      let estimatedHeight = 32; // Base padding
      if (metadata.image) estimatedHeight += 160; // Image height
      if (metadata.title) estimatedHeight += 40; // Title (2 lines max)
      if (metadata.description) estimatedHeight += 45; // Description (2 lines)
      if (metadata.siteName) estimatedHeight += 25; // Site name

      const previewHeight = Math.min(estimatedHeight, 400); // Cap at 400px

      let x = 0;
      let y = 0;

      switch (placement) {
        case "right":
          x = right + padding;
          y = top + height / 2;
          break;
        case "left":
          x = left - padding;
          y = top + height / 2;
          break;
        case "top":
          x = left + width / 2;
          y = top - padding;
          break;
        case "bottom":
          x = left + width / 2;
          y = bottom + padding;
          break;
      }

      // Viewport boundary detection
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Adjust horizontal position if overflowing
      if (placement === "top" || placement === "bottom") {
        // Center-aligned previews
        const halfWidth = previewWidth / 2;
        if (x - halfWidth < padding) {
          x = halfWidth + padding;
        } else if (x + halfWidth > viewportWidth - padding) {
          x = viewportWidth - halfWidth - padding;
        }
      } else if (placement === "right") {
        if (x + previewWidth > viewportWidth - padding) {
          x = left - padding;
        }
      } else if (placement === "left") {
        if (x - previewWidth < padding) {
          x = right + padding;
        }
      }

      // Adjust vertical position to avoid overlap and overflow
      if (placement === "left" || placement === "right") {
        const halfHeight = previewHeight / 2;
        if (y - halfHeight < padding) {
          y = halfHeight + padding;
        } else if (y + halfHeight > viewportHeight - padding) {
          y = viewportHeight - halfHeight - padding;
        }
      } else if (placement === "top") {
        // Ensure preview is fully above the link
        const previewBottom = y;
        const linkTop = top;
        if (previewBottom > linkTop - previewHeight) {
          // Not enough space above, check if we can fit below
          if (bottom + padding + previewHeight < viewportHeight - padding) {
            // Switch to bottom
            y = bottom + padding;
          } else {
            // Keep on top but adjust to fit
            y = Math.max(padding + previewHeight, top - padding);
          }
        }
      } else if (placement === "bottom") {
        // Ensure preview is fully below the link
        if (y + previewHeight > viewportHeight - padding) {
          // Not enough space below, check if we can fit above
          if (top - padding - previewHeight > padding) {
            // Switch to top
            y = top - padding;
          } else {
            // Keep on bottom but adjust to fit
            y = Math.min(
              viewportHeight - previewHeight - padding,
              bottom + padding,
            );
          }
        }
      }

      // Set position BEFORE making visible
      this.state.url = url;
      this.state.x = x;
      this.state.y = y;
      this.state.placement = placement;

      // Make visible AFTER position and metadata are set
      this.state.visible = true;
    }, delay);
  }

  hide() {
    // Clear any pending show
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }

    // Delay hiding to allow moving to preview
    this.hideTimeout = setTimeout(() => {
      this.state.visible = false;
      // Don't clear metadata so it can be reused
    }, 100);
  }

  reset() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
    }
    this.state.visible = false;
    this.state.metadata = null;
    this.state.loading = false;
  }
}

export const linkPreviewStore = new LinkPreviewStore();
