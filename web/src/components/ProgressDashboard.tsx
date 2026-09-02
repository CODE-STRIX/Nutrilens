import React, { useState, useEffect } from 'react';
import {
  ProgressDashboardData,
  PatternIntelligenceReport
} from '@shared/types';
import { UserProfile } from '@shared/types/user';
import { WebApiService } from '../services/api';
import { scoreToArcOffset, getBandLabel, getBandColour, getBandCssClass, getBandTint } from '../utils/scoring';
import {
  ChevronRight,
  ShieldAlert,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Clock,
  Search,
  Camera
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProgressDashboardProps {
  activePersona: UserProfile;
  onNavigateToPatterns: () => void;
  onNavigateToIntelligence: (productId?: string) => void;
  activeProfile?: { id: string; name: string; healthConditions: string[]; [key: string]: any };
  onNavigateToRecalls?: () => void;
  onNavigateToAlternatives?: () => void;
}

// ── Score dial SVG ─────────────────────────────────────────────────────────────

const ScoreDial: React.FC<{ score: number; size?: number }> = ({ score, size = 128 }) => {
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const offset = scoreToArcOffset(score, r);

  const band = score >= 80 ? 'good' : score >= 60 ? 'okay' : score >= 40 ? 'limit' : 'avoid';
  const colour = getBandColour(band);

  return (
    <div className="score-dial-wrap" style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 100 100">
        {/* Track */}
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke="var(--surface-sunk)"
          strokeWidth="8"
        />
        {/* Arc */}
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={colour}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="score-dial-inner">
        <span
          className="score-value tabular"
          style={{ fontSize: size >= 128 ? 'var(--text-31)' : 'var(--text-20)', color: colour }}
        >
          {score}
        </span>
        <span className="score-label">/ 100</span>
      </div>
    </div>
  );
};

// ── Scan Row ───────────────────────────────────────────────────────────────────

interface ScanRowData {
  id: string;
  productName: string;
  brand: string;
  category: string;
  personalizedScore: number;
  sodiumMg: number;
  scannedAt: string;
  productId: string;
}

const ScanRow: React.FC<{ scan: ScanRowData; onClick: () => void }> = ({ scan, onClick }) => {
  const band = scan.personalizedScore >= 80 ? 'good'
             : scan.personalizedScore >= 60 ? 'okay'
             : scan.personalizedScore >= 40 ? 'limit'
             : 'avoid';
  const colour = getBandColour(band);

  return (
    <tr
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      aria-label={`View ${scan.productName}`}
    >
      <td>
        <div style={{ fontWeight: 500, color: 'var(--ink)', fontSize: 'var(--text-14)' }}>
          {scan.productName}
        </div>
        <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)' }}>
          {scan.brand} &middot; {scan.category}
        </div>
      </td>
      <td className="right tabular" style={{ color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>
        {scan.sodiumMg} mg
      </td>
      <td className="right">
        <span
          className={`verdict-badge ${getBandCssClass(band)}`}
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {scan.personalizedScore}
        </span>
      </td>
      <td className="right" style={{ color: 'var(--ink-3)', fontSize: 'var(--text-12)', whiteSpace: 'nowrap' }}>
        {new Date(scan.scannedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
      </td>
    </tr>
  );
};

// ── Pattern Summary Bar ────────────────────────────────────────────────────────

const PatternBar: React.FC<{ label: string; pct: number; count: number; total: number; severity: string }> = ({
  label, pct, count, total, severity
}) => {
  const colour = severity === 'HIGH_RISK'
    ? 'var(--verdict-avoid)'
    : severity === 'MODERATE_WARNING'
    ? 'var(--verdict-limit)'
    : 'var(--verdict-ok)';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--sp-3)', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-1)', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', fontWeight: 500 }}>{label}</span>
          <span style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', fontVariantNumeric: 'tabular-nums' }}>
            {count} of {total}
          </span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${pct}%`, background: colour }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${label}: ${pct}%`}
          />
        </div>
      </div>
      <span
        className="tabular"
        style={{ fontSize: 'var(--text-20)', fontFamily: 'Archivo, sans-serif', fontWeight: 600, color: colour, minWidth: 48, textAlign: 'right' }}
      >
        {pct}%
      </span>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  activePersona,
  onNavigateToPatterns,
  onNavigateToIntelligence,
  activeProfile,
  onNavigateToRecalls,
  onNavigateToAlternatives
}) => {
  const [data, setData] = useState<ProgressDashboardData | null>(null);
  const [patterns, setPatterns] = useState<PatternIntelligenceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanInput, setScanInput] = useState('');
  const [sortCol, setSortCol] = useState<'score' | 'sodium' | 'date'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Full persona fingerprint — triggers reload when conditions/allergies change within the same profile ID
  const personaFingerprint = JSON.stringify({
    id: activePersona.id,
    conditions: (activePersona as any).healthConditions ?? [],
    allergies: (activePersona as any).allergies ?? [],
    diet: (activePersona as any).dietaryPreferences ?? [],
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [dash, pats] = await Promise.all([
        WebApiService.getDashboard(activePersona.id, activePersona),
        WebApiService.getPatternIntelligence(activePersona.id)
      ]);
      setData(dash);
      setPatterns(pats);
      setLoading(false);
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaFingerprint]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (scanInput.trim()) onNavigateToIntelligence(scanInput.trim());
    else onNavigateToIntelligence();
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Personal score, recent scans, and pattern summary</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120 }} />)}
        </div>
      </div>
    );
  }

  if (!data || !patterns) return null;

  const score = data.runningAverageScore;
  const band = score >= 80 ? 'good' : score >= 60 ? 'okay' : score >= 40 ? 'limit' : 'avoid';

  const sortedScans = [...data.recentScans].sort((a, b) => {
    if (sortCol === 'score') return sortAsc ? a.personalizedScore - b.personalizedScore : b.personalizedScore - a.personalizedScore;
    if (sortCol === 'sodium') return sortAsc ? a.sodiumMg - b.sodiumMg : b.sodiumMg - a.sodiumMg;
    return sortAsc
      ? new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime()
      : new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime();
  });

  const toggleSort = (col: 'score' | 'sodium' | 'date') => {
    if (sortCol === col) setSortAsc(a => !a);
    else { setSortCol(col); setSortAsc(false); }
  };

  // Pattern summary — top 3 insights (same object as Patterns page)
  const topInsights = patterns.insights.slice(0, 3);

  return (
    <div className="animate-fade-in">

      {/* ── Page header ────────────────────────────────────────────── */}
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Personal score and scan history for{' '}
          <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>{activePersona.name}</strong>
        </p>
      </div>

      {/* ── Quick scan input ────────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 'var(--sp-8)' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
          <div className="input-icon-wrap" style={{ flex: '1 1 240px' }}>
            <Search size={16} className="input-icon" />
            <input
              type="text"
              className="input"
              value={scanInput}
              onChange={e => setScanInput(e.target.value)}
              placeholder="Enter a barcode, product name, or INS code"
              aria-label="Product search"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <Camera size={14} />
            Analyse product
          </button>
        </form>
      </div>

      {/* ── Main grid ───────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--sp-6)' }}>

        {/* ── Col 1: Score dial + stats ──────────────────────────── */}
        <div style={{ gridColumn: 'span 4' }}>

          {/* Score card */}
          <div className="card" style={{ marginBottom: 'var(--sp-6)' }}>
            <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-4)' }}>
              Nutrition index
            </div>

            {/* Grid: dial left, label right — no overlap */}
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--sp-4)', alignItems: 'center' }}>
              <ScoreDial score={score} size={120} />
              <div>
                <span className={`verdict-badge verdict-${band}`} style={{ marginBottom: 'var(--sp-2)', display: 'inline-flex' }}>
                  {getBandLabel(band)}
                </span>
                <div style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', marginBottom: 'var(--sp-1)' }}>
                  Average across {data.totalScans} scans
                </div>
                <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)' }}>
                  Calculated for {activePersona.name}
                </div>
              </div>
            </div>
          </div>

          {/* Scan streak — no emoji */}
          <div className="card" style={{ marginBottom: 'var(--sp-6)' }}>
            <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-2)' }}>
              Scan streak
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-2)' }}>
              <span className="score-value tabular" style={{ fontSize: 'var(--text-39)', color: 'var(--ink)' }}>
                {data.currentStreakDays}
              </span>
              <span style={{ fontSize: 'var(--text-14)', color: 'var(--ink-3)' }}>
                {data.currentStreakDays === 1 ? 'day' : 'days'} in a row
              </span>
            </div>
            <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', marginTop: 'var(--sp-1)' }}>
              Longest: {data.longestStreakDays} days
            </div>
          </div>

          {/* Recall alerts shortcut */}
          <button
            className="card btn-ghost"
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--sp-4)' }}
            onClick={onNavigateToRecalls}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <ShieldAlert size={16} style={{ color: 'var(--verdict-avoid)' }} />
              <div>
                <div style={{ fontSize: 'var(--text-14)', fontWeight: 600, color: 'var(--ink)' }}>Recall alerts</div>
                <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)' }}>3 active notices in seeded dataset</div>
              </div>
            </div>
            <ArrowRight size={14} style={{ color: 'var(--ink-3)' }} />
          </button>
        </div>

        {/* ── Col 2: Pattern summary ──────────────────────────────── */}
        <div style={{ gridColumn: 'span 4' }}>
          <div className="card" style={{ height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)' }}>Pattern summary</div>
                <div style={{ fontSize: 'var(--text-14)', fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>
                  Last {patterns.analyzedScansCount} scans
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={onNavigateToPatterns}
                aria-label="View full pattern report"
              >
                <BarChart3 size={14} />
                Full report
              </button>
            </div>

            {topInsights.map(insight => (
              <PatternBar
                key={insight.metricKey}
                label={insight.title.replace(/[^\x00-\x7F]/g, '')} /* strip any emoji */
                pct={insight.percentage}
                count={Math.round(insight.percentage / 100 * insight.sampleSize)}
                total={insight.sampleSize}
                severity={insight.severity}
              />
            ))}

            <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 'var(--sp-4)', marginTop: 'var(--sp-2)' }}>
              <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', lineHeight: 1.5, maxWidth: 'none' }}>
                {patterns.overallSummary}
              </p>
            </div>
          </div>
        </div>

        {/* ── Col 3: Learning card ────────────────────────────────── */}
        <div style={{ gridColumn: 'span 4' }}>
          <div className="card" style={{ borderLeft: '3px solid var(--ink)', marginBottom: 'var(--sp-6)' }}>
            <div style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'flex-start' }}>
              <BookOpen size={16} style={{ color: 'var(--ink-3)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-1)' }}>
                  Today's concept
                </div>
                <div style={{ fontSize: 'var(--text-14)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-1)' }}>
                  What is NOVA and why it matters
                </div>
                <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', margin: 0, maxWidth: 'none' }}>
                  The NOVA classification groups foods by the degree of industrial processing, not by nutritional composition.
                  Understanding it changes how you shop.
                </p>
              </div>
            </div>
          </div>

          {/* Overall summary */}
          <div className="card card-sunk">
            <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-2)' }}>
              What to focus on
            </div>
            {activePersona.healthConditions.length > 0 ? (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                {activePersona.healthConditions.map(c => (
                  <li key={c} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-2)', fontSize: 'var(--text-14)', color: 'var(--ink-2)' }}>
                    <AlertTriangle size={14} style={{ color: 'var(--verdict-limit)', flexShrink: 0, marginTop: 2 }} />
                    {(c as string) === 'Hypertension' && 'Aim for under 140 mg sodium per serving.'}
                    {(c as string) === 'Type2Diabetes' && 'Prefer products with under 10 g sugars per 100 g.'}
                    {(c as string) === 'HighCholesterol' && 'Limit saturated fat to under 6 g per 100 g.'}
                    {(c as string) === 'GERD' && 'Avoid acidic and spicy ingredients.'}
                    {(c as string) === 'KidneySupport' && 'Watch for phosphate additives (INS 338–452).'}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', margin: 0, maxWidth: 'none' }}>
                No conditions set. Visit Profile to personalise your analysis.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* ── Recent scans table ───────────────────────────────────── */}
      <div className="card" style={{ marginTop: 'var(--sp-8)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)' }}>Recent scans</div>
            <div style={{ fontSize: 'var(--text-14)', fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>
              {data.recentScans.length} products
            </div>
          </div>
          <TrendingUp size={16} style={{ color: 'var(--ink-3)' }} />
        </div>

        {data.recentScans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--sp-12)', color: 'var(--ink-3)' }}>
            <Clock size={32} style={{ marginBottom: 'var(--sp-3)', opacity: 0.5 }} />
            <div style={{ fontSize: 'var(--text-14)' }}>No scans yet. Scan your first product to see history here.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th
                    className="right"
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => toggleSort('sodium')}
                    aria-sort={sortCol === 'sodium' ? (sortAsc ? 'ascending' : 'descending') : 'none'}
                  >
                    Sodium {sortCol === 'sodium' ? (sortAsc ? '↑' : '↓') : ''}
                  </th>
                  <th
                    className="right"
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => toggleSort('score')}
                    aria-sort={sortCol === 'score' ? (sortAsc ? 'ascending' : 'descending') : 'none'}
                  >
                    Score {sortCol === 'score' ? (sortAsc ? '↑' : '↓') : ''}
                  </th>
                  <th
                    className="right"
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                    onClick={() => toggleSort('date')}
                    aria-sort={sortCol === 'date' ? (sortAsc ? 'ascending' : 'descending') : 'none'}
                  >
                    Date {sortCol === 'date' ? (sortAsc ? '↑' : '↓') : ''}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedScans.map(scan => (
                  <ScanRow
                    key={scan.id}
                    scan={scan}
                    onClick={() => onNavigateToIntelligence(scan.productId)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Open Food Facts attribution */}
      <p style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', marginTop: 'var(--sp-6)', lineHeight: 1.5 }}>
        Product data from{' '}
        <a href="https://world.openfoodfacts.org" target="_blank" rel="noopener noreferrer">
          Open Food Facts
        </a>
        , licensed under the{' '}
        <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noopener noreferrer">
          Open Database License (ODbL)
        </a>
        . Sample data is used for demonstration purposes.
      </p>

    </div>
  );
};
