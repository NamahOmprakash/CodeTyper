import { COACH_SYSTEM_PROMPT, buildCoachingPrompt } from '../coachPrompts';
import { CoachingContext, LLMProvider, ProviderConfig } from '../types';

export const geminiProvider: LLMProvider = {
  id: 'gemini',
  name: 'Google Gemini',
  type: 'cloud',
  requiresApiKey: true,
  defaultModel: 'gemini-2.0-flash',
  availableModels: ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-2.5-pro'],

  isAvailable: async (config: ProviderConfig) => {
    if (!config.apiKey?.trim()) {
      return { ok: false, message: 'Gemini API key is required' };
    }
    try {
      const model = config.model || 'gemini-2.0-flash';
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Ping' }] }],
            generationConfig: { maxOutputTokens: 2 },
          }),
        }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return { ok: false, message: errorData.error?.message || `HTTP ${res.status}` };
      }
      return { ok: true, message: 'Connected to Gemini API' };
    } catch (err: any) {
      return { ok: false, message: err?.message || 'Network error reaching Gemini' };
    }
  },

  generateCoaching: async (context: CoachingContext, config: ProviderConfig): Promise<string> => {
    const key = config.apiKey?.trim();
    if (!key) throw new Error('Missing Gemini API key');

    const model = config.model || 'gemini-2.0-flash';
    const userPrompt = buildCoachingPrompt(context);

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: COACH_SYSTEM_PROMPT }],
          },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: config.temperature ?? 0.6,
            maxOutputTokens: 120,
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gemini request failed: ${res.status}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) throw new Error('No coaching response returned');

    return candidate.trim().replace(/^["']|["']$/g, '');
  },
};
