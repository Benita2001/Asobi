import "server-only";

import OpenAI from "openai";

let client: OpenAI | undefined;

export function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  client ??= new OpenAI({ apiKey, timeout: 60_000, maxRetries: 0 });
  return client;
}

export function getOpenAIModel(): string {
  const model = process.env.OPENAI_MODEL;
  if (!model) throw new Error("OPENAI_MODEL is not configured.");
  return model;
}

export function getOpenAITTSConfig(): { model: string; voice: string } {
  const model = process.env.OPENAI_TTS_MODEL;
  const voice = process.env.OPENAI_TTS_VOICE;
  if (!model || !voice) throw new Error("OPENAI_TTS_NOT_CONFIGURED");
  return { model, voice };
}

export function getOpenAIImageConfig(): { model: string } {
  const model = process.env.OPENAI_IMAGE_MODEL;
  if (!model) throw new Error("OPENAI_IMAGE_NOT_CONFIGURED");
  return { model };
}
