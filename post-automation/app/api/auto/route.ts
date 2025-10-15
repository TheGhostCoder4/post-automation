export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function GET() {
  try {
    const prompt = `
You are a funny Indian developer tweeting about tech, tools, news, motivation, and memes.
Each output must be exactly ONE short, viral-style tweet (<= 280 characters) that uses casual Indian humour and developer sarcasm.
Include 3–5 relevant and trending hashtags.
DO NOT post only about bugs — rotate content type between: (1) Tech news/opinion, (2) Tool or productivity tip, (3) Career/motivation, (4) Quick how-to or snippet, (5) Meme/dev joke.
Begin by picking one content type at random and write the tweet to fit that type.
Tone examples (pick whichever fits the chosen type):
- Tech news/opinion: "Short take + one-liner reaction + callout hashtag"
- Tool tip: "One useful tip or shortcut + benefit + small joke"
- Motivation: "Short encouragement + relatable dev pain + call-to-action"
- How-to/snippet: "One-line tip or command + why it helps"
- Meme/dev joke: "Punchline + self-deprecating dev humour"

Constraints:
- Keep it concise and punchy.
- Use casual Indian expressions when natural (eg. 'yaar', 'bhai', 'arre').
- Avoid controversial or political topics.
- Do not repeat exact same theme twice in a row (the caller should ensure randomness across calls).

Examples (one per type):
- Tech news/opinion: "Meta's new release looks promising, but can it fix my npm install speed? Asking for a 10-year-old repo. #WebDev #TechNews #OpenSource"
- Tool tip: "Pro tip: use Ctrl+Shift+L to multi-cursor the whole line — saves you from 3 useless tabs and emotional breakdown. #VSCODE #Productivity #DevTips"
- Motivation: "If your code didn't work today, it taught you five ways NOT to do it. Tomorrow you're richer in experience, yaar. #GrowthMindset #CodingLife #Motivation"
- How-to/snippet: "One-liner: `git reset --soft HEAD~1` — undo last commit but keep changes staged. Save your weekend. #Git #DevOps #ProTip"
- Meme/dev joke: "My code runs perfectly at 3am — then I run it in front of the client and it becomes a horcrux. #DeveloperProblems #TechHumor #IndianDev"
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

