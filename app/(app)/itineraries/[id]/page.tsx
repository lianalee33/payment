"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ItineraryContent from "@/app/components/itinerary/ItineraryContent";
import Spinner from "@/app/components/ui/Spinner";
import type { Itinerary } from "@/app/lib/types/travel";

export default function ItineraryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/itineraries/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setItinerary(json.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm("이 일정을 삭제할까요?")) return;
    setDeleting(true);
    const res = await fetch(`/api/itineraries/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) router.push("/itineraries");
    else setDeleting(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">일정을 찾을 수 없습니다.</p>
        <Link href="/itineraries" className="text-blue-600 hover:underline mt-2 inline-block text-sm">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/itineraries" className="text-sm text-blue-600 hover:underline">
            ← 목록으로
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">{itinerary.title}</h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span>{itinerary.destination}</span>
            <span>·</span>
            <span>{itinerary.days}일</span>
            {itinerary.start_date && (
              <>
                <span>·</span>
                <span>{itinerary.start_date}</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="shrink-0 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 text-sm font-medium"
        >
          {deleting ? "삭제 중..." : "삭제"}
        </button>
      </div>

      <ItineraryContent days={itinerary.content} />
    </div>
  );
}
