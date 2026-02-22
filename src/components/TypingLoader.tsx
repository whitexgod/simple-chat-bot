export default function TypingLoader() {
  return (
    <div className="flex justify-start animate-fadeInUp">
      <div className="rounded-2xl rounded-bl-md border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-300 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-300 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand-300 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
