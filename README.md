# Key Script ⌨️

**Key Script** is an intelligent, developer-first touch-typing tutor and code fluency accelerator engineered to build muscle memory, cadence, and syntax confidence across real-world programming languages.

Unlike standard prose typing tests, Key Script is designed from the ground up for the realities of code: indentation levels, brackets, string interpolations, pointer asterisks, language keywords, and semicolon cadences.

---

## ✨ Features

- **⚡ Syntax-Aware Typing Engine**: Built specifically for code. Automatically manages multi-space indentation, consecutive tabs, string literals, and bracket pairs without browser scrolling or tab-focus hijacking.
- **🖐️ Dynamic Dual-Hand Finger Guide**: Vector SVG visualization depicting the exact finger responsible for each incoming keystroke, with distinct emerald active-finger indicators and amber shift-hand coordination.
- **⌨️ Real-Time Mechanical Feedback**: Authentic mechanical switch sound effects generated in real time using the browser's native Web Audio API (no external audio assets required).
- **📚 Multi-Language Structured Curriculums (30 Comprehensive Lessons)**:
  - **Python Track (15 Lessons)**: Output & Quotes, Variables & F-Strings, Conditionals & Indentation, For Loops & Iteration, Functions & Returns, Dictionaries & Hash Maps, List Comprehensions & Lambdas, While Loops & Accumulators, Sets & Tuple Unpacking, Exception Handling (`try`/`except`), Classes & OOP (`__init__`), String Delimiters & Parsing, Flexible Signatures (`**kwargs`), Decorators & Closures (`@`), and Generators (`yield`).
  - **C++ Track (15 Lessons)**: Standard I/O (`#include <iostream>`), Data Types & Precision, Conditionals & Code Braces, For Loops & Fixed Arrays, Functions & Signatures, Pass-by-Reference (`&`), Pointers & Dereferencing (`*`), Structs & Dot Access (`.`), Dynamic Memory (`new`/`delete`), STL Vectors (`std::vector`), Classes & Constructors (`:`), Arrow Dereference (`->`), Generic Function Templates (`<typename T>`), Lambda Expressions (`[](){}`), and Linked Nodes & Pointer Traversal.
- **📂 Custom Code Snippet Manager**: Drag and drop your own `.py` or `.cpp` source files or paste custom code snippets to practice your personal codebase. Snippets are saved locally in browser storage.
- **📊 Comprehensive Performance Analytics**: TypingClub-style post-lesson debrief calculating standard WPM, raw WPM, accuracy %, time elapsed, streak records, and specific keys needing review.
- **🎨 Developer Themes**: Sleek Dark Mode (inspired by VS Code Dark+) and Crisp Light Mode with full UI persistence.

---

## 🧪 Experimental Features

The following modules represent active frontiers in Key Script and are flagged as experimental:

### 🏷️ `[Experimental]` Local & Cloud AI Teaching Agent
- Real-time pedagogical guidance and mistake pattern diagnosis.
- Seamlessly connects to your local model servers:
  - **LM Studio** (`http://localhost:1234/v1`, customizable server port)
  - **Ollama** (`http://localhost:11434/v1`)
- Also supports cloud LLM inference via **Google Gemini API** (`gemini-1.5-flash` / `gemini-1.5-pro`) and **OpenAI API** (`gpt-4o` / `gpt-4o-mini`).
- Diagnoses physical keyboard patterns such as adjacent-key slips, bracket confusion (`(` vs `[` vs `{`), quote mistakes (`"` vs `'`), and shift timing delays.

### 🏷️ `[Experimental]` In-Browser Real-Time Code Execution
- Execute the exact code you just typed directly within the browser runtime by pressing `Cmd + Enter` (macOS) or `Ctrl + Enter` (Windows/Linux).
- Executes Python scripts using in-memory WebAssembly and runs C++ simulations with live stdout terminal feedback.

### 🏷️ `[Experimental]` Dynamic Voice Narration & TTS Code Breakdown
- Web Speech API integration that speaks code explanations, tricky symbol pronunciations, and AI coach feedback aloud.
- Features a fine-grained speech rate adjuster ranging from **`0.25x` (slow study)** to **`4.0x` (rapid speed-read)**.
- Global voice registry with auto-detection for Chrome, Brave, Safari, and Firefox.

### 🏷️ `[Experimental]` Syntax AST Breakdown & Symbol Diagnostic Tips
- Contextual right-sidebar breakdown decomposing each code line into its programmatic intent (e.g., initialization, loop guard, stream injection).
- Tricky symbol cards offering ergonomic keyboard shortcuts and finger recommendations for programming symbols like `->`, `::`, `!=`, `{}` and `[]`.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd CodeTyper
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The compiled static bundle will be generated in `dist/`.

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## 🤖 Configuring Local AI Coach (LM Studio / Ollama)

To enable offline, privacy-first AI coaching:

1. Open **LM Studio** or **Ollama** on your machine.
2. In **LM Studio**:
   - Start the local server (default port: `1234`).
   - Load any supported coding or instruct model (e.g. Qwen 2.5 Coder, Llama 3, Mistral).
3. In **Key Script**:
   - Click the ⚙️ icon on the AI Coach bubble in the typing view.
   - Select **LM Studio** (or **Ollama**).
   - Enter your model identifier and verify the endpoint URL (`http://localhost:1234/v1`).
   - Test or start typing to receive real-time coaching tips!

---

## 📁 Project Structure

```
Key Script/
├── index.html                   # HTML entry point with metadata
├── package.json                 # Project dependencies and build scripts
├── RELATIONS.md                 # Full component topology and state relations
├── src/
│   ├── App.tsx                  # Root controller & view orchestration
│   ├── main.tsx                 # React DOM mount point
│   ├── types.ts                 # TypeScript type definitions
│   ├── components/
│   │   ├── AISettings.tsx       # AI Coach settings modal
│   │   ├── CoachBubble.tsx      # Interactive AI feedback bubble
│   │   ├── CodeDisplay.tsx      # Editor view with per-character syntax coloring
│   │   ├── CodeExplainer.tsx    # Right sidebar with TTS code breakdown
│   │   ├── CustomCodeView.tsx   # Custom snippet management & upload
│   │   ├── HandDiagram.tsx      # SVG hand graphic with finger highlight
│   │   ├── Header.tsx           # Navigation bar, language tabs, theme toggles
│   │   ├── KeyboardVisualizer.tsx # QWERTY visualizer with semantic state
│   │   ├── LessonList.tsx       # Curriculum index with stars and WPM
│   │   ├── MobileDashboard.tsx  # Mobile view with progress overview
│   │   ├── ResultsScreen.tsx    # Post-lesson debrief & tricky keys
│   │   └── TypingView.tsx       # Main typing arena
│   ├── data/
│   │   ├── fingerMap.ts         # QWERTY key-to-finger coordinate mappings
│   │   ├── themes.ts            # Editor color themes
│   │   └── curriculum/          # Structured lessons (Python, C++)
│   ├── hooks/
│   │   ├── useAudio.ts          # Web Audio API mechanical sound synthesizers
│   │   ├── useCoach.ts          # AI coaching orchestration hook
│   │   ├── useCustomCode.ts     # LocalStorage snippet persistence
│   │   ├── useFullscreen.ts     # Fullscreen toggle hook
│   │   ├── useMistakeTracker.ts # Keystroke mistake pattern diagnostics
│   │   ├── useProgress.ts       # Lesson scoring and progress persistence
│   │   ├── useTheme.ts          # Dark / Light theme manager
│   │   ├── useTTS.ts            # Web Speech API text-to-speech controller
│   │   └── useTypingEngine.ts   # Core keystroke evaluation and metric engine
│   └── utils/
│       ├── codeRunner.ts        # In-browser code execution sandbox
│       ├── codeTokenizer.ts     # Syntax tokenizer
│       ├── naturalNarrator.ts   # Code pronunciation and natural narrator
│       └── coaching/            # Provider clients (LM Studio, Ollama, Gemini, OpenAI)
```

For in-depth component data flows and hook lifecycles, see [RELATIONS.md](RELATIONS.md).
