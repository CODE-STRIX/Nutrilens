import React, { useState, useEffect, lazy, Suspense } from 'react';
import './App.css';
import { Sidebar, BottomNav, AppTab } from './components/Sidebar';
import { usePersonaStore } from './store/persona';
import { CheckCircle2 } from 'lucide-react';

// Lazy-load all page components
const ProgressDashboard  = lazy(() => import('./components/ProgressDashboard').then(m => ({ default: m.ProgressDashboard })));
const FoodPatternIntelligence = lazy(() => import('./components/FoodPatternIntelligence').then(m => ({ default: m.FoodPatternIntelligence })));
const ProductIntelligence = lazy(() => import('./components/ProductIntelligence').then(m => ({ default: m.ProductIntelligence })));
const RecallAlertsView   = lazy(() => import('./components/RecallAlertsView').then(m => ({ default: m.RecallAlertsView })));
const LearningLibraryView = lazy(() => import('./components/LearningLibraryView').then(m => ({ default: m.LearningLibraryView })));
const ProfilePage        = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const CommunityBrowsePage = lazy(() => import('./pages/CommunityBrowsePage').then(m => ({ default: m.CommunityBrowsePage })));
const AlternativesComparisonPage = lazy(() => import('./pages/AlternativesComparisonPage').then(m => ({ default: m.AlternativesComparisonPage })));
const ScanPage           = lazy(() => import('./pages/ScanPage'));
const AboutPage          = lazy(() => import('./pages/AboutPage'));

// ── Fallback loader ───────────────────────────────────────────────────────────

const PageLoader: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
    gap: 'var(--sp-3)',
    color: 'var(--ink-3)',
    fontSize: 'var(--text-14)',
  }}>
    <div
      className="animate-spin"
      style={{
        width: 20,
        height: 20,
        border: '2px solid var(--rule)',
        borderTopColor: 'var(--ink)',
        borderRadius: '50%',
      }}
    />
    Loading
  </div>
);

// ── Toast ─────────────────────────────────────────────────────────────────────

interface Toast {
  id: number;
  message: string;
}

// ── App ───────────────────────────────────────────────────────────────────────

const RECALL_COUNT = 3; // seeded recall alert count

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('scan');
  const [targetProductId, setTargetProductId] = useState<string | undefined>(undefined);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [nextToastId, setNextToastId] = useState(0);

  // Global persona state
  const personaStore = usePersonaStore();

  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('nutrilens_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nutrilens_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  // Toast helpers
  const showToast = (message: string) => {
    const id = nextToastId;
    setNextToastId(n => n + 1);
    setToasts(ts => [...ts, { id, message }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 3500);
  };

  // Navigation helpers
  const handleNavigateToIntelligence = (productId?: string) => {
    setTargetProductId(productId);
    setActiveTab('intelligence');
  };

  const handleSelectPersona = (persona: typeof personaStore.active) => {
    personaStore.setActive(persona);
    showToast(`Scores recalculated for ${persona.name}.`);
  };

  return (
    <div className="app-shell">
      {/* ── Sidebar (desktop) ─────────────────────────────────────────── */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        recallCount={RECALL_COUNT}
        activePersona={personaStore.active}
        onSelectPersona={handleSelectPersona}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main className="main-content" id="main-content" tabIndex={-1}>
        {/* Skip link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only"
          style={{ position: 'absolute', top: 'var(--sp-2)', left: 'var(--sp-2)', zIndex: 999 }}
        >
          Skip to main content
        </a>

        {/* Live region for scan results (accessibility) */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          id="scan-status"
        />

        <Suspense fallback={<div className="page-container"><PageLoader /></div>}>
          <div className="page-container">

            {activeTab === 'scan' && (
              <ScanPage
                activePersona={personaStore.active}
                onNavigateToIntelligence={handleNavigateToIntelligence}
              />
            )}

            {activeTab === 'dashboard' && (
              <ProgressDashboard
                activePersona={personaStore.active}
                onNavigateToPatterns={() => setActiveTab('patterns')}
                onNavigateToIntelligence={handleNavigateToIntelligence}
                onNavigateToRecalls={() => setActiveTab('recalls')}
                onNavigateToAlternatives={() => setActiveTab('alternatives')}
              />
            )}

            {activeTab === 'patterns' && (
              <FoodPatternIntelligence
                activePersona={personaStore.active}
                onNavigateToIntelligence={handleNavigateToIntelligence}
              />
            )}

            {activeTab === 'intelligence' && (
              <ProductIntelligence
                initialProductId={targetProductId}
                activePersona={personaStore.active}
              />
            )}

            {activeTab === 'recalls' && (
              <RecallAlertsView />
            )}

            {activeTab === 'learning' && (
              <LearningLibraryView />
            )}

            {activeTab === 'profile' && (
              <ProfilePage
                activePersona={personaStore.active}
                onPersonaUpdated={handleSelectPersona}
              />
            )}

            {activeTab === 'community' && (
              <CommunityBrowsePage />
            )}

            {activeTab === 'alternatives' && (
              <AlternativesComparisonPage
                activePersona={personaStore.active}
              />
            )}

            {activeTab === 'about' && (
              <AboutPage />
            )}

          </div>
        </Suspense>
      </main>

      {/* ── Bottom Nav (mobile) ───────────────────────────────────────── */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        recallCount={RECALL_COUNT}
      />

      {/* ── Toast stack ───────────────────────────────────────────────── */}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className="toast animate-slide-up">
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
