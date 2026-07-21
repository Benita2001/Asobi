import "server-only";

import OpenAI from "openai";

let client: OpenAI | undefined;

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  client ??= new OpenAI({ apiKey, timeout: 20_000, maxRetries: 0 });
  return client;
}

export function getOpenAIModel(): string {
  const model = process.env.OPENAI_MODEL;
  if (!model) throw new Error("OPENAI_MODEL is not configured.");
  return model;
}
