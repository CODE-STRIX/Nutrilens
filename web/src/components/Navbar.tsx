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
    <header className="sticky top-0 z-50 transition-all" style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between min-h-16 py-2 md:py-0 gap-2 md:gap-4">

          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer shrink-0"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl p-0.5" style={{ background: 'var(--primary)' }}>
              <div className="logo-inner-bg w-full h-full rounded-[10px] flex items-center justify-center" style={{ background: 'var(--bg-card)' }}>
                <Sparkles className="w-5 h-5 animate-pulse-subtle" style={{ color: 'var(--primary)' }} />
              </div>
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight" style={{ color: 'var(--text-heading)' }}>
                Nutri<span style={{ color: 'var(--primary)' }}>Lens</span>
              </span>
              <p className="text-[11px] hidden lg:block" style={{ color: 'var(--text-muted)' }}>AI Food Safety &amp; Ingredient Intelligence</p>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <nav className="nav-tab-bar order-3 md:order-none flex w-full md:w-auto md:flex-1 md:min-w-0 items-center gap-1 p-1.5 rounded-2xl overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive ? 'nav-tab-btn active' : 'nav-tab-btn'
                  }`}
                  style={{
                    color: isActive ? 'var(--text-on-primary)' : 'var(--text-secondary)',
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 text-[10px] rounded-full font-black ${
                        isActive ? '' : 'animate-pulse'
                      }`}
                      style={isActive ? { backgroundColor: 'var(--bg-main)', color: 'var(--primary)' } : { backgroundColor: 'var(--color-danger)', color: 'var(--text-on-primary)' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Light / Dark Mode Toggle */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="nav-icon-btn p-2 rounded-xl cursor-pointer transition-all"
              >
                {theme === 'dark'
                  ? <Sun className="w-4 h-4 text-amber-400" />
                  : <Moon className="w-4 h-4 text-indigo-400" />
                }
              </button>
            )}

            {/* Quick Scan Button */}
            {onOpenScanner && (
              <button
                onClick={onOpenScanner}
                className="hidden lg:flex btn-primary items-center gap-2 px-3.5 py-2 text-xs"
              >
                <Camera className="w-4 h-4" />
                <span>Scan Food</span>
              </button>
            )}

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <div
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="nav-icon-btn flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs"
                  style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
                  {getInitials(currentPersona.name)}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--text-heading)' }}>
                    {currentPersona.name}
                    <ChevronDown className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div className="text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                    {currentPersona.healthConditions.join(', ') || 'No conditions'}
                  </div>
                </div>
              </div>

              {/* Persona Dropdown Menu */}
              {showPersonaMenu && (
                <div className="persona-dropdown-menu absolute right-0 top-full mt-3 w-80 sm:w-96 rounded-2xl z-[100] p-4 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <span className="text-xs font-black uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                      Switch Active Health Persona
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                      style={{ background: 'var(--color-safe-soft)', borderColor: 'var(--color-safe-border)', color: 'var(--color-safe)' }}>
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
                            isActive ? 'persona-card active' : 'persona-card'
                          }`}
                          style={isActive ? {
                            background: 'var(--color-safe-soft)',
                            borderColor: 'var(--color-safe)'
                          } : {
                            background: 'var(--bg-surface-alt)',
                            borderColor: 'var(--border-color)'
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0`}
                              style={isActive
                                ? { background: 'var(--color-safe)', color: 'var(--text-on-primary)' }
                                : { background: 'var(--border-color)', color: 'var(--text-secondary)' }
                              }
                            >
                              {getInitials(persona.name)}
                            </div>
                            <div className="space-y-0.5">
                              <div className="text-sm font-extrabold leading-tight" style={{ color: 'var(--text-heading)' }}>
                                {persona.name}
                              </div>
                              <div className="text-[11px] text-amber-400 font-semibold leading-tight">
                                {persona.healthConditions.join(', ') || 'Standard Health'}
                              </div>
                              <div className="text-[11px] font-medium leading-tight" style={{ color: 'var(--text-muted)' }}>
                                Allergies: {persona.allergies.join(', ') || 'None'}
                              </div>
                            </div>
                          </div>

                          {isActive && (
                            <span className="px-2 py-0.5 text-[10px] font-black rounded-full shrink-0 shadow-sm"
                              style={{ background: 'var(--color-safe)', color: 'var(--text-on-primary)' }}>
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
                    className="flex items-center justify-center gap-1.5 text-xs font-extrabold cursor-pointer transition-colors pt-2.5"
                    style={{ borderTop: '1px solid var(--border-color)', color: 'var(--color-indigo)' }}
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

      {/* Mobile Sub-nav */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 gap-2" style={{ borderTop: '1px solid var(--border-color)' }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-bold transition-all cursor-pointer ${
              activeTab === item.id ? 'nav-tab-btn active' : 'nav-tab-btn'
            }`}
            style={{
              color: activeTab === item.id ? 'var(--text-on-primary)' : 'var(--text-secondary)',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
