# Agentic Chat Bot

A modern React + TypeScript + Tailwind chat UI that connects to an n8n webhook and supports text + voice conversations.

## Features

- Clean chat interface with animated message bubbles and loaders.
- Session-based conversations with `New Session` support.
- Webhook integration with dynamic payload:
  - `sessionId`
  - `message`
- Voice Mode with:
  - Speech-to-text input
  - Male/Female voice selection
  - Auto readout of assistant responses
  - 3-second pause detection to auto-send
  - Auto resume listening after response readout
  - 3-second delayed mic start after enabling voice mode
- Jarvis-style voice interaction panel while listening/waiting.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS

## Prerequisites

- Node.js 18+ (recommended Node.js 20+)
- npm
- Running n8n webhook endpoint (default):
  - `http://localhost:5678/webhook/ai-chat-bot`

## Setup

1. Clone the repository.
2. Go to this project folder:
   - `cd agentic-chat-bot`
3. Install dependencies:
   - `npm install`
4. Create env file:
   - copy `.env.example` to `.env`
5. Start development server:
   - `npm run dev`

## Environment Variables

All runtime config is read from `.env` using Vite `import.meta.env`.

```env
VITE_WEBHOOK_URL=http://localhost:5678/webhook/ai-chat-bot
VITE_DEFAULT_SESSION_ID=1
VITE_SPEECH_LANG=en-US
VITE_DEFAULT_VOICE_GENDER=female
```

## API Contract

The app sends:

```json
{
  "sessionId": "1",
  "message": "Hi, I am Tuhin"
}
```

The app can parse common response formats, including:

```json
{ "output": "..." }
```

Also supports `reply`, `response`, `message`, `text`, and nested `data.*`.

## Scripts

- `npm run dev` - Start local development server.
- `npm run build` - Type-check and build production bundle.
- `npm run preview` - Preview production build locally.

## Browser Notes

- Voice input uses Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
- Best support is typically on Chromium-based browsers.
- If microphone permission is blocked, voice mode input will not work.

## Project Structure

```text
src/
  components/
  config/
  types/
  utils/
```

## Git Notes

- `.env` is ignored by git.
- `.env.example` is committed as the template.

## License

Use your preferred license for this repository (MIT recommended if open source).
