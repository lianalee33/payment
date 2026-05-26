import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { getAuthUser } from "@/app/lib/auth";
import ItineraryCard from "@/app/components/itinerary/ItineraryCard";
import type { Itinerary } from "@/app/lib/types/travel";

export default async function DashboardPage() {
  const user = await getAuthUser();
  const supabase = await createClient();

  const { data } = user
    ? await supabase
        .from("itineraries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)
    : { data: null };

  const itineraries = (data ?? []) as Itinerary[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">안녕하세요 👋</h1>
        <p className="text-gray-500 mt-1">{user?.email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/itineraries/new"
          className="flex flex-col items-center justify-center gap-3 p-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          <span className="text-4xl">✈️</span>
          <span className="font-semibold">새 여행 일정 만들기</span>
          <span className="text-sm text-blue-200">AI가 맞춤 일정을 생성해 드려요</span>
        </Link>
        <Link
          href="/itineraries"
          className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
        >
          <span className="text-4xl">🗺️</span>
          <span className="font-semibold text-gray-900">내 여행 일정</span>
          <span className="text-sm text-gray-500">저장된 일정 {itineraries.length}개</span>
        </Link>
        <Link
          href="/chat"
          className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
        >
          <span className="text-4xl">💬</span>
          <span className="font-semibold text-gray-900">AI 여행 채팅</span>
          <span className="text-sm text-gray-500">궁금한 것을 물어보세요</span>
        </Link>
      </div>

      {itineraries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">최근 여행 일정</h2>
            <Link href="/itineraries" className="text-sm text-blue-600 hover:underline">
              전체 보기
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {itineraries.map((it) => (
              <ItineraryCard key={it.id} itinerary={it} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
