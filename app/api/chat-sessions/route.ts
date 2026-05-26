import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { requireAuth } from "@/app/lib/auth";
import type { ApiResponse } from "@/app/lib/constants";
import type { ChatSession } from "@/app/lib/types/travel";

export async function GET() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { user } = auth;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .select()
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    const body: ApiResponse = { success: false, error: "세션을 불러오는 중 오류가 발생했습니다." };
    return NextResponse.json(body, { status: 500 });
  }

  const body: ApiResponse<ChatSession[]> = { success: true, data: data as ChatSession[] };
  return NextResponse.json(body);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { user } = auth;

  const { title } = await req.json().catch(() => ({}));

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({ user_id: user.id, title: title ?? "새 대화" })
    .select()
    .single();

  if (error) {
    const body: ApiResponse = { success: false, error: "세션 생성 중 오류가 발생했습니다." };
    return NextResponse.json(body, { status: 500 });
  }

  const body: ApiResponse<ChatSession> = { success: true, data: data as ChatSession };
  return NextResponse.json(body, { status: 201 });
}
