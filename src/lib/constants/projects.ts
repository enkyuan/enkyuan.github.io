export const projects = [
  {
    name: "AgentKit",
    dates: "Present",
    achievements: [
      {
        text: "Built matching ReAct runtimes around typed tools, event journals, session replay, idempotency, approvals, and bounded execution",
      },
      {
        text: "Added OpenAI and Anthropic providers alongside Gemini, Kimi, and OpenRouter paths, with deterministic mocks and normalized error contracts",
      },
      {
        text: "Kept the SDK core infra-free, moving Redis realtime, FastAPI hosting, and Soniox voice into optional edges so teams can start locally and scale out deliberately",
      },
      {
        text: "Used the runtime beneath Ryo, where small businesses configure agents that answer questions, take orders, and collect payments",
        link_text: "Alloy",
        link_href: "https://github.com/enkyuan/alloy",
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
