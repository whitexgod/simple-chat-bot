type VoiceInteractionPanelProps = {
  isListening: boolean;
  isSending: boolean;
  draftInput: string;
};

export default function VoiceInteractionPanel({
  isListening,
  isSending,
  draftInput,
}: VoiceInteractionPanelProps) {
  const status = isListening && !isSending ? "Listening..." : "Processing Request...";
  const hint =
    isListening && !isSending
      ? "Speak naturally. I am capturing your message."
      : "I heard you. Preparing the best response now.";

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
      <div className="jarvis-grid absolute inset-0 rounded-3xl bg-cyan-400/5 backdrop-blur-[2px]" />
      <div className="relative w-full max-w-md rounded-3xl border border-cyan-200/40 bg-slate-950/65 p-6 shadow-[0_0_50px_rgba(34,211,238,0.22)]">
        <div className="pointer-events-none absolute inset-0 rounded-3xl border border-cyan-200/20" />

        <div className="relative mx-auto mb-5 flex h-44 w-44 items-center justify-center">
          <span className="jarvis-ring absolute h-44 w-44 rounded-full border border-cyan-200/50" />
          <span className="jarvis-ring-delay absolute h-32 w-32 rounded-full border border-cyan-200/40" />
          <span className="absolute h-24 w-24 rounded-full bg-cyan-300/20 blur-xl" />
          <span
            className={`absolute h-16 w-16 rounded-full ${
              isListening ? "bg-cyan-300/95 animate-pulse" : "bg-cyan-200/75 animate-pulseSoft"
            }`}
          />
        </div>

        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-100/85">{status}</p>
          <p className="mt-2 text-sm text-cyan-50/85">{hint}</p>
          <p className="mt-4 min-h-11 rounded-xl border border-cyan-100/20 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100/90">
            {draftInput.trim() ? `"${draftInput.trim()}"` : "..."}
          </p>
        </div>
      </div>
    </div>
  );
}
