import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { requireAuth } from "@/app/lib/auth";
import type { ApiResponse, PaginatedResponse, PaginationMeta } from "@/app/lib/constants";
import type { Itinerary } from "@/app/lib/types/travel";

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { user } = auth;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("itineraries")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    const body: ApiResponse = { success: false, error: "일정을 불러오는 중 오류가 발생했습니다." };
    return NextResponse.json(body, { status: 500 });
  }

  const total = count ?? 0;
  const meta: PaginationMeta = { page, limit, total, totalPages: Math.ceil(total / limit) };
  const body: PaginatedResponse<Itinerary> = { success: true, data: data as Itinerary[], meta };
  return NextResponse.json(body);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { user } = auth;

  const { title, destination, days, startDate, endDate, content } = await req.json();

  if (!title || !destination || !days || !content) {
    const body: ApiResponse = { success: false, error: "필수 필드가 누락되었습니다." };
    return NextResponse.json(body, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("itineraries")
    .insert({
      user_id: user.id,
      title,
      destination,
      days,
      start_date: startDate ?? null,
      end_date: endDate ?? null,
      content,
    })
    .select()
    .single();

  if (error) {
    const body: ApiResponse = { success: false, error: "일정 저장 중 오류가 발생했습니다." };
    return NextResponse.json(body, { status: 500 });
  }

  const body: ApiResponse<Itinerary> = { success: true, data: data as Itinerary };
  return NextResponse.json(body, { status: 201 });
}
