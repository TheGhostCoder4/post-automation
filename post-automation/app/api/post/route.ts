import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const { text, image_url } = await req.json();

  const tweet = await axios.post(
    "https://api.twitter.com/2/tweets",
    { text },
    { headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` } }
  );

  return NextResponse.json({ tweet });
}
