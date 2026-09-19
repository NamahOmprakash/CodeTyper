import { COACH_SYSTEM_PROMPT, buildCoachingPrompt } from '../coachPrompts';
import { CoachingContext, LLMProvider, ProviderConfig } from '../types';

function normalizeLMStudioUrl(baseUrl?: string): string {
  const raw = (baseUrl || 'http://localhost:1234/v1').trim().replace(/\/+$/, '');
  if (!raw) return 'http://localhost:1234/v1';
  return raw.endsWith('/v1') ? raw : `${raw}/v1`;
}

async function safeLMStudioFetch(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (err) {
    if (url.includes('localhost')) {
      const ipv4Url = url.replace('localhost', '127.0.0.1');
      return await fetch(ipv4Url, init);
    }
    throw err;
  }
}

export const lmStudioProvider: LLMProvider = {
  id: 'lmstudio',
  name: 'LM Studio (Local)',
  type: 'local',
  requiresApiKey: false,
  defaultBaseUrl: 'http://localhost:1234/v1',
  defaultModel: 'local-model',
  availableModels: ['local-model'],

  isAvailable: async (config: ProviderConfig) => {
    const base = normalizeLMStudioUrl(config.baseUrl);
    try {
      const res = await safeLMStudioFetch(`${base}/models`, { method: 'GET' });
      if (!res.ok) {
        return { ok: false, message: `LM Studio returned HTTP ${res.status}` };
      }
      const data = await res.json();
      const models = (data.data || []).map((m: any) => m.id);
      return {
        ok: true,
        message:
          models.length > 0
            ? `Connected on port 1234! Loaded model: ${models[0]}`
            : 'Connected to LM Studio on port 1234',
      };
    } catch (err: any) {
      return {
        ok: false,
        message:
          'Could not connect to LM Studio at ' +
          base +
          '. Make sure the Local Server is running on port 1234 in LM Studio.',
      };
    }
  },

  generateCoaching: async (context: CoachingContext, config: ProviderConfig): Promise<string> => {
    const base = normalizeLMStudioUrl(config.baseUrl);
    let model = config.model?.trim();

    // If user left model empty or default 'local-model', auto-detect loaded model from LM Studio
    if (!model || model === 'local-model') {
      try {
        const modelRes = await safeLMStudioFetch(`${base}/models`, { method: 'GET' });
        if (modelRes.ok) {
          const modelData = await modelRes.json();
          const firstId = modelData.data?.[0]?.id;
          if (firstId) {
            model = firstId;
          }
        }
      } catch {}
    }

    if (!model) {
      model = 'local-model';
    }

    const userPrompt = buildCoachingPrompt(context);

    const res = await safeLMStudioFetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      throw new Error(err.error?.message || `LM Studio request failed: ${res.status}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('No content returned from LM Studio');

    return content.trim().replace(/^["']|["']$/g, '');
  },
};
