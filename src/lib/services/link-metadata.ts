export interface LinkMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url: string;
}

// Simple in-memory cache
const metadataCache = new Map<string, LinkMetadata>();

/**
 * Fetches link metadata using a CORS proxy service
 * For production, consider using a dedicated metadata API service
 */
export async function fetchLinkMetadata(url: string): Promise<LinkMetadata> {
  // Check cache first
  if (metadataCache.has(url)) {
    return metadataCache.get(url)!;
  }

  try {
    // Validate URL
    const parsedUrl = new URL(url);

    // Use corsproxy.io - more reliable than allorigins
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl, {
      signal: AbortSignal.timeout(8000), // 8 second timeout
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Parse metadata from HTML
    const metadata = parseMetadataFromHTML(html, url);

    // Cache the result
    metadataCache.set(url, metadata);

    return metadata;
  } catch (error) {
    console.error("Error fetching link metadata:", error);

    // Return basic metadata on error
    const parsedUrl = new URL(url);
    const fallback: LinkMetadata = {
      title: parsedUrl.hostname.replace("www.", ""),
      description: url,
      siteName: parsedUrl.hostname.replace("www.", ""),
      url: url,
    };

    // Cache the fallback too
    metadataCache.set(url, fallback);

    return fallback;
  }
}

/**
 * Parses metadata from HTML content
 */
function parseMetadataFromHTML(html: string, url: string): LinkMetadata {
  const metadata: LinkMetadata = { url };

  // Extract Open Graph metadata
  const ogTitle = html.match(
    /<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i,
  );
  const ogDescription = html.match(
    /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i,
  );
  const ogImage = html.match(
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
  );
  const ogSiteName = html.match(
    /<meta\s+property=["']og:site_name["']\s+content=["']([^"']+)["']/i,
  );

  // Extract Twitter Card metadata as fallback
  const twitterTitle = html.match(
    /<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i,
  );
  const twitterDescription = html.match(
    /<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i,
  );
  const twitterImage = html.match(
    /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i,
  );

  // Extract standard HTML meta tags as fallback
  const titleTag = html.match(/<title>([^<]+)<\/title>/i);
  const descriptionMeta = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i,
  );

  // Prioritize OG tags, then Twitter, then standard HTML
  metadata.title = ogTitle?.[1] || twitterTitle?.[1] || titleTag?.[1];

  metadata.description =
    ogDescription?.[1] || twitterDescription?.[1] || descriptionMeta?.[1];

  metadata.image = ogImage?.[1] || twitterImage?.[1];

  // Make relative image URLs absolute
  if (metadata.image && !metadata.image.startsWith("http")) {
    try {
      const baseUrl = new URL(url);
      metadata.image = new URL(metadata.image, baseUrl.origin).href;
    } catch {
      metadata.image = undefined;
    }
  }

  metadata.siteName =
    ogSiteName?.[1] || new URL(url).hostname.replace("www.", "");

  // Decode HTML entities in text
  if (metadata.title) {
    metadata.title = decodeHTMLEntities(metadata.title);
  }
  if (metadata.description) {
    metadata.description = decodeHTMLEntities(metadata.description);
  }

  return metadata;
}

/**
 * Decodes HTML entities in a string
 */
function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
  };

  return text.replace(/&[#\w]+;/g, (entity) => entities[entity] || entity);
}

/**
 * Clears the metadata cache
 */
export function clearMetadataCache(): void {
  metadataCache.clear();
}
