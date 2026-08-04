import React from 'react';
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
  ArrowUpRight
} from 'lucide-react';

interface ProgressDashboardProps {
  data: ProgressDashboardData;
  onNavigateToPatterns: () => void;
  onNavigateToIntelligence: (productId?: string) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ 
  data, 
  onNavigateToPatterns,
  onNavigateToIntelligence 
}) => {
  const score = data.runningAverageScore;
  
  // Calculate SVG gauge circle offset (radius 45 -> circumference 282.7)
  const circumference = 282.7;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let gaugeColor = '#ef4444'; // Red for high risk
  if (score >= 80) gaugeColor = '#10b981'; // Emerald
  else if (score >= 65) gaugeColor = '#06b6d4'; // Cyan
  else if (score >= 45) gaugeColor = '#f59e0b'; // Amber

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
                Active Safety Profile
              </span>
              <span className="text-xs text-slate-400">SIH 2026 Live Sync</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{data.userName}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Here is your running food safety intelligence summary calculated across your last {data.totalScans} scanned products.
            </p>
          </div>

          {/* Quick Streak & Total Scans Counter */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800/80">
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
              <div className="text-2xl font-black text-white">{data.totalScans}</div>
              <div className="text-xs font-medium text-slate-400">Total Scans</div>
            </div>
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
                {score}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase">out of 100</span>
            </div>
          </div>

          <div className="mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            {data.healthTier === 'SUPER_HEALTHY' && '🌟 Super Healthy Diet'}
            {data.healthTier === 'BALANCED' && '✅ Balanced Diet'}
            {data.healthTier === 'NEEDS_ATTENTION' && '⚠️ Needs Attention (High Sodium)'}
            {data.healthTier === 'HIGH_RISK_DIET' && '🚨 High Risk for Hypertension'}
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
                  <AlertTriangle className="w-4 h-4" /> Hypertension Alert
                </div>
                <p className="text-slate-300 text-[11px]">
                  40% of your scanned snacks exceed the 500mg sodium limit per serving.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
                <div className="font-bold text-rose-400 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4" /> Peanut Allergy Protection
                </div>
                <p className="text-slate-300 text-[11px]">
                  100% of scans passed allergen filter. 0 peanut cross-contamination risks detected.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToPatterns}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-2 group"
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
                Weekly Scan Summary
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
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 border border-cyan-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-2 group"
          >
            Explore Healthy Alternative
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Recent Scans History Table (Feature 6) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Recent Scan History</h3>
            <p className="text-xs text-slate-400">Tappable food items with personalized health scores</p>
          </div>
          <button 
            onClick={() => onNavigateToIntelligence()} 
            className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-1"
          >
            Look up product <ChevronRight className="w-3.5 h-3.5" />
          </button>
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
              {data.recentScans.map((scan) => (
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

    </div>
  );
};
