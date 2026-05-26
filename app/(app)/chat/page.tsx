"use client";

import { useEffect, useState, useCallback } from "react";
import ChatSessionList from "@/app/components/chat/ChatSessionList";
import ChatWindow from "@/app/components/chat/ChatWindow";
import ChatInput from "@/app/components/chat/ChatInput";
import type { ChatSession, ChatMessage } from "@/app/lib/types/travel";

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/chat-sessions")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data.length > 0) {
          setSessions(json.data);
          setActiveSessionId(json.data[0].id);
        }
      });
  }, []);

  const loadMessages = useCallback(async (sessionId: string) => {
    const res = await fetch(`/api/chat-sessions/${sessionId}/messages`);
    const json = await res.json();
    if (json.success) setMessages(json.data);
  }, []);

  useEffect(() => {
    if (activeSessionId) loadMessages(activeSessionId);
    else setMessages([]);
  }, [activeSessionId, loadMessages]);

  async function handleNewSession() {
    setLoading(true);
    const res = await fetch("/api/chat-sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const json = await res.json();
    if (json.success) {
      setSessions((prev) => [json.data, ...prev]);
      setActiveSessionId(json.data.id);
      setMessages([]);
    }
    setLoading(false);
  }

  async function handleDeleteSession(id: string) {
    if (!confirm("이 대화를 삭제할까요?")) return;
    await fetch(`/api/chat-sessions/${id}`, { method: "DELETE" });
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      setActiveSessionId(remaining.length > 0 ? remaining[0].id : null);
    }
  }

  async function handleSend(text: string) {
    if (!activeSessionId) {
      await handleNewSession();
      return;
    }

    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      session_id: activeSessionId,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);
    setStreaming("");

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: activeSessionId, message: text }),
    });

    if (!res.ok || !res.body) {
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });
      setStreaming(accumulated);
    }

    const assistantMsg: ChatMessage = {
      id: `temp-assistant-${Date.now()}`,
      session_id: activeSessionId,
      role: "assistant",
      content: accumulated,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), tempUserMsg, assistantMsg]);
    setStreaming("");
    setLoading(false);

    await loadMessages(activeSessionId);
  }

  return (
    <div className="h-[calc(100vh-3.5rem-3rem)] flex rounded-xl border border-gray-200 overflow-hidden bg-white">
      <ChatSessionList
        sessions={sessions}
        activeId={activeSessionId}
        onSelect={setActiveSessionId}
        onNew={handleNewSession}
        onDelete={handleDeleteSession}
        loading={loading}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow messages={messages} streaming={streaming || undefined} />
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}
