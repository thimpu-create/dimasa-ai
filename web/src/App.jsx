import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from './components/Navbar';
import StudioTab from './components/StudioTab';
import CommunityLabTab from './components/CommunityLabTab';
import DictionaryTab from './components/DictionaryTab';
import GrammarTab from './components/GrammarTab';
import AboutTab from './components/AboutTab';
import CorrectionModal from './components/CorrectionModal';
import NewSentenceModal from './components/NewSentenceModal';
import SettingsModal from './components/SettingsModal';
import { ruleBasedTranslate, translateWithGemini } from './utils/translator';
import { initialCommunityFeed } from './data/initial_community_data';
import { isCloudSyncEnabled, fetchCloudFeed, postCloudSentence, voteCloudSentence } from './utils/supabase';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dimasa AI ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-stone-200 shadow-lg text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-2xl font-bold">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-stone-900 font-heading">Something went wrong</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            {this.state.error?.message || "An unexpected error occurred while rendering this tab."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 shadow-sm"
          >
            Reload Studio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('lab');
  const [englishInput, setEnglishInput] = useState('Where are you going?');
  const [translationResult, setTranslationResult] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Community state with localStorage persistence (starts clean)
  const [feed, setFeed] = useState(() => {
    try {
      const saved = localStorage.getItem('dimasa_community_feed_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return Array.isArray(initialCommunityFeed) ? initialCommunityFeed : [];
  });

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('dimasa_gemini_api_key') || '';
  });

  // Modals
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  const [correctionTarget, setCorrectionTarget] = useState({ english: '', currentTranslation: '' });
  const [isNewSentenceOpen, setIsNewSentenceOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load from cloud database if configured & auto-sync any offline items
  const syncWithCloud = useCallback(async () => {
    if (!isCloudSyncEnabled) return;

    try {
      const cloudItems = await fetchCloudFeed();
      if (!cloudItems || !Array.isArray(cloudItems)) return;

      const mapped = cloudItems.map(item => ({
        id: item.id,
        english: item.english,
        aiDraft: item.ai_draft,
        dimasaCorrection: item.dimasa_correction,
        author: item.author,
        timestamp: new Date(item.created_at).toLocaleDateString(),
        upvotes: item.upvotes,
        downvotes: item.downvotes,
        status: item.status,
        explanation: item.explanation,
        votedByMe: null
      }));

      // Get current stored local entries from localStorage
      let localSaved = [];
      try {
        const saved = localStorage.getItem('dimasa_community_feed_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) localSaved = parsed;
        }
      } catch {}

      const cloudEnglishSet = new Set(mapped.map(m => (m.english || '').trim().toLowerCase()));
      const localOnly = localSaved.filter(f => f && f.english && !cloudEnglishSet.has(f.english.trim().toLowerCase()));

      if (localOnly.length > 0) {
        console.log(`[Dimasa AI] Syncing ${localOnly.length} offline local entries to Supabase...`);
        const syncedEntries = await Promise.all(
          localOnly.map(async item => {
            const res = await postCloudSentence({
              english: item.english.trim(),
              ai_draft: item.aiDraft || null,
              dimasa_correction: item.dimasaCorrection.trim(),
              author: item.author || 'Community Contributor',
              explanation: item.explanation || 'Submitted in offline mode',
              upvotes: item.upvotes || 1,
              downvotes: item.downvotes || 0,
              status: item.status || 'pending'
            });
            if (res && res[0]) {
              return {
                id: res[0].id,
                english: res[0].english,
                aiDraft: res[0].ai_draft,
                dimasaCorrection: res[0].dimasa_correction,
                author: res[0].author,
                timestamp: new Date(res[0].created_at).toLocaleDateString(),
                upvotes: res[0].upvotes,
                downvotes: res[0].downvotes,
                status: res[0].status,
                explanation: res[0].explanation,
                votedByMe: item.votedByMe || null
              };
            }
            return item;
          })
        );
        setFeed([...syncedEntries, ...mapped]);
      } else {
        setFeed(prev => {
          const voteMap = new Map((prev || []).map(p => [(p.english || '').trim().toLowerCase(), p.votedByMe]));
          return mapped.map(item => ({
            ...item,
            votedByMe: voteMap.get((item.english || '').trim().toLowerCase()) || null
          }));
        });
      }
    } catch (err) {
      console.warn('[Dimasa AI] Cloud sync error:', err);
    }
  }, []);

  useEffect(() => {
    syncWithCloud();

    window.addEventListener('online', syncWithCloud);
    return () => window.removeEventListener('online', syncWithCloud);
  }, [syncWithCloud]);

  // Sync feed to localStorage
  useEffect(() => {
    localStorage.setItem('dimasa_community_feed_v2', JSON.stringify(feed));
  }, [feed]);

  // Dynamically calculate contributors from actual submissions (NO HARDCODING)
  const contributors = useMemo(() => {
    const map = {};
    if (Array.isArray(feed)) {
      feed.forEach(item => {
        if (!item) return;
        const name = (item.author || '').trim();
        if (!name) return;
        if (!map[name]) {
          map[name] = {
            name,
            contributions: 0,
            verifiedCount: 0,
            badge: 'Contributor'
          };
        }
        map[name].contributions += 1;
        if (item.status === 'verified') {
          map[name].verifiedCount += 1;
        }
      });
    }

    return Object.values(map)
      .map(c => {
        let badge = 'Contributor';
        if (c.verifiedCount >= 10) badge = 'Master Translator';
        else if (c.verifiedCount >= 5) badge = 'Senior Speaker';
        else if (c.contributions >= 3) badge = 'Active Member';
        return { ...c, badge };
      })
      .sort((a, b) => b.contributions - a.contributions);
  }, [feed]);

  // Translation executor
  const performTranslation = useCallback(async (text) => {
    if (!text || !text.trim()) {
      setTranslationResult(null);
      return;
    }

    setIsTranslating(true);
    try {
      if (apiKey && apiKey.trim()) {
        const result = await translateWithGemini(text, apiKey.trim());
        setTranslationResult(result);
      } else {
        const result = ruleBasedTranslate(text);
        setTranslationResult(result);
      }
    } catch (err) {
      console.warn('Gemini translation failed, falling back to rule-based:', err);
      const fallback = ruleBasedTranslate(text);
      fallback.explanation += ` (Gemini note: ${err.message})`;
      setTranslationResult(fallback);
    } finally {
      setIsTranslating(false);
    }
  }, [apiKey]);

  // Run initial translation on mount
  useEffect(() => {
    performTranslation(englishInput);
  }, []);

  const handleTranslateInput = (text) => {
    performTranslation(text);
  };

  // Open correction modal for current translation
  const handleOpenCorrection = (english, currentTranslation) => {
    setCorrectionTarget({ english, currentTranslation });
    setIsCorrectionOpen(true);
  };

  // Submit a correction to the community feed (stayOnTab preserves active workflow)
  const handleSubmitCorrection = async ({ english, aiDraft, dimasaCorrection, author, explanation }, stayOnTab = false) => {
    const tempId = `corr-${Date.now()}`;
    const newEntry = {
      id: tempId,
      english,
      aiDraft,
      dimasaCorrection,
      author: author || 'Community Contributor',
      timestamp: 'Just now',
      upvotes: 1,
      downvotes: 0,
      status: 'pending',
      explanation,
      votedByMe: 'up'
    };

    setFeed(prev => [newEntry, ...prev]);

    if (isCloudSyncEnabled) {
      try {
        const saved = await postCloudSentence({
          english,
          ai_draft: aiDraft,
          dimasa_correction: dimasaCorrection,
          author: author || 'Community Contributor',
          explanation,
          upvotes: 1,
          downvotes: 0,
          status: 'pending'
        });

        if (saved && saved[0] && saved[0].id) {
          setFeed(prev => prev.map(item => item.id === tempId ? { ...item, id: saved[0].id } : item));
        }
      } catch (err) {
        console.warn('Could not post directly to cloud, will sync on next reconnect:', err);
      }
    }

    if (!stayOnTab) {
      setActiveTab('community');
    }
  };

  // Quick endorse from translator tab
  const handleQuickEndorse = (english, dimasa, authorName) => {
    const contributor = authorName || localStorage.getItem('dimasa_contributor_name') || 'Community Speaker';
    const existing = feed.find(f => f.english.toLowerCase() === english.toLowerCase());
    if (existing) {
      handleVote(existing.id, 'up');
    } else {
      handleSubmitCorrection({
        english,
        aiDraft: dimasa,
        dimasaCorrection: dimasa,
        author: contributor,
        explanation: 'Directly verified from translator interface'
      }, true);
    }
  };

  // Handle voting on translations
  const handleVote = (id, type) => {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    setFeed(prev => prev.map(item => {
      if (item.id !== id) return item;

      let up = item.upvotes;
      let down = item.downvotes;
      let myVote = item.votedByMe;

      if (type === 'up') {
        if (myVote === 'up') {
          up = Math.max(0, up - 1);
          myVote = null;
        } else {
          up += 1;
          if (myVote === 'down') down = Math.max(0, down - 1);
          myVote = 'up';
        }
      } else if (type === 'down') {
        if (myVote === 'down') {
          down = Math.max(0, down - 1);
          myVote = null;
        } else {
          down += 1;
          if (myVote === 'up') up = Math.max(0, up - 1);
          myVote = 'down';
        }
      }

      const status = up >= 3 ? 'verified' : 'pending';

      if (isCloudSyncEnabled && isUUID) {
        voteCloudSentence(id, up, down, status);
      }

      return {
        ...item,
        upvotes: up,
        downvotes: down,
        votedByMe: myVote,
        status
      };
    }));
  };

  // Export dataset for fine-tuning
  const handleExportJsonl = () => {
    const verified = feed.filter(f => f.status === 'verified');
    if (verified.length === 0) {
      alert('No verified translations yet! Upvote translations to 3+ approvals first.');
      return;
    }

    const lines = verified.map(item => {
      return JSON.stringify({
        messages: [
          { role: 'user', content: `Translate to Dimasa: ${item.english}` },
          { role: 'assistant', content: item.dimasaCorrection }
        ],
        metadata: {
          contributor: item.author,
          verified_votes: item.upvotes
        }
      });
    });

    const blob = new Blob([lines.join('\n')], { type: 'application/jsonl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dimasa_finetuning_dataset_${Date.now()}.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem('dimasa_gemini_api_key', newKey);
    if (englishInput) {
      setTimeout(() => performTranslation(englishInput), 100);
    }
  };

  const handleClearFeed = () => {
    if (confirm('Are you sure you want to clear all community submissions from local storage?')) {
      setFeed([]);
      localStorage.removeItem('dimasa_community_feed_v2');
    }
  };

  const verifiedCount = Array.isArray(feed) ? feed.filter(f => f && f.status === 'verified').length : 0;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between">
      <div>
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onOpenSettings={() => setIsSettingsOpen(true)}
          apiKey={apiKey}
          verifiedCount={verifiedCount}
          isCloudSyncEnabled={isCloudSyncEnabled}
        />

        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-24 md:py-8">
          <ErrorBoundary>
            {(activeTab === 'lab' || activeTab === 'translate' || activeTab === 'studio') && (
              <StudioTab 
                feed={feed}
                onVote={handleVote}
                onSubmitSentence={handleSubmitCorrection}
                apiKey={apiKey}
                englishInput={englishInput}
                setEnglishInput={setEnglishInput}
                translationResult={translationResult}
                isTranslating={isTranslating}
                onTranslate={handleTranslateInput}
                onOpenCorrectionModal={handleOpenCorrection}
                onQuickEndorse={handleQuickEndorse}
              />
            )}

            {activeTab === 'community' && (
              <CommunityLabTab 
                feed={feed}
                contributors={contributors}
                onVote={handleVote}
                onOpenNewSentenceModal={() => setIsNewSentenceOpen(true)}
                onExportJsonl={handleExportJsonl}
                isCloudSyncEnabled={isCloudSyncEnabled}
              />
            )}

            {activeTab === 'dictionary' && (
              <DictionaryTab />
            )}

            {activeTab === 'grammar' && (
              <GrammarTab />
            )}

            {activeTab === 'about' && (
              <AboutTab />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-12 py-8 text-center text-xs text-stone-500 mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <p className="font-semibold text-stone-800 text-sm">
            Dimasa AI Open Lingua Project • Documenting & Digitizing the Dimasa Language
          </p>
          <p className="text-stone-500">
            Initial vocabulary and linguistic grounding sourced from the Dimasa dictionary and linguistic survey records.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-1 font-medium text-stone-600">
            <a 
              href="https://developerthimpu.online" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-amber-700 underline underline-offset-2"
            >
              developerthimpu.online
            </a>
            <span>•</span>
            <a 
              href="mailto:developerthimpu@gmail.com" 
              className="hover:text-amber-700 underline underline-offset-2"
            >
              developerthimpu@gmail.com
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CorrectionModal 
        isOpen={isCorrectionOpen}
        onClose={() => setIsCorrectionOpen(false)}
        englishText={correctionTarget.english}
        currentTranslation={correctionTarget.currentTranslation}
        onSubmitCorrection={handleSubmitCorrection}
      />

      <NewSentenceModal 
        isOpen={isNewSentenceOpen}
        onClose={() => setIsNewSentenceOpen(false)}
        onSubmitNewSentence={handleSubmitCorrection}
      />

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        onClearFeed={handleClearFeed}
        hasCommunityData={feed.length > 0}
      />
    </div>
  );
}
