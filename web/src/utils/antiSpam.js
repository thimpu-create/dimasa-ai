/**
 * Anti-Spam & Bot Protection Utility
 * Protects community submissions without adding friction for human native speakers.
 */

// 1. Generate or retrieve persistent anonymous device/contributor ID
export function getOrCreateDeviceId() {
  let deviceId = localStorage.getItem('dimasa_device_id');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    localStorage.setItem('dimasa_device_id', deviceId);
  }
  return deviceId;
}

// 2. Validate translation text against spam heuristics
export function validateSubmissionText(text) {
  if (!text || typeof text !== 'string') {
    return { valid: false, reason: "Translation cannot be empty." };
  }

  const clean = text.trim();

  // Length checks
  if (clean.length < 2) {
    return { valid: false, reason: "Translation is too short (minimum 2 characters)." };
  }
  if (clean.length > 300) {
    return { valid: false, reason: "Translation exceeds maximum allowed length (300 characters)." };
  }

  // URL / Link injection check
  const urlPattern = /(https?:\/\/|www\.|\.com|\.org|\.net|\.xyz|\.io|bit\.ly|t\.me)/i;
  if (urlPattern.test(clean)) {
    return { valid: false, reason: "Links and URLs are not permitted in translations." };
  }

  // Repetitive character spam (e.g., 'aaaaaa', 'xxxxxx', '111111')
  const repetitivePattern = /(.)\1{5,}/;
  if (repetitivePattern.test(clean)) {
    return { valid: false, reason: "Repeated character spam detected." };
  }

  // HTML / Script injection check
  if (/<[^>]*>|javascript:|data:/i.test(clean)) {
    return { valid: false, reason: "Invalid script or HTML characters detected." };
  }

  return { valid: true };
}

// 3. Rate limiter & Timing protection (Bots submit instantaneously; humans take at least 1.5s)
const SUBMISSION_TIMESTAMPS_KEY = 'dimasa_submission_timestamps';
const MIN_HUMAN_INTERACTION_MS = 1500; // 1.5 seconds minimum to read & type

export function checkSubmissionSpeed(cardRenderTime) {
  const elapsed = Date.now() - cardRenderTime;
  if (elapsed < MIN_HUMAN_INTERACTION_MS) {
    return { allowed: false, reason: "Submission too rapid. Please take a moment to type naturally." };
  }
  return { allowed: true };
}

export function checkRateLimit() {
  const now = Date.now();
  let timestamps = [];
  try {
    const raw = localStorage.getItem(SUBMISSION_TIMESTAMPS_KEY);
    timestamps = raw ? JSON.parse(raw) : [];
  } catch {
    timestamps = [];
  }

  // Filter timestamps within the last 60 seconds
  timestamps = timestamps.filter(t => now - t < 60000);

  // Maximum 12 submissions per minute per device (prevents rapid script flood)
  if (timestamps.length >= 12) {
    return { allowed: false, reason: "Rate limit reached (max 12 sentences per minute). Please wait a few seconds." };
  }

  // Record this submission
  timestamps.push(now);
  localStorage.setItem(SUBMISSION_TIMESTAMPS_KEY, JSON.stringify(timestamps));
  return { allowed: true };
}
