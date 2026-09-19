import { ExplanationBlock, Lesson } from '../types';

/**
 * Cleans concept block headings by removing code syntax clutter,
 * symbol brackets, and markdown tags so TTS announces them naturally.
 */
export function cleanHeading(heading: string): string {
  if (!heading) return '';
  return heading
    .replace(/\s*\([^)]*\)\s*$/g, '') // remove trailing parenthesized symbols like (<<), (;), (#include <iostream>), (def)
    .replace(/\(\)/g, '')
    .replace(/C\+\+/g, 'C plus plus')
    .replace(/&/g, 'and')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Transforms code explanations into natural, engaging, human-sounding
 * spoken explanations suitable for text-to-speech.
 */
export function formatSpeechText(rawText: string): string {
  if (!rawText) return '';

  let text = rawText;

  // Preserve C++ as C plus plus first before any other replacements
  text = text.replace(/C\+\+/g, 'C plus plus');

  // Redundant syntax phrases cleanup
  text = text.replace(/double quotes\s*[`"']?"[`"']?/gi, 'double quotes');
  text = text.replace(/single quotes\s*[`"']?'[`"']?/gi, 'single quotes');
  text = text.replace(/double quotes\s*or\s*single quotes\s*[`"']?['"][^`]*`/gi, 'double quotes or single quotes');
  text = text.replace(/inside\s+angle\s+brackets\s*[`"']?<>[`"']?/gi, 'inside angle brackets');

  // Backtick-wrapped symbol replacements (must run BEFORE stripping backticks)
  text = text.replace(/`"`/g, 'double quote');
  text = text.replace(/`'`/g, 'single quote');
  text = text.replace(/`;`/g, 'semicolon');
  text = text.replace(/`:`/g, 'colon');
  text = text.replace(/`=`/g, 'equals sign');
  text = text.replace(/`Tab`/gi, 'the Tab key');

  // Strip markdown formatting
  text = text.replace(/`([^`]+)`/g, '$1');
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/#+\s*/g, '');

  // Conversationalize keyboard finger instructions
  text = text.replace(/\(Right Pinky\)/gi, 'with your right pinky finger');
  text = text.replace(/\(Left Pinky\)/gi, 'with your left pinky finger');
  text = text.replace(/using\s+your\s+Right Pinky/gi, 'using your right pinky finger');
  text = text.replace(/using\s+your\s+Left Pinky/gi, 'using your left pinky finger');
  text = text.replace(/using\s+your\s+Right Ring/gi, 'using your right ring finger');
  text = text.replace(/using\s+your\s+Left Ring/gi, 'using your left ring finger');
  text = text.replace(/using\s+your\s+Right Middle/gi, 'using your right middle finger');
  text = text.replace(/using\s+your\s+Left Middle/gi, 'using your left middle finger');
  text = text.replace(/using\s+your\s+Right Index/gi, 'using your right index finger');
  text = text.replace(/using\s+your\s+Left Index/gi, 'using your left index finger');

  text = text.replace(/Right Pinky \+ Left Shift/gi, 'your right pinky while holding left shift');
  text = text.replace(/Left Pinky \+ Right Shift/gi, 'your left pinky while holding right shift');
  text = text.replace(/Right Pinky/gi, 'your right pinky finger');
  text = text.replace(/Left Pinky/gi, 'your left pinky finger');
  text = text.replace(/Right Ring(?: finger)?/gi, 'your right ring finger');
  text = text.replace(/Left Ring(?: finger)?/gi, 'your left ring finger');
  text = text.replace(/Right Middle(?: finger)?/gi, 'your right middle finger');
  text = text.replace(/Left Middle(?: finger)?/gi, 'your left middle finger');
  text = text.replace(/Right Index(?: finger)?/gi, 'your right index finger');
  text = text.replace(/Left Index(?: finger)?/gi, 'your left index finger');

  // Avoid "finger finger" or "your your"
  text = text.replace(/finger\s+finger/gi, 'finger');
  text = text.replace(/your\s+your/gi, 'your');

  // Programming syntax to spoken English
  text = text.replace(/#include\s+<iostream>/gi, 'we include the input output stream library');
  text = text.replace(/#include\s+<([^>]+)>/gi, 'we include the $1 library header');
  text = text.replace(/#include/gi, 'the include directive');
  text = text.replace(/using\s+namespace\s+std;/gi, 'using namespace standard');
  text = text.replace(/cout\s*<<\s*["']([^"']*)["']\s*<<\s*endl;/gi, 'we use cout to print "$1" followed by end line');
  text = text.replace(/cout\s*<</gi, 'cout');
  text = text.replace(/cin\s*>>/gi, 'cin');
  text = text.replace(/std::/gi, 'standard namespace ');
  text = text.replace(/endl\s*;/gi, 'end line');
  text = text.replace(/endl/gi, 'end line');
  text = text.replace(/print\s*\(\s*f["']([^"']*)["']\s*\)/gi, 'the print function with an f-string formatting "$1"');
  text = text.replace(/print\s*\(\s*["']([^"']*)["']\s*\)/gi, 'the print function outputting "$1"');
  text = text.replace(/print\s*\(\)/gi, 'the print function');
  text = text.replace(/def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\):/gi, 'defining the function $1 taking $2');
  text = text.replace(/int\s+main\s*\(\)/gi, 'the main entry function');
  text = text.replace(/main\(\)/gi, 'the main function');
  text = text.replace(/TreeNode\*/gi, 'Tree Node pointer');
  text = text.replace(/nullptr/gi, 'null pointer');

  text = text.replace(/<>/gi, 'angle brackets');
  text = text.replace(/->/gi, ' arrow pointer ');
  text = text.replace(/::/gi, ' scope resolution ');
  text = text.replace(/==/gi, ' equals ');
  text = text.replace(/!=/gi, ' does not equal ');
  text = text.replace(/>=/gi, ' is greater than or equal to ');
  text = text.replace(/<=/gi, ' is less than or equal to ');
  text = text.replace(/\+\+/gi, ' increment operator ');
  text = text.replace(/--/gi, ' decrement operator ');

  // Symbols when mentioned as pairs or syntax
  text = text.replace(/\bbetween\s+[`"']?<[`"']?\s+and\s+[`"']?>[`"']?/gi, 'between angle brackets');
  text = text.replace(/[`"']?<[`"']?\s+and\s+[`"']?>[`"']?/gi, 'less-than and greater-than symbols');
  text = text.replace(/[`"']?\([`"']?\s+and\s+[`"']?\)[`"']?/gi, 'opening and closing parentheses');
  text = text.replace(/[`"']?\{[`"']?\s+and\s+[`"']?\}[`"']?/gi, 'opening and closing curly braces');
  text = text.replace(/[`"']?\[[`"']?\s+and\s+[`"']?\][`"']?/gi, 'opening and closing square brackets');

  // Standalone symbol references in explanations
  text = text.replace(/for\s+[`"']?\([`"']?/gi, 'for the opening parenthesis');
  text = text.replace(/for\s+[`"']?\)[`"']?/gi, 'for the closing parenthesis');
  text = text.replace(/for\s+[`"']?\{[`"']?/gi, 'for the opening curly brace');
  text = text.replace(/for\s+[`"']?\}[`"']?/gi, 'for the closing curly brace');
  text = text.replace(/for\s+[`"']?\[[`"']?/gi, 'for the opening square bracket');
  text = text.replace(/for\s+[`"']?\][`"']?/gi, 'for the closing square bracket');
  text = text.replace(/Type\s+[`"']?<[`"']?/gi, 'Type the less-than symbol');
  text = text.replace(/Type\s+[`"']?>[`"']?/gi, 'Type the greater-than symbol');
  text = text.replace(/Type\s+[`"']?=[`"']?/gi, 'Type the equals sign');
  text = text.replace(/Type\s+[`"']?:[`"']?/gi, 'Type the colon');
  text = text.replace(/Hit\s+[`"']?:[`"']?/gi, 'Press the colon');
  text = text.replace(/Hit\s+[`"']?;[`"']?/gi, 'Press the semicolon');

  // Semicolon & colon mentions
  text = text.replace(/with a semicolon ;\.?/gi, 'with a semicolon.');
  text = text.replace(/with a colon :\.?/gi, 'with a colon.');

  text = text.replace(/&/g, ' and ');
  text = text.replace(/;\s*/g, ', ');
  text = text.replace(/f-string/gi, 'formatted string');

  // Strip line indicators L1, L1-L2
  text = text.replace(/\bL\d+(?:-L\d+)?\b/g, '');

  // Strip leftover backticks and bracket artifacts
  text = text.replace(/`/g, '');
  text = text.replace(/\(\)/g, ' parentheses ');
  text = text.replace(/\{\}/g, ' curly braces ');
  text = text.replace(/\[\]/g, ' square brackets ');

  // Fix punctuation artifacts
  text = text.replace(/,\./g, '.');
  text = text.replace(/,+/g, ',');
  text = text.replace(/\.+/g, '.');
  text = text.replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();

  return text;
}

/**
 * Builds a natural, engaging verbal lecture for an entire lesson
 */
export function buildLessonNarration(lesson: Lesson): string {
  const cleanTitle = cleanHeading(lesson.title);
  const cleanDesc = formatSpeechText(lesson.description).toLowerCase().replace(/\.$/, '');
  const intro = `Welcome to Lesson ${lesson.number > 0 ? lesson.number : ''}: ${cleanTitle}. In this lesson, we will ${cleanDesc}. Here is how this code works:`;

  const transitions = [
    'First',
    'Next',
    'Then',
    'Additionally',
    'Finally',
  ];

  const bodyParts = lesson.explanation.map((block, idx) => {
    const headingClean = cleanHeading(block.heading);
    const bodyClean = formatSpeechText(block.body);
    const transition = idx < transitions.length ? transitions[idx] : 'Also';
    return `${transition}, regarding ${headingClean}: ${bodyClean}`;
  });

  const outro = `Now, practice typing this code on your keyboard to build muscle memory.`;

  return `${intro} ${bodyParts.join(' ')} ${outro}`;
}

/**
 * Builds a natural explanation for a single concept block
 */
export function buildBlockNarration(block: ExplanationBlock): string {
  const headingClean = cleanHeading(block.heading);
  const bodyClean = formatSpeechText(block.body);
  return `Regarding ${headingClean}: ${bodyClean}`;
}
