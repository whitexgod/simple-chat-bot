import { VoiceGender, type VoiceGender as VoiceGenderType } from "../types/chat";

type ChatHeaderProps = {
  sessionId: string;
  isVoiceMode: boolean;
  autoReadOut: boolean;
  isSending: boolean;
  voiceGender: VoiceGenderType;
  onSessionChange: (value: string) => void;
  onToggleReadout: () => void;
  onToggleVoiceMode: () => void;
  onNewSession: () => void;
  onVoiceGenderChange: (gender: VoiceGenderType) => void;
};

export default function ChatHeader({
  sessionId,
  isVoiceMode,
  autoReadOut,
  isSending,
  voiceGender,
  onSessionChange,
  onToggleReadout,
  onToggleVoiceMode,
  onNewSession,
  onVoiceGenderChange,
}: ChatHeaderProps) {
  return (
    <header className="relative flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
      <div>
        <h1 className="text-lg font-semibold text-white sm:text-xl">Agentic AI Chat Bot</h1>
        <p className="text-xs text-slate-300 sm:text-sm">
          {isVoiceMode
            ? "Voice conversation mode is active: readout always on"
            : "Connected"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-xs sm:text-sm">
          <span className="text-slate-300">Session</span>
          <input
            className="w-20 bg-transparent text-white outline-none placeholder:text-slate-400"
            value={sessionId}
            onChange={(e) => onSessionChange(e.target.value)}
            placeholder="e.g. 1"
            maxLength={64}
          />
        </label>
        <button
          type="button"
          onClick={onToggleReadout}
          disabled={isVoiceMode}
          className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          title="Toggle readout for assistant messages"
        >
          {isVoiceMode ? "Readout Locked" : autoReadOut ? "Readout On" : "Readout Off"}
        </button>
        <button
          type="button"
          onClick={onToggleVoiceMode}
          className={`rounded-xl px-3 py-2 text-xs font-medium text-white transition sm:text-sm ${
            isVoiceMode
              ? "border border-cyan-300/60 bg-cyan-500/30 shadow-[0_0_20px_rgba(103,232,249,0.35)]"
              : "border border-white/20 bg-white/10 hover:bg-white/20"
          }`}
        >
          {isVoiceMode ? "Switch to Text Mode" : "Switch to Voice Mode"}
        </button>
        <button
          type="button"
          onClick={onNewSession}
          disabled={isSending}
          className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-medium text-slate-100 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
        >
          New Session
        </button>
      </div>

      {isVoiceMode && (
        <div className="flex items-center gap-2 rounded-xl border border-cyan-200/30 bg-cyan-400/10 px-2 py-1">
          <span className="text-xs text-cyan-100/90">Voice</span>
          <button
            type="button"
            onClick={() => onVoiceGenderChange(VoiceGender.Female)}
            className={`rounded-lg px-2 py-1 text-xs font-medium transition ${
              voiceGender === VoiceGender.Female
                ? "bg-cyan-300/30 text-white"
                : "bg-white/10 text-cyan-100 hover:bg-white/20"
            }`}
          >
            Female
          </button>
          <button
            type="button"
            onClick={() => onVoiceGenderChange(VoiceGender.Male)}
            className={`rounded-lg px-2 py-1 text-xs font-medium transition ${
              voiceGender === VoiceGender.Male
                ? "bg-cyan-300/30 text-white"
                : "bg-white/10 text-cyan-100 hover:bg-white/20"
            }`}
          >
            Male
          </button>
        </div>
      )}
    </header>
  );
}
