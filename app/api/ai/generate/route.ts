import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/app/lib/auth";
import { openai } from "@/app/lib/openai";
import type { GenerateRequest } from "@/app/lib/types/travel";

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  const body: GenerateRequest = await req.json();
  const { destination, days, styles, startDate } = body;

  if (!destination || !days) {
    return NextResponse.json({ success: false, error: "목적지와 여행 기간은 필수입니다." }, { status: 400 });
  }

  const styleText = styles?.length ? styles.join(", ") : "자유 여행";
  const dateText = startDate ? `시작일: ${startDate}` : "";

  const stream = await openai.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "당신은 여행 전문 AI입니다. 여행 일정을 JSON 배열 형식으로만 출력하세요. 다른 텍스트나 마크다운 코드 블록은 절대 포함하지 마세요. 오직 JSON 배열만 출력하세요.",
      },
      {
        role: "user",
        content: `다음 조건으로 ${days}일 여행 일정을 생성해주세요.
목적지: ${destination}
여행 스타일: ${styleText}
${dateText}

다음 형식의 JSON 배열로 출력하세요:
[
  {
    "day": 1,
    "date": "YYYY-MM-DD 또는 null",
    "theme": "이 날의 테마",
    "activities": [
      { "time": "09:00", "place": "장소명", "description": "활동 설명", "tips": "선택적 팁" }
    ],
    "meals": { "breakfast": "아침 추천", "lunch": "점심 추천", "dinner": "저녁 추천" },
    "accommodation": "숙소 추천"
  }
]`,
      },
    ],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content ?? "";
        if (delta) controller.enqueue(encoder.encode(delta));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
