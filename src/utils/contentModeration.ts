// Content moderation and filtering utilities

// List of inappropriate words/phrases (basic filter)
const INAPPROPRIATE_WORDS = [
  // Offensive language (keep it basic for demo)
  'fuck', 'shit', 'damn', 'bitch', 'bastard', 'asshole', 'ass', 'hell',
  'pork', 'dick', 'cock', 'pussy', 'cunt', 'fag', 'retard', 'slut', 'whore',
  // Discriminatory terms
  'racist', 'sexist', 'hate', 'nazi', 'terrorist',
  // Suspicious/scam related
  'password', 'credit card', 'bank account', 'ssn', 'social security',
  'send money', 'wire transfer', 'bitcoin', 'cryptocurrency', 'paypal', 'venmo',
  // Inappropriate content
  'nude', 'naked', 'sex', 'porn', 'xxx',
];

// Patterns that might indicate scams or inappropriate requests
const SUSPICIOUS_PATTERNS = [
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/i, // Phone numbers
  /\b\d{3}[-]?\d{2}[-]?\d{4}\b/i, // SSN pattern
  /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/i, // Credit card pattern
  /(?:meet\s+(?:me|up)|come\s+(?:over|to))\s+(?:my|your)\s+(?:place|room|apartment)/i, // Inappropriate meeting requests
  /give\s+(?:me|you)\s+(?:your|my)\s+(?:number|address|location)/i, // Personal info requests
];

export interface ModerationResult {
  isClean: boolean;
  reason?: string;
  flaggedWords?: string[];
  severity: 'clean' | 'blocked';
}

/**
 * Check if content contains inappropriate or suspicious content
 */
export function moderateContent(content: string): ModerationResult {
  const lowerContent = content.toLowerCase();
  const flaggedWords: string[] = [];
  
  // Check for inappropriate words
  for (const word of INAPPROPRIATE_WORDS) {
    // Use word boundaries to match whole words
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lowerContent)) {
      flaggedWords.push(word);
    }
  }
  
  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(content)) {
      return {
        isClean: false,
        reason: 'Message contains suspicious content (potential scam or inappropriate request)',
        severity: 'blocked',
      };
    }
  }
  
  // If any inappropriate words found - BLOCK immediately
  if (flaggedWords.length > 0) {
    return {
      isClean: false,
      reason: 'Message contains inappropriate language',
      flaggedWords,
      severity: 'blocked',
    };
  }
  
  return {
    isClean: true,
    severity: 'clean',
  };
}

/**
 * Filter and replace inappropriate words with asterisks
 */
export function filterContent(content: string): string {
  let filtered = content;
  
  for (const word of INAPPROPRIATE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filtered = filtered.replace(regex, (match) => '*'.repeat(match.length));
  }
  
  return filtered;
}

/**
 * Check if a message should be blocked entirely
 */
export function shouldBlockMessage(content: string): boolean {
  const result = moderateContent(content);
  return result.severity === 'blocked';
}

/**
 * Get a user-friendly message for why content was flagged
 */
export function getModerationMessage(result: ModerationResult): string {
  if (result.severity === 'blocked') {
    return '⚠️ This message cannot be sent as it contains inappropriate or offensive content. Please be respectful.';
  }
  
  return '';
}