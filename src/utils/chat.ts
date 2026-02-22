enum ResponseField {
  Output = "output",
  Reply = "reply",
  Response = "response",
  Message = "message",
  Text = "text",
  Data = "data",
}

const getTextFromObject = (obj: Record<string, unknown>): string | null => {
  if (typeof obj[ResponseField.Output] === "string") return obj[ResponseField.Output];
  if (typeof obj[ResponseField.Reply] === "string") return obj[ResponseField.Reply];
  if (typeof obj[ResponseField.Response] === "string") return obj[ResponseField.Response];
  if (typeof obj[ResponseField.Message] === "string") return obj[ResponseField.Message];
  if (typeof obj[ResponseField.Text] === "string") return obj[ResponseField.Text];
  return null;
};

export const extractReplyText = (payload: unknown): string => {
  if (typeof payload === "string") return payload;
  if (Array.isArray(payload)) {
    const first = payload[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object") {
      const text = getTextFromObject(first as Record<string, unknown>);
      if (text) return text;
    }
  }
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    const text = getTextFromObject(obj);
    if (text) return text;
    const nested = obj[ResponseField.Data];
    if (nested && typeof nested === "object") {
      const nestedText = getTextFromObject(nested as Record<string, unknown>);
      if (nestedText) return nestedText;
    }
  }
  return "I received your message but the response format was unexpected.";
};

export const nowTime = (): string =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const newSessionId = (): string => crypto.randomUUID().split("-")[0];
