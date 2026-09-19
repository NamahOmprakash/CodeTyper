import { CharStatus } from '../types';

/**
 * Token types matching VS Code Dark+ and Monaco Editor syntax grammars.
 */
export type TokenType =
  | 'keyword'
  | 'type-keyword'
  | 'directive'
  | 'function'
  | 'string'
  | 'number'
  | 'type'
  | 'variable'
  | 'operator'
  | 'punctuation'
  | 'comment'
  | 'default';

const PYTHON_KEYWORDS = new Set([
  'def', 'return', 'if', 'elif', 'else', 'for', 'in', 'while', 'break',
  'continue', 'import', 'from', 'as', 'class', 'pass', 'True', 'False',
  'None', 'and', 'or', 'not', 'is', 'lambda', 'try', 'except', 'finally',
  'raise', 'with', 'yield', 'global', 'nonlocal', 'assert'
]);

const PYTHON_BUILTINS = new Set([
  'print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict', 'set',
  'tuple', 'sum', 'min', 'max', 'abs', 'round', 'type', 'input', 'enumerate', 'zip'
]);

const CPP_CONTROL_KEYWORDS = new Set([
  'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case',
  'default', 'break', 'continue', 'using', 'namespace', 'new', 'delete',
  'nullptr', 'true', 'false', 'template', 'typename', 'auto', 'sizeof',
  'typedef', 'public', 'private', 'protected', 'class', 'struct', 'const', 'static'
]);

const CPP_TYPE_KEYWORDS = new Set([
  'int', 'double', 'char', 'float', 'bool', 'void', 'long', 'short',
  'unsigned', 'signed'
]);

const CPP_BUILTINS = new Set([
  'cout', 'cin', 'endl', 'printf', 'scanf'
]);

const CPP_TYPES = new Set([
  'std', 'string', 'vector', 'map', 'set', 'pair', 'queue', 'stack', 'TreeNode', 'ListNode'
]);

/**
 * Tokenizes code into per-character TokenType array.
 * Maps 1-to-1 with character indices in code.
 */
export function tokenizeCode(code: string, language: 'python' | 'cpp'): TokenType[] {
  const n = code.length;
  const tokenTypes: TokenType[] = new Array(n).fill('default');

  let i = 0;
  while (i < n) {
    const ch = code[i];

    // Python comments (#)
    if (language === 'python' && ch === '#') {
      const start = i;
      while (i < n && code[i] !== '\n') i++;
      for (let k = start; k < i; k++) tokenTypes[k] = 'comment';
      continue;
    }

    // C++ single-line comments (//)
    if (language === 'cpp' && ch === '/' && i + 1 < n && code[i + 1] === '/') {
      const start = i;
      while (i < n && code[i] !== '\n') i++;
      for (let k = start; k < i; k++) tokenTypes[k] = 'comment';
      continue;
    }

    // C++ multi-line comments (/* ... */)
    if (language === 'cpp' && ch === '/' && i + 1 < n && code[i + 1] === '*') {
      const start = i;
      i += 2;
      while (i < n && !(code[i - 1] === '*' && code[i] === '/')) i++;
      if (i < n) i++;
      for (let k = start; k < i; k++) tokenTypes[k] = 'comment';
      continue;
    }

    // C++ Preprocessor directive (#include <...>, #define, etc.)
    if (language === 'cpp' && ch === '#') {
      const start = i;
      while (i < n && /[a-zA-Z_#]/.test(code[i])) i++;
      for (let k = start; k < i; k++) tokenTypes[k] = 'directive';

      // Skip whitespace after #include
      while (i < n && (code[i] === ' ' || code[i] === '\t')) i++;

      // If followed by <header>, color as string/header
      if (i < n && code[i] === '<') {
        const headerStart = i;
        while (i < n && code[i] !== '>' && code[i] !== '\n') i++;
        if (i < n && code[i] === '>') i++;
        for (let k = headerStart; k < i; k++) tokenTypes[k] = 'string';
      }
      continue;
    }

    // Python f-string or raw string prefix: f"...", r"..."
    if (
      language === 'python' &&
      (ch === 'f' || ch === 'r' || ch === 'F' || ch === 'R') &&
      i + 1 < n &&
      (code[i + 1] === '"' || code[i + 1] === "'")
    ) {
      tokenTypes[i] = 'keyword';
      const quote = code[i + 1];
      const start = i + 1;
      i += 2;
      while (i < n && code[i] !== quote && code[i] !== '\n') {
        if (code[i] === '\\' && i + 1 < n) {
          i += 2;
        } else {
          i++;
        }
      }
      if (i < n && code[i] === quote) i++;
      for (let k = start; k < i; k++) tokenTypes[k] = 'string';
      continue;
    }

    // String literals ("..." or '...')
    if (ch === '"' || ch === "'") {
      const quote = ch;
      const start = i;
      i++;
      while (i < n && code[i] !== quote && code[i] !== '\n') {
        if (code[i] === '\\' && i + 1 < n) {
          i += 2;
        } else {
          i++;
        }
      }
      if (i < n && code[i] === quote) i++;
      for (let k = start; k < i; k++) tokenTypes[k] = 'string';
      continue;
    }

    // Numbers: digits with optional decimal point
    if (/[0-9]/.test(ch)) {
      const start = i;
      while (i < n && /[0-9.]/.test(code[i])) i++;
      if (language === 'cpp' && i < n && /[fFulL]/.test(code[i])) i++;
      for (let k = start; k < i; k++) tokenTypes[k] = 'number';
      continue;
    }

    // Words: Identifiers, Keywords, Functions
    if (/[a-zA-Z_]/.test(ch)) {
      const start = i;
      while (i < n && /[a-zA-Z0-9_]/.test(code[i])) i++;
      const word = code.slice(start, i);

      // Peek if followed by '(' (ignoring spaces)
      let nextNonSpace = i;
      while (nextNonSpace < n && (code[nextNonSpace] === ' ' || code[nextNonSpace] === '\t')) {
        nextNonSpace++;
      }
      const isCall = nextNonSpace < n && code[nextNonSpace] === '(';

      let type: TokenType = 'variable';

      if (language === 'python') {
        if (PYTHON_KEYWORDS.has(word)) {
          type = 'keyword';
        } else if (PYTHON_BUILTINS.has(word) || isCall) {
          type = 'function';
        } else {
          type = 'variable';
        }
      } else {
        if (CPP_TYPE_KEYWORDS.has(word)) {
          type = 'type-keyword';
        } else if (CPP_CONTROL_KEYWORDS.has(word)) {
          type = 'keyword';
        } else if (CPP_BUILTINS.has(word)) {
          type = 'function';
        } else if (CPP_TYPES.has(word) || /^[A-Z][a-zA-Z0-9_]*$/.test(word)) {
          type = 'type';
        } else if (isCall) {
          type = 'function';
        } else {
          type = 'variable';
        }
      }

      for (let k = start; k < i; k++) tokenTypes[k] = type;
      continue;
    }

    // Multi-character operators
    if (i + 1 < n) {
      const pair = code.slice(i, i + 2);
      if (['<<', '>>', '::', '->', '++', '--', '==', '!=', '<=', '>=', '&&', '||', '+=', '-=', '*='].includes(pair)) {
        tokenTypes[i] = 'operator';
        tokenTypes[i + 1] = 'operator';
        i += 2;
        continue;
      }
    }

    // Single-character operators
    if (['=', '+', '-', '*', '/', '%', '<', '>', '&', '|', '!', '^', '~'].includes(ch)) {
      tokenTypes[i] = 'operator';
      i++;
      continue;
    }

    // Punctuation
    if (['(', ')', '{', '}', '[', ']', ';', ':', ',', '.'].includes(ch)) {
      tokenTypes[i] = 'punctuation';
      i++;
      continue;
    }

    // Whitespace or unclassified
    tokenTypes[i] = 'default';
    i++;
  }

  return tokenTypes;
}

/**
 * Returns the exact VS Code Dark+ color for a token in pending, current, or correct state.
 */
export function getVSCodeTokenStyle(
  type: TokenType,
  status: CharStatus
): { color: string; opacity?: number; fontWeight?: string } {
  if (status === 'incorrect') {
    return {
      color: '#f44747',
      fontWeight: '700',
    };
  }

  const isCorrect = status === 'correct';

  switch (type) {
    case 'keyword':
      // VS Code Control Keywords: pink/purple (#C586C0)
      return {
        color: isCorrect ? '#c586c0' : '#c586c0',
        opacity: isCorrect ? 1.0 : 0.65,
        fontWeight: isCorrect ? '600' : '400',
      };

    case 'type-keyword':
      // VS Code Type Keywords (int, double, char, void): keyword blue (#569CD6)
      return {
        color: isCorrect ? '#569cd6' : '#569cd6',
        opacity: isCorrect ? 1.0 : 0.65,
        fontWeight: isCorrect ? '600' : '400',
      };

    case 'directive':
      // Preprocessor directive (#include, #define): purple (#C586C0)
      return {
        color: isCorrect ? '#c586c0' : '#c586c0',
        opacity: isCorrect ? 1.0 : 0.65,
        fontWeight: isCorrect ? '600' : '400',
      };

    case 'function':
      // Function names & calls (print, main, cout, multiply): warm gold (#DCDCAA)
      return {
        color: isCorrect ? '#dcdcaa' : '#dcdcaa',
        opacity: isCorrect ? 1.0 : 0.65,
        fontWeight: isCorrect ? '600' : '400',
      };

    case 'string':
      // String literals ("...", '...'): warm terracotta (#CE9178)
      return {
        color: isCorrect ? '#ce9178' : '#ce9178',
        opacity: isCorrect ? 1.0 : 0.65,
        fontWeight: isCorrect ? '500' : '400',
      };

    case 'number':
      // Numeric literals (22, 3.85, 0): light sage green (#B5CEA8)
      return {
        color: isCorrect ? '#b5cea8' : '#b5cea8',
        opacity: isCorrect ? 1.0 : 0.65,
        fontWeight: isCorrect ? '600' : '400',
      };

    case 'type':
      // Custom classes/types (TreeNode, std, vector): teal (#4EC9B0)
      return {
        color: isCorrect ? '#4ec9b0' : '#4ec9b0',
        opacity: isCorrect ? 1.0 : 0.65,
        fontWeight: isCorrect ? '600' : '400',
      };

    case 'variable':
      // Identifiers / variables (user, age, gpa): soft sky blue (#9CDCFE)
      return {
        color: isCorrect ? '#9cdcfe' : '#9cdcfe',
        opacity: isCorrect ? 1.0 : 0.65,
        fontWeight: isCorrect ? '500' : '400',
      };

    case 'comment':
      // Comments (#, //): muted forest green (#6A9955)
      return {
        color: isCorrect ? '#6a9955' : '#6a9955',
        opacity: isCorrect ? 1.0 : 0.65,
        fontWeight: isCorrect ? '500' : '400',
      };

    case 'operator':
    case 'punctuation':
    case 'default':
    default:
      // Operators & punctuation (=, +, *, (, ), {, }, ;): light off-white (#D4D4D4)
      return {
        color: isCorrect ? '#e4e4e7' : '#a1a1aa',
        opacity: isCorrect ? 1.0 : 0.55,
        fontWeight: isCorrect ? '500' : '400',
      };
  }
}
