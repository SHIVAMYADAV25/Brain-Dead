import { useState } from "react";
import { sendMessage } from "../services/chat.service";
import { useChatStore } from "../store/chat.store";

type Message = {
  role: "user" | "ai";
  text: string;
};

function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const { contextToken, chatId, setChatId } = useChatStore();

  async function handleSend() {
    if (!input.trim()) return;

    setMessages((m) => [...m, { role: "user", text: input }]);
    setLoading(true);

    const response = await sendMessage({
      message: input,
      contextToken: chatId ? undefined : contextToken || undefined,
      chatId: chatId || undefined,
    });

    setMessages((m) => [...m, { role: "ai", text: response.answer }]);

    if (response.chatId) {
      setChatId(response.chatId);
    }

    setInput("");
    setLoading(false);
  }

  return (
    <div>
      <h2>Chat</h2>

      <div>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.role}:</b> {m.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
      />

      <button onClick={handleSend} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}

export default ChatPage;
