import React, { useState } from 'react';
import { BookOpen, Search, Volume2, Sparkles, Filter } from 'lucide-react';
import { wordbook } from '../data/dimasa_wordbook';

export default function DictionaryTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(wordbook.words.map(w => w.category || 'General'))];

  const filteredWords = wordbook.words.filter(w => {
    const matchesSearch = 
      (w.dimasa || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.english || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.ipa || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Dimasa Word Book & Lexicon</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-heading">
              Digitized Lexicon Explorer
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Explore {wordbook.words.length} verified words, pronunciations, and semantic classifications.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Dimasa or English..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-4 mt-4 border-t border-stone-100 scrollbar-none">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors font-medium ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredWords.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="font-bold text-lg text-amber-900 font-heading">
                  {item.dimasa}
                </span>
                <span className="text-[10px] font-mono font-semibold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full border border-stone-200">
                  {item.category || item.pos}
                </span>
              </div>

              {item.ipa && (
                <p className="text-xs font-mono text-stone-400 mt-0.5">
                  [{item.ipa}]
                </p>
              )}

              <p className="text-sm font-medium text-stone-800 mt-2">
                "{item.english}"
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-stone-400">
                {item.pos || 'Term'}
              </span>
              <button
                onClick={() => speakText(item.dimasa)}
                className="p-1 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                title="Pronounce"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <BookOpen className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-stone-700">No words found</p>
          <p className="text-xs text-stone-400 mt-1">Try searching another keyword or switch category.</p>
        </div>
      )}
    </div>
  );
}
