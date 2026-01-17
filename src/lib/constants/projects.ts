export const projects = [
  {
    name: "Modal",
    dates: "2025",
    description: "Agentic voice assistant to help you work smarter.",
    achievements: [
      {
        text: "Integrated Soniox with Redis Streams and Cartesia as part of the speech-to-text -> text-to-speech pipeline to transcribe audio from the user and send it to the agent for context and workflow orchestration",
        link_text: "Soniox",
        link_href: "https://soniox.com",
      },
      {
        text: "Added Google Workspace and Spotify APIs to interact with the user's calendar, emails, documents, and music",
      },
      {
        text: "Designed and built the mobile app for the agentic voice assistant with SwiftUI",
      },
    ],
  },
  {
    name: "Ato",
    dates: "2024",
    description: "A better alternative to Todoist, Things3, and other task management tools.",
    achievements: [
      {
        text: "Built the web client with Tanstack Router and IntentUI",
        links: [
          {
            text: "Tanstack Router",
            href: "https://tanstack.com/router/latest",
          },
          {
            text: "IntentUI",
            href: "https://intentui.com",
          },
        ],
      },
      {
        text: "Added a custom block-based WYSIWYG editor for creating and editing tasks, managing spaces, projects, and everything in between",
      },
      {
        text: "Implemented a server with Go and Chi Router for handling data and business logic",
      },
    ],
  },
];
