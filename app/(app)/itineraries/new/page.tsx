"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ItineraryForm from "@/app/components/itinerary/ItineraryForm";
import ItineraryContent from "@/app/components/itinerary/ItineraryContent";
import ErrorMessage from "@/app/components/ui/ErrorMessage";
import type { DayPlan, GenerateRequest } from "@/app/lib/types/travel";

export default function NewItineraryPage() {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [days, setDays] = useState<DayPlan[]>([]);
  const [streamText, setStreamText] = useState("");
  const [lastRequest, setLastRequest] = useState<GenerateRequest | null>(null);

  async function handleGenerate(data: GenerateRequest) {
    setGenerating(true);
    setError("");
    setDays([]);
    setStreamText("");
    setLastRequest(data);

    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok || !res.body) {
      setError("일정 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setGenerating(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      accumulated += chunk;
      setStreamText(accumulated);
    }

    try {
      const parsed: DayPlan[] = JSON.parse(accumulated);
      setDays(parsed);
    } catch {
      setError("AI 응답을 파싱하지 못했습니다. 다시 시도해 주세요.");
    }

    setStreamText("");
    setGenerating(false);
  }

  async function handleSave() {
    if (!lastRequest || days.length === 0) return;
    setSaving(true);
    setError("");

    const title = `${lastRequest.destination} ${lastRequest.days}박 ${lastRequest.days + 1}일 여행`;

    const res = await fetch("/api/itineraries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        destination: lastRequest.destination,
        days: lastRequest.days,
        startDate: lastRequest.startDate,
        content: days,
      }),
    });

    const json = await res.json();
    if (!json.success) {
      setError("저장 중 오류가 발생했습니다.");
      setSaving(false);
      return;
    }

    router.push(`/itineraries/${json.data.id}`);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">새 여행 일정 만들기</h1>
        <p className="text-gray-500 mt-1">AI가 맞춤 여행 일정을 생성해 드립니다</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ItineraryForm onSubmit={handleGenerate} isLoading={generating} />
      </div>

      <ErrorMessage message={error} />

      {generating && streamText && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <p className="text-xs font-medium text-gray-400 mb-3">AI가 일정을 생성하고 있어요...</p>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono overflow-x-auto max-h-64">
            {streamText}
          </pre>
        </div>
      )}

      {days.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">생성된 일정</h2>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium text-sm"
            >
              {saving ? "저장 중..." : "이 일정 저장하기"}
            </button>
          </div>
          <ItineraryContent days={days} />
        </div>
      )}
    </div>
  );
}
