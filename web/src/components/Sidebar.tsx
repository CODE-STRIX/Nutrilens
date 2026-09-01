import React, { useState } from 'react';
import {
  Camera,
  LayoutDashboard,
  BarChart3,
  Layers,
  ShieldAlert,
  ArrowLeftRight,
  BookOpen,
  Users,
  UserCircle2,
  Info,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  X
} from 'lucide-react';
import { UserProfile } from '@shared/types/user';
import { DEMO_PERSONAS, conditionLabel, allergenLabel } from '../store/persona';

// ── Types ────────────────────────────────────────────────────────────────────

export type AppTab =
  | 'scan'
  | 'dashboard'
  | 'patterns'
  | 'intelligence'
  | 'recalls'
  | 'alternatives'
  | 'learning'
  | 'community'
  | 'profile'
  | 'about';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  recallCount: number;
  activePersona: UserProfile;
  onSelectPersona: (p: UserProfile) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

// ── Navigation Structure ─────────────────────────────────────────────────────

import { LucideIcon } from 'lucide-react';

interface NavItem {
  id: AppTab;
  label: string;
  Icon: LucideIcon;
  badge?: number;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

// ── Sidebar (desktop, ≥1024px) ────────────────────────────────────────────────

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  recallCount,
  activePersona,
  onSelectPersona,
  theme,
  onToggleTheme
}) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const sections: NavSection[] = [
    {
      label: 'Scan',
      items: [
        { id: 'scan',         label: 'Scan and lookup', Icon: Camera },
        { id: 'intelligence', label: 'Product intelligence', Icon: Layers },
      ]
    },
    {
      label: 'Analyse',
      items: [
        { id: 'dashboard', label: 'Dashboard',       Icon: LayoutDashboard },
        { id: 'patterns',  label: 'Food patterns',   Icon: BarChart3 },
      ]
    },
    {
      label: 'Protect',
      items: [
        { id: 'recalls',      label: 'Recall centre', Icon: ShieldAlert, badge: recallCount },
        { id: 'alternatives', label: 'Alternatives',  Icon: ArrowLeftRight },
      ]
    },
    {
      label: 'Learn',
      items: [
        { id: 'learning',   label: 'Learning modules', Icon: BookOpen },
        { id: 'community',  label: 'Community',         Icon: Users },
      ]
    },
  ];

  const initials = activePersona.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="#FBFCFA" strokeWidth="2" />
            <path d="M5 9a4 4 0 0 1 8 0" stroke="#52A87A" strokeWidth="2" strokeLinecap="round" />
            <circle cx="9" cy="9" r="1.5" fill="#52A87A" />
          </svg>
        </div>
        <div className="sidebar-logo-text">NutriLens</div>
      </div>

      {/* Demo mode chip */}
      <div className="sidebar-demo-chip" aria-label="Demo data mode active">
        <CheckCircle2 size={12} />
        Demo data
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {sections.map(section => (
          <div key={section.label}>
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map(item => (
              <button
                key={item.id}
                className={`sidebar-item${activeTab === item.id ? ' active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                aria-current={activeTab === item.id ? 'page' : undefined}
              >
                <item.Icon size={16} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="sidebar-item-badge" aria-label={`${item.badge} alerts`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--rule)' }} />

        {/* Secondary nav */}
        <div>
          <button
            className={`sidebar-item${activeTab === 'profile' ? ' active' : ''}`}
            onClick={() => setActiveTab('profile')}
            aria-current={activeTab === 'profile' ? 'page' : undefined}
          >
            <UserCircle2 size={16} />
            <span>Profile</span>
          </button>
          <button
            className={`sidebar-item${activeTab === 'about' ? ' active' : ''}`}
            onClick={() => setActiveTab('about')}
            aria-current={activeTab === 'about' ? 'page' : undefined}
          >
            <Info size={16} />
            <span>About</span>
          </button>
          <button className="sidebar-item" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light theme' : 'Dark theme'}</span>
          </button>
        </div>
      </nav>

      {/* Persona selector at bottom */}
      <div className="sidebar-persona">
        <div
          className="sidebar-persona-card"
          role="button"
          tabIndex={0}
          onClick={() => setShowPersonaMenu(v => !v)}
          onKeyDown={e => e.key === 'Enter' && setShowPersonaMenu(v => !v)}
          aria-expanded={showPersonaMenu}
          aria-haspopup="listbox"
          aria-label={`Active persona: ${activePersona.name}. Click to switch.`}
        >
          <div className="sidebar-persona-avatar" aria-hidden="true">{initials}</div>
          <div className="sidebar-persona-info">
            <div className="sidebar-persona-name">{activePersona.name}</div>
            <div className="sidebar-persona-condition">
              {activePersona.healthConditions.length > 0
                ? conditionLabel(activePersona.healthConditions[0])
                : 'No conditions set'}
            </div>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--ink-3)', flexShrink: 0 }} aria-hidden="true" />
        </div>

        {/* Medical disclaimer */}
        <p className="medical-disclaimer" style={{ marginTop: 'var(--sp-3)' }}>
          NutriLens gives general nutrition information based on the label and your saved profile.
          It is not medical advice. Talk to a doctor or a registered dietitian about your diet.
        </p>
      </div>

      {/* Persona switcher modal */}
      {showPersonaMenu && (
        <PersonaMenu
          activePersona={activePersona}
          onSelect={(p) => { onSelectPersona(p); setShowPersonaMenu(false); }}
          onClose={() => setShowPersonaMenu(false)}
          onOpenProfile={() => { setActiveTab('profile'); setShowPersonaMenu(false); }}
        />
      )}
    </aside>
  );
};

// ── Persona Menu Modal ────────────────────────────────────────────────────────

interface PersonaMenuProps {
  activePersona: UserProfile;
  onSelect: (p: UserProfile) => void;
  onClose: () => void;
  onOpenProfile: () => void;
}

const PersonaMenu: React.FC<PersonaMenuProps> = ({ activePersona, onSelect, onClose, onOpenProfile }) => {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Switch health persona" onClick={onClose}>
      <div
        className="modal-panel animate-slide-up"
        style={{ maxWidth: 400 }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
          <h3 style={{ fontSize: 'var(--text-20)', fontFamily: 'Archivo, sans-serif', fontWeight: 600 }}>
            Switch health persona
          </h3>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onClose}
            aria-label="Close"
            style={{ padding: 'var(--sp-1)' }}
          >
            <X size={16} />
          </button>
        </div>

        <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', marginBottom: 'var(--sp-4)' }}>
          Scores and alerts will be recalculated for the selected profile.
        </p>

        <div role="listbox" aria-label="Health personas" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          {DEMO_PERSONAS.map(persona => {
            const isActive = activePersona.id === persona.id;
            const initials = persona.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

            return (
              <button
                key={persona.id}
                role="option"
                aria-selected={isActive}
                onClick={() => onSelect(persona)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--sp-3)',
                  padding: 'var(--sp-4)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${isActive ? 'var(--ink)' : 'var(--rule)'}`,
                  background: isActive ? 'var(--surface-sunk)' : 'var(--surface)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'border-color 0.15s',
                  fontFamily: 'inherit',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'var(--ink)' : 'var(--surface-sunk)',
                    color: isActive ? 'var(--ink-invert)' : 'var(--ink-2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Archivo, sans-serif',
                    fontWeight: 600,
                    fontSize: 'var(--text-14)',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-14)', color: 'var(--ink)', marginBottom: 2 }}>
                    {persona.name}
                    {isActive && (
                      <span style={{
                        marginLeft: 'var(--sp-2)',
                        fontSize: 'var(--text-12)',
                        fontWeight: 500,
                        color: 'var(--ink-3)',
                      }}>
                        — active
                      </span>
                    )}
                  </div>
                  {persona.healthConditions.length > 0 && (
                    <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-2)', marginBottom: 2 }}>
                      {persona.healthConditions.map(conditionLabel).join(', ')}
                    </div>
                  )}
                  {persona.allergies.length > 0 && (
                    <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)' }}>
                      Avoids: {persona.allergies.map(allergenLabel).join(', ')}
                    </div>
                  )}
                </div>
                {isActive && <CheckCircle2 size={16} style={{ color: 'var(--verdict-ok)', flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 'var(--sp-4)', borderTop: '1px solid var(--rule)', paddingTop: 'var(--sp-4)' }}>
          <button
            className="btn btn-secondary"
            style={{ width: '100%' }}
            onClick={onOpenProfile}
          >
            <UserCircle2 size={14} />
            Manage profiles
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Bottom Nav (mobile, <1024px) ──────────────────────────────────────────────

interface BottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  recallCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, recallCount }) => {
  const items: NavItem[] = [
    { id: 'scan',         label: 'Scan',       Icon: Camera },
    { id: 'dashboard',    label: 'Dashboard',  Icon: LayoutDashboard },
    { id: 'intelligence', label: 'Product',    Icon: Layers },
    { id: 'recalls',      label: 'Recalls',    Icon: ShieldAlert, badge: recallCount },
    { id: 'learning',     label: 'Learn',      Icon: BookOpen },
  ];

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {items.map(item => (
        <button
          key={item.id}
          className={`bottom-nav-item${activeTab === item.id ? ' active' : ''}`}
          onClick={() => setActiveTab(item.id)}
          aria-current={activeTab === item.id ? 'page' : undefined}
        >
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <item.Icon size={20} />
            {item.badge !== undefined && item.badge > 0 && (
              <span
                aria-label={`${item.badge} alerts`}
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  minWidth: 14,
                  height: 14,
                  background: 'var(--verdict-avoid)',
                  color: '#FFF',
                  borderRadius: 7,
                  fontSize: 9,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 2px',
                }}
              >
                {item.badge}
              </span>
            )}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
