import { NextResponse } from "next/server";

export async function GET() {
  const prompt = "Write a motivational tweet under 280 characters about learning to code.";
  
  const res = await fetch(`${process.env.CHATANYWHERE_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.CHATANYWHERE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  return NextResponse.json(data);
}
