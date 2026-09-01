import React, { useState, useEffect } from 'react';
import { Navbar, AppTab, samplePersonas } from './components/Navbar';
import { ProgressDashboard } from './components/ProgressDashboard';
import { FoodPatternIntelligence } from './components/FoodPatternIntelligence';
import { ProductIntelligence } from './components/ProductIntelligence';
import { RecallAlertsView } from './components/RecallAlertsView';
import { LearningLibraryView } from './components/LearningLibraryView';
import { ProfilePage } from './pages/ProfilePage';
import { CommunityBrowsePage } from './pages/CommunityBrowsePage';
import { AlternativesComparisonPage } from './pages/AlternativesComparisonPage';
import { WebApiService } from './services/api';
import { ProgressDashboardData, PatternIntelligenceReport, RecallAlert } from '@shared/types';
import { UserProfile } from '@shared/types/user';
import { Camera, X, Sparkles, Check, CheckCircle2 } from 'lucide-react';

const defaultDashboard: ProgressDashboardData = {
  userId: 'usr-demo-rahul',
  userName: 'Harish Parthiban',
  runningAverageScore: 40,
  totalScans: 10,
  currentStreakDays: 3,
  longestStreakDays: 7,
  scansThisWeek: 4,
  healthTier: 'NEEDS_ATTENTION',
  recentScans: [
    { id: 's1', userId: 'usr-demo-rahul', productId: 'prod-maggi-2min', productName: 'Maggi 2-Minute Noodles', brand: 'Nestlé', category: 'Instant Noodles', scannedAt: new Date().toISOString(), personalizedScore: 17, sodiumMg: 850, sugarGrams: 1.5, saturatedFatGrams: 5.2, fiberGrams: 2.1, hasAdditives: true },
    { id: 's2', userId: 'usr-demo-rahul', productId: 'prod-muesli-whole-grain', productName: 'Whole Grain Millet Muesli', brand: 'TrueElements', category: 'Breakfast Cereals', scannedAt: new Date(Date.now() - 86400000).toISOString(), personalizedScore: 88, sodiumMg: 45, sugarGrams: 4.5, saturatedFatGrams: 0.5, fiberGrams: 7.5, hasAdditives: false },
    { id: 's3', userId: 'usr-demo-rahul', productId: 'prod-lays-magic-masala', productName: "Lay's Magic Masala Chips", brand: 'PepsiCo', category: 'Potato Chips', scannedAt: new Date(Date.now() - 2 * 86400000).toISOString(), personalizedScore: 28, sodiumMg: 240, sugarGrams: 1.2, saturatedFatGrams: 4.1, fiberGrams: 1.0, hasAdditives: true },
    { id: 's4', userId: 'usr-demo-rahul', productId: 'prod-bikaner-local-sev', productName: 'Local Bikaneri Besan Sev', brand: 'Shree Ram Namkeen', category: 'Regional Snacks', scannedAt: new Date(Date.now() - 3 * 86400000).toISOString(), personalizedScore: 45, sodiumMg: 310, sugarGrams: 0.5, saturatedFatGrams: 2.5, fiberGrams: 2.5, hasAdditives: false }
  ]
};

const defaultPatternReport: PatternIntelligenceReport = {
  userId: 'usr-demo-rahul',
  analyzedScansCount: 10,
  insights: [
    { metricKey: 'HIGH_SODIUM', title: 'High Sodium Foods', percentage: 40, sampleSize: 10, severity: 'HIGH_RISK', description: '40% of your last 10 scanned products contained high sodium (>500mg per serving).', actionableTip: 'Hypertension patients should target <140mg sodium per serving. Check for "Low Sodium" whole food alternatives.' },
    { metricKey: 'HIGH_ADDITIVES', title: 'Artificial Preservatives & Additives', percentage: 60, sampleSize: 10, severity: 'HIGH_RISK', description: '60% of your scanned products contained artificial preservatives (INS 211), colorants (INS 102), or flavor enhancers (INS 621).', actionableTip: 'Reduce ultra-processed foods. Choose products with short ingredient lists (<5 whole food ingredients).' },
    { metricKey: 'LOW_FIBER', title: 'Low Dietary Fiber Gap', percentage: 70, sampleSize: 10, severity: 'MODERATE_WARNING', description: '70% of scanned products provided less than 3g dietary fiber per serving.', actionableTip: 'Target 25-30g total fiber daily. Replace refined maida snacks with whole millet, lentil, or seed-based options.' },
    { metricKey: 'GOOD_FIBER', title: 'High Fiber Choices ✅', percentage: 20, sampleSize: 10, severity: 'HEALTHY_TREND', description: '20% of your scanned products provided high dietary fiber (≥5g per serving). Great work!', actionableTip: 'Keep choosing whole grain muesli and legumes for gut microbiome health.' }
  ],
  overallSummary: 'Your scanned diet (avg 40/100) is high risk for Hypertension. Focus on reducing sodium and artificial additives.'
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [targetProductId, setTargetProductId] = useState<string | undefined>(undefined);
  const [dashboardData, setDashboardData] = useState<ProgressDashboardData>(defaultDashboard);
  const [patternReport, setPatternReport] = useState<PatternIntelligenceReport>(defaultPatternReport);
  const [recalls, setRecalls] = useState<RecallAlert[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(samplePersonas[0]);
  const [loading, setLoading] = useState(false);

  // Theme State (Light / Dark)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('nutrilens_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nutrilens_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Global Camera Scan Simulator Modal
  const [showGlobalScanner, setShowGlobalScanner] = useState(false);
  const [scanStep, setScanStep] = useState<'CAMERA' | 'ANALYZING' | 'DONE'>('CAMERA');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const initAppData = async () => {
      try {
        const [dash, patterns, recs] = await Promise.all([
          WebApiService.getDashboard(activeProfile.id),
          WebApiService.getPatternIntelligence(activeProfile.id),
          WebApiService.getRecallAlerts()
        ]);
        if (dash) setDashboardData(dash);
        if (patterns) setPatternReport(patterns);
        if (recs) setRecalls(recs);
      } catch {
        // Instant fallback ready
      }
    };

    initAppData();
  }, [activeProfile.id]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavigateToIntelligence = (productId?: string) => {
    setTargetProductId(productId);
    setActiveTab('intelligence');
  };

  const handleSelectProfile = (profile: UserProfile) => {
    setActiveProfile(profile);
    showToast(`Switched active health persona to ${profile.name} (${profile.healthConditions.join(', ') || 'Standard'})`);
  };

  const handleSimulateScanComplete = () => {
    setScanStep('ANALYZING');
    setTimeout(() => {
      setScanStep('DONE');
      setTimeout(() => {
        setShowGlobalScanner(false);
        setScanStep('CAMERA');
        handleNavigateToIntelligence('prod-maggi-2min');
        showToast('Label scan complete! Evaluated for ' + activeProfile.name);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 transition-colors">
      
      {/* Toast Notification Container */}
      {toastMsg && (
        <div className="toast-container">
          <div className="toast-item">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        recallCount={recalls.length}
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
        onOpenScanner={() => setShowGlobalScanner(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSearchProduct={handleNavigateToIntelligence}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && ['dashboard', 'patterns'].includes(activeTab) ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-xs text-slate-400 font-semibold animate-pulse">Evaluating Nutri Lens Safety Engine for {activeProfile.name}...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && dashboardData && (
              <ProgressDashboard 
                data={dashboardData}
                onNavigateToPatterns={() => setActiveTab('patterns')}
                onNavigateToIntelligence={handleNavigateToIntelligence}
                activeProfile={activeProfile}
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
              <ProfilePage 
                activeProfile={activeProfile}
                onProfileUpdated={handleSelectProfile}
              />
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

      {/* Global Camera OCR Scanner Simulator Modal */}
      {showGlobalScanner && (
        <div className="modal-backdrop">
          <div className="modal-content relative text-center max-w-md">
            <button
              onClick={() => setShowGlobalScanner(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {scanStep === 'CAMERA' && (
              <div className="space-y-4 py-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Camera className="w-8 h-8 animate-pulse" />
                </div>
                <h2 className="font-heading text-xl font-bold text-white">Live Food Label Scanner</h2>
                <p className="text-xs text-slate-400">Position any Indian packaged snack label or barcode in camera view for real-time OCR extraction.</p>
                
                <div className="h-44 bg-slate-950 rounded-2xl border-2 border-dashed border-emerald-500/50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
                  <span className="text-xs text-emerald-400 font-bold mb-2">Simulated Camera Viewfinder</span>
                  <span className="text-[10px] text-slate-500">Maggi 2-Minute Masala Noodles • Barcode 8901058852011</span>
                </div>

                <button
                  onClick={handleSimulateScanComplete}
                  className="btn-primary w-full justify-center py-3"
                >
                  Capture &amp; Analyze Label
                </button>
              </div>
            )}

            {scanStep === 'ANALYZING' && (
              <div className="py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                <h3 className="font-heading text-lg font-bold text-white">Extracting Ingredients &amp; Additives...</h3>
                <p className="text-xs text-slate-400">Comparing INS codes against {activeProfile.name}'s health conditions...</p>
              </div>
            )}

            {scanStep === 'DONE' && (
              <div className="py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white">Analysis Complete!</h3>
                <p className="text-xs text-slate-400">Opening 6-Facet Ingredient Intelligence view...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <p className="font-semibold">Nutri Lens — AI-Powered Food Label &amp; Ingredient Intelligence Platform</p>
        <p className="mt-1 text-[11px] text-slate-600">Team CODESTRIX • Web Application</p>
      </footer>

    </div>
  );
};
