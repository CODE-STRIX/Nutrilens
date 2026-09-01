import React, { useState } from 'react';
import { PatternIntelligenceReport, PatternInsight } from '@shared/types';
import { 
  BarChart3, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Lightbulb, 
  PieChart, 
  Info,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Flame
} from 'lucide-react';

interface FoodPatternIntelligenceProps {
  report: PatternIntelligenceReport;
  onNavigateToIntelligence: (productId?: string) => void;
}

export const FoodPatternIntelligence: React.FC<FoodPatternIntelligenceProps> = ({ 
  report,
  onNavigateToIntelligence 
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'ALL' | 'HIGH_RISK' | 'MODERATE_WARNING' | 'HEALTHY_TREND'>('ALL');
  const [scanRange, setScanRange] = useState<number>(10);
  const [simulatedSwaps, setSimulatedSwaps] = useState<number>(2);

  const filteredInsights = filterSeverity === 'ALL'
    ? report.insights
    : report.insights.filter(i => i.severity === filterSeverity);

  // Simulated score calculation
  const simulatedScoreGain = simulatedSwaps * 12;
  const projectScore = Math.min(100, 40 + simulatedScoreGain);

  const renderStatusBadge = (severity: string) => {
    if (severity === 'HIGH_RISK') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-500/20 flex items-center gap-1.5 animate-pulse-subtle">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          HIGH RISK / DANGER 🚨
        </span>
      );
    }
    if (severity === 'MODERATE_WARNING') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/20 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          MODERATE WARNING ⚠️
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-500/20 flex items-center gap-1.5">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        SAFE CHOICE ✓
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-black mb-3">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Pattern Analytics Engine
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
              Food Pattern <span className="text-cyan-400 font-black">Intelligence</span>
            </h1>
            <p className="text-slate-200 text-sm font-medium mt-1.5 max-w-2xl">
              Surfacing real eating habits across your last <strong className="text-cyan-400 font-bold">{scanRange} scans</strong> instead of judging single products in isolation.
            </p>
          </div>

          {/* Scan Range Selector */}
          <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-500/40 text-right min-w-[240px] space-y-2 shadow-lg shadow-cyan-500/10">
            <div className="text-xs text-white font-extrabold">Scans Analyzed Range</div>
            <div className="flex items-center justify-end gap-1.5">
              {[5, 10, 20, 50].map(range => (
                <button
                  key={range}
                  onClick={() => setScanRange(range)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    scanRange === range ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/40' : 'bg-slate-800 text-cyan-300 hover:text-white border border-slate-700'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <div className="text-xs text-emerald-400 font-black flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" /> Live Profile Sync
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-start gap-3 bg-slate-900/70 p-4 rounded-xl border border-slate-700">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-100 font-medium leading-relaxed">
            <strong className="text-white font-bold">Pattern Summary ({scanRange} scans):</strong> {report.overallSummary}
          </p>
        </div>
      </div>

      {/* Diet Risk Simulator Widget */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="font-heading text-xl font-black text-white drop-shadow-sm">Dietary Improvement Simulator</h2>
          </div>
          <span className="badge badge-cyan font-bold">Interactive Score Predictor</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-3 md:col-span-2">
            <label className="text-xs font-bold text-slate-200 block">
              If I replace <strong className="text-cyan-400 font-black text-sm">{simulatedSwaps} high-sodium processed snacks</strong> per week with whole food alternatives:
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={simulatedSwaps}
              onChange={(e) => setSimulatedSwaps(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-2"
            />
            <div className="flex justify-between text-xs text-slate-200 font-semibold">
              <span>1 Swap / week (+12 pts)</span>
              <span>3 Swaps / week (+36 pts)</span>
              <span>5 Swaps / week (+60 pts)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-center space-y-1">
            <div className="text-xs text-slate-200 font-bold">Predicted Running Score</div>
            <div className="text-3xl font-black text-emerald-400 flex items-center justify-center gap-2">
              <span className="text-slate-400 text-xl">40</span>
              <ArrowRight className="w-5 h-5 text-cyan-400" />
              <span>{projectScore} / 100</span>
            </div>
            <div className="text-xs text-emerald-400 font-black">+ {simulatedScoreGain} Points Projected Gain</div>
          </div>
        </div>
      </div>

      {/* Visual Metric Progress Bars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {report.insights.map((insight) => (
          <div key={insight.metricKey} className="glass-panel p-5 rounded-2xl border border-slate-700 relative overflow-hidden space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase tracking-wider">{insight.title}</span>
              {insight.severity === 'HIGH_RISK' && <AlertOctagon className="w-5 h-5 text-rose-400" />}
              {insight.severity === 'MODERATE_WARNING' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {insight.severity === 'HEALTHY_TREND' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </div>

            <div className="text-3xl font-black text-white">
              {insight.percentage}%
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  insight.severity === 'HIGH_RISK' ? 'bg-rose-500 shadow-md shadow-rose-500/50' : insight.severity === 'MODERATE_WARNING' ? 'bg-amber-500 shadow-md shadow-amber-500/50' : 'bg-emerald-500 shadow-md shadow-emerald-500/50'
                }`}
                style={{ width: `${insight.percentage}%` }}
              />
            </div>

            <div className="text-xs text-slate-300 font-semibold pt-1">
              Found in {Math.round((insight.percentage / 100) * scanRange)} of {scanRange} scans
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs & Detailed Insights */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-400" />
            Detailed Pattern Breakdown
          </h2>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
            <Filter className="w-4 h-4 text-cyan-400 ml-2" />
            <button
              onClick={() => setFilterSeverity('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                filterSeverity === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-slate-200 hover:text-white'
              }`}
            >
              All ({report.insights.length})
            </button>
            <button
              onClick={() => setFilterSeverity('HIGH_RISK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterSeverity === 'HIGH_RISK' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-extrabold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Danger / High Risk
            </button>
            <button
              onClick={() => setFilterSeverity('MODERATE_WARNING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterSeverity === 'MODERATE_WARNING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Caution
            </button>
            <button
              onClick={() => setFilterSeverity('HEALTHY_TREND')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterSeverity === 'HEALTHY_TREND' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Safe Choice
            </button>
          </div>
        </div>

        {/* Insight Cards List */}
        <div className="space-y-4">
          {filteredInsights.map((insight) => (
            <div 
              key={insight.metricKey}
              className={`glass-panel p-6 rounded-2xl border transition-all space-y-4 ${
                insight.severity === 'HIGH_RISK'
                  ? 'border-rose-500/40 hover:border-rose-500/70 bg-rose-950/15'
                  : insight.severity === 'MODERATE_WARNING'
                  ? 'border-amber-500/40 hover:border-amber-500/70 bg-amber-950/15'
                  : 'border-emerald-500/40 hover:border-emerald-500/70 bg-emerald-950/15'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-xl shrink-0 ${
                    insight.severity === 'HIGH_RISK'
                      ? 'bg-rose-500/20 text-rose-400'
                      : insight.severity === 'MODERATE_WARNING'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {insight.severity === 'HIGH_RISK' && <AlertOctagon className="w-6 h-6" />}
                    {insight.severity === 'MODERATE_WARNING' && <AlertTriangle className="w-6 h-6" />}
                    {insight.severity === 'HEALTHY_TREND' && <CheckCircle2 className="w-6 h-6" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-heading text-lg font-extrabold text-white">{insight.title}</h3>
                      {renderStatusBadge(insight.severity)}
                    </div>

                    <p className="text-slate-200 text-xs font-medium leading-relaxed pt-1">
                      {insight.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-white">{insight.percentage}%</span>
                  <div className="text-xs text-slate-200 font-bold">Frequency</div>
                </div>
              </div>

              {/* Actionable Tip Box */}
              <div className="pt-3 border-t border-slate-800/80 flex items-start gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <div className="text-xs font-extrabold text-amber-400">Actionable Health Guidance</div>
                  <p className="text-slate-200 text-xs font-semibold mt-0.5">{insight.actionableTip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};


