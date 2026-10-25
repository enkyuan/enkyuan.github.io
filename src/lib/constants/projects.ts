export const projects = [
  {
    name: "Kaji",
    dates: "Present",
    href: "https://kaji.build/",
    description:
      "A dependency-free TypeScript library for controlling application actions triggered by agents, automations, or API callers.",
    achievements: [
      {
        text: "Each action is a capability: a validated input schema, a permission check, an optional approval requirement, and the function that performs the work. Kaji runs these checks in order before allowing a side effect.",
      },
      {
        text: "A request identity combines the action, caller, and idempotency key. With an atomic store, repeated requests read or await the original result; reusing a key with different input never runs the action.",
      },
      {
        text: "Outcomes distinguish a confirmed failure from an unknown result, such as a refund whose reply was lost after the payment provider committed it. The application supplies identity, policy, approval handling, and durable storage.",
      },
    ],
  },
  {
    name: "Kaze",
    dates: "Present",
    href: "https://github.com/hiyoriOS/kaze",
    description:
      "A draft protocol and Rust reference implementation for admitting AI agents under terms set by the platform they access.",
    achievements: [
      {
        text: "The platform signs an Offer describing an action's requirements, price, limits, and permitted access path. The agent presents a mandate defining what its principal authorized, where that authority applies, and how much it may commit.",
      },
      {
        text: "Web Bot Auth verifies the operator behind the request. Key-bound mandates connect the agent to its delegated authority; liability claims can name the accountable operator and attest its coverage.",
      },
      {
        text: "A deterministic verifier checks the signed evidence without network access or a system clock, with the same core available as WebAssembly. Platforms retain replay tracking, quotas, and settlement, while payment and receipts reuse x402, MPP, and AP2 conventions.",
      },
    ],
  },
  {
    name: "Flux",
    dates: "2026",
    description:
      "Honorable Mention at HackIllinois — a REST API for live web search, cited AI answers, clean URL extraction, and context-aware conversations.",
    achievements: [
      {
        text: "Built a FastAPI retrieval pipeline that searches and extracts content with Tavily, semantically reranks results with Cohere, and falls back cleanly to Tavily ordering when reranking is unavailable",
      },
      {
        text: "Added grounded answer synthesis with Gemini, ranked citations, and multi-turn retrieval that carries the last three queries into follow-up searches",
      },
      {
        text: "Designed eight REST endpoints spanning search, answers, contents, and paginated conversation CRUD, with bounded in-memory state, typed responses, request tracing, body-size protection, and a consistent error contract",
      },
      {
        text: "Built and refined a TanStack Start + Fumadocs documentation site with a generated OpenAPI reference, local and production API sandboxes, and SSR fixes",
      },
      {
        text: "Shipped a Next.js demo, Railway and Vercel deployment paths, an offline retrieval A/B evaluation, and benchmarks for latency, success rate, reranking, and citation coverage",
        link_text: "Flux",
        link_href: "https://github.com/vedantlbhatt/flux",
      },
    ],
  },
  {
    name: "Milo",
    dates: "2025 – 2026",
    description:
      "A low-latency voice assistant that keeps conversation immediate while longer automations run elsewhere.",
    achievements: [
      {
        text: "Streamed speech between a SwiftUI client and FastAPI over WebSockets, separating the live dialogue path from long-running TaskIQ jobs",
      },
      {
        text: "Routed transcriptions, tool results, and user updates through Redis Streams + Pub/Sub so services could work independently without making the conversation wait",
      },
      {
        text: "Built safer integrations around encrypted OAuth tokens, idempotent tool execution, and Redis-backed deduplication and retries",
      },
    ],
  },
];
