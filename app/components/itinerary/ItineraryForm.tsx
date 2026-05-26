"use client";

import { useState } from "react";
import type { TravelStyle, GenerateRequest } from "@/app/lib/types/travel";

const STYLES: TravelStyle[] = ["문화", "자연", "음식", "쇼핑", "휴양"];

interface Props {
  onSubmit: (data: GenerateRequest) => void;
  isLoading: boolean;
}

export default function ItineraryForm({ onSubmit, isLoading }: Props) {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [styles, setStyles] = useState<TravelStyle[]>([]);
  const [startDate, setStartDate] = useState("");

  function toggleStyle(s: TravelStyle) {
    setStyles((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ destination, days, styles, startDate: startDate || undefined });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">목적지 *</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          placeholder="예: 도쿄, 파리, 제주도"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">여행 기간 *</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={14}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="flex-1"
          />
          <span className="w-16 text-center font-semibold text-blue-700 text-lg">{days}일</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">여행 스타일</label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleStyle(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                styles.includes(s)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">출발일 (선택)</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !destination}
        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            AI가 일정을 생성하고 있어요...
          </>
        ) : (
          "AI로 일정 생성하기 ✈️"
        )}
      </button>
    </form>
  );
}
