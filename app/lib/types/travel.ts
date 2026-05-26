export interface Activity {
  time: string;
  place: string;
  description: string;
  tips?: string;
}

export interface DayPlan {
  day: number;
  date?: string;
  theme: string;
  activities: Activity[];
  meals: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  accommodation?: string;
}

export interface Itinerary {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date?: string;
  end_date?: string;
  days: number;
  content: DayPlan[];
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export type TravelStyle = "문화" | "자연" | "음식" | "쇼핑" | "휴양";

export interface GenerateRequest {
  destination: string;
  days: number;
  styles: TravelStyle[];
  startDate?: string;
}
