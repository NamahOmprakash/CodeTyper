import React, { useRef, useState } from 'react';
import {
  Upload,
  Plus,
  Play,
  Trash2,
  FileCode2,
  Terminal,
  Clock,
  Star,
  CheckCircle2,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { CustomSnippet, Language, Lesson } from '../types';
import { useCustomCode } from '../hooks/useCustomCode';
import { executeCode } from '../utils/codeRunner';

interface CustomCodeViewProps {
  customCodeHook: ReturnType<typeof useCustomCode>;
  onSelectSnippetForTyping: (lesson: Lesson) => void;
  onBackToCurriculum: () => void;
}

export const CustomCodeView: React.FC<CustomCodeViewProps> = ({
  customCodeHook,
  onSelectSnippetForTyping,
  onBackToCurriculum,
}) => {
  const { snippets, addSnippet, deleteSnippet, uploadFile, convertSnippetToLesson } = customCodeHook;

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLanguage, setNewLanguage] = useState<Language>('python');
  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Code runner state for previewing snippets
  const [executingSnippetId, setExecutingSnippetId] = useState<string | null>(null);
  const [executionOutput, setExecutionOutput] = useState<{ id: string; output: string; error?: string; time: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleCreateSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const created = addSnippet(newTitle || 'Untitled Snippet', newLanguage, newCode, newDesc);
    setIsCreating(false);
    setNewTitle('');
    setNewCode('');
    setNewDesc('');
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      try {
        await uploadFile(files[i]);
      } catch (err) {
        console.error('File upload failed:', err);
      }
    }
  };

  const handleRunSnippet = async (snippet: CustomSnippet) => {
    setExecutingSnippetId(snippet.id);
    setExecutionOutput(null);
    try {
      const res = await executeCode(snippet.code, snippet.language);
      setExecutionOutput({
        id: snippet.id,
        output: res.output,
        error: res.error,
        time: res.executionTimeMs,
      });
    } finally {
      setExecutingSnippetId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onBackToCurriculum}
            className="inline-flex items-center gap-2 text-xs font-semibold text-theme-text-muted hover:text-theme-text mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Curriculum
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-theme-text flex items-center gap-2.5">
            <FileCode2 className="w-7 h-7 text-theme-primary" />
            Custom Code & Uploads
          </h1>
          <p className="text-xs sm:text-sm text-theme-text-muted mt-1">
            Upload files or paste code snippets. Saved in your browser's local storage for every visit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            multiple
            accept=".py,.cpp,.cc,.c,.h,.hpp,.txt,.js,.ts"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-theme-surface border border-theme-border hover:bg-theme-surface-hover text-theme-text font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4 text-theme-primary" />
            Upload File
          </button>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 rounded-xl bg-theme-primary hover:bg-theme-primary-hover text-black font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-theme-primary/10"
          >
            <Plus className="w-4 h-4" />
            New Snippet
          </button>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileUpload(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 mb-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-theme-primary bg-theme-primary/5'
            : 'border-theme-border/80 bg-theme-surface/40 hover:bg-theme-surface/70 hover:border-theme-border'
        }`}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-theme-primary/70" />
        <p className="text-sm font-semibold text-theme-text">
          Drag & drop your code files here, or <span className="text-theme-primary underline">browse</span>
        </p>
        <p className="text-xs text-theme-text-muted mt-1">
          Supports .py, .cpp, .c, .h, .txt (automatically parsed and saved to local storage)
        </p>
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <form
          onSubmit={handleCreateSnippet}
          className="bg-theme-surface border border-theme-border rounded-2xl p-6 mb-8 shadow-md"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-theme-text">Create New Custom Snippet</h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-theme-text-muted hover:text-theme-text"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-theme-text-muted mb-1">
                Snippet Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. QuickSort Algorithm or Linked List Node"
                className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-sm text-theme-text focus:outline-none focus:border-theme-primary font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-theme-text-muted mb-1">
                Language
              </label>
              <select
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value as Language)}
                className="w-full bg-theme-bg border border-theme-border rounded-lg px-3 py-2 text-sm text-theme-text focus:outline-none focus:border-theme-primary font-medium"
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-theme-text-muted mb-1">
              Code Content (Type or Paste)
            </label>
            <textarea
              rows={8}
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="Paste or write your code here..."
              className="w-full bg-theme-bg border border-theme-border rounded-lg p-3 text-sm font-mono text-theme-text focus:outline-none focus:border-theme-primary leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-lg border border-theme-border text-xs font-semibold text-theme-text-muted hover:text-theme-text"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-theme-primary hover:bg-theme-primary-hover text-black font-bold text-xs shadow-sm"
            >
              Save to Local Storage
            </button>
          </div>
        </form>
      )}

      {/* Snippets List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-theme-text-muted px-1">
          <span>Saved Snippets ({snippets.length})</span>
          <span>Access Anytime via Local Storage</span>
        </div>

        {snippets.length === 0 ? (
          <div className="bg-theme-surface/50 border border-theme-border rounded-2xl p-12 text-center text-theme-text-muted">
            <FileCode2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-theme-text">No custom snippets yet</p>
            <p className="text-xs mt-1">Upload a file or create your first snippet to practice typing it.</p>
          </div>
        ) : (
          snippets.map((snippet) => {
            const isRunning = executingSnippetId === snippet.id;
            const outputInfo = executionOutput?.id === snippet.id ? executionOutput : null;

            return (
              <div
                key={snippet.id}
                className="bg-theme-surface border border-theme-border rounded-2xl p-5 shadow-sm hover:border-theme-border/90 transition-all flex flex-col gap-4"
              >
                {/* Snippet Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-center font-mono font-bold text-xs shrink-0 text-theme-primary">
                      {snippet.language === 'python' ? 'PY' : 'C++'}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-theme-text">{snippet.title}</h3>
                      <p className="text-xs text-theme-text-muted mt-0.5">
                        {snippet.description || 'Custom code snippet'} • Added{' '}
                        {new Date(snippet.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Run Code & Practice Typing */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Run Code Button */}
                    <button
                      onClick={() => handleRunSnippet(snippet)}
                      disabled={isRunning}
                      className="px-3 py-1.5 rounded-lg bg-theme-bg border border-theme-border hover:bg-theme-surface-hover text-theme-terminal font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Run code in simulated terminal"
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                    </button>

                    {/* Practice Typing Button */}
                    <button
                      onClick={() => onSelectSnippetForTyping(convertSnippetToLesson(snippet))}
                      className="px-4 py-1.5 rounded-lg bg-theme-primary hover:bg-theme-primary-hover text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      title="Practice touch typing this code"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>Type Code</span>
                    </button>

                    {/* Delete Snippet */}
                    <button
                      onClick={() => deleteSnippet(snippet.id)}
                      className="p-1.5 rounded-lg hover:bg-theme-bg text-theme-text-muted hover:text-theme-incorrect transition-colors"
                      title="Delete snippet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Code Preview */}
                <div className="bg-theme-bg rounded-xl p-3.5 border border-theme-border/80 font-mono text-xs text-theme-text overflow-x-auto max-h-48 leading-relaxed select-none">
                  <pre>{snippet.code}</pre>
                </div>

                {/* Execution Output (if executed) */}
                {outputInfo && (
                  <div className="bg-black/90 rounded-xl p-3.5 border border-emerald-500/30 text-xs font-mono text-emerald-400 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-zinc-400 pb-2 mb-2 border-b border-white/10 text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        Execution Output
                      </span>
                      <span>{outputInfo.time}ms</span>
                    </div>
                    {outputInfo.error ? (
                      <pre className="text-red-400 whitespace-pre-wrap">{outputInfo.error}</pre>
                    ) : (
                      <pre className="whitespace-pre-wrap">{outputInfo.output}</pre>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
