import type { ChatSession } from "@/app/lib/types/travel";

interface Props {
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export default function ChatSessionList({ sessions, activeId, onSelect, onNew, onDelete, loading }: Props) {
  return (
    <div className="w-56 shrink-0 border-r border-gray-200 flex flex-col bg-gray-50">
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={onNew}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 대화
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`group flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
              s.id === activeId ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => onSelect(s.id)}
          >
            <span className="flex-1 text-sm truncate">{s.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(s.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-0.5 rounded transition-opacity"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
