import React, { useState } from 'react';
import { Sparkles, Languages, Quote, ArrowRight, CheckCircle2, Mail } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Workspace (Left / Center Column) */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
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
                <span>Free Text Mode</span>
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

        {/* Right Side Card: Creator's Mission Note */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="bg-gradient-to-br from-amber-50/80 via-white to-stone-50 rounded-3xl border border-amber-200/80 shadow-sm p-6 sm:p-7 space-y-5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                <Quote className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                  A Note to the Community
                </span>
              </div>
            </div>

            <blockquote className="border-l-4 border-amber-400 pl-4 py-1 italic text-stone-700 text-sm sm:text-[15px] leading-relaxed font-serif">
              "Juthai razee rao , ang ebu project k salamba ni motive jaka - AI k dimasa grao slingrimani ode permanently preserve klaima so that in future jini ebu graothai digitally ebu muluk ha permanently thaoma ne . AI ni data centers ha ode knowledge bases ha jini graothai k lahi hemshi ning information short jabi. Obani ani lugurao , dada rao , abi rao k ebu project ha contribute klainang tsihi hemshi ning ang asha jaladu. JUTHAI!"
            </blockquote>

            <div className="pt-4 border-t border-amber-200/60 space-y-3">
              <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed">
                Please contribute whatever you know in pure Dimasa language. I strongly recommend you to use the <strong className="text-amber-900">Free Text mode</strong>. Thanks!
              </p>

              {studioMode !== 'freeform' ? (
                <button
                  type="button"
                  onClick={() => handleModeChange('freeform')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>Open Free Text Mode</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free Text Mode Active</span>
                </div>
              )}
            </div>

            {/* Grammar Accuracy Note & Funding Callout */}
            <div className="pt-4 border-t border-amber-200/60 space-y-3 text-xs text-stone-600 leading-relaxed">
              <div className="bg-white/80 rounded-2xl p-3.5 border border-stone-200/80 space-y-1">
                <p className="font-semibold text-stone-800">Note on Initial Data &amp; Grammar</p>
                <p>
                  This initial data is taken from an existing book of Dimasa grammar and most of it is incorrect. Please{' '}
                  <a href="mailto:developerthimpu@gmail.com" className="text-amber-800 font-semibold underline underline-offset-2 hover:text-amber-950">
                    write to me
                  </a>{' '}
                  if something needs to be corrected in the Grammar section.
                </p>
              </div>

              <div className="bg-stone-900 text-stone-200 rounded-2xl p-3.5 space-y-2">
                <p className="font-semibold text-amber-300">Support &amp; Infrastructure Funding</p>
                <p className="text-[11px] sm:text-xs text-stone-300 leading-relaxed">
                  This project is not funded at all. If someone is willing to fund this project so that it gets better infrastructure to be trained on, please contact me. Thanks!
                </p>
                <a
                  href="mailto:developerthimpu@gmail.com"
                  className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-white bg-amber-600 hover:bg-amber-500 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  <span>developerthimpu@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
