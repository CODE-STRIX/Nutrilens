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

  const score = data.runningAverageScore;
  
  // Calculate SVG gauge circle offset (radius 45 -> circumference 282.7)
  const circumference = 282.7;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let gaugeColor = '#EF4444'; // Red for high risk
  if (score >= 80) gaugeColor = '#16A34A'; // Leaf Green
  else if (score >= 65) gaugeColor = '#0284C7'; // Sky Blue
  else if (score >= 45) gaugeColor = '#D97706'; // Amber

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scanInput.trim()) {
      onNavigateToIntelligence(scanInput.trim());
    } else {
      onNavigateToIntelligence();
    }
=======
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
      
      {/* ── HERO / QUICK SCAN ACTION AREA ── */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-emerald-500/30 shadow-md">
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

          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID (2-COLUMN LAYOUT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── LEFT COLUMN (70% Width - Personal Analytics & Intelligence) ── */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Widget 1: Health Score & Streak Card */}
          <div className="glass-card p-6 sm:p-7 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Score Circular Ring */}
              <div className="flex items-center gap-5">
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="var(--border-color)"
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
                    <span className="text-3xl font-black tracking-tight" style={{ color: gaugeColor }}>
                      {score}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">/ 100</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Running Nutrition Index
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold">Personalized Health Score</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Calculated from your last {data.totalScans} scanned packaged items.
                  </p>
                </div>
              </div>

          {/* Widget 2: Food Pattern Intelligence Chart */}
          <div className="glass-card p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    Feature 7 • Habit Radar
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold">Food Pattern Intelligence Chart</h3>
                <p className="text-xs text-slate-400">Scan history risk &amp; nutrient exposure breakdown</p>
              </div>
              <button
                onClick={onNavigateToPatterns}
                className="text-xs font-bold text-sky-500 hover:underline flex items-center gap-1"
              >
                Full Analytics <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pattern Progress Bars */}
            <div className="space-y-4 pt-2">
              
              {/* Item 1: High Sodium */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-amber-500">
                    <AlertTriangle className="w-3.5 h-3.5" /> High Sodium Intake (Hypertension Flag)
                  </span>
                  <span className="font-bold text-amber-500">40% of scans</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500 transition-all duration-700" style={{ width: '40%' }} />
                </div>
              </div>

              {/* Item 2: Added Sugar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-rose-500">
                    <AlertTriangle className="w-3.5 h-3.5" /> High Added Sugar Content
                  </span>
                  <span className="font-bold text-rose-500">60% of scans</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-rose-500 transition-all duration-700" style={{ width: '60%' }} />
                </div>
              </div>

              {/* Item 3: Good Fiber Ratio */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Good Fiber Ratio (&gt;3g per serving)
                  </span>
                  <span className="font-bold text-emerald-500">70% of scans</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: '70%' }} />
                </div>
              </div>

            </div>
          </div>

          {/* Widget 3: Interactive Ingredient Map Explorer */}
          <div className="glass-card p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                    Features 2 &amp; 3 • Flagship
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold">Interactive Ingredient Map Explorer</h3>
                <p className="text-xs text-slate-400">Click any additive card to uncover why manufacturers add it and its body impact</p>
              </div>
              <button
                onClick={() => onNavigateToIntelligence()}
                className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1"
              >
                Deep Inspection <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tappable Ingredient Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Card A: INS 211 */}
              <div
                onClick={() => setSelectedIngredient('ins-211')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedIngredient === 'ins-211'
                    ? 'border-amber-500 bg-amber-500/10 shadow-md'
                    : 'border-slate-700/60 bg-slate-800/30 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">INS 211</span>
                    <h4 className="font-bold text-sm">Sodium Benzoate</h4>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-500 rounded-md">
                    Preservative
                  </span>
                </div>

                {/* Manufacturing Rationale Tag */}
                <div className="mb-2.5">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 rounded-md flex items-center gap-1 inline-flex">
                    <Layers className="w-3 h-3" /> Extended Shelf Life &amp; Cost Efficiency
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">
                  Prevents mold growth in acidic beverages. Safe in micro doses, but sodium accumulation can impact blood pressure.
                </p>

                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-semibold">Found in:</span>
                  <span className="px-2 py-0.5 text-[9px] bg-slate-700/50 text-slate-300 rounded-full">Sauces</span>
                  <span className="px-2 py-0.5 text-[9px] bg-slate-700/50 text-slate-300 rounded-full">Sodas</span>
                  <span className="px-2 py-0.5 text-[9px] bg-slate-700/50 text-slate-300 rounded-full">Pickles</span>
                </div>
              </div>

              {/* Card B: INS 621 */}
              <div
                onClick={() => setSelectedIngredient('ins-621')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedIngredient === 'ins-621'
                    ? 'border-amber-500 bg-amber-500/10 shadow-md'
                    : 'border-slate-700/60 bg-slate-800/30 hover:border-amber-500/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">INS 621</span>
                    <h4 className="font-bold text-sm">Monosodium Glutamate (MSG)</h4>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-500 rounded-md">
                    Flavor Enhancer
                  </span>
                </div>

                {/* Manufacturing Rationale Tag */}
                <div className="mb-2.5">
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 rounded-md flex items-center gap-1 inline-flex">
                    <Layers className="w-3 h-3" /> Umami Craving Enhancement
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2">
                  Triggers taste receptors to intensify savory perception. High sodium payload per serving.
                </p>

                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-semibold">Found in:</span>
                  <span className="px-2 py-0.5 text-[9px] bg-slate-700/50 text-slate-300 rounded-full">Instant Noodles</span>
                  <span className="px-2 py-0.5 text-[9px] bg-slate-700/50 text-slate-300 rounded-full">Chips</span>
                </div>
              </div>

            </div>
          </div>

          {/* Recent Scans Table */}
          <div className="glass-card p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold">Recent Scan History</h3>
                <p className="text-xs text-slate-400">Click any product to inspect detailed ingredient cards</p>
              </div>
              <button 
                onClick={() => onNavigateToIntelligence()} 
                className="text-xs text-emerald-500 font-bold hover:underline flex items-center gap-1"
              >
                Scan Product <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 px-3">Product Name</th>
                    <th className="pb-3 px-3">Brand</th>
                    <th className="pb-3 px-3">Sodium</th>
                    <th className="pb-3 px-3 text-right">Personal Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/40 text-xs">
                  {data.recentScans.map((scan) => (
                    <tr 
                      key={scan.id}
                      onClick={() => onNavigateToIntelligence(scan.productId)}
                      className="hover:bg-slate-700/30 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-3 font-semibold group-hover:text-emerald-500 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {scan.productName}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">{scan.brand}</td>
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          (scan.sodiumMg ?? (scan as any).sodiumPerServingMg ?? 0) > 400 
                            ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30' 
                            : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                        }`}>
                          {scan.sodiumMg ?? (scan as any).sodiumPerServingMg ?? 0} mg
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-sm">
                        <span className={scan.personalizedScore >= 75 ? 'text-emerald-500' : 'text-amber-500'}>
                          {scan.personalizedScore} / 100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN (30% Width - Safety & Community Feeds) ── */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Widget 4: FSSAI Recall Alert Box (Crimson Red Border) */}
          <div className="glass-card p-6 border-l-4 border-l-rose-600 border-slate-700/60 bg-rose-500/5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
              <span className="text-xs font-black text-rose-500 uppercase tracking-wider">
                FSSAI Safety Alert
=======
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white tracking-tight" style={{ color: gaugeColor }}>
                {currentScore}
>>>>>>> 28594d5 (feat: UI enhancements, instant tab loading, theme fixes & spacious layouts)
              </span>
            </div>
            
            <h4 className="font-heading font-extrabold text-base text-rose-600 dark:text-rose-400">
              ⚠️ FSSAI Notice: Product Recalled
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              A snack item from your historical scans (<span className="font-bold">Kurkure Masala Munch Batch #781</span>) was recently flagged for excessive sodium level violations.
            </p>

            <button
              onClick={() => onNavigateToRecalls ? onNavigateToRecalls() : onNavigateToIntelligence()}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500/15 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              View Safe Alternatives
              <ChevronRight className="w-4 h-4" />
            </button>
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
>>>>>>> 28594d5 (feat: UI enhancements, instant tab loading, theme fixes & spacious layouts)
                >
                  View All
                </button>
              )}
            </div>

            <h4 className="font-heading font-bold text-base">
              👥 Community Local Submissions
            </h4>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-xs">Unbranded Banana Chips</div>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-500 rounded-full">
                    3/5 Votes
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">Submitted by: User @KeralaSnacker</div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-3/5 rounded-full" />
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-xs">Local Roasted Chana</div>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-500 rounded-full">
                    Verified ✅
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">High Protein • 0 Additives</div>
              </div>
            </div>
          </div>

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

