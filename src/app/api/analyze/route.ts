import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { formatter } from "./formatter";

const isDev = process.env.NODE_ENV === "development";

const getSystemPrompt = () => {
  const content = fs.readFileSync(
    path.join(process.cwd(), "public", "systemPrompt.md"),
    "utf-8"
  );

  // Extract version from the first line if it exists
  const versionMatch = content.match(/^<!-- version: (.*?) -->/);
  const version = versionMatch ? versionMatch[1] : "unknown";

  console.log(`[System Prompt] Version: ${version} 🔄`);

  // Return the content without the version comment
  return content.replace(/^<!-- version: .*? -->\n?/, "");
};

// Load system prompt once in production
const systemPrompt = getSystemPrompt();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Load system prompt on every request in development
    const currentSystemPrompt = isDev ? getSystemPrompt() : systemPrompt;

    const body = await request.json();
    const { type, content, previousCode } = body;

    let messages: OpenAI.Chat.ChatCompletionMessageParam[];
    if (type === "image") {
      messages = [
        {
          role: "system" as const,
          content: currentSystemPrompt,
        },
        {
          role: "user" as const,
          content: [
            {
              type: "text",
              text: "Generate a functional React component from this image using Tailwind CSS. Output only valid JSX.",
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
      const contextMessage = previousCode
        ? {
            role: "assistant" as const,
            content: previousCode,
          }
        : null;

      messages = [
        {
          role: "system" as const,
          content: currentSystemPrompt,
        },
        ...(contextMessage ? [contextMessage] : []),
        {
          role: "user" as const,
          content: `Please update the previous component with the following change:\n\n${content}`,
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
