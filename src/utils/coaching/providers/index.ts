import { LLMProvider, CoachProviderId } from '../types';
import { geminiProvider } from './geminiProvider';
import { openaiProvider } from './openaiProvider';
import { ollamaProvider } from './ollamaProvider';
import { lmStudioProvider } from './lmStudioProvider';

export const PROVIDERS_MAP: Record<string, LLMProvider> = {
  gemini: geminiProvider,
  openai: openaiProvider,
  ollama: ollamaProvider,
  lmstudio: lmStudioProvider,
};

export function getProvider(id: CoachProviderId): LLMProvider | undefined {
  return PROVIDERS_MAP[id];
}

export function getAllProviders(): LLMProvider[] {
  return [geminiProvider, openaiProvider, ollamaProvider, lmStudioProvider];
}
