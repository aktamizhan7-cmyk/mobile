import React from 'react';
import {
  Sparkles,
  Layers,
  FileSpreadsheet,
  Columns,
  BookmarkCheck,
  Sun,
  Moon,
  ShieldAlert,
  Smartphone,
  Cpu,
  Monitor,
} from 'lucide-react';
import { useUserAccount } from '../../context/UserAccountContext';
import { ThorLogo } from './ThorLogo';

interface HeaderProps {
  currentTab: 'home' | 'builder' | 'displays' | 'processors' | 'compare' | 'quotation' | 'dashboard' | 'admin';
  setCurrentTab: (tab: 'home' | 'builder' | 'displays' | 'processors' | 'compare' | 'quotation' | 'dashboard' | 'admin') => void;
  openSajaseModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, openSajaseModal }) => {
  const { theme, toggleTheme, compareList, savedConfigurations, isAdmin, setIsAdmin } = useUserAccount();

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Monogram */}
        <div
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-400 to-blue-500 p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center p-1">
              <ThorLogo variant="emblem" size={30} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base text-zinc-100 font-mono">
                THOR
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                PROVISIONAL BOM
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 hidden sm:block">
              Build the phone you actually want.
            </div>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-300">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentTab === 'home'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'hover:text-white hover:bg-zinc-900'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentTab('builder')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentTab === 'builder'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Builder</span>
          </button>
          <button
            onClick={() => setCurrentTab('displays')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentTab === 'displays'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>Display Lab</span>
          </button>
          <button
            onClick={() => setCurrentTab('processors')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentTab === 'processors'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>SoC Lab</span>
          </button>
          <button
            onClick={() => setCurrentTab('compare')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors relative ${
              currentTab === 'compare'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Columns className="w-4 h-4 text-zinc-400" />
            <span>Compare</span>
            {compareList.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-cyan-500 text-black text-[10px] font-bold flex items-center justify-center">
                {compareList.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentTab('quotation')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              currentTab === 'quotation'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'hover:text-white hover:bg-zinc-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-zinc-400" />
            <span>Quotation</span>
          </button>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors relative ${
              currentTab === 'dashboard'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'hover:text-white hover:bg-zinc-900'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-zinc-400" />
            <span>Saved ({savedConfigurations.length})</span>
          </button>
        </nav>

        {/* Right Actions: ASK SAJASE & System tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* SAJASE Quick AI Assistant Trigger */}
          <button
            onClick={openSajaseModal}
            className="relative group overflow-hidden px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-black animate-pulse" />
            <span>ASK SAJASE</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Admin toggle for testing / demo */}
          <button
            onClick={() => {
              setIsAdmin(!isAdmin);
              if (!isAdmin) setCurrentTab('admin');
            }}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-colors ${
              isAdmin
                ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400'
            }`}
            title="Toggle Admin Mode"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden lg:inline text-[11px] font-mono">{isAdmin ? 'Admin ON' : 'Admin'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden items-center justify-around border-t border-zinc-800/80 px-2 py-1.5 bg-zinc-950 text-xs">
        <button
          onClick={() => setCurrentTab('home')}
          className={`px-2 py-1 rounded ${currentTab === 'home' ? 'text-cyan-400 font-bold' : 'text-zinc-400'}`}
        >
          Home
        </button>
        <button
          onClick={() => setCurrentTab('builder')}
          className={`px-2 py-1 rounded ${currentTab === 'builder' ? 'text-cyan-400 font-bold' : 'text-zinc-400'}`}
        >
          Builder
        </button>
        <button
          onClick={() => setCurrentTab('displays')}
          className={`px-2 py-1 rounded ${currentTab === 'displays' ? 'text-cyan-400 font-bold' : 'text-zinc-400'}`}
        >
          Display Lab
        </button>
        <button
          onClick={() => setCurrentTab('processors')}
          className={`px-2 py-1 rounded ${currentTab === 'processors' ? 'text-cyan-400 font-bold' : 'text-zinc-400'}`}
        >
          SoC Lab
        </button>
        <button
          onClick={() => setCurrentTab('compare')}
          className={`px-2 py-1 rounded flex items-center gap-1 ${
            currentTab === 'compare' ? 'text-cyan-400 font-bold' : 'text-zinc-400'
          }`}
        >
          Compare ({compareList.length})
        </button>
        <button
          onClick={() => setCurrentTab('quotation')}
          className={`px-2 py-1 rounded ${currentTab === 'quotation' ? 'text-cyan-400 font-bold' : 'text-zinc-400'}`}
        >
          Quotation
        </button>
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`px-2 py-1 rounded ${currentTab === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-zinc-400'}`}
        >
          Saved
        </button>
      </div>
    </header>
  );
};
