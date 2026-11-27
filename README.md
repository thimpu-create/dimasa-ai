# Dimasa AI (Open Lingua Project) 🏔️

An open, community-powered English-to-Dimasa translator and human-in-the-loop validation platform designed to preserve and digitize the **Dimasa language** (a Tibeto-Burman language spoken by the Dimasa community).

---

## 👨‍💻 About the Creator & Project

- **Creator**: Software Developer & Architect
- **Portfolio**: [developerthimpu.online](https://developerthimpu.online)
- **Contact Email**: [developerthimpu@gmail.com](mailto:developerthimpu@gmail.com)

### 📚 Data Grounding & Provenance
The foundational seed vocabulary, phonetic transcriptions (IPA), and grammatical structures in this application are directly extracted and compiled from the **Dimasa dictionary** and linguistic survey records. The community platform acts as a human-in-the-loop validation mechanism to expand, correct, and modernize this data with authentic conversational speech.

---

## 🌟 What Has Been Built

### 1. Grounded Seed Knowledge & Grammar Rules (`data/`)
- **`data/dimasa_wordbook.json`**: Initial digitized database containing over 120+ authentic Dimasa words, IPA phonetics, English meanings, parts of speech, and semantic categories (Animals, Body Parts, Natural Objects, Food, Verbs, Numerals, Common Phrases) extracted from the Dimasa dictionary and linguistic records.
- **`data/grammar_rules.json`**: Codified Dimasa linguistic rules (Subject-Object-Verb word order, numeral classifiers `sao-`, `ma-`, `gong-`, case postpositions `-ke`, `-ni`, `-ha`, and tense suffixes `-du`, `-ba`, `-nang`, `-bo`).

### 2. Standalone Translation & Extraction Tools (`scripts/`)
- **`scripts/translator_engine.py`**: A hybrid translation engine combining stem-based vocabulary retrieval, Dimasa SOV grammatical synthesis, and optional Gemini LLM few-shot translation.
- **`scripts/extract_wordbook.py`**: Automated extraction pipeline using Gemini Vision to OCR and transcribe remaining pages from the Dimasa Word Book PDF into structured JSON.

### 3. Community Web Application (`web/`)
A mobile-first web app built with React, Vite, and Tailwind CSS featuring:
- **Live Translator**: English $\rightarrow$ Dimasa translation with recognized vocabulary chips, IPA guide, and grammatical explanations.
- **Community RLHF & Validation Feed**: Native speakers can review translations, upvote (agree), downvote (disagree), and suggest corrections.
- **Verification Threshold**: When a submission earns **3 community upvotes**, it automatically locks into the *Verified Gold Standard*.
- **Fine-Tuning Exporter**: Direct one-click download of verified pairs into standard `.jsonl` format ready for fine-tuning.
- **Word Book Explorer**: Searchable dictionary with category filtering and pronunciation helpers.
- **Grammar Guide**: Educational walkthrough of Dimasa grammar rules for learners.
- **About Creator Tab**: Detailed information about the project creator, portfolio link, contact email, and linguistic data grounding.
- **Dual-Engine Support**: Works 100% offline out-of-the-box via local rule-based synthesis, or can be connected to Google Gemini via API key in the settings modal.

---

## 🚀 Quick Start (Run Web App Locally)

To launch the web platform on your Mac:

```bash
cd web
npm run dev
```

Then open `http://localhost:3000` in your web browser.

---

## 🌐 Deploying to the Dimasa Community

You can deploy this website completely free so community members can access it on their phones:

### Option A: Deploy via Vercel (Recommended)
1. Push this project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Dimasa AI"
   git remote add origin https://github.com/your-username/dimasa-ai.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `dimasa-ai` repository.
4. Set the **Root Directory** to `web`.
5. Click **Deploy**. Vercel will give you a public URL (e.g. `dimasa-ai.vercel.app`) you can share with the community.

---

## 🔄 The AI Flywheel: From Community Feedback to Custom Model

```
Community Submissions 
         ↓
Review & Consensus (3+ Upvotes) 
         ↓
One-Click "Export Fine-Tune JSONL" 
         ↓
Fine-Tune Model (Gemini API or Llama 3 / NLLB)
         ↓
Update Translator Engine
```

### Export Format
The exporter produces training lines in standard instruction format:
```jsonl
{"messages": [{"role": "user", "content": "Translate to Dimasa: Where are you going?"}, {"role": "assistant", "content": "Ning bahani thangdu?"}], "metadata": {"contributor": "Community Contributor", "verified_votes": 3}}
```

### Fine-Tuning Instructions
1. **Gemini API Fine-Tuning**:
   - Upload your exported `.jsonl` file directly into [Google AI Studio](https://aistudio.google.com/app/tuned_models).
   - Click **Create Tuned Model** $\rightarrow$ select `Gemini 1.5 Flash` or `Gemini 2.5 Flash`.
2. **Open-Source Fine-Tuning (Llama / Gemma / NLLB)**:
   - Load the `.jsonl` file into an Unsloth or Hugging Face SFT trainer on Google Colab or RunPod with LoRA.
