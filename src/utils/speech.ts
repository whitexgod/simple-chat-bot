import type { VoiceGender } from "../types/chat";
import { VoiceGender as VoiceGenderEnum } from "../types/chat";

const FEMALE_TERMS = ["female", "woman", "samantha", "victoria", "zira", "aria", "susan", "ava"];
const MALE_TERMS = ["male", "man", "david", "mark", "james", "guy", "tom", "alex", "daniel"];

export const getPreferredVoice = (
  voices: SpeechSynthesisVoice[],
  gender: VoiceGender
): SpeechSynthesisVoice | null => {
  if (!voices.length) return null;
  const terms = gender === VoiceGenderEnum.Female ? FEMALE_TERMS : MALE_TERMS;
  const preferred = voices.find((voice) =>
    terms.some((term) => voice.name.toLowerCase().includes(term))
  );
  if (preferred) return preferred;
  return voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ?? voices[0] ?? null;
};

export const speakText = (
  text: string,
  gender: VoiceGender,
  voices: SpeechSynthesisVoice[],
  speechLang: string,
  onEnd?: () => void
): SpeechSynthesisUtterance | null => {
  if (!("speechSynthesis" in window)) return null;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.12;
  utterance.pitch = gender === VoiceGenderEnum.Female ? 1.15 : 0.95;
  utterance.lang = speechLang;
  if (onEnd) {
    utterance.onend = onEnd;
  }
  const preferredVoice = getPreferredVoice(voices, gender);
  if (preferredVoice) {
    utterance.voice = preferredVoice;
    utterance.lang = preferredVoice.lang;
  }
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return utterance;
};
