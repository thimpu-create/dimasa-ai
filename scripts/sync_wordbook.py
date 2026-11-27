#!/usr/bin/env python3
"""
Sync Dimasa Lexicon & Grammar between Python JSON files and Web JS files.
Usage:
  python3 scripts/sync_wordbook.py --to-web    # syncs data/*.json -> web/src/data/dimasa_wordbook.js
  python3 scripts/sync_wordbook.py --to-json   # syncs web/src/data/dimasa_wordbook.js -> data/*.json
"""
import json
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
WEB_DATA_FILE = os.path.join(BASE_DIR, 'web', 'src', 'data', 'dimasa_wordbook.js')
JSON_WORDBOOK = os.path.join(DATA_DIR, 'dimasa_wordbook.json')
JSON_GRAMMAR = os.path.join(DATA_DIR, 'grammar_rules.json')

def sync_to_web():
    with open(JSON_WORDBOOK, 'r', encoding='utf-8') as f:
        wb = json.load(f)
    with open(JSON_GRAMMAR, 'r', encoding='utf-8') as f:
        gr = json.load(f)

    content = f"// Auto-synced Dimasa Word Book & Grammar Data\n"
    content += f"export const wordbook = {json.dumps(wb, indent=2, ensure_ascii=False)};\n"
    content += f"export const grammarRules = {json.dumps(gr, indent=2, ensure_ascii=False)};\n"

    with open(WEB_DATA_FILE, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[✓] Successfully synced {len(wb.get('words', []))} words from JSON -> web/src/data/dimasa_wordbook.js")

def sync_to_json():
    # Read web JS file
    with open(WEB_DATA_FILE, 'r', encoding='utf-8') as f:
        code = f.read()

    # Extract wordbook
    wb_idx = code.find('export const wordbook =')
    gr_idx = code.find('export const grammarRules =')
    if wb_idx == -1 or gr_idx == -1:
        print("[!] Could not parse web/src/data/dimasa_wordbook.js")
        return

    wb_str = code[wb_idx + len('export const wordbook ='):gr_idx].strip().rstrip(';')
    gr_str = code[gr_idx + len('export const grammarRules ='):].strip().rstrip(';')

    wb = json.loads(wb_str)
    gr = json.loads(gr_str)

    with open(JSON_WORDBOOK, 'w', encoding='utf-8') as f:
        json.dump(wb, f, indent=2, ensure_ascii=False)
    with open(JSON_GRAMMAR, 'w', encoding='utf-8') as f:
        json.dump(gr, f, indent=2, ensure_ascii=False)
    print(f"[✓] Successfully synced from web JS -> data/dimasa_wordbook.json & data/grammar_rules.json")

if __name__ == '__main__':
    mode = sys.argv[1] if len(sys.argv) > 1 else '--to-web'
    if mode == '--to-json':
        sync_to_json()
    else:
        sync_to_web()
