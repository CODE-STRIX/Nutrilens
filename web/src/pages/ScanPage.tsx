import React, { useState, useRef } from 'react';
import { Camera, Type, Image, Search, Barcode, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { UserProfile } from '@shared/types/user';
import { WebApiService } from '../services/api';
import { Product, PersonalizedAnalysisResult } from '@shared/types';
import { scoreProduct, getBandLabel, getBandColour, getBandCssClass, getBandTint, scoreToArcOffset } from '../utils/scoring';

// ── Props ─────────────────────────────────────────────────────────────────────

interface ScanPageProps {
  activePersona: UserProfile;
  onNavigateToIntelligence: (productId?: string) => void;
}

// ── Sample products for demo chips ───────────────────────────────────────────

const SAMPLE_PRODUCTS = [
  { id: 'prod-maggi-2min',          label: 'Maggi Noodles',       barcode: '8901058852011' },
  { id: 'prod-lays-magic-masala',   label: "Lay's Magic Masala",  barcode: '4890008840012' },
  { id: 'prod-muesli-whole-grain',  label: 'TrueElements Muesli', barcode: '8906044320018' },
  { id: 'prod-amul-fresh-milk',     label: 'Amul Fresh Milk',     barcode: '8901088500019' },
];

type InputTab = 'type' | 'photo';

// ── Score dial (inline, no import duplication) ─────────────────────────────

const ResultDial: React.FC<{ score: number }> = ({ score }) => {
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const offset = scoreToArcOffset(score, r);
  const band = score >= 80 ? 'good' : score >= 60 ? 'okay' : score >= 40 ? 'limit' : 'avoid';
  const colour = getBandColour(band);

  return (
    <div style={{ position: 'relative', width: 96, height: 96 }} aria-hidden="true">
      <svg width={96} height={96} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--surface-sunk)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={colour}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: 'var(--text-25)', lineHeight: 1, color: colour, fontVariantNumeric: 'tabular-nums' }}>
          {score}
        </span>
        <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>/ 100</span>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────

const ScanPage: React.FC<ScanPageProps> = ({ activePersona, onNavigateToIntelligence }) => {
  const [activeTab, setActiveTab] = useState<InputTab>('type');
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ product: Product; analysis: PersonalizedAnalysisResult } | null>(null);
  const [revealStage, setRevealStage] = useState(0); // 0=hidden 1=name 2=score 3=alerts 4=done
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Analysis ───────────────────────────────────────────────────────────────

  const analyse = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setRevealStage(0);

    try {
      const products = await WebApiService.getProducts();
      const found = products.find(p =>
        p.id === query ||
        p.name?.toLowerCase().includes(query.toLowerCase()) ||
        (p as any).barcode === query
      ) || products.find(p =>
        (p as any).barcodes?.includes(query)
      );

      if (!found) {
        setError('No product found for that search. Try a different term, or scan using the camera on a mobile device.');
        setLoading(false);
        return;
      }

      const [analysis] = await Promise.all([
        WebApiService.analyzeProduct(found.id)
      ]);

      // Run through single scoring engine
      const scoreRes = scoreProduct(found, activePersona);

      // Merge scoring engine result into analysis for consistency
      if (analysis) {
        analysis.personalizedScore = scoreRes.score;
        (analysis as any).scoreBreakdown = scoreRes.breakdown;
        (analysis as any).personalAlerts = scoreRes.alerts;
      }

      setResult({ product: found, analysis });
      setLoading(false);

      // Orchestrated reveal (900ms total)
      setRevealStage(1); // name fades in (0ms)
      setTimeout(() => setRevealStage(2), 120);  // score counts up
      setTimeout(() => setRevealStage(3), 570);  // alerts slide in
      setTimeout(() => setRevealStage(4), 900);  // done

      // Announce to screen readers
      const liveRegion = document.getElementById('scan-status');
      if (liveRegion) {
        liveRegion.textContent = `Analysis complete. ${found.name} scored ${scoreRes.score} out of 100. ${getBandLabel(scoreRes.band)}.`;
      }

    } catch (err) {
      setError('The product lookup failed. Check your connection and try again.');
      setLoading(false);
    }
  };

  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyse(queryInput);
  };

  const handleSampleChip = (product: typeof SAMPLE_PRODUCTS[0]) => {
    setQueryInput(product.id);
    analyse(product.id);
  };

  // ── Result view ────────────────────────────────────────────────────────────

  const renderResult = () => {
    if (!result) return null;
    const { product, analysis } = result;
    const score = analysis?.personalizedScore ?? 0;
    const band = score >= 80 ? 'good' : score >= 60 ? 'okay' : score >= 40 ? 'limit' : 'avoid';
    const scoreRes = scoreProduct(product, activePersona);

    return (
      <div style={{ marginTop: 'var(--sp-8)' }}>
        <hr className="divider" />

        {/* Product name — stage 1 */}
        <div
          style={{
            opacity: revealStage >= 1 ? 1 : 0,
            transition: 'opacity 0.12s ease',
            marginBottom: 'var(--sp-6)',
          }}
        >
          <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-1)' }}>
            {(product as any).brand || ''}
          </div>
          <h2 style={{ fontFamily: 'Archivo, sans-serif', fontSize: 'var(--text-25)', fontWeight: 600, marginBottom: 'var(--sp-2)' }}>
            {product.name}
          </h2>
          <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
            {(product as any).category && (
              <span style={{
                fontSize: 'var(--text-12)', fontWeight: 500, color: 'var(--ink-3)',
                background: 'var(--surface-sunk)', padding: '2px var(--sp-2)',
                borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)'
              }}>
                {(product as any).category}
              </span>
            )}
            {(product as any).nova_group && (
              <span style={{
                fontSize: 'var(--text-12)', fontWeight: 500, color: 'var(--ink-3)',
                background: 'var(--surface-sunk)', padding: '2px var(--sp-2)',
                borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)'
              }}>
                NOVA {(product as any).nova_group}
              </span>
            )}
          </div>
        </div>

        {/* Score + verdict — stage 2 */}
        <div
          style={{
            opacity: revealStage >= 2 ? 1 : 0,
            transform: revealStage >= 2 ? 'none' : 'translateY(8px)',
            transition: 'opacity 0.45s ease, transform 0.45s ease',
            marginBottom: 'var(--sp-6)',
          }}
        >
          <div className="card" style={{ background: getBandTint(band) }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--sp-6)', alignItems: 'center' }}>
              <ResultDial score={score} />
              <div>
                <span className={`verdict-badge verdict-${band}`} style={{ marginBottom: 'var(--sp-2)', display: 'inline-flex' }}>
                  {getBandLabel(band)}
                </span>
                <div style={{ fontSize: 'var(--text-16)', color: 'var(--ink-2)' }}>
                  Analysed for <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{activePersona.name}</strong>
                </div>
                {scoreRes.confidence === 'partial' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginTop: 'var(--sp-2)', fontSize: 'var(--text-12)', color: 'var(--ink-3)' }}>
                    <Info size={12} />
                    Partial confidence — some nutrient fields were missing from the label data.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal alerts — stage 3 */}
        {scoreRes.alerts.length > 0 && (
          <div
            style={{
              opacity: revealStage >= 3 ? 1 : 0,
              transform: revealStage >= 3 ? 'none' : 'translateY(8px)',
              transition: 'opacity 0.3s ease 0.08s, transform 0.3s ease 0.08s',
              marginBottom: 'var(--sp-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-3)',
            }}
          >
            {scoreRes.alerts.map((alert, i) => (
              <div
                key={i}
                className={`risk-row ${alert.severity === 'block' ? 'avoid' : alert.severity === 'high' ? 'avoid' : 'limit'}`}
              >
                <AlertCircle size={16} style={{ color: alert.severity === 'medium' ? 'var(--verdict-limit)' : 'var(--verdict-avoid)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-14)', color: 'var(--ink)', marginBottom: 2 }}>
                    {alert.condition}: {alert.triggerValue}
                  </div>
                  <div style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)' }}>
                    {alert.consequence}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Score breakdown — stage 4 */}
        {revealStage >= 4 && scoreRes.breakdown.length > 0 && (
          <div className="card" style={{ marginBottom: 'var(--sp-6)' }}>
            <details>
              <summary style={{
                cursor: 'pointer', fontWeight: 600, fontSize: 'var(--text-14)', color: 'var(--ink)',
                listStyle: 'none', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)',
                padding: 'var(--sp-1) 0',
              }}>
                How this score was calculated
              </summary>
              <table className="data-table" style={{ marginTop: 'var(--sp-4)' }}>
                <thead>
                  <tr>
                    <th>Factor</th>
                    <th>Value</th>
                    <th className="right">Adjustment</th>
                  </tr>
                </thead>
                <tbody>
                  {scoreRes.breakdown.map((line, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500, color: 'var(--ink)' }}>{line.factor}</td>
                      <td style={{ color: 'var(--ink-2)' }}>{line.value}</td>
                      <td className="right tabular" style={{
                        color: line.delta > 0 ? 'var(--verdict-ok)' : line.delta < 0 ? 'var(--verdict-limit)' : 'var(--ink-3)',
                        fontWeight: 600,
                      }}>
                        {line.delta > 0 ? `+${line.delta}` : line.delta === 0 ? '—' : `${line.delta}`}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: '2px solid var(--rule)' }}>
                    <td style={{ fontWeight: 700, color: 'var(--ink)' }} colSpan={2}>Final score</td>
                    <td className="right tabular" style={{ fontWeight: 700, color: 'var(--ink)' }}>{score}</td>
                  </tr>
                </tbody>
              </table>
            </details>
          </div>
        )}

        {/* CTA to product intelligence */}
        {revealStage >= 4 && (
          <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => onNavigateToIntelligence(product.id)}
            >
              View full ingredient intelligence
              <ChevronRight size={14} />
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => { setResult(null); setRevealStage(0); setQueryInput(''); inputRef.current?.focus(); }}
            >
              Scan another product
            </button>
          </div>
        )}
      </div>
    );
  };

  // ── Page ──────────────────────────────────────────────────────────────────

  return (
    <div className="animate-fade-in">

      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Scan and lookup</h1>
        <p className="page-subtitle">
          Type a barcode, product name, or INS code to get an instant safety verdict personalised for{' '}
          <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>{activePersona.name}</strong>.
        </p>
      </div>

      {/* Input tabs */}
      <div className="card" style={{ maxWidth: 640 }}>
        <div className="tab-bar" style={{ marginBottom: 'var(--sp-4)' }}>
          <button
            className={`tab-btn${activeTab === 'type' ? ' active' : ''}`}
            onClick={() => setActiveTab('type')}
          >
            <Type size={14} style={{ display: 'inline', marginRight: 'var(--sp-1)', verticalAlign: 'middle' }} />
            Type or paste
          </button>
          <button
            className={`tab-btn${activeTab === 'photo' ? ' active' : ''}`}
            onClick={() => setActiveTab('photo')}
          >
            <Image size={14} style={{ display: 'inline', marginRight: 'var(--sp-1)', verticalAlign: 'middle' }} />
            Photograph label
          </button>
        </div>

        {/* Type tab */}
        {activeTab === 'type' && (
          <form onSubmit={handleTypeSubmit}>
            <div className="input-icon-wrap" style={{ marginBottom: 'var(--sp-3)' }}>
              <Search size={16} className="input-icon" />
              <input
                ref={inputRef}
                type="text"
                className="input"
                value={queryInput}
                onChange={e => setQueryInput(e.target.value)}
                placeholder="Barcode, product name, or INS code (e.g. INS 211)"
                aria-label="Product search"
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary" disabled={loading || !queryInput.trim()}>
                {loading ? (
                  <>
                    <div className="animate-spin" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />
                    Analysing
                  </>
                ) : (
                  <>
                    <Barcode size={14} />
                    Analyse product
                  </>
                )}
              </button>
            </div>

            {/* Sample chips */}
            <div>
              <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', marginBottom: 'var(--sp-2)' }}>
                Try a sample product:
              </div>
              <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                {SAMPLE_PRODUCTS.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleSampleChip(p)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* Photo tab */}
        {activeTab === 'photo' && (
          <div>
            <div
              className="scan-viewfinder scan-corners"
              style={{ marginBottom: 'var(--sp-4)' }}
              aria-label="Simulated camera viewfinder"
            >
              <Camera size={32} style={{ color: 'var(--ink-3)', opacity: 0.4, marginBottom: 'var(--sp-2)' }} />
              <div style={{ fontSize: 'var(--text-14)', color: 'var(--ink-3)', textAlign: 'center', maxWidth: 240 }}>
                Camera capture is simulated in this demo.
                Use the "Type or paste" tab to analyse products.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setActiveTab('type')}
              >
                Switch to text input
              </button>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            className="risk-row limit"
            style={{ marginTop: 'var(--sp-4)' }}
            role="alert"
          >
            <AlertCircle size={16} style={{ color: 'var(--verdict-limit)', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)' }}>{error}</span>
          </div>
        )}
      </div>

      {/* Result */}
      <div style={{ maxWidth: 640 }}>
        {renderResult()}
      </div>

      {/* Attribution */}
      <p style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', marginTop: 'var(--sp-8)', lineHeight: 1.5, maxWidth: 640 }}>
        Product data from{' '}
        <a href="https://world.openfoodfacts.org" target="_blank" rel="noopener noreferrer">Open Food Facts</a>
        , licensed under the{' '}
        <a href="https://opendatacommons.org/licenses/odbl/1-0/" target="_blank" rel="noopener noreferrer">Open Database License (ODbL)</a>
        . This demo uses locally seeded sample data.
      </p>

    </div>
  );
};

export default ScanPage;
