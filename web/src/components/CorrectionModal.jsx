import React, { useState } from 'react';
import { X, Send, Sparkles, User } from 'lucide-react';

export default function CorrectionModal({ 
  isOpen, 
  onClose, 
  englishText, 
  currentTranslation, 
  onSubmitCorrection 
}) {
  const [correctedText, setCorrectedText] = useState(currentTranslation || '');
  const [authorName, setAuthorName] = useState(() => {
    return localStorage.getItem('dimasa_contributor_name') || '';
  });
  const [explanation, setExplanation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!correctedText.trim()) return;

    if (authorName.trim()) {
      localStorage.setItem('dimasa_contributor_name', authorName.trim());
    }

    onSubmitCorrection({
      english: englishText,
      aiDraft: currentTranslation,
      dimasaCorrection: correctedText.trim(),
      author: authorName.trim() || 'Community Contributor',
      explanation: explanation.trim() || 'Suggested by community speaker'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-stone-900 text-base">Suggest a Better Translation</h3>
              <p className="text-xs text-stone-400">Help train the open Dimasa AI model</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source info */}
        <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 text-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400">English Input</span>
          <p className="font-semibold text-stone-900 text-sm">"{englishText}"</p>
          {currentTranslation && (
            <p className="text-stone-500 text-[11px] pt-1">
              Current AI draft: <span className="line-through">{currentTranslation}</span>
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Your Correct Dimasa Translation (Roman Script) *
            </label>
            <input
              type="text"
              required
              value={correctedText}
              onChange={(e) => setCorrectedText(e.target.value)}
              placeholder="e.g. Ning bahani thangdu?"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1 flex items-center space-x-1">
              <User className="w-3 h-3 text-stone-400" />
              <span>Your Name or Contributor Handle (Optional)</span>
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. DimasaSpeaker"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Why is this better? (Optional grammatical note)
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="e.g. Added suffix -du for present tense, natural phrasing..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit to Community Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
