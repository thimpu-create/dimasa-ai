import React, { useState } from 'react';
import { 
  Globe, Mail, BookOpen, Sparkles, Heart, ExternalLink, 
  Copy, Check, Code, ShieldCheck, Database, Award
} from 'lucide-react';

export default function AboutTab() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const email = "developerthimpu@gmail.com";
  const portfolioUrl = "https://developerthimpu.online";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-200 text-xs font-semibold mb-4">
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Language Preservation & AI Technology</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
            About the Project & Creator
          </h1>
          <p className="mt-3 text-stone-300 text-sm sm:text-base leading-relaxed">
            Dimasa AI is an open-source initiative dedicated to documenting, digitizing, and building 
            modern translation AI for the Dimasa language.
          </p>
        </div>
      </div>

      {/* Grid: Creator Info & Data Provenance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Creator Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-heading">The Creator</h2>
                <p className="text-xs text-amber-700 font-semibold">Software Developer & Architect</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Passionate about bridging low-resource languages with modern generative AI. This project 
              was built to give native speakers an open, community-driven platform to test, correct, 
              and train authentic AI models.
            </p>
          </div>

          {/* Contact & Portfolio Links */}
          <div className="space-y-3 pt-4 border-t border-stone-100">
            {/* Portfolio Link */}
            <a
              href={portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 hover:bg-amber-50/70 border border-stone-200 hover:border-amber-300 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 group-hover:text-amber-700">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Portfolio</span>
                  <span className="text-xs sm:text-sm font-bold text-stone-800 group-hover:text-amber-900">developerthimpu.online</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-amber-700" />
            </a>

            {/* Email Contact */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Contact Email</span>
                  <a href={`mailto:${email}`} className="text-xs sm:text-sm font-bold text-stone-800 hover:text-amber-700">
                    {email}
                  </a>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors"
                title="Copy Email"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Data Provenance & Dictionary Source Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900 font-heading">Data & Linguistic Grounding</h2>
                <p className="text-xs text-emerald-700 font-semibold">Dictionary & Linguistic Records</p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
              <p>
                <strong>Initial Data Source:</strong> All initial vocabulary entries, phonetic transcriptions (IPA), 
                and core semantic categories in this application are directly compiled from the <strong>Dimasa dictionary</strong> and 
                linguistic survey documentation.
              </p>
              <p>
                <strong>Community-Driven Improvement:</strong> Because foundation AI models have near-zero native 
                Dimasa data, the <em>Community Lab</em> serves as a human-in-the-loop validation platform. Native 
                speakers review AI drafts, provide grammatical corrections, and upvote accurate sentences.
              </p>
              <p>
                <strong>Open Fine-Tuning:</strong> Every verified sentence is automatically structured into fine-tuning 
                datasets to train custom open-source Dimasa translation models.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-2xl">
            <p className="text-xs text-amber-900 font-medium">
              💡 Have additional dictionary sources, literature, or grammar materials you'd like to integrate? Reach out directly via email or the portfolio link!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
