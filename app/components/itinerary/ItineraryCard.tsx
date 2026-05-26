import Link from "next/link";
import type { Itinerary } from "@/app/lib/types/travel";

interface Props {
  itinerary: Itinerary;
  onDelete?: (id: string) => void;
}

export default function ItineraryCard({ itinerary, onDelete }: Props) {
  const dateRange =
    itinerary.start_date && itinerary.end_date
      ? `${itinerary.start_date} ~ ${itinerary.end_date}`
      : itinerary.start_date
      ? `${itinerary.start_date}~`
      : null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{itinerary.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{itinerary.destination}</p>
        </div>
        <span className="shrink-0 text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
          {itinerary.days}일
        </span>
      </div>
      {dateRange && <p className="text-xs text-gray-400">{dateRange}</p>}
      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
        <Link
          href={`/itineraries/${itinerary.id}`}
          className="flex-1 text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-1"
        >
          보기
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(itinerary.id)}
            className="flex-1 text-center text-sm font-medium text-red-500 hover:text-red-600 py-1"
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
}
