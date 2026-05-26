import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { requireAuth } from "@/app/lib/auth";
import type { ApiResponse } from "@/app/lib/constants";
import type { ChatMessage } from "@/app/lib/types/travel";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { user } = auth;

  const { id: sessionId } = await params;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!session) {
    const body: ApiResponse = { success: false, error: "세션을 찾을 수 없습니다." };
    return NextResponse.json(body, { status: 404 });
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select()
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    const body: ApiResponse = { success: false, error: "메시지를 불러오는 중 오류가 발생했습니다." };
    return NextResponse.json(body, { status: 500 });
  }

  const body: ApiResponse<ChatMessage[]> = { success: true, data: data as ChatMessage[] };
  return NextResponse.json(body);
}
