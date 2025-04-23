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
    const { type, content, previousCode } = body;

    let messages: OpenAI.Chat.ChatCompletionMessageParam[];
    if (type === "image") {
      messages = [
        {
          role: "system" as const,
          content: systemPrompt,
        },
        {
          role: "user" as const,
          content: [
            {
              type: "text",
              text: "Analyze this UI layout and return ONLY a valid JSON object following the specified format. Do not include any additional text or formatting.",
            },
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
      // For text messages, include the previous code if it exists
      const contextMessage = previousCode
        ? {
            role: "system" as const,
            content: `Previous component code:\n${previousCode}\n\nUse this as reference for the next component. Only modify what user asks for.`,
          }
        : null;

      messages = [
        {
          role: "system" as const,
          content: systemPrompt,
        },
        ...(contextMessage ? [contextMessage] : []),
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
