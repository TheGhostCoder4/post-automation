import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Write a short, inspiring Instagram caption about learning to code.
    Make it sound personal, real, and motivational.
    Use line breaks and 3–4 hashtags.
    No emojis.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({
      success: true,
      model: "gemini-1.5-flash",
      caption: text.trim(),
    });
  } catch (err: any) {
    console.error("❌ Gemini Error:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}
