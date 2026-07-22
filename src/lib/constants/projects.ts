export const projects = [
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
    name: "AgentKit",
    dates: "2025",
    description:
      "Embeddable SDK for building production-grade agentic platforms with text and voice.",
    achievements: [
      {
        text: "Designed a layered, infra-free core SDK with an in-memory event bus and store, letting developers build and test ReAct-loop agents locally before wiring in Redis and a database",
      },
      {
        text: "Built a pluggable LLM provider system supporting Gemini, OpenAI, and OpenRouter-backed models, with a mock provider for deterministic testing",
      },
      {
        text: "Implemented a voice modality layer with real-time STT via Soniox and TTS via Gemini and OpenAI, decoupling audio I/O from the agent reasoning loop",
        link_text: "Soniox",
        link_href: "https://soniox.com",
      },
      {
        text: "Shipped agentkit-serve, a reference FastAPI + TaskIQ deployment that fans out events over Redis Streams and Pub/Sub across three isolated processes — API, reasoning worker, and tool worker",
      },
    ],
  },
];
