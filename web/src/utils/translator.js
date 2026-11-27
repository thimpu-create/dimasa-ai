import { wordbook, grammarRules } from '../data/dimasa_wordbook';

// Stemming helper
function getStems(word) {
  const set = new Set([word]);
  if (word.endsWith('s') && word.length > 2) set.add(word.slice(0, -1));
  if (word.endsWith('es') && word.length > 3) set.add(word.slice(0, -2));
  if (word.endsWith('ing') && word.length > 4) set.add(word.slice(0, -3));
  if (word.endsWith('ed') && word.length > 3) {
    set.add(word.slice(0, -2));
    set.add(word.slice(0, -1));
  }
  return set;
}

export function findMatchingVocabulary(englishText) {
  const stopWords = new Set(['is', 'are', 'am', 'the', 'a', 'an', 'to', 'for', 'of', 'in', 'on', 'at']);
  const tokens = (englishText.toLowerCase().match(/\b[a-z0-9']+\b/g) || [])
    .filter(t => !stopWords.has(t) && t.length > 1);
  
  const matched = [];
  const seen = new Set();

  tokens.forEach(tok => {
    const variants = getStems(tok);
    wordbook.words.forEach(item => {
      // Exclude multi-word phrase entries from keyword chips
      if (item.pos === 'PHRASE' || (item.english && item.english.includes(' '))) return;

      const engWords = (item.english || '').toLowerCase().match(/\b[a-z0-9']+\b/g) || [];
      const hasMatch = engWords.some(w => variants.has(w));
      if (hasMatch && !seen.has(item.dimasa)) {
        seen.add(item.dimasa);
        matched.push(item);
      }
    });
  });

  return matched.slice(0, 4);
}

export function ruleBasedTranslate(englishText) {
  const clean = englishText.trim().toLowerCase();
  if (!clean) return { translation: '', method: 'empty', matched: [] };

  // 1. Check exact phrase match
  for (const item of wordbook.words) {
    if (item.pos === 'PHRASE') {
      const pEng = (item.english || '').toLowerCase();
      if (pEng === clean || pEng.includes(clean) || clean.includes(pEng)) {
        return {
          translation: item.dimasa,
          ipa: item.ipa,
          method: 'Exact Phrase Match',
          matched: [item],
          explanation: `Direct match from Dimasa Word Book ("${item.english}")`
        };
      }
    }
  }

  // 2. Keyword matching
  const matched = findMatchingVocabulary(clean);

  // 3. SOV Assembly
  let subject = null;
  let obj = null;
  let verb = null;

  matched.forEach(item => {
    if (item.pos === 'PRON' && !subject) {
      subject = item.dimasa;
    } else if (item.pos === 'VERB' && !verb) {
      verb = item.dimasa;
    } else if (['NOUN', 'ADJ', 'Animals', 'Natural Objects', 'House', 'Foods'].includes(item.category) && !obj) {
      obj = item.dimasa;
    }
  });

  const parts = [];
  if (subject) parts.push(subject);
  if (obj && obj !== subject) parts.push(obj);
  
  if (verb) {
    let conjugated = verb;
    if (clean.includes('ing') || clean.includes('am ') || clean.includes('is ') || clean.includes('are ')) {
      conjugated += 'du'; // present continuous
    } else if (clean.includes('will') || clean.includes('shall')) {
      conjugated += 'nang'; // future
    } else if (clean.includes('ed') || clean.includes('did') || clean.includes('yesterday') || clean.includes('went') || clean.includes('ate')) {
      conjugated += 'ba'; // past
    } else if (clean.includes('please') || clean.startsWith('do ') || clean.startsWith('go ')) {
      conjugated += 'bo'; // imperative
    }
    parts.push(conjugated);
  }

  if (parts.length > 0) {
    const sentence = parts.join(' ');
    const capitalized = sentence.charAt(0).toUpperCase() + sentence.slice(1);
    return {
      translation: capitalized,
      method: 'Rule-Based SOV Synthesizer',
      matched,
      explanation: 'Synthesized using verified Dimasa Subject-Object-Verb (SOV) order and tense markers.'
    };
  }

  // Direct word listing if no full sentence structure
  if (matched.length > 0) {
    return {
      translation: matched.map(m => m.dimasa).join(' / '),
      method: 'Vocabulary Match',
      matched,
      explanation: 'Matched individual dictionary words.'
    };
  }

  return {
    translation: 'Dimasa translation draft needed',
    method: 'Untranslated',
    matched: [],
    explanation: 'No direct word book entries matched. You can be the first to contribute this translation!'
  };
}

export async function translateWithGemini(englishText, apiKey) {
  const matched = findMatchingVocabulary(englishText);
  const vocabContext = matched.map(m => `- ${m.english} => ${m.dimasa} (${m.category || 'Word'})`).join('\n');

  const prompt = `You are a specialist Dimasa language translator.
Translate this English text into natural Dimasa using the Latin/Roman script.

Dimasa Grammatical Rules:
- STRICT Word Order: SOV (Subject - Object - Verb).
- Tense suffixes: -du (present continuous/habitual), -ba (past), -nang (future), -bo (imperative).
- Case suffixes: -ke (accusative object), -ni (genitive/possessive), -ha (locative/dative).

Reference Vocabulary from Dimasa Word Book:
${vocabContext || 'Adhere strictly to standard Dimasa morphology and vocabulary.'}

English: "${englishText}"

Respond ONLY with valid JSON in this exact format:
{
  "translation": "Dimasa translated text here",
  "explanation": "Brief explanation of grammatical choices"
}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(rawText);

  return {
    translation: parsed.translation,
    method: 'Gemini 2.5 Flash Neural Translator',
    matched,
    explanation: parsed.explanation || 'Translated by Gemini with Dimasa dictionary grounding.'
  };
}
