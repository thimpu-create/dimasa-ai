import React, { useState } from 'react';
import { X, Key, Check, AlertCircle, ExternalLink, Shield, Trash2 } from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  apiKey, 
  onSaveApiKey, 
  onClearFeed,
  hasCommunityData 
}) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleClearKey = () => {
    setInputKey('');
    onSaveApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-stone-900 text-base">Translation Engine Settings</h3>
              <p className="text-xs text-stone-400">Configure AI models & local storage</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engine status explanation */}
        <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-4 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-stone-800 font-semibold">
            <Shield className="w-4 h-4 text-amber-600" />
            <span>Dual-Engine Architecture</span>
          </div>
          <p className="text-stone-600 leading-relaxed">
            <strong>1. Offline Mode (Default):</strong> Uses the built-in <em>Dimasa Word Book</em> database and SOV grammar rules. Runs 100% locally in your browser with zero latency.
          </p>
          <p className="text-stone-600 leading-relaxed">
            <strong>2. Gemini 2.5 Flash Neural Mode:</strong> When you provide a Gemini API key, translations are enhanced with dynamic multilingual LLM reasoning grounded with the word book.
          </p>
        </div>

        {/* API Key Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <p className="text-[11px] text-stone-400 mt-1.5 flex items-center justify-between">
              <span>Saved in your browser's localStorage.</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-amber-700 hover:underline inline-flex items-center space-x-0.5"
              >
                <span>Get free key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>

          {/* Reset / Clear Local Feed Data */}
          {hasCommunityData && (
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">Reset community data:</span>
              <button
                type="button"
                onClick={onClearFeed}
                className="inline-flex items-center space-x-1 text-rose-600 hover:text-rose-700 font-semibold hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Local Submissions</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {apiKey && (
              <button
                type="button"
                onClick={handleClearKey}
                className="text-xs text-rose-600 hover:underline font-medium"
              >
                Remove Key (Switch to Offline)
              </button>
            )}
            <div className="flex items-center space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white shadow-md transition-all"
              >
                {saved ? <Check className="w-4 h-4 text-emerald-400" /> : null}
                <span>{saved ? 'Saved!' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
