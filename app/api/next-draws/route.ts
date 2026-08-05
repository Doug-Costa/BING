import { NextResponse } from "next/server";
import { mockDraws } from "@/lib/mock";

export const revalidate = 30;

export async function GET() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  const roomId = process.env.NEXT_PUBLIC_ROOM_ID || "room-001";
  const mocksEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true";
  if (!base) {
    return mocksEnabled
      ? NextResponse.json(mockDraws())
      : NextResponse.json({ message: "NEXT_PUBLIC_API_URL não configurada." }, { status: 503 });
  }
  try {
    const response = await fetch(`${base}/bingo/tvapp/next-draws`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roomId }),
      next: { revalidate: 30, tags: [`next-draws-${roomId}`] }
    });
    if (!response.ok) throw new Error("upstream");
    const draws = await response.json();
    return NextResponse.json(draws.filter((draw: { scheduledAt: string }) => new Date(draw.scheduledAt).getTime() > Date.now()));
  } catch {
    return mocksEnabled
      ? NextResponse.json(mockDraws())
      : NextResponse.json({ message: "Não foi possível consultar os próximos sorteios." }, { status: 502 });
  }
}
