/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEBHOOK_URL?: string;
  readonly VITE_DEFAULT_SESSION_ID?: string;
  readonly VITE_SPEECH_LANG?: string;
  readonly VITE_DEFAULT_VOICE_GENDER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
