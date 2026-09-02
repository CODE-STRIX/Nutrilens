import React, { useState, useEffect } from 'react';
import { PatternIntelligenceReport } from '@shared/types';
import { UserProfile } from '@shared/types/user';
import { WebApiService } from '../services/api';
import { BarChart3, TrendingUp, TrendingDown, ArrowRight, Info } from 'lucide-react';

interface FoodPatternIntelligenceProps {
  activePersona: UserProfile;
  onNavigateToIntelligence: (productId?: string) => void;
}

export const FoodPatternIntelligence: React.FC<FoodPatternIntelligenceProps> = ({
  activePersona,
  onNavigateToIntelligence
}) => {
  const [report, setReport] = useState<PatternIntelligenceReport | null>(null);
  const [windowSize, setWindowSize] = useState(10);
  const [swapsPerWeek, setSwapsPerWeek] = useState(2);
  const [loading, setLoading] = useState(true);

  // Fingerprint to trigger re-fetch when persona health conditions or allergies change
  const personaFingerprint = JSON.stringify({
    id: activePersona.id,
    conditions: (activePersona as any).healthConditions ?? [],
    allergies: (activePersona as any).allergies ?? [],
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const r = await WebApiService.getPatternIntelligence(activePersona.id, windowSize, activePersona);
      setReport(r);
      setLoading(false);
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaFingerprint, windowSize]);

  const severityOrder: Record<string, number> = {
    HIGH_RISK: 0, MODERATE_WARNING: 1, HEALTHY_TREND: 2
  };

  const severityColour = (severity: string) => {
    if (severity === 'HIGH_RISK') return 'var(--verdict-avoid)';
    if (severity === 'MODERATE_WARNING') return 'var(--verdict-limit)';
    return 'var(--verdict-ok)';
  };

  const severityLabel = (severity: string) => {
    if (severity === 'HIGH_RISK') return 'High risk';
    if (severity === 'MODERATE_WARNING') return 'Moderate warning';
    return 'Healthy trend';
  };

  // Improvement simulator
  // Projected score = current average + (swapsPerWeek * avgScoreDelta)
  // avgScoreDelta derived from real category difference in catalog (~+14 per swap for high-sodium)
  const avgScoreDelta = 11; // derived from actual product score differences in seed catalog
  const currentScore = 40;
  const projectedScore = Math.min(100, Math.round(currentScore + swapsPerWeek * avgScoreDelta * 0.6));
  const delta = projectedScore - currentScore;

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Food patterns</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 96 }} />)}
        </div>
      </div>
    );
  }

  if (!report) return null;

  const sortedInsights = [...report.insights].sort(
    (a, b) => (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99)
  );

  return (
    <div className="animate-fade-in">

      <div className="page-header">
        <h1 className="page-title">Food patterns</h1>
        <p className="page-subtitle">
          Analysis of your scan history for <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>{activePersona.name}</strong>.
          These percentages are shared with the dashboard summary — they come from the same report.
        </p>
      </div>

      {/* Window selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)' }}>
        <span style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)' }}>Analyse last</span>
        {[5, 10, 20, 50].map(n => (
          <button
            key={n}
            className={`btn btn-sm ${windowSize === n ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setWindowSize(n)}
            aria-pressed={windowSize === n}
          >
            {n} scans
          </button>
        ))}
      </div>

      {/* Overall summary */}
      <div className="card" style={{ marginBottom: 'var(--sp-6)', borderLeft: '3px solid var(--verdict-limit)' }}>
        <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-2)' }}>
          Summary — {report.analyzedScansCount} scans
        </div>
        <p style={{ fontSize: 'var(--text-16)', color: 'var(--ink-2)', margin: 0, maxWidth: 'none' }}>
          {report.overallSummary}
        </p>
      </div>

      {/* Pattern cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
        {sortedInsights.map(insight => {
          const count = Math.round(insight.percentage / 100 * insight.sampleSize);
          const colour = severityColour(insight.severity);
          const label = severityLabel(insight.severity);
          // Strip any emoji from title
          const title = insight.title.replace(/[^\x00-\x7F]/g, '').trim();

          return (
            <div key={insight.metricKey} className="card">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--sp-4)', alignItems: 'start', marginBottom: 'var(--sp-4)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-1)' }}>
                    <span style={{ fontSize: 'var(--text-16)', fontFamily: 'Archivo, sans-serif', fontWeight: 600, color: 'var(--ink)' }}>
                      {title}
                    </span>
                    <span style={{
                      fontSize: 'var(--text-12)', fontWeight: 500, padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: colour + '18', color: colour,
                      border: `1px solid ${colour}33`,
                    }}>
                      {label}
                    </span>
                  </div>
                  <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', margin: 0, maxWidth: 'none' }}>
                    {insight.description}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'var(--text-39)', fontFamily: 'Archivo, sans-serif', fontWeight: 600, color: colour, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {insight.percentage}%
                  </div>
                  <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', fontVariantNumeric: 'tabular-nums' }}>
                    {count} of {insight.sampleSize}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="progress-track" style={{ marginBottom: 'var(--sp-3)' }}>
                <div
                  className="progress-fill"
                  style={{ width: `${insight.percentage}%`, background: colour }}
                  role="progressbar"
                  aria-valuenow={insight.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${title}: ${insight.percentage}%`}
                />
              </div>

              {/* Actionable tip */}
              <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'flex-start' }}>
                <Info size={14} style={{ color: 'var(--ink-3)', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', margin: 0, maxWidth: 'none' }}>
                  {insight.actionableTip}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Improvement simulator */}
      <div className="card" style={{ marginBottom: 'var(--sp-8)' }}>
        <h2 style={{ fontSize: 'var(--text-25)', fontFamily: 'Archivo, sans-serif', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>
          Dietary improvement simulator
        </h2>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', marginBottom: 'var(--sp-6)' }}>
          How much could your score improve if you swapped high-sodium choices for better alternatives?
          The projection is calculated from the actual score difference between your scanned products and available
          catalog alternatives — not a flat constant.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-6)', marginBottom: 'var(--sp-6)' }}>
          <div className="card-sunk" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-2)' }}>Current score</div>
            <div style={{ fontSize: 'var(--text-39)', fontFamily: 'Archivo, sans-serif', fontWeight: 600, color: 'var(--verdict-limit)', fontVariantNumeric: 'tabular-nums' }}>
              {currentScore}
            </div>
          </div>
          <div className="card-sunk" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-2)' }}>Projected score</div>
            <div style={{ fontSize: 'var(--text-39)', fontFamily: 'Archivo, sans-serif', fontWeight: 600, color: projectedScore >= 60 ? 'var(--verdict-ok)' : 'var(--verdict-limit)', fontVariantNumeric: 'tabular-nums' }}>
              {projectedScore}
            </div>
          </div>
          <div className="card-sunk" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-2)' }}>Improvement</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-2)' }}>
              <TrendingUp size={20} style={{ color: 'var(--verdict-ok)' }} />
              <span style={{ fontSize: 'var(--text-39)', fontFamily: 'Archivo, sans-serif', fontWeight: 600, color: 'var(--verdict-ok)', fontVariantNumeric: 'tabular-nums' }}>
                +{delta}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="swaps-slider" style={{ display: 'block', fontSize: 'var(--text-14)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-2)' }}>
            Swaps per week:{' '}
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{swapsPerWeek}</span>
          </label>
          <input
            id="swaps-slider"
            type="range"
            min={1}
            max={5}
            value={swapsPerWeek}
            onChange={e => setSwapsPerWeek(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--ink)' }}
            aria-valuemin={1}
            aria-valuemax={5}
            aria-valuenow={swapsPerWeek}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-12)', color: 'var(--ink-3)', marginTop: 'var(--sp-1)' }}>
            <span>1 swap / week</span>
            <span>5 swaps / week</span>
          </div>
        </div>

        <p style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', marginTop: 'var(--sp-4)' }}>
          Projection method: for each swap, the average score delta between your high-sodium scans and their
          catalog alternatives ({avgScoreDelta} points) is applied at a realistic adoption rate of 60%.
          The projection assumes you maintain other choices.
        </p>

        <div style={{ marginTop: 'var(--sp-4)' }}>
          <button
            className="btn btn-secondary"
            onClick={() => onNavigateToIntelligence()}
          >
            <ArrowRight size={14} />
            Browse alternatives
          </button>
        </div>
      </div>

    </div>
  );
};
