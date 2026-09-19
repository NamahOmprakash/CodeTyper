import { CoachingContext } from './types';
import { getFingerForChar } from '../../data/fingerMap';

export const COACH_SYSTEM_PROMPT = `You are a world-class coding and touch-typing tutor inside an interactive app called CodeTyper.
Your goal is to guide students to build physical muscle memory, proper finger placement, and coding fluency.

RULES:
1. Be concise: exactly 1 or 2 sentences max (under 40 words).
2. Be warm, observant, and actionable. Never talk down to the student.
3. Mention physical finger placement or keyboard layout when relevant (e.g. "Right Pinky", "Left Shift").
4. If code semantics are involved, briefly explain the syntax rule.
5. No markdown bold or headers, just plain conversational sentences ready to be read aloud or shown in a coach bubble.`;

export function buildCoachingPrompt(context: CoachingContext): string {
  const { language, lessonTitle, wpm, accuracy, mistakes, trigger, userQuestion } = context;

  const topMistake = mistakes[0];
  const finger = topMistake ? getFingerForChar(topMistake.char) : null;

  if (trigger === 'user_ask' && userQuestion) {
    return `The student is practicing ${language.toUpperCase()} lesson "${lessonTitle}" and asked: "${userQuestion}".
Current stats: ${wpm} WPM, ${accuracy}% accuracy.
Give a direct, friendly 1-2 sentence tip addressing their question.`;
  }

  if (trigger === 'lesson_complete') {
    return `The student just finished ${language.toUpperCase()} lesson "${lessonTitle}".
Stats: ${wpm} WPM, ${accuracy}% accuracy.
${topMistake ? `Their most frequent typo was '${topMistake.char}' (${topMistake.count} times).` : 'They had zero errors!'}
Give an encouraging 1-2 sentence final debrief and tip for their next lesson.`;
  }

  if (trigger === 'struggling') {
    return `The student's accuracy dropped to ${accuracy}% at ${wpm} WPM on lesson "${lessonTitle}".
Give a calm, centering 1-2 sentence tip on pacing and finding home row.`;
  }

  // Repeated mistake
  if (topMistake) {
    const wrong = topMistake.lastTyped[0];
    const mistakeDesc =
      topMistake.count > 1
        ? `They just repeatedly typed '${wrong}' instead of '${topMistake.char}' (${topMistake.count} times).`
        : `They just typed '${wrong}' instead of '${topMistake.char}'.`;
    return `The student is typing ${language.toUpperCase()} in lesson "${lessonTitle}".
${mistakeDesc}
${finger ? `Correct finger is ${finger.fingerLabel}${finger.shiftHand ? ` with ${finger.shiftHand === 'left' ? 'Left' : 'Right'} Shift` : ''}.` : ''}
${topMistake.wordContext ? `This occurred in the code token "${topMistake.wordContext}".` : ''}
${topMistake.category === 'adjacent_key' ? 'Note: These keys are adjacent on the keyboard.' : ''}
${topMistake.category === 'shift_missed' ? 'Note: The student missed holding the shift key.' : ''}
Give a 1-sentence physical tip on how to hit '${topMistake.char}' cleanly.`;
  }

  return `The student is typing ${language.toUpperCase()} at ${wpm} WPM and ${accuracy}% accuracy. Give a 1-sentence tip on maintaining typing cadence.`;
}
