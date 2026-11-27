import React, { useState } from 'react';
import { 
  Users, CheckCircle2, Clock, ThumbsUp, ThumbsDown, 
  Download, Filter, Award, MapPin, Sparkles, PlusCircle 
} from 'lucide-react';

export default function CommunityLabTab({ 
  feed = [], 
  contributors = [], 
  onVote, 
  onOpenNewSentenceModal,
  onExportJsonl 
}) {
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'verified'

  const safeFeed = Array.isArray(feed) ? feed : [];
  const safeContributors = Array.isArray(contributors) ? contributors : [];

  const filteredFeed = safeFeed.filter(item => {
    if (!item) return false;
    if (filter === 'verified') return item.status === 'verified';
    if (filter === 'pending') return item.status === 'pending';
    return true;
  });

  const verifiedCount = safeFeed.filter(f => f && f.status === 'verified').length;
  const pendingCount = safeFeed.filter(f => f && f.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header with Stats & Export */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Community RLHF Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-heading">
              Dimasa AI Training Feed
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Every sentence below is submitted or reviewed by native Dimasa speakers. When an entry reaches 
              <strong> 3 community approvals</strong>, it locks into the <em>Verified Gold Dataset</em> for fine-tuning.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={onOpenNewSentenceModal}
              className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit Sentence</span>
            </button>
            <button
              onClick={onExportJsonl}
              disabled={verifiedCount === 0}
              className={`flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                verifiedCount > 0
                  ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
              title="Download training file for model fine-tuning"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSONL ({verifiedCount})</span>
            </button>
          </div>
        </div>

        {/* Quick Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-stone-100">
          <div className="bg-stone-50 rounded-xl p-2.5 sm:p-3 border border-stone-200/60">
            <span className="text-[10px] sm:text-[11px] font-medium text-stone-500 uppercase tracking-wider">Submissions</span>
            <p className="text-base sm:text-lg font-bold text-stone-900">{feed.length}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-2.5 sm:p-3 border border-emerald-200/60">
            <span className="text-[10px] sm:text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Verified</span>
            <p className="text-base sm:text-lg font-bold text-emerald-900">{verifiedCount}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-2.5 sm:p-3 border border-amber-200/60">
            <span className="text-[10px] sm:text-[11px] font-medium text-amber-700 uppercase tracking-wider">Awaiting Votes</span>
            <p className="text-base sm:text-lg font-bold text-amber-900">{pendingCount}</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-2.5 sm:p-3 border border-orange-200/60">
            <span className="text-[10px] sm:text-[11px] font-medium text-orange-700 uppercase tracking-wider">Contributors</span>
            <p className="text-base sm:text-lg font-bold text-orange-900">{contributors.length}</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Feed + Leaderboard Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: The Community Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Pills */}
          <div className="flex items-center space-x-2 pb-1">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center space-x-1">
              <Filter className="w-3 h-3" />
              <span>Filter:</span>
            </span>
            <button
              onClick={() => setFilter('all')}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              All Submissions ({feed.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                filter === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              Needs Votes ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('verified')}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                filter === 'verified'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
            >
              Verified Gold ({verifiedCount})
            </button>
          </div>

          {/* Empty State */}
          {filteredFeed.length === 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-stone-900 text-base">
                No Community Submissions Yet
              </h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                Be the first to submit a sentence or test any phrase in the Translator tab and click 
                <strong> "Suggest Better Translation"</strong> to begin building the Dimasa dataset!
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenNewSentenceModal}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Submit the First Sentence</span>
                </button>
              </div>
            </div>
          )}

          {/* Cards List */}
          {filteredFeed.map((item) => {
            const isVerified = item.status === 'verified';
            const votesNeeded = Math.max(0, 3 - item.upvotes);

            return (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:border-amber-400 transition-all space-y-3"
              >
                {/* Top Author Bar */}
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-stone-800">{item.author}</span>
                    <span>•</span>
                    <span>{item.timestamp}</span>
                  </div>

                  {isVerified ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Dataset</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-200">
                      <Clock className="w-3 h-3" />
                      <span>{votesNeeded} more vote{votesNeeded > 1 ? 's' : ''} to verify</span>
                    </span>
                  )}
                </div>

                {/* English Source */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">English Source</span>
                  <p className="text-sm font-semibold text-stone-800">"{item.english}"</p>
                </div>

                {/* AI Draft vs Correction */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {item.aiDraft && item.aiDraft !== item.dimasaCorrection && (
                    <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-2.5 text-xs">
                      <span className="text-[10px] uppercase font-bold text-stone-400">Initial AI Draft</span>
                      <p className="text-stone-500 line-through mt-0.5">{item.aiDraft}</p>
                    </div>
                  )}

                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 text-xs sm:col-span-1">
                    <span className="text-[10px] uppercase font-bold text-amber-800">Community Dimasa Translation</span>
                    <p className="text-stone-900 font-bold text-base mt-0.5">{item.dimasaCorrection}</p>
                  </div>
                </div>

                {/* Contributor's Linguistic Explanation */}
                {item.explanation && (
                  <p className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 italic">
                    💬 "{item.explanation}"
                  </p>
                )}

                {/* Voting Bar */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onVote(item.id, 'up')}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        item.votedByMe === 'up'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{item.upvotes} Agree</span>
                    </button>

                    <button
                      onClick={() => onVote(item.id, 'down')}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        item.votedByMe === 'down'
                          ? 'bg-rose-600 text-white'
                          : 'bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 border border-stone-200'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Disagree</span>
                    </button>
                  </div>

                  {/* Progress to verification */}
                  <div className="hidden sm:flex items-center space-x-2 text-[11px] text-stone-400">
                    <div className="w-20 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full ${isVerified ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                        style={{ width: `${Math.min(100, (item.upvotes / 3) * 100)}%` }}
                      />
                    </div>
                    <span>{Math.min(3, item.upvotes)}/3</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Dynamic Community Leaderboard */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center space-x-2 pb-3 border-b border-stone-100">
              <Award className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Community Leaderboard
              </h3>
            </div>

            {contributors.length > 0 ? (
              <div className="divide-y divide-stone-100 mt-2">
                {contributors.map((c, i) => (
                  <div key={i} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="w-5 text-center text-xs font-bold text-stone-400">
                        #{i + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-stone-900">{c.name}</p>
                        <p className="text-[11px] text-stone-400">{c.badge}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-700">{c.verifiedCount}</span>
                      <span className="text-[10px] text-stone-400 block">verified</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-stone-400 space-y-1">
                <p className="font-semibold text-stone-600">No contributors yet</p>
                <p>Submit translations or corrections to see your name on the leaderboard!</p>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-stone-100 bg-amber-50/50 rounded-xl p-3">
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                🏆 <strong>Community Target:</strong> 500 verified sentence pairs to train the first open-source Dimasa translation checkpoint.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
