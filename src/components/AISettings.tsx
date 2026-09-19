import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Bot,
  Sparkles,
  Cpu,
  Brain,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Key,
  Globe,
  Volume2,
  ShieldAlert,
  Square,
  RefreshCw,
} from 'lucide-react';
import { CoachProviderId, ProviderConfig } from '../utils/coaching/types';
import { getProvider } from '../utils/coaching/providers';

interface AISettingsProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProviderConfig;
  onSaveConfig: (cfg: ProviderConfig) => void;
  coachEnabled: boolean;
  onToggleCoach: (enabled: boolean) => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: (auto: boolean) => void;
  voices?: SpeechSynthesisVoice[];
  coachVoiceURI?: string;
  onSetCoachVoiceURI?: (uri: string) => void;
  coachRate?: number;
  onSetCoachRate?: (rate: number) => void;
  onPreviewCoachVoice?: (sampleText: string, voiceURI: string, rate: number) => void;
  isSpeakingPreview?: boolean;
  onStopPreview?: () => void;
  onRefreshVoices?: () => void;
}

interface ProviderOption {
  id: CoachProviderId;
  name: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
}

interface ProviderSettings {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export const AISettings: React.FC<AISettingsProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  coachEnabled,
  onToggleCoach,
  autoSpeak,
  onToggleAutoSpeak,
  voices = [],
  coachVoiceURI = '',
  onSetCoachVoiceURI,
  coachRate = 1.0,
  onSetCoachRate,
  onPreviewCoachVoice,
  isSpeakingPreview = false,
  onStopPreview,
  onRefreshVoices,
}) => {
  const initialProvider = (
    config.providerId === 'local' || config.providerId === 'nano'
      ? 'lmstudio'
      : config.providerId
  ) as CoachProviderId;
  const [selectedProvider, setSelectedProvider] = useState<CoachProviderId>(initialProvider);
  const [showKey, setShowKey] = useState(false);

  // Maintain isolated, non-polluting settings per provider
  const [providerSettings, setProviderSettings] = useState<Record<string, ProviderSettings>>(() => {
    const map: Record<string, ProviderSettings> = {
      lmstudio: { apiKey: '', baseUrl: 'http://localhost:1234/v1', model: 'local-model' },
      ollama: { apiKey: '', baseUrl: 'http://localhost:11434', model: 'llama3.2' },
      gemini: { apiKey: '', baseUrl: '', model: 'gemini-2.0-flash' },
      openai: { apiKey: '', baseUrl: '', model: 'gpt-4o-mini' },
    };

    if (typeof window !== 'undefined') {
      try {
        const saved =
          localStorage.getItem('keyscript-all-provider-settings') ||
          localStorage.getItem('codetyper-all-provider-settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          Object.keys(parsed).forEach((k) => {
            if (map[k]) {
              map[k] = { ...map[k], ...parsed[k] };
            }
          });
        }
      } catch {}
    }

    const currentId = config.providerId === 'local' ? 'lmstudio' : config.providerId;
    if (currentId && map[currentId]) {
      if (config.apiKey !== undefined) map[currentId].apiKey = config.apiKey;
      // If user had an accidental 11434 saved for lmstudio, correct it to default port 1234
      if (currentId === 'lmstudio' && config.baseUrl && config.baseUrl.includes('11434')) {
        map[currentId].baseUrl = 'http://localhost:1234/v1';
      } else if (config.baseUrl !== undefined) {
        map[currentId].baseUrl = config.baseUrl;
      }
      if (config.model !== undefined) map[currentId].model = config.model;
    }

    return map;
  });

  const [tempVoiceURI, setTempVoiceURI] = useState<string>(coachVoiceURI || '');
  const [tempRate, setTempRate] = useState<number>(coachRate ?? 1.0);

  useEffect(() => {
    if (isOpen) {
      setTempVoiceURI(coachVoiceURI || '');
      setTempRate(coachRate ?? 1.0);
    }
  }, [isOpen, coachVoiceURI, coachRate]);

  const sortedVoices = useMemo(() => {
    if (!voices || voices.length === 0) return [];
    const enVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('en'));
    const otherVoices = voices.filter((v) => !v.lang.toLowerCase().startsWith('en'));

    enVoices.sort((a, b) => {
      if (a.default && !b.default) return -1;
      if (!a.default && b.default) return 1;
      return a.name.localeCompare(b.name);
    });

    otherVoices.sort((a, b) => a.name.localeCompare(b.name));

    return [...enVoices, ...otherVoices];
  }, [voices]);

  const [testStatus, setTestStatus] = useState<{
    loading: boolean;
    success?: boolean;
    message?: string;
  } | null>(null);

  if (!isOpen) return null;

  // Dedicated AI providers only (LM Studio, Ollama, Google Gemini, OpenAI)
  const providerOptions: ProviderOption[] = [
    {
      id: 'lmstudio',
      name: 'LM Studio (Local)',
      subtitle: 'Connect to LM Studio local server on default port 1234 (http://localhost:1234/v1)',
      badge: 'Local AI • Port 1234',
      icon: <Brain className="w-4 h-4 text-pink-400" />,
    },
    {
      id: 'ollama',
      name: 'Ollama (Local)',
      subtitle: 'Connect to your local Ollama server running Llama 3, Mistral, Qwen (port 11434)',
      badge: 'Local AI • Free',
      icon: <Brain className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'gemini',
      name: 'Google Gemini API',
      subtitle: 'Gemini 2.0 Flash / 2.5 Flash for deep contextual code & typing review',
      badge: 'Cloud AI',
      icon: <Sparkles className="w-4 h-4 text-blue-400" />,
    },
    {
      id: 'openai',
      name: 'OpenAI API',
      subtitle: 'GPT-4o Mini / GPT-4o for smart tutoring feedback',
      badge: 'Cloud AI',
      icon: <Cpu className="w-4 h-4 text-emerald-400" />,
    },
  ];

  const currentProviderDef = getProvider(selectedProvider);
  const currentSettings = providerSettings[selectedProvider] || {
    apiKey: '',
    baseUrl: currentProviderDef?.defaultBaseUrl || '',
    model: currentProviderDef?.defaultModel || '',
  };

  const updateCurrentSettings = (patch: Partial<ProviderSettings>) => {
    setProviderSettings((prev) => {
      const updated = {
        ...prev,
        [selectedProvider]: {
          ...(prev[selectedProvider] || { apiKey: '', baseUrl: '', model: '' }),
          ...patch,
        },
      };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('keyscript-all-provider-settings', JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  };

  const handleSelectProvider = (id: CoachProviderId) => {
    setSelectedProvider(id);
    setTestStatus(null);
  };

  const handleTestConnection = async () => {
    setTestStatus({ loading: true });

    const prov = getProvider(selectedProvider);
    if (!prov) {
      setTestStatus({ loading: false, success: false, message: 'Unknown provider' });
      return;
    }

    const testCfg: ProviderConfig = {
      providerId: selectedProvider,
      apiKey: currentSettings.apiKey.trim(),
      baseUrl: currentSettings.baseUrl.trim() || prov.defaultBaseUrl,
      model: currentSettings.model.trim() || prov.defaultModel,
      enabled: true,
    };

    const res = await prov.isAvailable(testCfg);
    setTestStatus({
      loading: false,
      success: res.ok,
      message: res.message,
    });
  };

  const handleClose = () => {
    if (onStopPreview) onStopPreview();
    onClose();
  };

  const handleSave = () => {
    const def = getProvider(selectedProvider);
    const updated: ProviderConfig = {
      providerId: selectedProvider,
      apiKey: currentSettings.apiKey.trim(),
      baseUrl: currentSettings.baseUrl.trim() || def?.defaultBaseUrl,
      model: currentSettings.model.trim() || def?.defaultModel,
      enabled: coachEnabled,
    };
    onSaveConfig(updated);
    if (onSetCoachVoiceURI) onSetCoachVoiceURI(tempVoiceURI);
    if (onSetCoachRate) onSetCoachRate(tempRate);
    if (onStopPreview) onStopPreview();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-theme-surface border border-theme-border rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-theme-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-theme-primary/15 border border-theme-primary/30 flex items-center justify-center text-theme-primary">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-theme-text">AI Coach Settings</h2>
              <p className="text-xs text-theme-text-muted">
                Configure real-time typing review engine & LLM provider
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-theme-bg text-theme-text-muted hover:text-theme-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Master Enable Toggle */}
          <div className="bg-theme-bg p-3.5 rounded-xl border border-theme-border flex items-center justify-between">
            <div>
              <span className="font-semibold text-theme-text text-sm block">Enable AI Coach</span>
              <span className="text-theme-text-muted text-[11px]">
                Observes typos in real time and provides physical finger placement coaching
              </span>
            </div>
            <input
              type="checkbox"
              checked={coachEnabled}
              onChange={(e) => onToggleCoach(e.target.checked)}
              className="w-4 h-4 accent-theme-primary rounded cursor-pointer"
            />
          </div>

          {/* AI Coach Voice & Speech Speed Controls */}
          <div className="bg-theme-bg p-3.5 rounded-xl border border-theme-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-theme-primary" />
                <div>
                  <span className="font-semibold text-theme-text text-xs block">
                    AI Coach Voice & Speech Speed
                  </span>
                  <span className="text-theme-text-muted text-[11px]">
                    Customize coach narration voice and rate (0.25x to 4.0x)
                  </span>
                </div>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <span className="text-[11px] text-theme-text-muted">Auto-speak</span>
                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={(e) => onToggleAutoSpeak(e.target.checked)}
                  className="w-4 h-4 accent-theme-primary rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Voice Dropdown and Speed Controls */}
            <div className="pt-2 border-t border-theme-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Voice Dropdown */}
              <div className="flex flex-col gap-1 min-w-0">
                <div className="text-[10px] uppercase font-mono text-theme-text-muted tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span>Coach Voice</span>
                    {onRefreshVoices && (
                      <button
                        type="button"
                        onClick={onRefreshVoices}
                        className="text-theme-text-muted hover:text-theme-primary transition-colors p-0.5"
                        title="Re-scan system voices"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                  <span className="text-[9px] text-theme-primary truncate max-w-[80px]">
                    {sortedVoices.find((v) => v.voiceURI === tempVoiceURI)?.lang || ''}
                  </span>
                </div>
                <select
                  value={tempVoiceURI}
                  onChange={(e) => setTempVoiceURI(e.target.value)}
                  className="w-full bg-theme-surface border border-theme-border text-theme-text text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-theme-primary transition-colors cursor-pointer truncate"
                  title="Select AI Coach voice"
                >
                  <option value="">System Default Voice</option>
                  {sortedVoices.map((voice) => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                      {voice.name} {voice.default ? '★ (Default)' : ''} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Speed Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-theme-text-muted uppercase tracking-wider">
                  <span>Speech Speed</span>
                  <button
                    type="button"
                    onClick={() => setTempRate(1.0)}
                    className="text-theme-primary hover:underline font-semibold"
                    title="Reset speed to 1.00x"
                  >
                    {tempRate.toFixed(2)}x (reset)
                  </button>
                </div>
                <div className="flex items-center gap-2 h-[30px]">
                  <input
                    type="range"
                    min="0.25"
                    max="4.00"
                    step="0.05"
                    value={tempRate}
                    onChange={(e) => setTempRate(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-theme-surface rounded-lg appearance-none cursor-pointer accent-theme-primary"
                    title={`AI Coach speech speed: ${tempRate.toFixed(2)}x`}
                  />
                  <span className="text-[11px] font-mono text-theme-text w-9 text-right font-medium">
                    {tempRate.toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>

            {/* Test Voice Preview Bar */}
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-theme-text-muted italic text-[10px]">
                Range: 0.25x (slow) to 4.00x (super fast)
              </span>

              {onPreviewCoachVoice && (
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeakingPreview && onStopPreview) {
                      onStopPreview();
                    } else {
                      onPreviewCoachVoice(
                        'Keep your fingers relaxed and anchored on the home row.',
                        tempVoiceURI,
                        tempRate
                      );
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors shadow-sm ${
                    isSpeakingPreview
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'bg-theme-surface border-theme-border text-theme-text hover:border-theme-primary/60'
                  }`}
                  title="Preview how the AI Coach sounds with this voice and speed"
                >
                  {isSpeakingPreview ? (
                    <>
                      <Square className="w-3 h-3 text-amber-400" />
                      <span>Stop Preview</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3 h-3 text-theme-primary" />
                      <span>Preview Coach Voice</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Provider Selection */}
          <div>
            <label className="font-semibold text-theme-text uppercase tracking-wider text-[10px] font-mono mb-2 block">
              Select Coaching Intelligence
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {providerOptions.map((opt) => {
                const isSelected = selectedProvider === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectProvider(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-theme-primary/10 border-theme-primary ring-1 ring-theme-primary/30 shadow-sm'
                        : 'bg-theme-bg/60 border-theme-border hover:border-theme-border/80'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2 font-semibold text-theme-text">
                        {opt.icon}
                        <span>{opt.name}</span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/30 border border-white/5 text-theme-text-muted">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-theme-text-muted leading-snug">
                      {opt.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Provider Credentials / Configuration Fields */}
          {(selectedProvider === 'gemini' || selectedProvider === 'openai') && (
            <div className="bg-theme-bg p-3.5 rounded-xl border border-theme-border space-y-3">
              <div className="flex items-center gap-1.5 text-amber-400 text-[11px]">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>
                  API key is saved in your browser's localStorage for this session only.
                </span>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-theme-text-muted block mb-1">
                  API Key
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={currentSettings.apiKey}
                      onChange={(e) => updateCurrentSettings({ apiKey: e.target.value })}
                      placeholder={selectedProvider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                      className="w-full bg-theme-surface border border-theme-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-primary font-mono"
                    />
                    <Key className="w-3.5 h-3.5 text-theme-text-muted absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="px-2.5 py-1.5 rounded-lg bg-theme-surface border border-theme-border text-[11px] text-theme-text-muted hover:text-theme-text"
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {currentProviderDef && (
                <div>
                  <label className="text-[10px] uppercase font-mono text-theme-text-muted block mb-1">
                    Model
                  </label>
                  <select
                    value={currentSettings.model || currentProviderDef.defaultModel}
                    onChange={(e) => updateCurrentSettings({ model: e.target.value })}
                    className="w-full bg-theme-surface border border-theme-border rounded-lg px-2.5 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-primary font-mono"
                  >
                    {currentProviderDef.availableModels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Local Provider Base URL & Models (LM Studio / Ollama) */}
          {(selectedProvider === 'ollama' || selectedProvider === 'lmstudio') && (
            <div className="bg-theme-bg p-3.5 rounded-xl border border-theme-border space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase font-mono text-theme-text-muted">
                    Server Endpoint Base URL
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      updateCurrentSettings({
                        baseUrl:
                          selectedProvider === 'lmstudio'
                            ? 'http://localhost:1234/v1'
                            : 'http://localhost:11434',
                      })
                    }
                    className="text-[10px] text-theme-primary hover:underline font-mono"
                    title="Click to reset URL to default port"
                  >
                    Default ({selectedProvider === 'lmstudio' ? 'Port 1234' : 'Port 11434'})
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={currentSettings.baseUrl}
                    onChange={(e) => updateCurrentSettings({ baseUrl: e.target.value })}
                    placeholder={
                      selectedProvider === 'lmstudio'
                        ? 'http://localhost:1234/v1'
                        : 'http://localhost:11434'
                    }
                    className="w-full bg-theme-surface border border-theme-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-primary font-mono"
                  />
                  <Globe className="w-3.5 h-3.5 text-theme-text-muted absolute left-2.5 top-2.5" />
                </div>
                <p className="text-[10px] text-theme-text-muted mt-1">
                  {selectedProvider === 'lmstudio'
                    ? 'Default server port is 1234. In LM Studio, click the Local Server icon (<->) on the left sidebar and click "Start Server".'
                    : 'Default port is 11434. Make sure Ollama is running (`ollama serve`).'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase font-mono text-theme-text-muted">
                    Model Name
                  </label>
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => updateCurrentSettings({ model: '' })}
                      className="text-theme-text-muted hover:text-theme-text"
                      title="Clear model input to use active model"
                    >
                      Clear
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCurrentSettings({
                          model: selectedProvider === 'lmstudio' ? 'local-model' : 'llama3.2',
                        })
                      }
                      className="text-theme-primary hover:underline"
                      title="Set to default model identifier"
                    >
                      Default ({selectedProvider === 'lmstudio' ? 'local-model' : 'llama3.2'})
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={currentSettings.model}
                  onChange={(e) => updateCurrentSettings({ model: e.target.value })}
                  placeholder={
                    selectedProvider === 'lmstudio'
                      ? 'local-model (or empty to use loaded model)'
                      : 'llama3.2'
                  }
                  className="w-full bg-theme-surface border border-theme-border rounded-lg px-2.5 py-1.5 text-xs text-theme-text focus:outline-none focus:border-theme-primary font-mono"
                />
                <p className="text-[10px] text-theme-text-muted mt-1">
                  {selectedProvider === 'lmstudio'
                    ? 'In LM Studio, any model you have loaded in the Local Server tab will be used automatically.'
                    : 'Enter any model installed in your Ollama library.'}
                </p>
              </div>
            </div>
          )}
          {/* Test Status Banner */}
          {testStatus && (
            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                testStatus.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}
            >
              {testStatus.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              )}
              <span className="leading-snug">{testStatus.message}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-theme-border bg-theme-bg/60">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus?.loading}
            className="px-3 py-1.5 rounded-lg bg-theme-surface border border-theme-border text-theme-text hover:border-theme-primary text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {testStatus?.loading && <Loader2 className="w-3 h-3 animate-spin" />}
            <span>Test Connection</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 rounded-lg text-theme-text-muted hover:text-theme-text text-xs"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-theme-primary text-theme-bg font-bold text-xs hover:opacity-90 transition-opacity shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
