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
  Info 
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

  const filteredInsights = filterSeverity === 'ALL'
    ? report.insights
    : report.insights.filter(i => i.severity === filterSeverity);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              Feature 7 — Pattern Analytics
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Food Pattern <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Intelligence</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Surfacing real eating habits across your last {report.analyzedScansCount} scans instead of judging single products in isolation.
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-right min-w-[200px]">
            <div className="text-xs text-slate-400 font-medium">Scans Analyzed</div>
            <div className="text-3xl font-black text-white">{report.analyzedScansCount} Items</div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">Live Profile Sync</div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-start gap-3 bg-slate-900/50 p-4 rounded-xl">
          <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">Pattern Summary:</strong> {report.overallSummary}
          </p>
        </div>
      </div>

      {/* Visual Metric Progress Bars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {report.insights.map((insight) => (
          <div key={insight.metricKey} className="glass-panel p-5 rounded-xl border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{insight.title}</span>
              {insight.severity === 'HIGH_RISK' && <AlertOctagon className="w-4 h-4 text-rose-400" />}
              {insight.severity === 'MODERATE_WARNING' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              {insight.severity === 'HEALTHY_TREND' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>

            <div className="text-3xl font-black text-white my-1">
              {insight.percentage}%
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden my-2">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  insight.severity === 'HIGH_RISK' ? 'bg-rose-500' : insight.severity === 'MODERATE_WARNING' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${insight.percentage}%` }}
              />
            </div>

            <div className="text-[11px] text-slate-400">
              Found in {Math.round((insight.percentage / 100) * insight.sampleSize)} of {insight.sampleSize} scans
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

          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <Filter className="w-4 h-4 text-slate-500 ml-2" />
            <button
              onClick={() => setFilterSeverity('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterSeverity === 'ALL' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({report.insights.length})
            </button>
            <button
              onClick={() => setFilterSeverity('HIGH_RISK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterSeverity === 'HIGH_RISK' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              High Risk
            </button>
            <button
              onClick={() => setFilterSeverity('MODERATE_WARNING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterSeverity === 'MODERATE_WARNING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Caution
            </button>
            <button
              onClick={() => setFilterSeverity('HEALTHY_TREND')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterSeverity === 'HEALTHY_TREND' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Healthy Trends
            </button>
          </div>
        </div>

        {/* Insight Cards List */}
        <div className="space-y-4">
          {filteredInsights.map((insight) => (
            <div 
              key={insight.metricKey}
              className={`glass-panel p-6 rounded-2xl border transition-all ${
                insight.severity === 'HIGH_RISK'
                  ? 'border-rose-500/30 hover:border-rose-500/50 bg-rose-950/10'
                  : insight.severity === 'MODERATE_WARNING'
                  ? 'border-amber-500/30 hover:border-amber-500/50 bg-amber-950/10'
                  : 'border-emerald-500/30 hover:border-emerald-500/50 bg-emerald-950/10'
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

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-lg font-bold text-white">{insight.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        insight.severity === 'HIGH_RISK'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : insight.severity === 'MODERATE_WARNING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {insight.severity.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-2xl font-black text-white">{insight.percentage}%</span>
                  <div className="text-[10px] text-slate-400">Frequency</div>
                </div>
              </div>

              {/* Actionable Tip Box */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-start gap-3 bg-slate-900/60 p-3.5 rounded-xl">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <div className="text-xs font-bold text-amber-400">Actionable Health Guidance</div>
                  <p className="text-slate-300 text-xs mt-0.5">{insight.actionableTip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
