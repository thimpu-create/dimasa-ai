#!/usr/bin/env python3
"""
Dimasa Wordbook Digitalizer
Extracts dictionary entries from the Dimasa Word Book using Gemini Vision.

Usage:
    export GEMINI_API_KEY="your-api-key"
    python3 scripts/extract_wordbook.py --start-page 20 --end-page 30
"""

import os
import sys
import json
import argparse
import subprocess
from pathlib import Path

# Optional Google GenAI SDK
try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
# Automatically find any source PDF in workspace
pdf_files = list(Path(__file__).resolve().parent.parent.glob("*.pdf"))
PDF_FILE = pdf_files[0] if pdf_files else Path(__file__).resolve().parent.parent / "dimasa_word_book.pdf"
WORDBOOK_JSON = DATA_DIR / "dimasa_wordbook.json"

EXTRACTION_PROMPT = """
You are an expert linguist transcribing a page from the 'Dimasa Word Book'.
Examine the image carefully. Extract all dictionary entries visible on the page.

Return ONLY a valid JSON array of objects with the following schema:
[
  {
    "dimasa": "dimasa word in Latin/Roman orthography",
    "ipa": "phonetic IPA transcription if visible, or null",
    "english": "English gloss / definition",
    "category": "Section or category name if visible, e.g. Animals, Body Parts, Verbs, etc.",
    "pos": "Part of speech (NOUN, VERB, ADJ, ADV, PRON, NUM, PHRASE)"
  }
]
Do not wrap in markdown quotes. Output ONLY the raw JSON array.
"""

def extract_page_as_image(pdf_path: Path, page_num: int, output_dir: Path) -> Path:
    output_prefix = output_dir / f"page_{page_num}"
    cmd = [
        "pdfimages",
        "-f", str(page_num),
        "-l", str(page_num),
        "-png",
        str(pdf_path),
        str(output_prefix)
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Find generated png
    generated_pngs = sorted(output_dir.glob(f"page_{page_num}-*.png"))
    if not generated_pngs:
        raise FileNotFoundError(f"Failed to extract image for page {page_num}")
    return generated_pngs[0]

def main():
    parser = argparse.ArgumentParser(description="Extract Dimasa dictionary pages to JSON")
    parser.add_argument("--start-page", type=int, default=25, help="Start PDF page (default 25)")
    parser.add_argument("--end-page", type=int, default=26, help="End PDF page (inclusive)")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("[!] GEMINI_API_KEY environment variable not set.")
        print("    Please run: export GEMINI_API_KEY='your-key'")
        sys.exit(1)

    if genai is None:
        print("[!] google-genai library not installed. Install with: pip install google-genai")
        sys.exit(1)

    client = genai.Client(api_key=api_key)
    tmp_dir = Path("/tmp/dimasa_ocr")
    tmp_dir.mkdir(parents=True, exist_ok=True)

    # Load existing wordbook
    if WORDBOOK_JSON.exists():
        with open(WORDBOOK_JSON, "r", encoding="utf-8") as f:
            existing_data = json.load(f)
    else:
        existing_data = {"source": "Dimasa Word Book", "total_entries": 0, "words": []}

    known_words = {w["dimasa"].strip().lower() for w in existing_data.get("words", [])}
    new_entries = []

    print(f"[*] Processing pages {args.start_page} to {args.end_page} from {PDF_FILE.name}...")

    for page_num in range(args.start_page, args.end_page + 1):
        print(f" -> Extracting page {page_num}...")
        img_path = extract_page_as_image(PDF_FILE, page_num, tmp_dir)
        
        with open(img_path, "rb") as f:
            image_bytes = f.read()

        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
                    EXTRACTION_PROMPT
                ]
            )
            raw_text = response.text.strip()
            if raw_text.startswith("```"):
                raw_text = raw_text.strip("`").replace("json\n", "", 1).strip()
            
            entries = json.loads(raw_text)
            added_for_page = 0
            for item in entries:
                dim = item.get("dimasa", "").strip().lower()
                if dim and dim not in known_words:
                    known_words.add(dim)
                    existing_data["words"].append(item)
                    new_entries.append(item)
                    added_for_page += 1

            print(f"    [+] Extracted {len(entries)} words ({added_for_page} new).")
        except Exception as e:
            print(f"    [!] Error on page {page_num}: {e}")
        finally:
            if img_path.exists():
                img_path.unlink()

    existing_data["total_entries"] = len(existing_data["words"])
    with open(WORDBOOK_JSON, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, indent=2, ensure_ascii=False)

    print(f"[✓] Completed! Total dictionary entries now: {existing_data['total_entries']}")

if __name__ == "__main__":
    main()
