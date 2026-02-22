import type { FormEvent } from "react";

type ChatComposerProps = {
  input: string;
  isSending: boolean;
  canSend: boolean;
  isSpeechSupported: boolean;
  isListening: boolean;
  isVoiceMode: boolean;
  onInputChange: (value: string) => void;
  onToggleVoiceInput: () => void;
  onSubmit: (event: FormEvent) => void;
};

export default function ChatComposer({
  input,
  isSending,
  canSend,
  isSpeechSupported,
  isListening,
  isVoiceMode,
  onInputChange,
  onToggleVoiceInput,
  onSubmit,
}: ChatComposerProps) {
  return (
    <form onSubmit={onSubmit} className="relative border-t border-white/10 p-3 sm:p-4">
      <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/20 p-2 shadow-inner sm:gap-3 sm:p-3">
        <button
          type="button"
          onClick={onToggleVoiceInput}
          disabled={isSending || !isSpeechSupported}
          className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-medium transition sm:text-sm ${
            isListening
              ? "bg-cyan-500/80 text-white animate-pulseSoft"
              : "border border-white/20 bg-white/10 text-slate-100 hover:bg-white/20"
          } disabled:cursor-not-allowed disabled:opacity-50`}
          title={
            isSpeechSupported
              ? isListening
                ? "Stop voice input"
                : "Start voice input"
              : "Voice input not supported"
          }
        >
          {isListening ? "Listening..." : isVoiceMode ? "Mic Live" : "Mic"}
        </button>
        <input
          className="min-w-0 flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-slate-400 sm:text-base"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!canSend}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
        >
          {isSending ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Sending
            </>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </form>
  );
}
