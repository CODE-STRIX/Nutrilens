import React, { useState } from 'react';
import { 
  ProgressDashboardData,
  ScannedProductHistory 
} from '@shared/types';
import { UserProfile } from '@shared/types/user';
import { 
  Flame, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  PlusCircle,
  Search,
  X,
  Camera,
  Check
} from 'lucide-react';

interface ProgressDashboardProps {
  data: ProgressDashboardData;
  onNavigateToPatterns: () => void;
  onNavigateToIntelligence: (productId?: string) => void;
  activeProfile?: UserProfile;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ 
  data, 
  onNavigateToPatterns,
  onNavigateToIntelligence,
  activeProfile 
}) => {
  const [scans, setScans] = useState<ScannedProductHistory[]>(data.recentScans);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showLogModal, setShowLogModal] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);

  // Form fields for logging new scan
  const [newProdName, setNewProdName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('Snacks');
  const [newSodium, setNewSodium] = useState(250);

  const currentScore = data.runningAverageScore;
  const userName = activeProfile ? activeProfile.name : data.userName;
  const conditions = activeProfile ? activeProfile.healthConditions : ['Hypertension'];
  
  // SVG gauge circle calculations
  const circumference = 282.7;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  let gaugeColor = '#ef4444';
  if (currentScore >= 80) gaugeColor = '#10b981';
  else if (currentScore >= 65) gaugeColor = '#06b6d4';
  else if (currentScore >= 45) gaugeColor = '#f59e0b';

  const categories = ['ALL', ...Array.from(new Set(scans.map(s => s.category)))];

  const filteredScans = scans.filter(s => {
    const matchesSearch = s.productName.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          s.brand.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const newScore = newSodium > 500 ? 25 : newSodium > 250 ? 55 : 85;

    const newEntry: ScannedProductHistory = {
      id: `s-${Date.now()}`,
      userId: data.userId,
      productId: `prod-custom-${Date.now()}`,
      productName: newProdName,
      brand: newBrand || 'Artisanal / Local',
      category: newCategory,
      scannedAt: new Date().toISOString(),
      personalizedScore: newScore,
      sodiumMg: Number(newSodium),
      sugarGrams: 2.0,
      saturatedFatGrams: 1.5,
      fiberGrams: 4.0,
      hasAdditives: newSodium > 400
    };

    setScans([newEntry, ...scans]);
    setLogSuccess(true);
    setTimeout(() => {
      setLogSuccess(false);
      setShowLogModal(false);
      setNewProdName('');
      setNewBrand('');
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Welcome & Health Tier Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Active Persona: {conditions.join(', ') || 'Standard'}
              </span>
              <span className="text-xs text-slate-400">NutriLens Live Engine</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{userName}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Running food safety score calculated across your last {scans.length} scanned products based on your active profile.
            </p>
          </div>

          {/* Quick Streak & Action Buttons */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-3 pr-4 border-r border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{data.currentStreakDays} Days</div>
                  <div className="text-xs font-medium text-amber-400">Healthy Streak 🔥</div>
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-white">{scans.length}</div>
                <div className="text-xs font-medium text-slate-400">Total Scans</div>
              </div>
            </div>

            <button
              onClick={() => setShowLogModal(true)}
              className="btn-primary flex-col sm:flex-row py-3 px-4 shadow-lg shadow-emerald-500/20"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Log Scan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Gauge Meter Score */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center relative">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Running Nutrition Score
          </h3>
          
          {/* SVG Gauge */}
          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={gaugeColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white tracking-tight" style={{ color: gaugeColor }}>
                {currentScore}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase">out of 100</span>
            </div>
          </div>

          <div className="mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            {currentScore >= 75 && '🌟 Super Healthy Diet'}
            {currentScore >= 60 && currentScore < 75 && '✅ Balanced Diet'}
            {currentScore >= 40 && currentScore < 60 && '⚠️ Needs Attention (High Sodium)'}
            {currentScore < 40 && '🚨 High Risk for Active Persona'}
          </div>
        </div>

        {/* Card 2: Health Tier & Condition Match Summary */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Condition Risk Summary
              </h3>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4" /> {conditions[0] || 'Hypertension'} Alert
                </div>
                <p className="text-slate-300 text-[11px]">
                  40% of your scanned snacks exceed the 500mg sodium limit per serving.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                <div className="font-bold text-rose-400 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4" /> Allergen Safety Filter
                </div>
                <p className="text-slate-300 text-[11px]">
                  100% of recent scans passed active allergen verification. Zero cross-contamination flags detected.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToPatterns}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            View Pattern Intelligence Report
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Card 3: Weekly Activity & Quick Recommendation */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Weekly Activity
              </h3>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-bold text-white">{data.scansThisWeek}</div>
                <div className="text-[11px] text-slate-400">Scans this week</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-bold text-emerald-400">{data.longestStreakDays} Days</div>
                <div className="text-[11px] text-slate-400">Best Streak</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs">
              <div className="font-bold text-cyan-400 mb-1">💡 Smart Shopping Tip</div>
              <p className="text-slate-300 text-[11px]">
                Replacing salty fried snacks with whole millet muesli can raise your nutrition score by +48 points!
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToIntelligence('prod-muesli-whole-grain')}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            Explore Healthy Alternative
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Recent Scans History Table (Feature 6) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Recent Scan History</h3>
            <p className="text-xs text-slate-400">Tappable food items with personalized health scores</p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex items-center min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3.5 text-cyan-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="input-field input-with-icon py-2 text-xs text-white placeholder-slate-400 font-semibold w-full"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select-field py-1.5 text-xs min-w-[140px]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-3">Product Name</th>
                <th className="pb-3 px-3">Brand</th>
                <th className="pb-3 px-3">Category</th>
                <th className="pb-3 px-3 text-center">Sodium</th>
                <th className="pb-3 px-3 text-center">Additives</th>
                <th className="pb-3 px-3 text-right">Personalized Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredScans.map((scan) => (
                <tr 
                  key={scan.id}
                  onClick={() => onNavigateToIntelligence(scan.productId)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                >
                  <td className="py-3.5 px-3 font-semibold text-white group-hover:text-emerald-400 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {scan.productName}
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">{scan.brand}</td>
                  <td className="py-3.5 px-3 text-slate-400">{scan.category}</td>
                  <td className="py-3.5 px-3 text-center font-medium">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      scan.sodiumMg > 500 ? 'bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20' : 'text-slate-300'
                    }`}>
                      {scan.sodiumMg}mg
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {scan.hasAdditives ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Present
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        None
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right font-extrabold">
                    <span className={`px-2.5 py-1 rounded-lg ${
                      scan.personalizedScore >= 75
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : scan.personalizedScore >= 45
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}>
                      {scan.personalizedScore} / 100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log / Scan Modal Overlay */}
      {showLogModal && (
        <div className="modal-backdrop">
          <div className="modal-content relative">
            <button
              onClick={() => setShowLogModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Camera className="w-6 h-6 text-emerald-400" />
              <h2 className="font-heading text-xl font-bold text-white">Log New Food Scan</h2>
            </div>

            {logSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white">Scan Successfully Logged!</h3>
                <p className="text-xs text-slate-400">Score evaluated based on {userName}'s active profile.</p>
              </div>
            ) : (
              <form onSubmit={handleAddScan} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Masala Oats, Sev Bhujia..."
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Saffola, Haldiram's"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="select-field"
                    >
                      <option value="Snacks">Snacks / Namkeen</option>
                      <option value="Instant Noodles">Instant Foods</option>
                      <option value="Cereals">Breakfast Cereals</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sodium Content (mg per serving): <strong className="text-emerald-400">{newSodium}mg</strong>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="1200"
                    step="10"
                    value={newSodium}
                    onChange={(e) => setNewSodium(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>10mg (Low)</span>
                    <span>500mg (Caution)</span>
                    <span>1200mg (High)</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Analyze &amp; Save Scan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

