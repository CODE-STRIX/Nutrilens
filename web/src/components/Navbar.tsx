import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  BarChart3, 
  BookOpen, 
  Sparkles,
  Users,
  ArrowLeftRight,
  UserCircle2,
  Search,
  Sun,
  Moon,
  Stethoscope
} from 'lucide-react';

export type AppTab = 
  | 'dashboard' 
  | 'patterns' 
  | 'intelligence' 
  | 'recalls' 
  | 'learning'
  | 'profile'
  | 'community'
  | 'alternatives';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  recallCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSearchProduct?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  recallCount,
  theme,
  onToggleTheme,
  onSearchProduct 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearchProduct) {
        onSearchProduct(searchQuery.trim());
      }
      setActiveTab('intelligence');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Quick Search */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse-subtle" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-xl tracking-tight">
                    Nutri<span className="text-emerald-500">Lens</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full">
                    SIH 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Lookup Bar */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Product / INS Code..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-800/40 border border-slate-700/60 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </form>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-800/30 border border-slate-700/40">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('intelligence')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'intelligence'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Explorer
            </button>

            <button
              onClick={() => setActiveTab('patterns')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'patterns'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Patterns
            </button>

            <button
              onClick={() => setActiveTab('recalls')}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'recalls'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Alerts
              {recallCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 text-[9px] font-bold bg-rose-600 text-white rounded-full animate-bounce">
                  {recallCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'community'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Community
            </button>

            <button
              onClick={() => setActiveTab('alternatives')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'alternatives'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }`}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Alternatives
            </button>

            <button
              onClick={() => setActiveTab('learning')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'learning'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Learning
            </button>
          </nav>

          {/* Right Controls: Health Profile Pill + Theme Toggle + User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Active Health Profile Pill */}
            <div 
              onClick={() => setActiveTab('profile')} 
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 cursor-pointer hover:bg-sky-500/20 transition-all text-xs font-medium"
              title="Click to manage health profile"
            >
              <Stethoscope className="w-3.5 h-3.5 text-sky-400" />
              <span className="truncate max-w-[150px]">Hypertension Active</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-slate-700/50 hover:bg-slate-700/30 text-slate-300 transition-all"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>

            {/* User Avatar Pill */}
            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-slate-700/40 bg-slate-800/30 cursor-pointer hover:border-emerald-500/40 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                RS
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile Sub-Nav */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-800/60 gap-2 scrollbar-none">
        <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('intelligence')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${activeTab === 'intelligence' ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}>Explorer</button>
        <button onClick={() => setActiveTab('patterns')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${activeTab === 'patterns' ? 'bg-emerald-500 text-white' : 'text-slate-400'}`}>Patterns</button>
        <button onClick={() => setActiveTab('recalls')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${activeTab === 'recalls' ? 'bg-rose-500 text-white' : 'text-slate-400'}`}>Alerts ({recallCount})</button>
        <button onClick={() => setActiveTab('community')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${activeTab === 'community' ? 'bg-amber-500 text-white' : 'text-slate-400'}`}>Community</button>
        <button onClick={() => setActiveTab('alternatives')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${activeTab === 'alternatives' ? 'bg-sky-500 text-white' : 'text-slate-400'}`}>Alternatives</button>
        <button onClick={() => setActiveTab('learning')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${activeTab === 'learning' ? 'bg-cyan-500 text-white' : 'text-slate-400'}`}>Learning</button>
        <button onClick={() => setActiveTab('profile')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${activeTab === 'profile' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}>Profile</button>
      </div>
    </header>
  );
};

