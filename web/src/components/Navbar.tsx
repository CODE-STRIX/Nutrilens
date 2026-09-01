import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  BarChart3, 
  BookOpen, 
  Sparkles,
  AlertTriangle,
  Users,
  ArrowLeftRight,
  UserCircle2,
  Camera,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { UserProfile } from '@shared/types/user';

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
  activeProfile?: UserProfile;
  onSelectProfile?: (profile: UserProfile) => void;
  onOpenScanner?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const samplePersonas: UserProfile[] = [
  {
    id: 'usr-demo-rahul',
    name: 'Rahul Sharma',
    email: 'rahul.s@codestrix.in',
    age: 32,
    healthConditions: ['Hypertension'],
    allergies: ['Peanuts'],
    goals: ['LowSodium', 'HeartHealth'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'usr-demo-priya',
    name: 'Priya Nair',
    email: 'priya.nair@health.in',
    age: 27,
    healthConditions: ['Type2Diabetes'],
    allergies: ['Gluten'],
    goals: ['WeightLoss', 'LowSodium'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'usr-demo-anand',
    name: 'Anand Verma',
    email: 'anand.v@cardio.in',
    age: 45,
    healthConditions: ['HighCholesterol'],
    allergies: ['Dairy'],
    goals: ['HighProtein', 'HeartHealth'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  recallCount,
  activeProfile,
  onSelectProfile,
  onOpenScanner,
  theme = 'dark',
  onToggleTheme
}) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const currentPersona = activeProfile || samplePersonas[0];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const navItems: { id: AppTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'intelligence', label: 'Intelligence', icon: Sparkles },
    { id: 'patterns', label: 'Patterns', icon: BarChart3 },
    { id: 'alternatives', label: 'Alternatives', icon: ArrowLeftRight },
    { id: 'recalls', label: 'Recalls', icon: ShieldAlert, badge: recallCount },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'profile', label: 'Profile', icon: UserCircle2 }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                Nutri<span className="text-emerald-400">Lens</span>
              </span>
              <p className="text-[11px] text-slate-400 hidden lg:block">AI Food Safety &amp; Ingredient Intelligence</p>
            </div>
          </div>

          {/* Streamlined Top Navigation Tabs Bar */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-black ${
                      isActive ? 'bg-slate-950 text-white' : 'bg-rose-500 text-white animate-pulse'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar: Light/Dark Mode + Scanner + Persona Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Light / Dark Mode Toggle Button */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>
            )}

            {/* Quick Scan Action Button */}
            {onOpenScanner && (
              <button
                onClick={onOpenScanner}
                className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:opacity-90 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Scan Food</span>
              </button>
            )}

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  {getInitials(currentPersona.name)}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-semibold text-white flex items-center gap-1">
                    {currentPersona.name}
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <div className="text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3 h-3" /> {currentPersona.healthConditions.join(', ') || 'No conditions'}
                  </div>
                </div>
              </div>

              {/* Persona Dropdown Menu (100% Solid Opaque Square Card) */}
              {showPersonaMenu && (
                <div className="persona-dropdown-menu absolute right-0 top-full mt-3 w-80 sm:w-96 rounded-2xl border border-slate-700 shadow-2xl z-[100] p-4 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-wider">
                      Switch Active Health Persona
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Live AI Engine
                    </span>
                  </div>

                  <div className="space-y-2">
                    {samplePersonas.map((persona) => {
                      const isActive = currentPersona.id === persona.id;

                      return (
                        <div
                          key={persona.id}
                          onClick={() => {
                            if (onSelectProfile) onSelectProfile(persona);
                            setShowPersonaMenu(false);
                          }}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            isActive
                              ? 'bg-emerald-950/40 border-emerald-400 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                              isActive ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'bg-slate-800 text-slate-300'
                            }`}>
                              {getInitials(persona.name)}
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-sm font-extrabold text-white leading-tight">{persona.name}</div>
                              <div className="text-[11px] text-amber-300 font-semibold leading-tight">
                                {persona.healthConditions.join(', ') || 'Standard Health'}
                              </div>
                              <div className="text-[11px] text-slate-400 font-medium leading-tight">
                                Allergies: {persona.allergies.join(', ') || 'None'}
                              </div>
                            </div>
                          </div>

                          {isActive && (
                            <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-500 text-slate-950 rounded-full shrink-0 shadow-sm">
                              Active
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div 
                    onClick={() => {
                      setActiveTab('profile');
                      setShowPersonaMenu(false);
                    }}
                    className="pt-2.5 border-t border-slate-800 flex items-center justify-center gap-1.5 text-xs text-indigo-400 font-extrabold cursor-pointer hover:text-indigo-300 transition-colors"
                  >
                    <span>Manage Custom Health Profiles</span>
                    <span>→</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Streamlined Sub-nav */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-800 gap-2 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold transition-all ${
              activeTab === item.id ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};


