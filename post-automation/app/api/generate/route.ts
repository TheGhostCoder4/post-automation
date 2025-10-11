
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST() {
  const prompt = "Write a short storytelling-style post about growth mindset for developers.";

  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    }
  );

  const text = response.data.choices[0].message.content;
  return NextResponse.json({ text });
}
