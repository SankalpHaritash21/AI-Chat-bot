/// <reference types="vite/client" />

export interface LoadingProps {
  isLoading: boolean;
}

interface Message {
  type: "user" | "bot";
  message: string;
}

export interface ChatHistoryProps {
  chatHistory: Message[];
}
