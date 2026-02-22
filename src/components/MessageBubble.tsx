import { Role, type ChatMessage } from "../types/chat";

type MessageBubbleProps = {
  message: ChatMessage;
  onReadOut: (text: string) => void;
};

export default function MessageBubble({ message, onReadOut }: MessageBubbleProps) {
  const isUser = message.role === Role.User;

  return (
    <div className={`animate-fadeInUp flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[84%] rounded-2xl px-4 py-3 shadow-lg backdrop-blur-xl sm:max-w-[70%] ${
          isUser
            ? "rounded-br-md bg-gradient-to-r from-brand-500 to-brand-700 text-white"
            : "rounded-bl-md border border-white/15 bg-white/10 text-slate-100"
        }`}
      >
        <p className="text-sm leading-relaxed sm:text-[15px]">{message.text}</p>
        <div className="mt-2 flex items-center justify-end gap-2">
          {!isUser && (
            <button
              type="button"
              onClick={() => onReadOut(message.text)}
              className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-[11px] text-white/80 transition hover:bg-white/20"
              title="Read response"
            >
              Read
            </button>
          )}
          <span className="block text-right text-[11px] text-white/65">{message.createdAt}</span>
        </div>
      </div>
    </div>
  );
}
