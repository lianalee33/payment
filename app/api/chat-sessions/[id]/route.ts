import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { requireAuth } from "@/app/lib/auth";
import type { ApiResponse } from "@/app/lib/constants";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { user } = auth;

  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    const body: ApiResponse = { success: false, error: "세션 삭제 중 오류가 발생했습니다." };
    return NextResponse.json(body, { status: 500 });
  }

  const body: ApiResponse = { success: true };
  return NextResponse.json(body);
}
