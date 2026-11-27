import React, { useState } from 'react';
import { X, Send, PlusCircle, User } from 'lucide-react';

export default function NewSentenceModal({ isOpen, onClose, onSubmitNewSentence }) {
  const [english, setEnglish] = useState('');
  const [dimasa, setDimasa] = useState('');
  const [author, setAuthor] = useState(() => {
    return localStorage.getItem('dimasa_contributor_name') || '';
  });
  const [explanation, setExplanation] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!english.trim() || !dimasa.trim()) return;

    if (author.trim()) {
      localStorage.setItem('dimasa_contributor_name', author.trim());
    }

    onSubmitNewSentence({
      english: english.trim(),
      aiDraft: null,
      dimasaCorrection: dimasa.trim(),
      author: author.trim() || 'Community Contributor',
      explanation: explanation.trim() || 'Community contributed sentence pair'
    });

    onClose();
    setEnglish('');
    setDimasa('');
    setExplanation('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-800 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-stone-900 text-base">Contribute New Sentence Pair</h3>
              <p className="text-xs text-stone-400">Add authentic Dimasa sentences to expand training dataset</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              English Sentence *
            </label>
            <input
              type="text"
              required
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="e.g. Come here quickly"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Dimasa Translation (Roman Script) *
            </label>
            <input
              type="text"
              required
              value={dimasa}
              onChange={(e) => setDimasa(e.target.value)}
              placeholder="e.g. Ereha goronghe fabo"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1 flex items-center space-x-1">
              <User className="w-3 h-3 text-stone-400" />
              <span>Your Name or Handle (Optional)</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. DimasaSpeaker"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Context or Notes (Optional)
            </label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="e.g. Everyday conversational phrase"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
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
              <span>Submit Sentence</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
