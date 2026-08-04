import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  BarChart3, 
  BookOpen, 
  Sparkles,
  AlertTriangle,
  Users,
  ArrowLeftRight,
  UserCircle2
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
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, recallCount }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                  Nutri<span className="text-emerald-400">Lens</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                  SIH 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">AI Food Safety &amp; Ingredient Intelligence</p>
            </div>
          </div>

          {/* Navigation Tabs — Person A + Person B */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 overflow-x-auto">
            {/* Person A tabs */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('patterns')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'patterns'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Patterns
            </button>

            <button
              onClick={() => setActiveTab('intelligence')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'intelligence'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Intelligence
            </button>

            <button
              onClick={() => setActiveTab('recalls')}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'recalls'
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Recalls
              {recallCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full animate-bounce">
                  {recallCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('learning')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'learning'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Learning
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-700 mx-1" />

            {/* Person B tabs */}
            <button
              onClick={() => setActiveTab('community')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'community'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              Community
            </button>

            <button
              onClick={() => setActiveTab('alternatives')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'alternatives'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              Alternatives
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <UserCircle2 className="w-4 h-4" />
              Profile
            </button>
          </nav>

          {/* Active Profile Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                RS
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white">Rahul Sharma</div>
                <div className="text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                  <AlertTriangle className="w-3 h-3" /> Hypertension + Peanut Allergy
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile sub-nav */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-800 gap-2 scrollbar-none">
        <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${activeTab === 'dashboard' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('patterns')} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${activeTab === 'patterns' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>Patterns</button>
        <button onClick={() => setActiveTab('intelligence')} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${activeTab === 'intelligence' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400'}`}>Product Search</button>
        <button onClick={() => setActiveTab('recalls')} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${activeTab === 'recalls' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400'}`}>Recalls ({recallCount})</button>
        <button onClick={() => setActiveTab('learning')} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${activeTab === 'learning' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}>Learning</button>
        <button onClick={() => setActiveTab('community')} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${activeTab === 'community' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400'}`}>Community</button>
        <button onClick={() => setActiveTab('alternatives')} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${activeTab === 'alternatives' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}>Alternatives</button>
        <button onClick={() => setActiveTab('profile')} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${activeTab === 'profile' ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400'}`}>Profile</button>
      </div>
    </header>
  );
};
