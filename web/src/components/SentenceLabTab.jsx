import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, Shuffle, ArrowRight, Check, ThumbsUp, ThumbsDown, 
  Send, AlertCircle, HelpCircle, CheckCircle2,
  Edit3, User, ShieldCheck, AlertTriangle, Languages 
} from 'lucide-react';
import { essentialCategories, essentialPhrases } from '../data/essential_phrases';
import { ruleBasedTranslate, translateWithGemini } from '../utils/translator';
import { 
  validateSubmissionText, 
  checkSubmissionSpeed, 
  checkRateLimit 
} from '../utils/antiSpam';

export default function SentenceLabTab({ 
  feed = [], 
  onVote, 
  onSubmitSentence,
  apiKey,
  onSwitchToFreeform 
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Persistent Contributor Identity
  const [contributorName, setContributorName] = useState(() => {
    try {
      return localStorage.getItem('dimasa_contributor_name') || 'Speaker_' + Math.floor(100 + Math.random() * 900);
    } catch {
      return 'Speaker_101';
    }
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfileName, setTempProfileName] = useState(contributorName);

  // User input fields
  const [userDimasa, setUserDimasa] = useState('');
  const [showAiDraft, setShowAiDraft] = useState(false);
  const [aiDraftText, setAiDraftText] = useState(null);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Anti-bot & honeypot tracking
  const [honeypot, setHoneypot] = useState('');
  const cardRenderTimeRef = useRef(Date.now());
  const inputRef = useRef(null);

  // Filter phrases by category
  const filteredPhrases = useMemo(() => {
    if (selectedCategory === 'all') return essentialPhrases;
    return essentialPhrases.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const currentPhrase = filteredPhrases[currentIndex] || filteredPhrases[0];
  const activeEnglish = currentPhrase?.english || '';

  // Existing community submissions for this exact English sentence
  const existingSubmissions = useMemo(() => {
    if (!activeEnglish.trim() || !Array.isArray(feed)) return [];
    return feed.filter(f => f && f.english && typeof f.english === 'string' && f.english.trim().toLowerCase() === activeEnglish.trim().toLowerCase());
  }, [feed, activeEnglish]);

  // Auto-generate AI draft for active English sentence
  useEffect(() => {
    if (!activeEnglish.trim()) {
      setAiDraftText(null);
      return;
    }
    const instant = ruleBasedTranslate(activeEnglish);
    setAiDraftText(instant.translation || '');

    if (apiKey && apiKey.trim()) {
      setIsGeneratingDraft(true);
      translateWithGemini(activeEnglish, apiKey.trim())
        .then(res => {
          if (res?.translation) {
            setAiDraftText(res.translation);
          }
        })
        .catch(() => {})
        .finally(() => setIsGeneratingDraft(false));
    }
  }, [activeEnglish, apiKey]);

  // Reset input when phrase changes
  useEffect(() => {
    setUserDimasa('');
    setSubmittedSuccess(false);
    setErrorMessage(null);
    cardRenderTimeRef.current = Date.now();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [currentIndex, selectedCategory]);

  const handleNext = () => {
    if (currentIndex < filteredPhrases.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(filteredPhrases.length - 1);
    }
  };

  const handleRandom = () => {
    if (filteredPhrases.length <= 1) return;
    let nextIdx = Math.floor(Math.random() * filteredPhrases.length);
    if (nextIdx === currentIndex) {
      nextIdx = (currentIndex + 1) % filteredPhrases.length;
    }
    setCurrentIndex(nextIdx);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const clean = tempProfileName.trim() || 'Speaker';
    setContributorName(clean);
    try {
      localStorage.setItem('dimasa_contributor_name', clean);
    } catch {}
    setIsEditingProfile(false);
  };

  // Submit Handler with 4-Layer Anti-Bot Protection
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Layer 1: Honeypot trap
    if (honeypot) {
      console.warn('Bot detected via honeypot.');
      return;
    }

    // Layer 2: Text quality checks
    const textValidation = validateSubmissionText(userDimasa);
    if (!textValidation.valid) {
      setErrorMessage(textValidation.reason);
      return;
    }

    // Layer 3: Time-gate check (Too fast = automated script)
    const speedCheck = checkSubmissionSpeed(cardRenderTimeRef.current);
    if (!speedCheck.allowed) {
      setErrorMessage(speedCheck.reason);
      return;
    }

    // Layer 4: Rate limit check
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      setErrorMessage(rateCheck.reason);
      return;
    }

    // Submit validated sentence (stayOnTab = true preserves card flow)
    onSubmitSentence({
      english: activeEnglish.trim(),
      aiDraft: aiDraftText || null,
      dimasaCorrection: userDimasa.trim(),
      author: contributorName,
      explanation: `Category: ${currentPhrase?.category || 'Essential phrases'}`
    }, true);

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setUserDimasa('');
      handleNext();
    }, 600);
  };

  const progressPercentage = Math.round(((currentIndex + 1) / filteredPhrases.length) * 100);

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* The Focused Main Training Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Card Header Toolbar */}
        <div className="space-y-3 pb-4 border-b border-stone-100">
          <div className="flex items-center justify-between gap-2 text-xs">
            {/* Category Dropdown & Counter */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentIndex(0);
                }}
                className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {essentialCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>

              <span className="text-stone-400 font-semibold hidden sm:inline">
                Card {currentIndex + 1} of {filteredPhrases.length}
              </span>
            </div>

            {/* Contributor Handle & Prev/Next Nav */}
            <div className="flex items-center space-x-1.5">
              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="flex items-center space-x-1">
                  <input
                    type="text"
                    autoFocus
                    value={tempProfileName}
                    onChange={(e) => setTempProfileName(e.target.value)}
                    className="w-24 px-2 py-1 bg-stone-50 border border-amber-400 rounded-lg text-xs font-semibold focus:outline-none"
                  />
                  <button type="submit" className="px-2 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold">
                    Save
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setTempProfileName(contributorName);
                    setIsEditingProfile(true);
                  }}
                  className="text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 px-2.5 py-1 rounded-lg border border-stone-200 text-[11px] font-semibold flex items-center space-x-1 group"
                  title="Click to change your contributor name"
                >
                  <User className="w-3 h-3 text-stone-400 group-hover:text-amber-700" />
                  <span>{contributorName}</span>
                  <Edit3 className="w-2.5 h-2.5 text-stone-400" />
                </button>
              )}

              <div className="flex items-center space-x-1 pl-1">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600"
                  title="Previous Sentence"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={handleRandom}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-amber-50 text-amber-700"
                  title="Shuffle Random"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600"
                  title="Next Sentence"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>

          {/* Thin Progress Line */}
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* English Sentence Prompt */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
            Translate this sentence to Dimasa:
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-heading leading-tight">
            "{currentPhrase?.english}"
          </h2>
          {currentPhrase?.context && (
            <p className="text-xs text-stone-500 font-medium pt-0.5">
              {currentPhrase.context}
            </p>
          )}
        </div>

        {/* Current AI Draft (Directly below the question) */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              Current AI Draft:
            </span>
            <p className="text-lg sm:text-xl font-bold text-stone-900 font-heading truncate sm:overflow-visible">
              {isGeneratingDraft ? (
                <span className="text-stone-400 text-sm font-normal">Loading draft...</span>
              ) : (
                aiDraftText || 'Draft not available'
              )}
            </p>
          </div>

          {aiDraftText && !isGeneratingDraft && (
            <button
              type="button"
              onClick={() => setUserDimasa(aiDraftText)}
              className="text-xs text-amber-800 hover:text-amber-950 font-bold bg-amber-100/80 hover:bg-amber-200 border border-amber-300/80 px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1 flex-shrink-0"
              title="Copy draft into input to edit or fix"
            >
              <span>Copy to Edit</span>
              <span>✍️</span>
            </button>
          )}
        </div>

        {/* Translation Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Honeypot Trap (Hidden from humans) */}
          <input
            type="text"
            name="contact_website_honey"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: 'none', position: 'absolute', opacity: 0 }}
            tabIndex="-1"
            autoComplete="off"
          />

          <div>
            <input
              ref={inputRef}
              type="text"
              required
              value={userDimasa}
              onChange={(e) => setUserDimasa(e.target.value)}
              placeholder="Type natural Dimasa translation here..."
              className="w-full px-4 py-3.5 bg-stone-50 border-2 border-stone-200 rounded-2xl text-base font-bold text-stone-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* Inline Validation / Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleNext}
              className="text-xs text-stone-500 hover:text-stone-800 font-semibold py-2.5 px-3 rounded-xl hover:bg-stone-100 transition-colors"
            >
              Skip ⏭️
            </button>

            <button
              type="submit"
              disabled={!userDimasa.trim() || submittedSuccess}
              className={`flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white shadow-md transition-all ${
                submittedSuccess
                  ? 'bg-emerald-600 shadow-emerald-600/20'
                  : 'bg-amber-600 hover:bg-amber-700 active:scale-95'
              } ${!userDimasa.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {submittedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved! Next ➔</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit & Next ➔</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Community Peer Review for this specific sentence (Clean Accordion / Mini List) */}
      {existingSubmissions.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-700 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Community Submissions ({existingSubmissions.length})</span>
            </span>
            <span className="text-[11px] text-stone-400">Upvote accurate phrases</span>
          </div>

          <div className="space-y-2">
            {existingSubmissions.map((sub) => (
              <div 
                key={sub.id} 
                className="bg-stone-50 border border-stone-100 rounded-xl p-3 flex items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-bold text-stone-900 text-sm">
                    {sub.dimasaCorrection}
                  </span>
                  <p className="text-[11px] text-stone-400">
                    By <strong>{sub.author}</strong> • {sub.timestamp}
                  </p>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => onVote(sub.id, 'up')}
                    className={`p-1.5 rounded-lg border flex items-center space-x-1 ${
                      sub.votedByMe === 'up'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span className="font-bold text-[11px]">{sub.upvotes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
