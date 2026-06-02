export const projects = [
  {
    name: "AgentKit",
    dates: "2025",
    description: "Embeddable SDK for building production-grade agentic platforms with text and voice.",
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
