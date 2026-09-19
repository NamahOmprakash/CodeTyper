import { CoachingContext, MistakePattern } from './types';
import { getFingerForChar } from '../../data/fingerMap';

export function getLocalCoaching(context: CoachingContext): string | null {
  const { mistakes, accuracy, wpm, trigger, userQuestion } = context;

  // If user explicitly asked a question
  if (trigger === 'user_ask' && userQuestion) {
    const q = userQuestion.toLowerCase();
    if (q.includes('finger') || q.includes('hand')) {
      const top = mistakes[0];
      if (top) {
        const finger = getFingerForChar(top.char);
        return `For '${top.char}', anchor your hands on the home row and reach with your ${finger.fingerLabel}.`;
      }
      return 'Keep your thumbs near the spacebar and rest your index fingers on F and J.';
    }
    if (q.includes('shift')) {
      return 'Hold the Shift key on the opposite hand: Left Shift for right-hand keys, Right Shift for left-hand keys.';
    }
    if (q.includes('speed') || q.includes('fast')) {
      return 'Speed comes from rhythm, not rushing. Slow down to 100% accuracy first; muscle memory will naturally accelerate.';
    }
    return `Focus on accuracy first. You're typing at ${wpm} WPM with ${accuracy}% accuracy. Keep a steady tempo!`;
  }

  // Streak celebration
  if (trigger === 'streak') {
    return 'Fantastic rhythm! You are completely in the groove 🎯';
  }

  // Struggling: accuracy fell below 75%
  if (trigger === 'struggling' && accuracy < 75) {
    return `Take a quick breath! Accuracy is ${accuracy}%. Pause for 1 second, locate the home row, and type with calm precision.`;
  }

  // Lesson complete review
  if (trigger === 'lesson_complete') {
    if (accuracy >= 95 && wpm >= 35) {
      return `Outstanding execution! ${wpm} WPM with ${accuracy}% accuracy. Your muscle memory for ${context.language === 'cpp' ? 'C++' : 'Python'} is sharp!`;
    }
    if (mistakes.length > 0) {
      const top = mistakes[0];
      const finger = getFingerForChar(top.char);
      return `Great practice! Next time, pay special attention to '${top.char}' (${finger.fingerLabel}) which tripped you up ${top.count} times.`;
    }
    return `Solid completion at ${wpm} WPM! Keep building your coding rhythm one keystroke at a time.`;
  }

  // Repeated mistakes analysis (highest priority for real-time coaching)
  if (mistakes.length > 0) {
    const top = mistakes[0];

    // Same char missed 2 or more times
    if (top.count >= 2) {
      const finger = getFingerForChar(top.char);

      if (top.category === 'shift_missed') {
        const shiftHand = finger.shiftHand === 'left' ? 'Left Shift' : 'Right Shift';
        return `Remember to hold ${shiftHand} firmly with your pinky before pressing '${top.char}' with your ${finger.fingerLabel}.`;
      }

      if (top.category === 'adjacent_key') {
        const wrongChar = top.lastTyped[0];
        return `You're hitting '${wrongChar}' instead of '${top.char}' — these are adjacent keys. Anchor on home row and reach with your ${finger.fingerLabel}.`;
      }

      if (top.category === 'bracket_confusion') {
        if (top.char === ')') {
          return "Closing parenthesis ')' is Shift+0 with your Right Pinky, not a curly bracket or square bracket.";
        }
        if (top.char === '(') {
          return "Opening parenthesis '(' is Shift+9 with your Right Ring finger.";
        }
        if (top.char === '}') {
          return "Closing curly brace '}' is Shift+] with your Right Pinky.";
        }
        if (top.char === '{') {
          return "Opening curly brace '{' is Shift+[ with your Right Pinky.";
        }
      }

      if (top.category === 'quotes_confusion') {
        return context.language === 'python'
          ? "Double quotes vs single quotes: Python accepts either, but match the exact quotes used in this lesson."
          : "In C++, use double quotes \" for string literals and single quotes ' for individual characters.";
      }

      if (top.wordContext) {
        return `Watch out on '${top.wordContext}' — slow down and think of '${top.char}' with your ${finger.fingerLabel}.`;
      }

      return `Target '${top.char}' with your ${finger.fingerLabel}. Take your time to build the right physical reflex.`;
    }
  }

  return null;
}
