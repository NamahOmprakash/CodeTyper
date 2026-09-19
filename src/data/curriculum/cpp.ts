import { Lesson } from '../../types';

export const cppLessons: Lesson[] = [
  {
    id: 'cpp-01',
    number: 1,
    title: 'Hello, C++ & iostream',
    description: 'Learn preprocessor directives, namespaces, standard output stream, and semicolons.',
    language: 'cpp',
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello, C++!" << endl;\n\treturn 0;\n}`,
    keyFocus: ['#', '<', '>', ';', '{', '}', '<', '<'],
    explanation: [
      {
        heading: 'Header Includes (#include <iostream>)',
        body: '`#include` tells the preprocessor to include the standard input/output stream library header inside angle brackets `<>`.',
        lineRange: [1, 1],
      },
      {
        heading: 'Namespaces & Semicolons (;)',
        body: '`using namespace std;` allows referencing `cout` without typing `std::`. Every statement in C++ terminates with a semicolon `;`. Semicolon is typed with Right Pinky.',
        lineRange: [2, 2],
      },
      {
        heading: 'The main() Entrypoint & Stream Insertion (<<)',
        body: 'Execution starts in `main()`. `cout <<` streams text to standard output. Type `<` with Right Ring while holding Left Shift.',
        lineRange: [4, 7],
      },
    ],
    expectedOutput: `Hello, C++!`,
  },
  {
    id: 'cpp-02',
    number: 2,
    title: 'Variables & Data Types',
    description: 'Practice static typing, assignment, stream chaining, and precision.',
    language: 'cpp',
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n\tint level = 5;\n\tdouble speed = 9.81;\n\tchar grade = 'A';\n\tcout << "Lvl: " << level << ", Spd: " << speed << endl;\n\treturn 0;\n}`,
    keyFocus: ['=', ';', '<', '>', "'", '"', '.'],
    explanation: [
      {
        heading: 'Strong Static Typing',
        body: 'Unlike Python, C++ variables require explicit types like `int` (integers), `double` (floating point), and `char` (single characters).',
        lineRange: [5, 7],
      },
      {
        heading: 'Character vs String Literals',
        body: "Single characters use single quotes 'A' (Right Pinky), whereas strings use double quotes \"...\".",
        lineRange: [7, 7],
      },
      {
        heading: 'Stream Operator Chaining',
        body: 'You can chain multiple expressions together into `cout` using consecutive `<<` stream insertion operators.',
        lineRange: [8, 8],
      },
    ],
    expectedOutput: `Lvl: 5, Spd: 9.81`,
  },
  {
    id: 'cpp-03',
    number: 3,
    title: 'Conditionals & Code Braces',
    description: 'Structure decisions using if-else logic and curly braces.',
    language: 'cpp',
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n\tint score = 85;\n\tif (score >= 75) {\n\t\tcout << "Passed!" << endl;\n\t} else {\n\t\tcout << "Try again." << endl;\n\t}\n\treturn 0;\n}`,
    keyFocus: ['(', ')', '{', '}', '>', '=', ';'],
    explanation: [
      {
        heading: 'Parenthesized Conditions',
        body: 'Conditions in C++ must be enclosed in parentheses `(...)`. Practice fluid Right Ring `(` and Right Pinky `)`.',
        lineRange: [6, 6],
      },
      {
        heading: 'Block Braces ({})',
        body: 'Compound statements are enclosed within curly braces `{` and `}`. Always use Right Pinky + Left Shift.',
        lineRange: [6, 10],
      },
      {
        heading: 'Else Clause',
        body: 'The `else` branch executes whenever the `if` test evaluates to false.',
        lineRange: [8, 10],
      },
    ],
    expectedOutput: `Passed!`,
  },
  {
    id: 'cpp-04',
    number: 4,
    title: 'For Loops & Arrays',
    description: 'Type traditional C-style for loops with increment operators and array indexing.',
    language: 'cpp',
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n\tint nums[3] = {10, 20, 30};\n\tfor (int i = 0; i < 3; i++) {\n\t\tcout << "Item: " << nums[i] << endl;\n\t}\n\treturn 0;\n}`,
    keyFocus: ['[', ']', '{', '}', ';', '<', '+', '+'],
    explanation: [
      {
        heading: 'Fixed-Size Arrays ([])',
        body: 'Arrays declare a fixed capacity inside `[3]`. Initializer lists use `{10, 20, 30}`.',
        lineRange: [5, 5],
      },
      {
        heading: 'The 3-Part For Loop',
        body: 'The `for` statement has initialization `int i = 0`, condition `i < 3`, and increment `i++`, all separated by semicolons `;`.',
        lineRange: [6, 6],
      },
      {
        heading: 'Subscript Indexing (nums[i])',
        body: 'Array elements are accessed by zero-based indexing using square brackets `[i]`.',
        lineRange: [7, 7],
      },
    ],
    expectedOutput: `Item: 10\nItem: 20\nItem: 30`,
  },
  {
    id: 'cpp-05',
    number: 5,
    title: 'Functions & Return Types',
    description: 'Define functions with explicit return types, parameter lists, and return statements.',
    language: 'cpp',
    code: `#include <iostream>\nusing namespace std;\n\nint multiply(int a, int b) {\n\treturn a * b;\n}\n\nint main() {\n\tint product = multiply(6, 7);\n\tcout << "Product: " << product << endl;\n\treturn 0;\n}`,
    keyFocus: ['(', ')', ',', '*', '{', '}', ';'],
    explanation: [
      {
        heading: 'Function Signature',
        body: 'The return type `int` comes first, followed by the function name `multiply` and typed parameters `(int a, int b)`.',
        lineRange: [4, 4],
      },
      {
        heading: 'The Multiplication Operator (*)',
        body: 'The asterisk `*` performs numeric multiplication. Type `*` using your Right Middle finger while holding Left Shift.',
        lineRange: [5, 5],
      },
      {
        heading: 'Calling and Assigning',
        body: 'The return value of `multiply(6, 7)` is captured into the variable `product` and streamed to `cout`.',
        lineRange: [9, 10],
      },
    ],
    expectedOutput: `Product: 42`,
  },
];
