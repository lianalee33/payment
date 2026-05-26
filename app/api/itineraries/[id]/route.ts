import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { requireAuth } from "@/app/lib/auth";
import type { ApiResponse } from "@/app/lib/constants";
import type { Itinerary } from "@/app/lib/types/travel";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { user } = auth;

  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("itineraries")
    .select()
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    const body: ApiResponse = { success: false, error: "일정을 찾을 수 없습니다." };
    return NextResponse.json(body, { status: 404 });
  }

  const body: ApiResponse<Itinerary> = { success: true, data: data as Itinerary };
  return NextResponse.json(body);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { user } = auth;

  const { id } = await params;
  const updates = await req.json();

  const allowed = ["title", "destination", "days", "start_date", "end_date", "content"];
  const filtered = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("itineraries")
    .update(filtered)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error || !data) {
    const body: ApiResponse = { success: false, error: "일정 수정 중 오류가 발생했습니다." };
    return NextResponse.json(body, { status: 500 });
  }

  const body: ApiResponse<Itinerary> = { success: true, data: data as Itinerary };
  return NextResponse.json(body);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { user } = auth;

  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase
    .from("itineraries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    const body: ApiResponse = { success: false, error: "일정 삭제 중 오류가 발생했습니다." };
    return NextResponse.json(body, { status: 500 });
  }

  const body: ApiResponse = { success: true };
  return NextResponse.json(body);
}
