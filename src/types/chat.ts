export enum Role {
  User = "user",
  Assistant = "assistant",
}

export type ChatMessage = {
  id: string;
  role: Role;
  text: string;
  createdAt: string;
};

export enum VoiceGender {
  Female = "female",
  Male = "male",
}
