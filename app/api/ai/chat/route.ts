import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";
import { requireAuth } from "@/app/lib/auth";
import { openai } from "@/app/lib/openai";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  const { user } = auth;

  const { sessionId, message } = await req.json();

  if (!sessionId || !message) {
    return NextResponse.json({ success: false, error: "sessionId와 message는 필수입니다." }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: session } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!session) {
    return NextResponse.json({ success: false, error: "세션을 찾을 수 없습니다." }, { status: 404 });
  }

  await supabase.from("chat_messages").insert({ session_id: sessionId, role: "user", content: message });

  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(20);

  const messages = (history ?? []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    messages: [
      {
        role: "system",
        content:
          "당신은 여행 전문 AI 어시스턴트입니다. 여행 계획, 현지 정보, 맛집, 숙소, 이동 방법 등을 한국어로 친절하고 구체적으로 안내합니다.",
      },
      ...messages,
    ],
  });

  const encoder = new TextEncoder();
  let accumulated = "";

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) {
          accumulated += delta;
          controller.enqueue(encoder.encode(delta));
        }
      }
      controller.close();
      if (accumulated) {
        await supabase
          .from("chat_messages")
          .insert({ session_id: sessionId, role: "assistant", content: accumulated });
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
