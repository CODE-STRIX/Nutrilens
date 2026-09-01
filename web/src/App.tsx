import React, { useState, useEffect } from 'react';
import { Navbar, AppTab } from './components/Navbar';
import { ProgressDashboard } from './components/ProgressDashboard';
import { FoodPatternIntelligence } from './components/FoodPatternIntelligence';
import { ProductIntelligence } from './components/ProductIntelligence';
import { RecallAlertsView } from './components/RecallAlertsView';
import { LearningLibraryView } from './components/LearningLibraryView';
// Person B pages
import { ProfilePage } from './pages/ProfilePage';
import { CommunityBrowsePage } from './pages/CommunityBrowsePage';
import { AlternativesComparisonPage } from './pages/AlternativesComparisonPage';
import { WebApiService } from './services/api';
import { ProgressDashboardData, PatternIntelligenceReport, RecallAlert } from '@shared/types';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [targetProductId, setTargetProductId] = useState<string | undefined>(undefined);
  const [dashboardData, setDashboardData] = useState<ProgressDashboardData | null>(null);
  const [patternReport, setPatternReport] = useState<PatternIntelligenceReport | null>(null);
  const [recalls, setRecalls] = useState<RecallAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const initAppData = async () => {
      setLoading(true);
      const [dash, patterns, recs] = await Promise.all([
        WebApiService.getDashboard('usr-demo-rahul'),
        WebApiService.getPatternIntelligence('usr-demo-rahul'),
        WebApiService.getRecallAlerts()
      ]);

      setDashboardData(dash);
      setPatternReport(patterns);
      setRecalls(recs);
      setLoading(false);
    };

    initAppData();
  }, []);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavigateToIntelligence = (productId?: string) => {
    setTargetProductId(productId);
    setActiveTab('intelligence');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        recallCount={recalls.length}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onSearchProduct={handleNavigateToIntelligence}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading spinner */}
        {loading && ['dashboard', 'patterns'].includes(activeTab) ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-semibold animate-pulse">Loading Nutri Lens Intelligence Engine...</p>
          </div>
        ) : (
          <>
            {/* ── Dashboard (4-Zone 2-Column Layout) ── */}
            {activeTab === 'dashboard' && dashboardData && (
              <ProgressDashboard 
                data={dashboardData}
                onNavigateToPatterns={() => setActiveTab('patterns')}
                onNavigateToIntelligence={handleNavigateToIntelligence}
                onNavigateToRecalls={() => setActiveTab('recalls')}
                onNavigateToCommunity={() => setActiveTab('community')}
                onNavigateToAlternatives={() => setActiveTab('alternatives')}
              />
            )}

            {activeTab === 'patterns' && patternReport && (
              <FoodPatternIntelligence 
                report={patternReport}
                onNavigateToIntelligence={handleNavigateToIntelligence}
              />
            )}

            {activeTab === 'intelligence' && (
              <ProductIntelligence 
                initialProductId={targetProductId}
              />
            )}

            {activeTab === 'recalls' && (
              <RecallAlertsView />
            )}

            {activeTab === 'learning' && (
              <LearningLibraryView />
            )}

            {activeTab === 'profile' && (
              <ProfilePage />
            )}

            {activeTab === 'community' && (
              <CommunityBrowsePage />
            )}

            {activeTab === 'alternatives' && (
              <AlternativesComparisonPage />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 mt-12 text-center text-xs text-slate-400">
        <p className="font-semibold">NutriLens — Food Safety &amp; Ingredient Intelligence Platform</p>
      </footer>

    </div>
  );
};

