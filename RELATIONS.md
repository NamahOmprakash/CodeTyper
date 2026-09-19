# Key Script: System Architecture & Component Relations

This document maps all file relationships, data flows, hook lifecycles, and component hierarchies across the **Key Script** codebase.

---

## 1. System Topology Overview

```
                                    +------------------+
                                    |    main.tsx      |
                                    +--------+---------+
                                             |
                                    +--------v---------+
                                    |     App.tsx      |
                                    +--------+---------+
                 +---------------------------+---------------------------+
                 |                           |                           |
        +--------v--------+         +--------v--------+         +--------v--------+
        |   Header.tsx    |         |  LessonList.tsx |         | TypingView.tsx  |
        +-----------------+         +-----------------+         +--------+--------+
                                                                         |
                         +-----------------------------------------------+-----------------------------------+
                         |                               |                               |                   |
                +--------v--------+             +--------v--------+             +--------v--------+ +--------v--------+
                | CodeDisplay.tsx |             |CoachBubble.tsx  |             | KeyboardVis.tsx | |CodeExplainer.tsx|
                +-----------------+             +--------+--------+             +--------+--------+ +-----------------+
                                                         |                               |
                                                +--------v--------+             +--------v--------+
                                                | AISettings.tsx  |             | HandDiagram.tsx |
                                                +-----------------+             +-----------------+
```

---

## 2. Component Hierarchy & Responsibilities

| Component | File Path | Parent | Key Children / Modals | Primary Role |
| :--- | :--- | :--- | :--- | :--- |
| **`App`** | `src/App.tsx` | `main.tsx` | `Header`, `LessonList`, `TypingView`, `ResultsScreen`, `CustomCodeView`, `MobileDashboard` | Root controller, manages active view, language selection, lesson progression, and mobile viewport detection. |
| **`Header`** | `src/components/Header.tsx` | `App.tsx` | None | Top navigation bar with language pills (Python / C++), theme toggle, mute button, and fullscreen trigger. Hidden during Focus Mode. |
| **`LessonList`** | `src/components/LessonList.tsx` | `App.tsx` | None | Curriculum view showing 5 structured Python and 5 C++ lessons with star ratings and WPM badges. |
| **`TypingView`** | `src/components/TypingView.tsx` | `App.tsx` | `CodeDisplay`, `CoachBubble`, `AISettings`, `KeyboardVisualizer`, `CodeExplainer` | Main typing arena, manages window key listeners, HUD stats, code execution drawer, and layout split. |
| **`CodeDisplay`** | `src/components/CodeDisplay.tsx` | `TypingView.tsx` | None | VS Code Dark+ and OneCompiler code editor view, per-character syntax coloring, line gutter, and status bar. |
| **`CoachBubble`** | `src/components/CoachBubble.tsx` | `TypingView.tsx` | Trigger for `AISettings` | Visual banner/bubble showing real-time feedback from the AI Teaching Agent with "Read Aloud" and "Ask Coach" buttons. |
| **`AISettings`** | `src/components/AISettings.tsx` | `TypingView.tsx` | None | Modal dialog to configure coach intelligence (LM Studio, Ollama, Gemini API, OpenAI API). |
| **`KeyboardVisualizer`** | `src/components/KeyboardVisualizer.tsx` | `TypingView.tsx` | `HandDiagram` | Virtual QWERTY keyboard with green/yellow/red semantic keys, shift indicators, and touch-typing finger guide. |
| **`HandDiagram`** | `src/components/HandDiagram.tsx` | `KeyboardVisualizer.tsx` | None | Dual-hand SVG vector diagram highlighting the active finger (emerald) and shift finger (amber). |
| **`CodeExplainer`** | `src/components/CodeExplainer.tsx` | `TypingView.tsx` | None | Right-hand sidebar with natural TTS code breakdown, collapsible Tricky Symbol Tips, and expected stdout card. |
| **`ResultsScreen`** | `src/components/ResultsScreen.tsx` | `App.tsx` | None | TypingClub-style post-lesson debrief with star ratings, WPM, accuracy, time, and "Keys to Review" breakdown. |
| **`CustomCodeView`** | `src/components/CustomCodeView.tsx` | `App.tsx` | None | Custom snippet manager with drag-and-drop file upload (`.py`, `.cpp`), code editor, and snippet execution. |
| **`MobileDashboard`** | `src/components/MobileDashboard.tsx` | `App.tsx` | None | Read-only progress view on mobile viewports with an advisory notice that full typing requires desktop. |

---

## 3. State & Hooks Dependency Graph

```
                                  +-------------------+
                                  |    LocalStorage   |
                                  +---------+---------+
                                            |
         +-------------------+--------------+--------------+-------------------+
         |                   |                             |                   |
+--------v--------+ +--------v--------+           +--------v--------+ +--------v--------+
|   useTheme.ts   | |  useAudio.ts    |           |  useProgress.ts | |useCustomCode.ts |
+-----------------+ +-----------------+           +-----------------+ +-----------------+
         |                   |                             |                   |
         +-------------------+--------------+--------------+-------------------+
                                            |
                                   +--------v--------+
                                   |     App.tsx     |
                                   +--------+--------+
                                            |
                              +-------------v-------------+
                              |      TypingView.tsx       |
                              +-------------+-------------+
                                            |
         +----------------------------------+----------------------------------+
         |                                  |                                  |
+--------v--------+                +--------v--------+                +--------v--------+
|useTypingEngine  |                |   useCoach.ts   |                |   useTTS.ts     |
+--------+--------+                +--------+--------+                +--------+--------+
         |                                  |                                  |
         |  (records keystrokes)            |  (queries patterns)              |  (reads aloud)
         +---------------->+----------------<                                  |
                           |                                                   |
                  +--------v-----------+                                       |
                  | useMistakeTracker  |                                       |
                  +--------------------+                                       |
                                                                               |
                               +-----------------------------------------------+
                               |
                      +--------v--------+
                      | naturalNarrator |
                      +-----------------+
```

### Hook Details

1. **`useTypingEngine.ts`**:
   - **Inputs**: `lesson`, `playClick`, `playError`, `onComplete`.
   - **Internal State**: `chars[]`, `currentIndex`, `startTime`, `elapsedTime`, `totalKeystrokes`, `correctKeystrokes`, `trickyKeys`, `lastMistake`.
   - **Sub-Hooks**: Uses `useMistakeTracker()`.
   - **Outputs**: Current character index, line number, active character, accuracy, WPM, raw WPM, `handleKeyDown`, `reset`.
   - **Lifecycle Rule**: State resets **only** when `lesson.code` changes (enforced via `mistakeTrackerRef`).

2. **`useMistakeTracker.ts`**:
   - **Role**: Detects physical keyboard mistakes (`adjacent_key`, `swap`, `bracket_confusion`, `quotes_confusion`, `shift_missed`).
   - **Outputs**: Memoized `patterns`, `recordCorrectKey()`, `recordMistake()`, `getTopPatterns()`, `currentStreak`, `bestStreak`.

3. **`useCoach.ts`**:
   - **Role**: Orchestrates real-time AI coaching across configured providers (LM Studio, Ollama, Gemini API, OpenAI).
   - **Outputs**: `currentMessage`, `isThinking`, `coachConfig`, `saveConfig`, `coachEnabled`, `setCoachEnabled`, `autoSpeak`, `setAutoSpeak`, `triggerCoaching`.

4. **`useTTS.ts`**:
   - **Role**: Manages speech synthesis with a **global voice registry** and active polling for Chromium/Brave browsers.
   - **Outputs**: `voices[]`, `selectedVoiceURI`, `rate`, `isSpeaking`, `isPaused`, `speak()`, `stop()`, `pause()`, `resume()`, `refreshVoices()`.

5. **`useProgress.ts`**:
   - **Role**: Tracks star ratings, best WPM, and accuracy per lesson under key `keyscript-progress` (fallback to `codetyper-progress`).

6. **`useCustomCode.ts`**:
   - **Role**: Manages custom and uploaded snippets under key `keyscript-custom-snippets` (fallback to `codetyper-custom-snippets`).

7. **`useTheme.ts`**:
   - **Role**: Manages `dark` vs `light` mode under key `keyscript-theme` (fallback to `codetyper-theme`).

8. **`useAudio.ts`**:
   - **Role**: Generates Web Audio API mechanical switch clicks and error buzzes.

9. **`useFullscreen.ts`**:
   - **Role**: Controls browser HTML5 Fullscreen API with vendor-prefixed fallbacks.

---

## 4. Keystroke & Typing Pipeline

```
[User Presses Key]
        │
        ▼
[window.addEventListener('keydown', onWindowKeyDown)] (in TypingView.tsx)
        │
        ├─► Is Cmd+Enter / Ctrl+Enter? ──► Run Code (handleRunCode)
        ├─► Is AISettings modal open?   ──► Let modal input handle it (return)
        ├─► Is text input / textarea?   ──► Let form control handle it (return)
        ├─► Is focus on a Button/Select?──► target.blur() (prevent focus capture)
        ├─► Is Space or Tab?            ──► e.preventDefault() (prevent page scroll)
        │
        ▼
[handleKeyDown(e)] (in useTypingEngine.ts)
        │
        ├─► Is Backspace?
        │       └─► Revert currentIndex (handles multi-tab indents in one go)
        │
        ├─► Is Expected char Tab & Typed Tab?
        │       └─► Auto-consumes ALL consecutive tabs on current line (no double tab)
        │
        ├─► Is TypedChar === ExpectedChar? (MATCH)
        │       ├─► playClick()
        │       ├─► setLastMistake(null)
        │       ├─► mistakeTrackerRef.current.recordCorrectKey()
        │       └─► chars[currentIndex].status = 'correct'
        │
        └─► Is TypedChar !== ExpectedChar? (MISMATCH)
                ├─► playError()
                ├─► Detect if Shift missed vs Wrong Key
                ├─► setLastMistake({ type, expectedChar, typedChar })
                ├─► mistakeTrackerRef.current.recordMistake(...)
                └─► chars[currentIndex].status = 'incorrect'
        │
        ▼
[Advance currentIndex = currentIndex + 1]
        │
        ├─► Is currentIndex >= code.length?
        │       └─► triggerComplete() ──► onComplete(LessonResult) ──► ResultsScreen
        │
        ▼
[Re-render with updated state]
        ├─► CodeDisplay highlights active line and status bar error count
        ├─► KeyboardVisualizer updates Target Key (green), Shift (amber), Mistake (red)
        └─► HandDiagram highlights active finger and shift hand
```

---

## 5. AI Teaching Agent: LLM Provider Execution
 
```
[Mistake Pattern Detected] (mistake count >= 1 or "Ask Coach" button clicked)
        │
        ▼
[useCoach.ts: triggerCoaching]
        │
        ├─► Debounce check (3.5-second interval, bypassed for user questions)
        │
        ▼
[Selected LLM Provider Execution]
        │
        ├─► LM Studio (Local):
        │       └─► POST http://localhost:1234/v1/chat/completions (auto-detects loaded model)
        │
        ├─► Ollama (Local):
        │       └─► POST http://localhost:11434/api/chat
        │
        ├─► Google Gemini API:
        │       └─► POST generativelanguage.googleapis.com
        │
        └─► OpenAI API:
                └─► POST api.openai.com/v1/chat/completions
        │
        ├─► Success ──► Return AI generated coaching sentence
        │
        └─► Unreachable / Offline?
                └─► If user clicked "Ask Coach", display connection helper tip
        │
        ▼
[Display in CoachBubble]
        ├─► Shows provider badge (🧠 LM Studio, 🦙 Ollama, 🤖 Gemini, ⚡ OpenAI)
        ├─► Auto-speaks via TTS if autoSpeak is enabled (using selected voice & rate)
        └─► User can click 🔊 to hear advice read aloud
```

### Provider Matrix

| Provider ID | Provider Name | Type | Endpoint | Default Model | Auto-Discovery |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `lmstudio` | LM Studio (Local) | Local | `http://localhost:1234/v1` | Auto-detects loaded model | `GET /v1/models` (OpenAI-compatible) |
| `ollama` | Ollama (Local) | Local | `http://localhost:11434` | `llama3.2` | `GET /api/tags` |
| `gemini` | Google Gemini API | Cloud | `generativelanguage.googleapis.com` | `gemini-2.0-flash` | Manual model list |
| `openai` | OpenAI API | Cloud | `api.openai.com/v1` | `gpt-4o-mini` | Manual model list |

---

## 6. Audio & Speech Synthesis Relations

```
[Voice Registry in useTTS.ts]
        │
        ├─► Global voices cache (globalVoices)
        ├─► window.speechSynthesis.addEventListener('voiceschanged', syncGlobalVoices)
        └─► 150ms active polling loop for Chromium/Brave voice hydration
                 │
                 ▼
[Consumers of useTTS()]
        │
        ├─► CodeExplainer.tsx (Lesson Narrator)
        │       ├─► Reads lesson narrative breakdown
        │       ├─► Reads individual concept blocks
        │       ├─► Voice selector dropdown (populated with system voices)
        │       ├─► Speed slider (0.25x - 4.00x)
        │       └─► Re-scan voices button (refreshVoices)
        │
        └─► AISettings.tsx & useCoach.ts (AI Teaching Coach)
                ├─► Independent coach voice dropdown selector
                ├─► Independent coach speech rate slider (0.25x - 4.00x)
                ├─► Interactive "Preview Coach Voice" audio test button
                ├─► Spoken real-time coaching tips on repeated mistakes
                └─► Manual CoachBubble tip read-aloud
```

### Speech Text Pipeline ([naturalNarrator.ts](file:///Users/namahomprakash/Agentic-projects/CodeTyper/src/utils/naturalNarrator.ts))
1. **Symbol Translation**: Translates code symbols into spoken words (`:` -> "colon", `;` -> "semicolon", `{` -> "open curly brace", `}` -> "close curly brace", `std::cout` -> "standard C-out", `<<` -> "stream insertion operator").
2. **Text Normalization**: Strips markdown formatting, backticks, asterisks.
3. **Sentence Chunking**: Divides speech into sentences to prevent Chromium's 15-second SpeechSynthesis timeout bug.

---

## 7. Storage & Persistence Map

| Storage Key | Managed By | Stored Value Schema | Usage |
| :--- | :--- | :--- | :--- |
| `keyscript-progress` | `useProgress.ts` | `Record<Language, Record<LessonId, { bestWpm, bestAccuracy, stars, completedAt }>>` | Curriculum progress, star ratings, and statistics. |
| `keyscript-custom-snippets` | `useCustomCode.ts` | `CustomSnippet[]` | User uploaded and custom written code snippets. |
| `keyscript-theme` | `useTheme.ts` | `'dark' \| 'light'` | Color scheme selection (Midnight vs Daylight). |
| `keyscript-muted` | `useAudio.ts` | `'true' \| 'false'` | Mute toggle for mechanical keyboard click sounds. |
| `keyscript-tts-voice` | `useTTS.ts` | `string` (Voice URI) | Selected SpeechSynthesis voice URI for lesson narration. |
| `keyscript-tts-rate` | `useTTS.ts` | `string` (Float e.g. `'1.0'`, clamped 0.25 - 4.0) | Lesson narration speed multiplier. |
| `keyscript-coach-voice` | `useCoach.ts` | `string` (Voice URI) | Dedicated voice URI for the AI Coach tutor. |
| `keyscript-coach-rate` | `useCoach.ts` | `string` (Float e.g. `'1.0'`, clamped 0.25 - 4.0) | Dedicated speech speed multiplier for the AI Coach. |
| `keyscript-coach-config` | `useCoach.ts` | `ProviderConfig` JSON (`providerId`, `apiKey`, `baseUrl`, `model`, `enabled`) | AI Coach provider credentials and settings. |
| `keyscript-coach-enabled` | `useCoach.ts` | `'true' \| 'false'` | AI Coach active toggle. |
| `keyscript-coach-autospeak` | `useCoach.ts` | `'true' \| 'false'` | Auto-read coaching tips via TTS toggle. |
| `keyscript-all-provider-settings` | `AISettings.tsx` | `Record<string, ProviderSettings>` | Per-provider API keys, base URLs, and models. |

---

## 8. Complete File-by-File Cross-Reference

| File | Depends On (Imports) | Depended On By (Imported By) |
| :--- | :--- | :--- |
| `src/types.ts` | Standard TypeScript types | Almost all files across `src/` |
| `src/main.tsx` | `React`, `App.tsx`, `index.css` | `index.html` (Vite entry) |
| `src/App.tsx` | `types.ts`, `python.ts`, `cpp.ts`, all hooks, all top-level components | `src/main.tsx` |
| `src/components/Header.tsx` | `types.ts`, `lucide-react` | `src/App.tsx` |
| `src/components/LessonList.tsx` | `types.ts`, `useProgress.ts`, `lucide-react` | `src/App.tsx` |
| `src/components/TypingView.tsx` | `types.ts`, `useTypingEngine.ts`, `useCoach.ts`, `useTTS.ts`, `codeRunner.ts`, `CodeDisplay.tsx`, `CoachBubble.tsx`, `AISettings.tsx`, `KeyboardVisualizer.tsx`, `CodeExplainer.tsx` | `src/App.tsx` |
| `src/components/CodeDisplay.tsx` | `types.ts`, `codeTokenizer.ts`, `lucide-react` | `src/components/TypingView.tsx` |
| `src/components/CoachBubble.tsx` | `coaching/types.ts`, `lucide-react` | `src/components/TypingView.tsx` |
| `src/components/AISettings.tsx` | `coaching/types.ts`, `coaching/providers/index.ts`, `lucide-react` | `src/components/TypingView.tsx` |
| `src/components/KeyboardVisualizer.tsx` | `fingerMap.ts`, `HandDiagram.tsx`, `types.ts`, `lucide-react` | `src/components/TypingView.tsx` |
| `src/components/HandDiagram.tsx` | `types.ts` | `src/components/KeyboardVisualizer.tsx` |
| `src/components/CodeExplainer.tsx` | `types.ts`, `fingerMap.ts`, `useTTS.ts`, `naturalNarrator.ts`, `lucide-react` | `src/components/TypingView.tsx` |
| `src/components/ResultsScreen.tsx` | `types.ts`, `fingerMap.ts`, `lucide-react` | `src/App.tsx` |
| `src/components/CustomCodeView.tsx` | `types.ts`, `useCustomCode.ts`, `codeRunner.ts`, `lucide-react` | `src/App.tsx` |
| `src/components/MobileDashboard.tsx` | `types.ts`, `useProgress.ts`, `useCustomCode.ts`, `lucide-react` | `src/App.tsx` |
| `src/hooks/useTypingEngine.ts` | `types.ts`, `useMistakeTracker.ts` | `src/components/TypingView.tsx` |
| `src/hooks/useMistakeTracker.ts` | `types.ts`, `coaching/types.ts` | `src/hooks/useTypingEngine.ts` |
| `src/hooks/useCoach.ts` | `coaching/types.ts`, `localCoach.ts`, `nanoCoach.ts`, `providers/index.ts`, `useMistakeTracker.ts` | `src/components/TypingView.tsx` |
| `src/hooks/useTTS.ts` | `naturalNarrator.ts` | `src/components/TypingView.tsx`, `src/components/CodeExplainer.tsx` |
| `src/hooks/useAudio.ts` | None | `src/App.tsx` |
| `src/hooks/useProgress.ts` | `types.ts` | `src/App.tsx`, `src/components/LessonList.tsx`, `src/components/MobileDashboard.tsx` |
| `src/hooks/useCustomCode.ts` | `types.ts` | `src/App.tsx`, `src/components/CustomCodeView.tsx`, `src/components/MobileDashboard.tsx` |
| `src/hooks/useTheme.ts` | None | `src/App.tsx` |
| `src/hooks/useFullscreen.ts` | None | `src/App.tsx` |
| `src/utils/codeTokenizer.ts` | `types.ts` | `src/components/CodeDisplay.tsx` |
| `src/utils/codeRunner.ts` | `types.ts` | `src/components/TypingView.tsx`, `src/components/CustomCodeView.tsx` |
| `src/utils/naturalNarrator.ts` | `types.ts` | `src/hooks/useTTS.ts`, `src/components/CodeExplainer.tsx` |
| `src/utils/coaching/localCoach.ts` | `coaching/types.ts`, `fingerMap.ts` | `src/hooks/useCoach.ts` |
| `src/utils/coaching/nanoCoach.ts` | `coaching/types.ts`, `coachPrompts.ts` | `src/hooks/useCoach.ts` |
| `src/utils/coaching/coachPrompts.ts`| `coaching/types.ts`, `fingerMap.ts` | `nanoCoach.ts`, all providers |
| `src/utils/coaching/providers/` | `coaching/types.ts`, `coachPrompts.ts` | `src/utils/coaching/providers/index.ts` |
| `src/data/fingerMap.ts` | `types.ts` | `KeyboardVisualizer.tsx`, `CodeExplainer.tsx`, `ResultsScreen.tsx`, `localCoach.ts` |
| `src/data/curriculum/python.ts` | `types.ts` | `src/App.tsx` |
| `src/data/curriculum/cpp.ts` | `types.ts` | `src/App.tsx` |
