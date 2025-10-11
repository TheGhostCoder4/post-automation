export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function GET() {
  try {
    const prompt = `
        You are a funny Indian developer tweeting about tech & memes.
        Write one short viral-style tweet under 280 characters including 3–5 relevant and trending hashtags.
        Use casual Indian humor and developer sarcasm.

        Examples:
        - My laptop makes more noise than my washing machine when I open VS Code. #DeveloperProblems #VSCode #TechHumor
        - AI says it won’t replace humans. Bro, you already replaced my confidence. #AI #CodingLife #Relatable
        - Monday morning standups are just "why are we alive" sessions. #WorkFromHome #TechMemes #IndianDev
        `;

    
    const aiRes = await fetch(`${process.env.CHATANYWHERE_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CHATANYWHERE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const aiData = await aiRes.json();
    const tweetText = aiData?.choices?.[0]?.message?.content?.trim();

    if (!tweetText) throw new Error("AI didn't return tweet text");

    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_CONSUMER_KEY!,
      appSecret: process.env.TWITTER_CONSUMER_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    const tweet = await twitterClient.v2.tweet({ text: tweetText });

    return NextResponse.json({
      success: true,
      message: "✅ Text-only tweet posted successfully!",
      tweetText,
      tweet,
    });
  } catch (err: any) {
    console.error("❌ Tweet failed:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
