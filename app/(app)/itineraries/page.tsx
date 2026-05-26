"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ItineraryCard from "@/app/components/itinerary/ItineraryCard";
import EmptyState from "@/app/components/ui/EmptyState";
import Spinner from "@/app/components/ui/Spinner";
import type { Itinerary } from "@/app/lib/types/travel";

export default function ItinerariesPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/itineraries")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setItineraries(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("이 일정을 삭제할까요?")) return;
    const res = await fetch(`/api/itineraries/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setItineraries((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">여행 일정</h1>
          <p className="text-gray-500 mt-1">저장된 여행 일정을 관리하세요</p>
        </div>
        <Link
          href="/itineraries/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 일정
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : itineraries.length === 0 ? (
        <EmptyState
          title="저장된 일정이 없어요"
          description="AI와 함께 첫 번째 여행 일정을 만들어 보세요!"
          action={
            <Link
              href="/itineraries/new"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              일정 만들기
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {itineraries.map((it) => (
            <ItineraryCard key={it.id} itinerary={it} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
