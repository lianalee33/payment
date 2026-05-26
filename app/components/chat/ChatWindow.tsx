"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "@/app/lib/types/travel";

interface Props {
  messages: ChatMessage[];
  streaming?: string;
}

export default function ChatWindow({ messages, streaming }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  if (messages.length === 0 && !streaming) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
        <span className="text-5xl mb-3">💬</span>
        <p className="font-medium text-gray-600">AI 여행 어시스턴트</p>
        <p className="text-sm mt-1">여행 계획, 현지 정보, 맛집 추천 등 무엇이든 물어보세요</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      {streaming && (
        <div className="flex justify-start">
          <div className="max-w-[75%] px-4 py-2.5 rounded-2xl rounded-bl-sm bg-white border border-gray-200 text-gray-800 text-sm whitespace-pre-wrap">
            {streaming}
            <span className="inline-block w-1 h-4 bg-gray-400 ml-0.5 animate-pulse" />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
