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
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [targetProductId, setTargetProductId] = useState<string | undefined>(undefined);
  const [dashboardData, setDashboardData] = useState<ProgressDashboardData | null>(null);
  const [patternReport, setPatternReport] = useState<PatternIntelligenceReport | null>(null);
  const [recalls, setRecalls] = useState<RecallAlert[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleNavigateToIntelligence = (productId?: string) => {
    setTargetProductId(productId);
    setActiveTab('intelligence');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        recallCount={recalls.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Person A tabs: show loading spinner only for data-dependent tabs */}
        {loading && ['dashboard', 'patterns'].includes(activeTab) ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-semibold animate-pulse">Loading Nutri Lens Intelligence Engine...</p>
          </div>
        ) : (
          <>
            {/* ── Person A Tabs ── */}
            {activeTab === 'dashboard' && dashboardData && (
              <ProgressDashboard 
                data={dashboardData}
                onNavigateToPatterns={() => setActiveTab('patterns')}
                onNavigateToIntelligence={handleNavigateToIntelligence}
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

            {/* ── Person B Tabs ── */}
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
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <p>Nutri Lens — AI-Powered Food Label &amp; Ingredient Intelligence Platform</p>
        <p className="mt-1 text-[11px] text-slate-600">Smart India Hackathon 2026 • Team CODESTRIX • Web App (Person A + Person B)</p>
      </footer>

    </div>
  );
};
