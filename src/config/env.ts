import { VoiceGender } from "../types/chat";

const getVoiceGender = (value: string | undefined): VoiceGender =>
  value?.toLowerCase() === VoiceGender.Male ? VoiceGender.Male : VoiceGender.Female;

export const APP_ENV = {
  webhookUrl:
    import.meta.env.VITE_WEBHOOK_URL?.trim() || "http://localhost:5678/webhook/ai-chat-bot",
  defaultSessionId: import.meta.env.VITE_DEFAULT_SESSION_ID?.trim() || "1",
  speechLang: import.meta.env.VITE_SPEECH_LANG?.trim() || "en-US",
  defaultVoiceGender: getVoiceGender(import.meta.env.VITE_DEFAULT_VOICE_GENDER),
} as const;
