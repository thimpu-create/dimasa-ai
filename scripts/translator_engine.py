#!/usr/bin/env python3
"""
Dimasa AI Hybrid Translator Engine
Combines seed dictionary lookup, Dimasa SOV grammar rules, and LLM few-shot grounding.
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, Any, List

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

try:
    from google import genai
except ImportError:
    genai = None

def load_data():
    dict_file = DATA_DIR / "dimasa_wordbook.json"
    rules_file = DATA_DIR / "grammar_rules.json"
    
    wordbook = {}
    if dict_file.exists():
        with open(dict_file, "r", encoding="utf-8") as f:
            wordbook = json.load(f)
            
    rules = {}
    if rules_file.exists():
        with open(rules_file, "r", encoding="utf-8") as f:
            rules = json.load(f)
            
    return wordbook, rules

class DimasaTranslator:
    def __init__(self, api_key: str = None):
        self.wordbook, self.rules = load_data()
        self.words = self.wordbook.get("words", [])
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")
        self.client = None
        if self.api_key and genai:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[!] Warning: Could not initialize Gemini client: {e}")

    def lookup_keywords(self, english_text: str) -> List[Dict[str, str]]:
        """Finds any vocabulary entries matching tokens in the English input."""
        tokens = re.findall(r"\b\w+\b", english_text.lower())
        matched = []
        seen = set()

        def stems(word):
            variants = {word}
            if word.endswith("s") and len(word) > 2:
                variants.add(word[:-1])
            if word.endswith("es") and len(word) > 3:
                variants.add(word[:-2])
            if word.endswith("ing") and len(word) > 4:
                variants.add(word[:-3])
            if word.endswith("ed") and len(word) > 3:
                variants.add(word[:-2])
                variants.add(word[:-1])
            return variants

        for token in tokens:
            token_variants = stems(token)
            for item in self.words:
                eng_variants = set(re.findall(r"\b\w+\b", item.get("english", "").lower()))
                if token_variants & eng_variants:
                    dim = item["dimasa"]
                    if dim not in seen:
                        seen.add(dim)
                        matched.append(item)
        return matched

    def rule_based_translate(self, english_text: str, matched_words: List[Dict[str, str]]) -> Dict[str, Any]:
        """Deterministic grammar-guided fallback when LLM is unavailable."""
        text = english_text.strip().lower()

        # Check for phrase matches
        for item in self.words:
            if item.get("pos") == "PHRASE":
                if item["english"].lower() in text or text in item["english"].lower():
                    return {
                        "translation": item["dimasa"],
                        "method": "exact_phrase_match",
                        "matched_vocabulary": [item],
                        "notes": f"Exact phrase match from word book: '{item['english']}'"
                    }

        # Rule-based SOV assembly
        subject = None
        obj = None
        verb = None

        for item in matched_words:
            pos = item.get("pos")
            if pos == "PRON" and not subject:
                subject = item["dimasa"]
            elif pos == "VERB" and not verb:
                verb = item["dimasa"]
            elif pos in ("NOUN", "ADJ") and not obj:
                obj = item["dimasa"]

        parts = []
        if subject:
            parts.append(subject)
        if obj:
            parts.append(obj)
        if verb:
            # Add continuous/present suffix if "is ...ing" or "am ...ing"
            if "ing" in text or "am" in text or "is" in text or "are" in text:
                parts.append(verb + "du")
            elif "will" in text or "shall" in text:
                parts.append(verb + "nang")
            elif "ed" in text or "did" in text or "went" in text or "ate" in text:
                parts.append(verb + "ba")
            else:
                parts.append(verb)

        if parts:
            assembled = " ".join(parts).capitalize()
            return {
                "translation": assembled,
                "method": "rule_based_sov",
                "matched_vocabulary": matched_words,
                "notes": "Generated using Dimasa SOV (Subject-Object-Verb) grammar heuristics."
            }

        # If no grammar parts parsed, list matched words
        if matched_words:
            return {
                "translation": " / ".join([w["dimasa"] for w in matched_words]),
                "method": "vocabulary_lookup",
                "matched_vocabulary": matched_words,
                "notes": "Direct vocabulary matches."
            }

        return {
            "translation": "(Translation draft needed - please provide community suggestion)",
            "method": "unknown",
            "matched_vocabulary": [],
            "notes": "No words in local dictionary matched."
        }

    def translate(self, english_text: str) -> Dict[str, Any]:
        matched = self.lookup_keywords(english_text)

        # If Gemini client is active, use LLM with grounded prompt
        if self.client:
            try:
                vocab_context = "\n".join([
                    f"- {w['english']} -> Dimasa: {w['dimasa']} ({w.get('category', 'General')})"
                    for w in matched
                ])
                prompt = f"""You are a specialized translator from English to Dimasa (a Tibeto-Burman language).
Translate the following English sentence into natural, grammatically correct Dimasa using the Latin/Roman script.

Dimasa Grammatical Rules:
1. Word order is STRICTLY SOV (Subject - Object - Verb). The verb must come at the end.
2. Present continuous / present habitual suffix: -du (e.g. thangdu = going, jadu = eating, longdu = drinking).
3. Past tense suffix: -ba (e.g. thangba = went, jaba = ate).
4. Future tense suffix: -nang (e.g. thangnang = will go).
5. Accusative/object marker: -ke (e.g. angke = me, ningke = you).
6. Genitive/possessive marker: -ni (e.g. ani = my, nini = your, boni = his).
7. Locative marker: -ha (e.g. noha = at home).

Verified Reference Vocabulary:
{vocab_context if vocab_context else "None available, adhere strictly to Dimasa morphology."}

English sentence to translate: "{english_text}"

Respond with ONLY the Dimasa translation in Roman script, followed on a new line by a brief 1-sentence breakdown of the grammar."""

                response = self.client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                output_lines = [line.strip() for line in response.text.strip().split("\n") if line.strip()]
                translation = output_lines[0]
                explanation = output_lines[1] if len(output_lines) > 1 else "AI-grounded translation."

                return {
                    "translation": translation,
                    "method": "gemini_llm_grounded",
                    "matched_vocabulary": matched,
                    "notes": explanation
                }
            except Exception as e:
                # Fall back to rule based
                res = self.rule_based_translate(english_text, matched)
                res["notes"] += f" (LLM query error: {e})"
                return res

        return self.rule_based_translate(english_text, matched)

if __name__ == "__main__":
    import sys
    test_query = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "I am drinking water"
    translator = DimasaTranslator()
    result = translator.translate(test_query)
    print(json.dumps(result, indent=2, ensure_ascii=False))
