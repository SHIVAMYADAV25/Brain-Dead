import { api } from "./api";

export async function createChatContext(payload: {
  scope: "page" | "content";
  scopeIds: string[];
}) {
  const res = await api.post("/chat/context", payload);
  return res.data.data; // { contextToken }
}

export async function sendMessage(payload: {
  message: string;
  contextToken?: string;
  chatId?: string;
}) {
  const res = await api.post("/chat/", payload);
  return res.data.data; // { answer, chatId? }
}
