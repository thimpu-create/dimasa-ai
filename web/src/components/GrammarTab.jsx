import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle, Layers, Check } from 'lucide-react';
import { grammarRules } from '../data/dimasa_wordbook';

export default function GrammarTab() {
  const { word_order, features, pronouns, question_words } = grammarRules;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Linguistic Survey & Grammar Specification</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-heading">
          Dimasa Language Structural Rules
        </h2>
      </div>

      {/* Grid of Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Word Order SOV */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">1</span>
            <h3 className="text-sm font-bold text-stone-900">Word Order: SOV (Verb-Final)</h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Unlike English (which is Subject-Verb-Object), an unmarked Dimasa sentence always places the <strong>Verb at the very end</strong>:
          </p>
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-mono">
              <span className="text-stone-500">English (SVO):</span>
              <span className="font-semibold text-stone-800">"The tiger drinks water"</span>
            </div>
            <div className="flex items-center justify-between font-mono pt-1 border-t border-stone-200/60">
              <span className="text-amber-800 font-semibold">Dimasa (SOV):</span>
              <span className="font-bold text-amber-900">"Misi [Subject] di [Object] longdu [Verb]"</span>
            </div>
          </div>
        </div>

        {/* 2. Tense & Aspect Markers */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">2</span>
            <h3 className="text-sm font-bold text-stone-900">Tense & Aspect Suffixes</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-start justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
              <div>
                <span className="font-bold text-stone-900">-du / -duhi</span>
                <p className="text-stone-500 text-[11px]">Present continuous / habitual</p>
              </div>
              <span className="font-mono text-amber-800 text-[11px]">thangdu (is going)</span>
            </div>
            <div className="flex items-start justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
              <div>
                <span className="font-bold text-stone-900">-ba</span>
                <p className="text-stone-500 text-[11px]">Past completed tense</p>
              </div>
              <span className="font-mono text-amber-800 text-[11px]">thangba (went)</span>
            </div>
            <div className="flex items-start justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
              <div>
                <span className="font-bold text-stone-900">-nang / -ma</span>
                <p className="text-stone-500 text-[11px]">Future intention</p>
              </div>
              <span className="font-mono text-amber-800 text-[11px]">thangnang (will go)</span>
            </div>
            <div className="flex items-start justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
              <div>
                <span className="font-bold text-stone-900">da- / -ya</span>
                <p className="text-stone-500 text-[11px]">Negation (da- imperative, -ya statement)</p>
              </div>
              <span className="font-mono text-amber-800 text-[11px]">dathang (don't go!)</span>
            </div>
          </div>
        </div>

        {/* 3. Numeral Classifiers */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">3</span>
            <h3 className="text-sm font-bold text-stone-900">Numeral Classifiers</h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Dimasa requires specific classifiers when counting objects:
          </p>
          <div className="space-y-1.5 text-xs">
            <div className="p-2 bg-stone-50 rounded-lg flex justify-between items-center">
              <span className="font-semibold text-stone-800">sao-</span>
              <span className="text-stone-500">Human beings (e.g. <em>subung sao-si</em> = 1 person)</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg flex justify-between items-center">
              <span className="font-semibold text-stone-800">ma-</span>
              <span className="text-stone-500">Animals / birds (e.g. <em>alu ma-si</em> = 1 cat)</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg flex justify-between items-center">
              <span className="font-semibold text-stone-800">gong-</span>
              <span className="text-stone-500">Long/cylindrical objects (e.g. <em>repgong gong-si</em> = 1 pen)</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg flex justify-between items-center">
              <span className="font-semibold text-stone-800">thai-</span>
              <span className="text-stone-500">Fruits / round objects (e.g. <em>thaigao thai-si</em> = 1 fruit)</span>
            </div>
          </div>
        </div>

        {/* 4. Case Postpositions */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
            <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">4</span>
            <h3 className="text-sm font-bold text-stone-900">Case Relations (Postpositions)</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-stone-50 rounded-lg flex justify-between items-center">
              <div>
                <span className="font-bold text-stone-800">Accusative (-ke)</span>
                <p className="text-[11px] text-stone-500">Marks direct object</p>
              </div>
              <span className="font-mono text-amber-900">angke (me), boke (him)</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg flex justify-between items-center">
              <div>
                <span className="font-bold text-stone-800">Genitive (-ni)</span>
                <p className="text-[11px] text-stone-500">Possession / belonging</p>
              </div>
              <span className="font-mono text-amber-900">ani (my), nini (your)</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg flex justify-between items-center">
              <div>
                <span className="font-bold text-stone-800">Locative (-ha)</span>
                <p className="text-[11px] text-stone-500">Location / place</p>
              </div>
              <span className="font-mono text-amber-900">noha (at house/home)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pronouns Reference Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
          Pronoun Conjugation Reference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase">
                <th className="py-2.5 px-3">Person</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Object (-ke)</th>
                <th className="py-2.5 px-3">Possessive (-ni)</th>
                <th className="py-2.5 px-3">Reflexive (-jar)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-stone-500">1st Person (I)</td>
                <td className="py-2.5 px-3 font-bold text-amber-900">ang</td>
                <td className="py-2.5 px-3 font-mono">angke</td>
                <td className="py-2.5 px-3 font-mono">ani</td>
                <td className="py-2.5 px-3 font-mono">angjar</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-stone-500">2nd Person (You)</td>
                <td className="py-2.5 px-3 font-bold text-amber-900">ning</td>
                <td className="py-2.5 px-3 font-mono">ningke</td>
                <td className="py-2.5 px-3 font-mono">nini</td>
                <td className="py-2.5 px-3 font-mono">ningjar</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-stone-500">3rd Person (He/She)</td>
                <td className="py-2.5 px-3 font-bold text-amber-900">bo</td>
                <td className="py-2.5 px-3 font-mono">boke</td>
                <td className="py-2.5 px-3 font-mono">boni</td>
                <td className="py-2.5 px-3 font-mono">bo-jar</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-stone-500">1st Person Plural (We)</td>
                <td className="py-2.5 px-3 font-bold text-amber-900">jing</td>
                <td className="py-2.5 px-3 font-mono">jingke</td>
                <td className="py-2.5 px-3 font-mono">jini</td>
                <td className="py-2.5 px-3 font-mono">jingjar</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-stone-500">3rd Person Plural (They)</td>
                <td className="py-2.5 px-3 font-bold text-amber-900">bonsi</td>
                <td className="py-2.5 px-3 font-mono">bonsike</td>
                <td className="py-2.5 px-3 font-mono">bonsini</td>
                <td className="py-2.5 px-3 font-mono">bonsijar</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
