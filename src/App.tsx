import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import ChatComposer from "./components/ChatComposer";
import ChatHeader from "./components/ChatHeader";
import MessageBubble from "./components/MessageBubble";
import TypingLoader from "./components/TypingLoader";
import VoiceInteractionPanel from "./components/VoiceInteractionPanel";
import { Role, VoiceGender, type ChatMessage } from "./types/chat";
import type { SpeechRecognitionLike } from "./types/speech";
import { APP_ENV } from "./config/env";
import { extractReplyText, newSessionId, nowTime } from "./utils/chat";
import { speakText } from "./utils/speech";

function App() {
  const [sessionId, setSessionId] = useState<string>(APP_ENV.defaultSessionId);
  const [input, setInput] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(false);
  const [voiceGender, setVoiceGender] = useState<VoiceGender>(APP_ENV.defaultVoiceGender);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [autoReadOut, setAutoReadOut] = useState<boolean>(true);
  const [isSpeechSupported] = useState<boolean>(
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: Role.Assistant,
      text: "Welcome. Ask me anything and I will respond via your local webhook.",
      createdAt: nowTime(),
    },
  ]);

  const listRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseVoiceInputRef = useRef<string>("");
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const autoSendTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voiceModeStartDelayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<string>("");
  const isVoiceModeRef = useRef<boolean>(false);
  const isSendingRef = useRef<boolean>(false);
  const isListeningRef = useRef<boolean>(false);
  const isVoiceModeBootingRef = useRef<boolean>(false);

  const canSend = useMemo(
    () => Boolean(input.trim()) && Boolean(sessionId.trim()) && !isSending,
    [input, sessionId, isSending]
  );
  const showVoiceInteractionPanel = isVoiceMode && (isListening || isSending);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  const clearAutoSendTimeout = () => {
    if (autoSendTimeoutRef.current) {
      clearTimeout(autoSendTimeoutRef.current);
      autoSendTimeoutRef.current = null;
    }
  };

  const clearVoiceModeStartDelay = () => {
    if (voiceModeStartDelayTimeoutRef.current) {
      clearTimeout(voiceModeStartDelayTimeoutRef.current);
      voiceModeStartDelayTimeoutRef.current = null;
    }
  };

  const readOut = (text: string) =>
    speakText(text, voiceGender, voicesRef.current, APP_ENV.speechLang, () => {
      if (
        isVoiceModeRef.current &&
        !isVoiceModeBootingRef.current &&
        !isSendingRef.current &&
        !isListeningRef.current
      ) {
        setTimeout(() => {
          if (
            isVoiceModeRef.current &&
            !isVoiceModeBootingRef.current &&
            !isSendingRef.current &&
            !isListeningRef.current
          ) {
            startListening();
          }
        }, 250);
      }
    });

  const pushMessage = (role: Role, text: string, shouldReadOut?: boolean) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role,
        text,
        createdAt: nowTime(),
      },
    ]);
    if (role === Role.Assistant && (shouldReadOut ?? (isVoiceMode || autoReadOut))) {
      readOut(text);
    }
  };

  const switchToNewSession = () => {
    const nextSessionId = newSessionId();
    setSessionId(nextSessionId);
    setInput("");
    setMessages([
      {
        id: crypto.randomUUID(),
        role: Role.Assistant,
        text: `Started a new session (${nextSessionId}). Ask me anything.`,
        createdAt: nowTime(),
      },
    ]);
  };

  const stopListening = () => {
    clearAutoSendTimeout();
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const startListening = () => {
    if (!isSpeechSupported) {
      pushMessage(Role.Assistant, "Voice input is not supported in this browser.", false);
      return;
    }
    if (isListening) return;

    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = APP_ENV.speechLang;
    baseVoiceInputRef.current = input.trim() ? `${input.trim()} ` : "";

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0]?.transcript ?? "";
      }
      const nextInput = `${baseVoiceInputRef.current}${transcript}`.trimStart();
      setInput(nextInput);
      inputRef.current = nextInput;
      clearAutoSendTimeout();
      autoSendTimeoutRef.current = setTimeout(() => {
        if (isVoiceModeRef.current && isListeningRef.current && !isSendingRef.current) {
          void sendMessage(inputRef.current.trim());
        }
      }, 3000);
    };

    recognition.onerror = () => {
      clearAutoSendTimeout();
      setIsListening(false);
      pushMessage(
        Role.Assistant,
        "Voice input stopped due to a microphone/permission issue.",
        false
      );
    };

    recognition.onend = () => {
      clearAutoSendTimeout();
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
      pushMessage(Role.Assistant, "Could not start voice input right now. Please try again.", false);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleVoiceMode = () => {
    const nextVoiceMode = !isVoiceMode;
    isVoiceModeRef.current = nextVoiceMode;
    setIsVoiceMode(nextVoiceMode);
    if (nextVoiceMode) {
      setAutoReadOut(true);
      isVoiceModeBootingRef.current = true;
      clearVoiceModeStartDelay();
      voiceModeStartDelayTimeoutRef.current = setTimeout(() => {
        if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
          voiceModeStartDelayTimeoutRef.current = setTimeout(() => {
            if (isVoiceModeRef.current && !isSendingRef.current && !isListeningRef.current) {
              isVoiceModeBootingRef.current = false;
              startListening();
            }
          }, 300);
          return;
        }
        if (isVoiceModeRef.current && !isSendingRef.current && !isListeningRef.current) {
          isVoiceModeBootingRef.current = false;
          startListening();
        }
      }, 3000);
      pushMessage(Role.Assistant, "Voice mode enabled. I will read out every response.", true);
    } else {
      clearVoiceModeStartDelay();
      isVoiceModeBootingRef.current = false;
      stopListening();
      pushMessage(Role.Assistant, "Voice mode disabled. Switched back to normal chat mode.", false);
    }
  };

  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    isVoiceModeRef.current = isVoiceMode;
  }, [isVoiceMode]);

  useEffect(() => {
    isSendingRef.current = isSending;
  }, [isSending]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const loadVoices = () => {
        voicesRef.current = window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      clearAutoSendTimeout();
      clearVoiceModeStartDelay();
      recognitionRef.current?.abort();
      if ("speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const sendMessage = async (messageText?: string) => {
    const trimmed = (messageText ?? inputRef.current).trim();
    const trimmedSession = sessionId.trim();
    if (!trimmed || !trimmedSession || isSending) return;

    if (isListeningRef.current) {
      stopListening();
    }

    pushMessage(Role.User, trimmed);
    setInput("");
    inputRef.current = "";
    setIsSending(true);
    scrollToBottom();

    try {
      const response = await fetch(APP_ENV.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: trimmedSession,
          message: trimmed,
        }),
      });

      if (!response.ok) {
        throw new Error(`Webhook returned ${response.status}`);
      }

      let payload: unknown;
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        payload = await response.json();
      } else {
        payload = await response.text();
      }

      const replyText = extractReplyText(payload);
      pushMessage(Role.Assistant, replyText);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      pushMessage(Role.Assistant, `Unable to reach webhook: ${message}`);
    } finally {
      setIsSending(false);
      scrollToBottom();
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await sendMessage();
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center p-4 sm:p-8">
      <section
        className={`relative w-full overflow-hidden rounded-3xl border shadow-glow backdrop-blur-2xl transition-all duration-300 ${
          isVoiceMode
            ? "border-cyan-300/40 bg-cyan-500/10 ring-1 ring-cyan-300/30"
            : "border-white/15 bg-white/5"
        }`}
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-brand-400/20 blur-3xl animate-float" />
        <div
          className={`pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full blur-3xl animate-float [animation-delay:1.2s] ${
            isVoiceMode ? "bg-cyan-300/25" : "bg-blue-300/15"
          }`}
        />

        <ChatHeader
          sessionId={sessionId}
          isVoiceMode={isVoiceMode}
          autoReadOut={autoReadOut}
          isSending={isSending}
          voiceGender={voiceGender}
          onSessionChange={setSessionId}
          onToggleReadout={() => setAutoReadOut((prev) => !prev)}
          onToggleVoiceMode={toggleVoiceMode}
          onNewSession={switchToNewSession}
          onVoiceGenderChange={setVoiceGender}
        />

        <div
          ref={listRef}
          className={`relative h-[60vh] space-y-3 overflow-y-auto p-4 scrollbar-thin sm:h-[65vh] sm:space-y-4 sm:p-6 ${
            showVoiceInteractionPanel ? "overflow-hidden" : ""
          }`}
        >
          <div
            className={`space-y-3 sm:space-y-4 transition ${
              showVoiceInteractionPanel ? "pointer-events-none opacity-30 blur-[1px]" : "opacity-100"
            }`}
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} onReadOut={readOut} />
            ))}
            {isSending && <TypingLoader />}
          </div>
          {showVoiceInteractionPanel && (
            <VoiceInteractionPanel isListening={isListening} isSending={isSending} draftInput={input} />
          )}
        </div>

        <ChatComposer
          input={input}
          isSending={isSending}
          canSend={canSend}
          isSpeechSupported={isSpeechSupported}
          isListening={isListening}
          isVoiceMode={isVoiceMode}
          onInputChange={setInput}
          onToggleVoiceInput={toggleVoiceInput}
          onSubmit={onSubmit}
        />
      </section>
    </main>
  );
}

export default App;
