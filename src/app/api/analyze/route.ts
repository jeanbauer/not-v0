import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { formatter } from "./formatter";

const systemPrompt = fs.readFileSync(
  path.join(process.cwd(), "public", "systemPrompt.md"),
  "utf-8"
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, content } = body;

    let messages: OpenAI.Chat.ChatCompletionMessageParam[];
    if (type === "image") {
      messages = [
        {
          role: "system" as const,
          content: `Based on the image uploaded, transform based on the following instructions: ${systemPrompt}`,
        },
        {
          role: "user" as const,
          content: [
            {
              type: "image_url",
              image_url: {
                url: content,
                detail: "high",
              },
            },
          ],
        },
      ];
    } else {
      messages = [
        {
          role: "system" as const,
          content: systemPrompt,
        },
        {
          role: "user" as const,
          content: content,
        },
      ];
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 2500,
    });

    const code = formatter(response.choices[0].message.content || "");
    return NextResponse.json({ result: code });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
