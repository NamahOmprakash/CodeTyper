import { COACH_SYSTEM_PROMPT, buildCoachingPrompt } from '../coachPrompts';
import { CoachingContext, LLMProvider, ProviderConfig } from '../types';

export const openaiProvider: LLMProvider = {
  id: 'openai',
  name: 'OpenAI',
  type: 'cloud',
  requiresApiKey: true,
  defaultModel: 'gpt-4o-mini',
  availableModels: ['gpt-4o-mini', 'gpt-4o'],

  isAvailable: async (config: ProviderConfig) => {
    if (!config.apiKey?.trim()) {
      return { ok: false, message: 'OpenAI API key is required' };
    }
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${config.apiKey.trim()}` },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return { ok: false, message: errorData.error?.message || `HTTP ${res.status}` };
      }
      return { ok: true, message: 'Connected to OpenAI' };
    } catch (err: any) {
      return { ok: false, message: err?.message || 'Network error reaching OpenAI' };
    }
  },

  generateCoaching: async (context: CoachingContext, config: ProviderConfig): Promise<string> => {
    const key = config.apiKey?.trim();
    if (!key) throw new Error('Missing OpenAI API key');

    const model = config.model || 'gpt-4o-mini';
    const userPrompt = buildCoachingPrompt(context);

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: COACH_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 120,
        temperature: config.temperature ?? 0.6,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `OpenAI request failed: ${res.status}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('No content returned from OpenAI');

    return content.trim().replace(/^["']|["']$/g, '');
  },
};
