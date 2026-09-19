import { useCallback, useState } from 'react';
import { CustomSnippet, Language, Lesson } from '../types';

const STORAGE_KEY = 'keyscript-custom-snippets';
const LEGACY_STORAGE_KEY = 'codetyper-custom-snippets';

const DEFAULT_CUSTOM_SNIPPETS: CustomSnippet[] = [
  {
    id: 'tree-py',
    title: 'Binary Search Tree (Python)',
    language: 'python',
    description: 'Insert and in-order traversal of a binary search tree.',
    code: `class TreeNode:\n\tdef __init__(self, val=0):\n\t\tself.val = val\n\t\tself.left = None\n\t\tself.right = None\n\ndef inorder_traversal(root):\n\tif not root:\n\t\treturn []\n\treturn inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right)\n\nroot = TreeNode(10)\nroot.left = TreeNode(5)\nroot.right = TreeNode(15)\nprint(f"In-Order BST: {inorder_traversal(root)}")`,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tree-cpp',
    title: 'Binary Tree Traversal (C++)',
    language: 'cpp',
    description: 'Struct-based binary tree node with recursive DFS.',
    code: `#include <iostream>\nusing namespace std;\n\nstruct TreeNode {\n\tint val;\n\tTreeNode* left;\n\tTreeNode* right;\n\tTreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nint main() {\n\tTreeNode* root = new TreeNode(10);\n\troot->left = new TreeNode(5);\n\troot->right = new TreeNode(20);\n\tcout << "Root: " << root->val << ", Left: " << root->left->val << endl;\n\treturn 0;\n}`,
    createdAt: new Date().toISOString(),
  },
];

export function useCustomCode() {
  const [snippets, setSnippets] = useState<CustomSnippet[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CUSTOM_SNIPPETS));
      return DEFAULT_CUSTOM_SNIPPETS;
    } catch {
      return DEFAULT_CUSTOM_SNIPPETS;
    }
  });

  const saveSnippets = (updated: CustomSnippet[]) => {
    setSnippets(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to persist custom snippets:', err);
    }
  };

  const addSnippet = useCallback((title: string, language: Language, code: string, description?: string) => {
    const newSnippet: CustomSnippet = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: title.trim() || 'Untitled Snippet',
      language,
      code: code.replace(/\r\n/g, '\n'),
      description: description?.trim(),
      createdAt: new Date().toISOString(),
    };
    saveSnippets([newSnippet, ...snippets]);
    return newSnippet;
  }, [snippets]);

  const deleteSnippet = useCallback((id: string) => {
    saveSnippets(snippets.filter((s) => s.id !== id));
  }, [snippets]);

  const updateSnippetStats = useCallback((id: string, wpm: number, accuracy: number, stars: number) => {
    saveSnippets(
      snippets.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            bestWpm: Math.max(s.bestWpm || 0, wpm),
            bestAccuracy: Math.max(s.bestAccuracy || 0, accuracy),
            stars: Math.max(s.stars || 0, stars),
          };
        }
        return s;
      })
    );
  }, [snippets]);

  const uploadFile = useCallback(async (file: File): Promise<CustomSnippet> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        let lang: Language = 'python';
        const name = file.name.toLowerCase();
        if (name.endsWith('.cpp') || name.endsWith('.cc') || name.endsWith('.c') || name.endsWith('.h') || name.endsWith('.hpp')) {
          lang = 'cpp';
        }

        const title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const created = addSnippet(title, lang, content, `Uploaded file: ${file.name}`);
        resolve(created);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, [addSnippet]);

  // Convert CustomSnippet into a Lesson for typing engine
  const convertSnippetToLesson = useCallback((snippet: CustomSnippet): Lesson => {
    // derive focus keys
    const specialKeys = new Set<string>();
    for (const ch of snippet.code) {
      if ('{}()[];:><=*+-/\\"\'!%&|'.includes(ch)) {
        specialKeys.add(ch);
      }
    }

    return {
      id: snippet.id,
      number: 0,
      title: snippet.title,
      description: snippet.description || 'Custom uploaded snippet',
      language: snippet.language,
      code: snippet.code,
      keyFocus: Array.from(specialKeys).slice(0, 8),
      explanation: [
        {
          heading: 'Custom Code Practice',
          body: `This is your custom ${snippet.language === 'python' ? 'Python' : 'C++'} snippet. You can run it anytime using the Run Code button or by pressing Cmd + Enter.`,
        },
      ],
      expectedOutput: 'Click "Run Code" or press Cmd+Enter to execute.',
    };
  }, []);

  return {
    snippets,
    addSnippet,
    deleteSnippet,
    updateSnippetStats,
    uploadFile,
    convertSnippetToLesson,
  };
}
