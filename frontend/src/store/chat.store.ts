import { create } from "zustand";

type ChatState = {
  contextToken: string | null;
  chatId: string | null;

  setContextToken: (token: string) => void;
  setChatId: (id: string) => void;
  resetChat: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  contextToken: null,
  chatId: null,

  setContextToken: (token) => set({ contextToken: token }),
  setChatId: (id) => set({ chatId: id }),

  resetChat: () =>
    set({
      contextToken: null,
      chatId: null,
    }),
}));
