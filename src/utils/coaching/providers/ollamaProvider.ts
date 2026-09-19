import { COACH_SYSTEM_PROMPT, buildCoachingPrompt } from '../coachPrompts';
import { CoachingContext, LLMProvider, ProviderConfig } from '../types';

export const ollamaProvider: LLMProvider = {
  id: 'ollama',
  name: 'Ollama (Local)',
  type: 'local',
  requiresApiKey: false,
  defaultBaseUrl: 'http://localhost:11434',
  defaultModel: 'llama3.2',
  availableModels: ['llama3.2', 'llama3.1', 'mistral', 'codellama', 'qwen2.5-coder', 'gemma2'],

  isAvailable: async (config: ProviderConfig) => {
    const base = (config.baseUrl || 'http://localhost:11434').replace(/\/+$/, '');
    try {
      const res = await fetch(`${base}/api/tags`, { method: 'GET' });
      if (!res.ok) {
        return { ok: false, message: `Ollama returned HTTP ${res.status}` };
      }
      const data = await res.json();
      const models = (data.models || []).map((m: any) => m.name);
      return {
        ok: true,
        message: models.length > 0 ? `Connected! Models: ${models.slice(0, 3).join(', ')}` : 'Connected to Ollama',
      };
    } catch (err: any) {
      return {
        ok: false,
        message: 'Could not connect to Ollama at ' + base + '. Make sure Ollama is running (`ollama serve`).',
      };
    }
  },

  generateCoaching: async (context: CoachingContext, config: ProviderConfig): Promise<string> => {
    const base = (config.baseUrl || 'http://localhost:11434').replace(/\/+$/, '');
    const model = config.model || 'llama3.2';
    const userPrompt = buildCoachingPrompt(context);

    const res = await fetch(`${base}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        system: COACH_SYSTEM_PROMPT,
        prompt: userPrompt,
        stream: false,
        options: {
          temperature: config.temperature ?? 0.6,
          num_predict: 120,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Ollama request failed with HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!data.response) throw new Error('Empty response from Ollama');

    return data.response.trim().replace(/^["']|["']$/g, '');
  },
};
