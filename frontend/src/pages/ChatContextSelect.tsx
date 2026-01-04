import { useState } from "react";
import { createChatContext } from "../services/chat.service";
import { useChatStore } from "../store/chat.store";
import { useNavigate } from "react-router-dom";

function ChatContextSelect() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [scope, setScope] = useState<"page" | "content">("page");

  const setContextToken = useChatStore((s) => s.setContextToken);
  const resetChat = useChatStore((s) => s.resetChat);
  const navigate = useNavigate();

  async function handleStartChat() {
    resetChat();

    const data = await createChatContext({
      scope,
      scopeIds: selectedIds,
    });

    setContextToken(data.contextToken);
    navigate("/chat");
  }

  return (
    <div>
      <h2>Select Context</h2>

      <select value={scope} onChange={(e) => setScope(e.target.value as any)}>
        <option value="page">Pages</option>
        <option value="content">Content</option>
      </select>

      {/* Replace this with real list later */}
      <button onClick={() => setSelectedIds(["demo-id"])}>
        Select Demo Item
      </button>

      <button onClick={handleStartChat} disabled={!selectedIds.length}>
        Start Chat
      </button>
    </div>
  );
}

export default ChatContextSelect;
