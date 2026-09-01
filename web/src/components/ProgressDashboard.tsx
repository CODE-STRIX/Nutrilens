import React, { useState } from 'react';
import { 
  ProgressDashboardData 
} from '@shared/types';
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
  Search,
  Camera,
  ShieldAlert,
  BookOpen,
  Users,
  Layers,
  Sparkles,
  ArrowLeftRight
} from 'lucide-react';

interface ProgressDashboardProps {
  data: ProgressDashboardData;
  onNavigateToPatterns: () => void;
  onNavigateToIntelligence: (productId?: string) => void;
  activeProfile?: { id: string; name: string; healthConditions: string[]; [key: string]: any };
  onNavigateToRecalls?: () => void;
  onNavigateToCommunity?: () => void;
  onNavigateToAlternatives?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ 
  data, 
  onNavigateToPatterns,
  onNavigateToIntelligence,
  activeProfile,
  onNavigateToRecalls,
  onNavigateToCommunity,
  onNavigateToAlternatives
}) => {
  const [scanInput, setScanInput] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>('ins-211');

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
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* ── HERO / QUICK SCAN ACTION AREA ── */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-emerald-500/30 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Ingredient &amp; Barcode Lookup
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
              Scan or Look Up Any Food Label
            </h1>
            <p className="text-sm text-slate-400">
              Instantly translate complex INS codes, additives, and nutrition facts into plain-language health guidance tailored to your profile.
            </p>
          </div>

          {/* Central Input & Action Buttons */}
          <form onSubmit={handleHeroSubmit} className="w-full lg:max-w-md flex flex-col gap-3">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                placeholder="Enter barcode, product name, or INS code (e.g. INS 211)..."
                className="w-full pl-11 pr-12 py-3 text-xs sm:text-sm rounded-2xl bg-slate-900/90 border border-slate-700/80 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => onNavigateToIntelligence()}
                className="absolute right-3 p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-emerald-400 transition-colors"
                title="Upload label photo / Camera OCR"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Analyze Product
              </button>

              <button
                type="button"
                onClick={() => onNavigateToAlternatives ? onNavigateToAlternatives() : onNavigateToPatterns()}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowLeftRight className="w-4 h-4" />
                Compare Products
              </button>
            </div>
          </form>

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

              {/* Streak Tracker */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 w-full sm:w-auto shrink-0 justify-center">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md">
                  🔥
                </div>
                <div>
                  <div className="text-xl font-black text-amber-500">{data.currentStreakDays} Days</div>
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">Healthy Scan Streak</div>
                </div>
              </div>

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

          {/* Widget 5: Daily Nutrition Byte (Sky Blue Learning Mode) */}
          <div className="glass-card p-6 border border-sky-500/30 bg-sky-500/5 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-500" />
              <span className="text-xs font-black text-sky-500 uppercase tracking-wider">
                Feature 10 • Learning Mode
              </span>
            </div>

            <h4 className="font-heading font-bold text-base">
              💡 Today's Food Literacy Byte
            </h4>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-sky-400">Dietary Fiber &amp; Glycemic Spikes</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fiber slows down sugar absorption into your bloodstream. Always choose snacks with &gt;3g of dietary fiber per 100g to maintain steady energy levels!
              </p>
            </div>
          </div>

          {/* Widget 6: Community Verifications Feed */}
          <div className="glass-card p-6 border border-amber-500/30 bg-amber-500/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-black text-amber-500 uppercase tracking-wider">
                  Feature 12 • Crowdsourced
                </span>
              </div>
              {onNavigateToCommunity && (
                <button
                  onClick={onNavigateToCommunity}
                  className="text-[11px] font-bold text-amber-500 hover:underline"
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

    </div>
  );
};
