import type { DayPlan } from "@/app/lib/types/travel";

interface Props {
  days: DayPlan[];
}

export default function ItineraryContent({ days }: Props) {
  return (
    <div className="space-y-6">
      {days.map((day) => (
        <div key={day.day} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-blue-50 px-5 py-3 flex items-center justify-between">
            <div>
              <span className="font-bold text-blue-700">Day {day.day}</span>
              {day.date && <span className="text-sm text-blue-500 ml-2">{day.date}</span>}
            </div>
            <span className="text-sm font-medium text-blue-600">{day.theme}</span>
          </div>

          <div className="p-5 space-y-4">
            <div className="space-y-3">
              {day.activities.map((act, i) => (
                <div key={i} className="flex gap-3">
                  <div className="shrink-0 w-16 text-xs font-medium text-gray-400 pt-0.5">{act.time}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{act.place}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{act.description}</p>
                    {act.tips && (
                      <p className="text-xs text-amber-600 mt-1 bg-amber-50 px-2 py-1 rounded">
                        💡 {act.tips}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {(day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">식사</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                  {day.meals.breakfast && <span>🌅 {day.meals.breakfast}</span>}
                  {day.meals.lunch && <span>☀️ {day.meals.lunch}</span>}
                  {day.meals.dinner && <span>🌙 {day.meals.dinner}</span>}
                </div>
              </div>
            )}

            {day.accommodation && (
              <div className="border-t border-gray-100 pt-3 text-sm text-gray-600">
                🏨 {day.accommodation}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
