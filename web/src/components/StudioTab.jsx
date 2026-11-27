import React, { useState } from 'react';
import { Sparkles, Languages } from 'lucide-react';
import SentenceLabTab from './SentenceLabTab';
import TranslatorTab from './TranslatorTab';

export default function StudioTab({
  feed,
  onVote,
  onSubmitSentence,
  apiKey,
  englishInput,
  setEnglishInput,
  translationResult,
  isTranslating,
  onTranslate,
  onOpenCorrectionModal,
  onQuickEndorse
}) {
  const [studioMode, setStudioMode] = useState(() => {
    try {
      return localStorage.getItem('dimasa_studio_mode') || 'cards';
    } catch {
      return 'cards';
    }
  });

  const handleModeChange = (mode) => {
    setStudioMode(mode);
    try {
      localStorage.setItem('dimasa_studio_mode', mode);
    } catch {}
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
      {/* Sleek, Centered iOS-Style Mode Switcher */}
      <div className="flex items-center justify-center pt-1 pb-1">
        <div className="bg-stone-200/80 p-1 rounded-2xl flex items-center space-x-1 shadow-inner border border-stone-200 w-full sm:w-auto max-w-md">
          <button
            onClick={() => handleModeChange('cards')}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 py-2 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              studioMode === 'cards'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${studioMode === 'cards' ? 'text-amber-600' : 'text-stone-400'}`} />
            <span>Essential Cards Pack</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              studioMode === 'cards' ? 'bg-amber-100 text-amber-800' : 'bg-stone-300 text-stone-600'
            }`}>
              33
            </span>
          </button>

          <button
            onClick={() => handleModeChange('freeform')}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 py-2 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              studioMode === 'freeform'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Languages className={`w-4 h-4 ${studioMode === 'freeform' ? 'text-amber-600' : 'text-stone-400'}`} />
            <span>Freeform Translator</span>
          </button>
        </div>
      </div>

      {/* Active Studio View */}
      <div>
        {studioMode === 'cards' ? (
          <SentenceLabTab
            feed={feed}
            onVote={onVote}
            onSubmitSentence={onSubmitSentence}
            apiKey={apiKey}
            onSwitchToFreeform={() => handleModeChange('freeform')}
          />
        ) : (
          <TranslatorTab
            englishInput={englishInput}
            setEnglishInput={setEnglishInput}
            translationResult={translationResult}
            isTranslating={isTranslating}
            onTranslate={onTranslate}
            onOpenCorrectionModal={onOpenCorrectionModal}
            onQuickEndorse={onQuickEndorse}
            onSwitchToCards={() => handleModeChange('cards')}
          />
        )}
      </div>
    </div>
  );
}
