import React, { useState } from 'react';
import { 
  ArrowRight, Copy, Check, Sparkles, BookOpen, ThumbsUp, Edit3, 
  RotateCcw, Volume2, ShieldCheck, AlertTriangle, User 
} from 'lucide-react';

export default function TranslatorTab({ 
  englishInput, 
  setEnglishInput, 
  translationResult, 
  isTranslating, 
  onTranslate, 
  onOpenCorrectionModal,
  onQuickEndorse,
  onSwitchToCards
}) {
  const [copied, setCopied] = useState(false);
  const [endorsed, setEndorsed] = useState(false);

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

  const samplePrompts = [
    "Where are you going?",
    "I am drinking water.",
    "What is your name?",
    "How are you?",
    "The tiger sees the deer."
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const clean = tempProfileName.trim() || 'Speaker';
    setContributorName(clean);
    try {
      localStorage.setItem('dimasa_contributor_name', clean);
    } catch {}
    setIsEditingProfile(false);
  };

  const handleCopy = () => {
    if (translationResult?.translation) {
      navigator.clipboard.writeText(translationResult.translation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEndorseClick = () => {
    if (translationResult?.translation) {
      onQuickEndorse(englishInput, translationResult.translation, contributorName);
      setEndorsed(true);
      setTimeout(() => setEndorsed(false), 3000);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Top Utility Bar: Quick Examples & Contributor Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        {/* Sample Prompt Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none touch-scroll">
          <span className="text-stone-400 font-semibold whitespace-nowrap">Examples:</span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setEnglishInput(prompt);
                onTranslate(prompt);
              }}
              className="text-[11px] bg-white border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 text-stone-700 px-2.5 py-1 rounded-xl whitespace-nowrap transition-all shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Contributor Handle */}
        <div className="flex items-center space-x-1.5 justify-end">
          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="flex items-center space-x-1">
              <input
                type="text"
                autoFocus
                value={tempProfileName}
                onChange={(e) => setTempProfileName(e.target.value)}
                className="w-24 px-2 py-0.5 bg-white border border-amber-400 rounded-lg text-xs font-semibold focus:outline-none"
              />
              <button type="submit" className="px-2 py-0.5 bg-amber-600 text-white rounded-lg text-xs font-bold">
                Save
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setTempProfileName(contributorName);
                setIsEditingProfile(true);
              }}
              className="text-stone-500 hover:text-stone-800 bg-white hover:bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200 text-[11px] font-medium flex items-center space-x-1"
              title="Click to change your contributor handle"
            >
              <User className="w-3 h-3 text-stone-400" />
              <span>{contributorName}</span>
              <Edit3 className="w-2.5 h-2.5 text-stone-400" />
            </button>
          )}
        </div>
      </div>

      {/* Dual-Box Translator Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Box: English Source */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-6 flex flex-col justify-between focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/10 transition-all min-h-[260px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3 text-xs">
              <span className="font-bold uppercase tracking-wider text-stone-400 text-[11px]">English (Source)</span>
              {englishInput && (
                <button 
                  onClick={() => { setEnglishInput(''); }}
                  className="text-stone-400 hover:text-stone-600 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <textarea
              value={englishInput}
              onChange={(e) => {
                setEnglishInput(e.target.value);
                onTranslate(e.target.value);
              }}
              placeholder="Type English sentence here... (e.g. 'Where are you going?')"
              rows={4}
              className="w-full text-lg sm:text-xl font-medium text-stone-900 placeholder-stone-400 bg-transparent resize-none focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <span>{englishInput.length} characters</span>
            <span className="font-medium text-stone-500">Standard English</span>
          </div>
        </div>

        {/* Right Box: Dimasa Draft */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-6 flex flex-col justify-between min-h-[260px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold uppercase tracking-wider text-amber-800 text-[11px]">Dimasa Draft</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                  {translationResult?.method || 'Ready'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {translationResult?.translation && (
                  <>
                    <button
                      onClick={() => speakText(translationResult.translation)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Audio Pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                      title="Copy Translation"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Translation Output Area */}
            <div className="min-h-[90px] flex flex-col justify-center">
              {isTranslating ? (
                <div className="flex items-center space-x-2 text-stone-400 py-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-sm">Synthesizing Dimasa draft...</span>
                </div>
              ) : translationResult?.translation ? (
                <div className="space-y-1">
                  <p className="text-xl sm:text-2xl font-extrabold text-stone-900 font-heading">
                    {translationResult.translation}
                  </p>
                  {translationResult.ipa && (
                    <p className="text-xs font-mono text-amber-700">
                      IPA: [{translationResult.ipa}]
                    </p>
                  )}
                  {translationResult.explanation && (
                    <p className="text-xs text-stone-500 mt-2 bg-stone-50 p-2.5 rounded-xl border border-stone-100 leading-relaxed">
                      💡 {translationResult.explanation}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-stone-400 text-sm italic">
                  Translation draft will appear here in Romanized Dimasa.
                </p>
              )}
            </div>
          </div>

          {/* Feedback & Actions */}
          <div className="pt-3 border-t border-stone-100">
            {translationResult?.translation ? (
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handleEndorseClick}
                  disabled={endorsed}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    endorsed 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{endorsed ? 'Verified! (+1)' : 'Sounds Accurate'}</span>
                </button>

                <button
                  onClick={() => onOpenCorrectionModal(englishInput, translationResult.translation)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Suggest Correction</span>
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-stone-400 italic">
                * Experimental AI draft for model training only.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grounded Vocabulary Chips */}
      {translationResult?.matched && translationResult.matched.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-stone-600">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Recognized Vocabulary:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {translationResult.matched.map((item, idx) => (
              <span 
                key={idx} 
                className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1 text-xs text-stone-700"
              >
                <strong className="text-amber-900">{item.dimasa}</strong>
                {item.ipa && <span className="font-mono text-stone-400 text-[11px] ml-1">[{item.ipa}]</span>}
                <span className="text-stone-400 ml-1.5">= "{item.english}"</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
