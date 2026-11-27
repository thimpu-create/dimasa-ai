import React from 'react';
import { Sparkles, Users, BookOpen, Languages, User, Key, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenSettings, apiKey, verifiedCount }) {
  const tabs = [
    { id: 'lab', label: 'Translate & Train', mobileLabel: 'Translate', icon: Sparkles },
    { id: 'community', label: 'Community Review', mobileLabel: 'Review', icon: Users, badge: verifiedCount },
    { id: 'dictionary', label: 'Word Book', mobileLabel: 'Words', icon: BookOpen },
    { id: 'grammar', label: 'Grammar Guide', mobileLabel: 'Grammar', icon: Languages },
    { id: 'about', label: 'About Creator', mobileLabel: 'Creator', icon: User }
  ];

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo & Brand */}
            <div 
              className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer select-none" 
              onClick={() => setActiveTab('lab')}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 flex-shrink-0">
                <span className="font-heading text-base sm:text-lg font-bold">DA</span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  <span className="font-heading text-base sm:text-lg font-bold tracking-tight text-stone-900">
                    Dimasa AI
                  </span>
                  <span className="text-[10px] sm:text-xs bg-amber-100 text-amber-800 font-semibold px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-300">
                    Training Lab
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-stone-500 hidden sm:block">Community-Powered Language Training Studio</p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex space-x-1 lg:space-x-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors relative ${
                      isActive
                        ? 'bg-amber-50 text-amber-800 border border-amber-200 font-semibold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700' : 'text-stone-500'}`} />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && tab.badge > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold bg-amber-600 text-white rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action: Settings / Key */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenSettings}
                className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  apiKey
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                }`}
                title="Configure Gemini API Key"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{apiKey ? 'Gemini Active' : 'Offline Mode'}</span>
                {apiKey && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Native-Style Mobile Bottom Navigation Bar (Thumb Friendly) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 safe-area-bottom shadow-lg">
        <div className="grid grid-cols-5 h-14">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center space-y-1 relative transition-colors ${
                  isActive ? 'text-amber-700 font-bold' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-600 stroke-[2.2]' : 'text-stone-400'}`} />
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 text-[9px] font-extrabold bg-amber-600 text-white rounded-full leading-tight">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight">{tab.mobileLabel}</span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-0.5 bg-amber-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
