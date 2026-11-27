#!/usr/bin/env python3
"""
Dimasa AI Training Data Downloader
Fetches verified community translation pairs from Supabase (or local database)
and saves them as a standard JSONL dataset ready for fine-tuning.

Usage:
    python3 scripts/download_training_data.py
"""

import os
import json
import urllib.request
import urllib.error
from pathlib import Path

# Load config from environment or .env if present
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
OUTPUT_FILE = DATA_DIR / "dimasa_finetuning_dataset.jsonl"

def load_env_file():
    env_path = Path(__file__).resolve().parent.parent / "web" / ".env.local"
    if env_path.exists():
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

def fetch_from_supabase(supabase_url: str, supabase_anon_key: str):
    url = f"{supabase_url}/rest/v1/community_feed?status=eq.verified&select=*&order=upvotes.desc"
    headers = {
        "apikey": supabase_anon_key,
        "Authorization": f"Bearer {supabase_anon_key}",
        "Content-Type": "application/json"
    }

    req = urllib.request.Request(url, headers=headers, method="GET")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data
    except urllib.error.HTTPError as e:
        print(f"[!] Supabase HTTP Error {e.code}: {e.read().decode('utf-8')}")
        return None
    except Exception as e:
        print(f"[!] Connection Error: {e}")
        return None

def main():
    load_env_file()
    supabase_url = os.environ.get("VITE_SUPABASE_URL")
    supabase_key = os.environ.get("VITE_SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key:
        print("[-] Central cloud database credentials not found in environment.")
        print("    To fetch data directly from all community users across the world:")
        print("    1. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in 'web/.env.local'")
        print("       or run: export VITE_SUPABASE_URL='https://xxx.supabase.co' ...")
        print("\n[*] Checking local fallback storage in data/...")
        
        # Check if local wordbook phrases can be exported as base training pairs
        wordbook_path = DATA_DIR / "dimasa_wordbook.json"
        if wordbook_path.exists():
            with open(wordbook_path, "r", encoding="utf-8") as f:
                wb = json.load(f)
            
            phrases = [w for w in wb.get("words", []) if w.get("pos") == "PHRASE"]
            print(f"[+] Found {len(phrases)} base seed phrases from dictionary.")
            
            with open(OUTPUT_FILE, "w", encoding="utf-8") as f_out:
                for p in phrases:
                    entry = {
                        "messages": [
                            {"role": "user", "content": f"Translate to Dimasa: {p['english']}"},
                            {"role": "assistant", "content": p["dimasa"]}
                        ],
                        "metadata": {
                            "source": "Dimasa dictionary",
                            "category": p.get("category", "Phrases")
                        }
                    }
                    f_out.write(json.dumps(entry, ensure_ascii=False) + "\n")
            
            print(f"[✓] Exported base seed pairs to: {OUTPUT_FILE.relative_to(Path.cwd())}")
        return

    print(f"[*] Connecting to Supabase: {supabase_url}...")
    records = fetch_from_supabase(supabase_url, supabase_key)

    if not records:
        print("[-] No verified records found yet. Community submissions need 3+ approvals to be verified.")
        return

    print(f"[+] Successfully fetched {len(records)} verified community translation pairs!")

    count = 0
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f_out:
        for r in records:
            entry = {
                "messages": [
                    {"role": "user", "content": f"Translate to Dimasa: {r['english']}"},
                    {"role": "assistant", "content": r["dimasa_correction"]}
                ],
                "metadata": {
                    "contributor": r.get("author", "Community Contributor"),
                    "upvotes": r.get("upvotes", 0),
                    "created_at": r.get("created_at")
                }
            }
            f_out.write(json.dumps(entry, ensure_ascii=False) + "\n")
            count += 1

    print(f"[✓] Exported {count} clean training pairs to: {OUTPUT_FILE.name}")
    print(f"    File path: {OUTPUT_FILE}")
    print("    Ready to upload into Google AI Studio (Gemini) or Unsloth/HuggingFace (Llama/Gemma)!")

if __name__ == "__main__":
    main()
