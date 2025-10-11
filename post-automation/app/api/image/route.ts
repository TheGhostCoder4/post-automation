
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const { text } = await req.json();

  const response = await axios.post(
    "https://api.nanobanana.ai/v1/generate-image",
    {
      model: "gemini-image",
      prompt: `Create a storytelling-style illustration for: ${text}`,
    },
    { headers: { Authorization: `Bearer ${process.env.NANOBANANA_API_KEY}` } }
  );

  return NextResponse.json({ image_url: response.data.image_url });
}
