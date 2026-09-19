import { Lesson } from '../../types';

export const pythonLessons: Lesson[] = [
  {
    id: 'py-01',
    number: 1,
    title: 'Hello, World!',
    description: 'Master standard output, quotation marks, and parentheses.',
    language: 'python',
    code: `print("Hello, World!")\nprint("Welcome to Key Script!")`,
    keyFocus: ['(', ')', '"', '!'],
    explanation: [
      {
        heading: 'The print() Function',
        body: '`print()` is built into Python. It outputs data or text to the terminal console.',
        lineRange: [1, 1],
      },
      {
        heading: 'String Literals & Quotes',
        body: 'Text wrapped in double quotes `"` or single quotes `\'` is a string. Type quotes using your Right Pinky while holding Left Shift.',
        lineRange: [1, 2],
      },
      {
        heading: 'Parentheses for Arguments',
        body: 'Function parameters go inside `(` and `)`. Use Right Ring finger for `(` and Right Pinky for `)`.',
        lineRange: [1, 2],
      },
    ],
    expectedOutput: `Hello, World!\nWelcome to Key Script!`,
  },
  {
    id: 'py-02',
    number: 2,
    title: 'Variables & F-Strings',
    description: 'Practice assignment operators, data types, and formatted strings.',
    language: 'python',
    code: `user = "Alex"\nage = 22\ngpa = 3.85\nprint(f"User: {user}, Age: {age}, GPA: {gpa}")`,
    keyFocus: ['=', '"', '{', '}', ':', '.'],
    explanation: [
      {
        heading: 'Variable Assignment (=)',
        body: 'In Python, `=` assigns the value on the right to the variable name on the left. Type `=` using your Right Pinky.',
        lineRange: [1, 3],
      },
      {
        heading: 'F-Strings for String Formatting',
        body: 'Prefixing a string with `f` allows embedding variables inside `{` and `}` directly within the string.',
        lineRange: [4, 4],
      },
      {
        heading: 'Touch-Typing Curly Braces',
        body: 'Curly braces `{` and `}` are typed by pressing `[` or `]` with your Right Pinky while holding Left Shift with your Left Pinky.',
        lineRange: [4, 4],
      },
    ],
    expectedOutput: `User: Alex, Age: 22, GPA: 3.85`,
  },
  {
    id: 'py-03',
    number: 3,
    title: 'Conditionals & Indentation',
    description: 'Master colons, tabs, comparison operators, and branching logic.',
    language: 'python',
    code: `score = 88\nif score >= 90:\n\tprint("Grade: A")\nelif score >= 80:\n\tprint("Grade: B")\nelse:\n\tprint("Grade: C")`,
    keyFocus: [':', '>', '=', '\t'],
    explanation: [
      {
        heading: 'Colons and Blocks (:)',
        body: 'In Python, control statements like `if`, `elif`, and `else` end with a colon `:`. Hit `:` with Right Pinky + Left Shift.',
        lineRange: [2, 6],
      },
      {
        heading: 'Indentation (Tab)',
        body: 'Python enforces blocks through whitespace indentation. Use your Left Pinky to tap `Tab` at the beginning of indented lines.',
        lineRange: [3, 7],
      },
      {
        heading: 'Comparison Operators (>=)',
        body: '`>=` checks if the left value is greater than or equal to the right. Fast typing comes from smooth Right Ring `>` then Right Pinky `=`.',
        lineRange: [2, 4],
      },
    ],
    expectedOutput: `Grade: B`,
  },
  {
    id: 'py-04',
    number: 4,
    title: 'For Loops & Lists',
    description: 'Iterate over collections with brackets and loop keywords.',
    language: 'python',
    code: `languages = ["Python", "C++", "Rust"]\nfor lang in languages:\n\tprint(f"I code in {lang}!")`,
    keyFocus: ['[', ']', ':', ',', '\t', '{', '}'],
    explanation: [
      {
        heading: 'Lists and Square Brackets ([])',
        body: 'Lists hold ordered items separated by commas `,`. Type `[` and `]` with your Right Pinky, commas with Right Middle.',
        lineRange: [1, 1],
      },
      {
        heading: 'For ... In Syntax',
        body: 'The `for ... in` loop iterates through each item in an iterable. Notice the colon `:` initiating the loop body.',
        lineRange: [2, 2],
      },
      {
        heading: 'Loop Body Execution',
        body: 'The indented `print()` runs once per element in the list, substituting `{lang}` with the current item.',
        lineRange: [3, 3],
      },
    ],
    expectedOutput: `I code in Python!\nI code in C++!\nI code in Rust!`,
  },
  {
    id: 'py-05',
    number: 5,
    title: 'Functions & Return Values',
    description: 'Define reusable functions with def, parameters, and return statements.',
    language: 'python',
    code: `def calculate_area(width, height):\n\tarea = width * height\n\treturn area\n\ntotal = calculate_area(7, 4)\nprint(f"Total Area: {total}")`,
    keyFocus: ['(', ')', ',', ':', '*', '\t', '_'],
    explanation: [
      {
        heading: 'Function Definition (def)',
        body: '`def` introduces a function name followed by parentheses containing parameters.',
        lineRange: [1, 1],
      },
      {
        heading: 'The Return Statement',
        body: '`return` sends back the calculated result to the caller, terminating function execution.',
        lineRange: [3, 3],
      },
      {
        heading: 'Calling the Function',
        body: 'Invoke the function by its name with arguments inside parentheses: `calculate_area(7, 4)`.',
        lineRange: [5, 6],
      },
    ],
    expectedOutput: `Total Area: 28`,
  },
];
