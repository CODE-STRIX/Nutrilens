import React, { useState, useEffect } from 'react';
import { AlternativeRecommendation, ComparisonResult, ComparisonMetric } from '@shared/types/personalization';
import { api } from '../services/api';
import { ArrowLeftRight, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { ManufacturingTransparencyModal } from '../components/ManufacturingTransparencyModal';
import { Product } from '@shared/types/product';

export const AlternativesComparisonPage: React.FC = () => {
  const [alternative, setAlternative] = useState<AlternativeRecommendation | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [altData, compData] = await Promise.all([
      api.getHealthyAlternative('8901234567890'),
      api.compareProducts('PROD-8901234567890', 'PROD-8909876543210')
    ]);
    setAlternative(altData);
    setComparison(compData);
    setLoading(false);
  };

  if (loading || !alternative || !comparison) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ color: 'var(--cyan-400)', fontWeight: 600 }}>Loading Shopping Assistant & Alternatives History...</div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span className="badge badge-emerald"><ArrowLeftRight size={14} /> Alternatives & Comparisons</span>
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Healthy Alternatives & Product Comparison</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.95rem' }}>
            Review healthy alternatives and side-by-side product comparisons with clear, plain-language verdicts.
          </p>
        </div>
      </div>

      {/* Alternative Recommendation */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Sparkles color="var(--emerald-400)" size={22} />
          <h2 style={{ fontSize: '1.35rem' }}>Healthy Alternative Recommendation</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center' }}>
          {/* Original Product */}
          <div className="glass-panel" style={{ padding: '20px', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className="badge badge-rose">Scanned Product</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{alternative.originalProductName}</h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)', marginTop: '10px', lineHeight: 1.5 }}>
              {(alternative.recommendedProduct.ingredientText ?? 'Refined Wheat Flour (Maida), Palmolein Oil, Salt, MSG (INS 621), Tartrazine (INS 102).')}
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ background: 'var(--emerald-500)', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
              <ArrowRight color="#fff" size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--emerald-400)', fontWeight: 700 }}>BETTER PICK</span>
          </div>

          {/* Recommended Alternative */}
          <div className="glass-panel" style={{ padding: '20px', borderColor: 'rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span className="badge badge-emerald">Recommended Alternative</span>
              <span style={{ fontWeight: 800, color: 'var(--emerald-400)' }}>Score {alternative.personalizedScore}/100</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{alternative.recommendedProduct.name}</h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--emerald-400)', fontWeight: 600, marginBottom: '12px' }}>{alternative.recommendedProduct.brand}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: 'var(--radius-sm)', lineHeight: 1.5 }}>
              {alternative.recommendedProduct.ingredientText}
            </div>
          </div>
        </div>

        {/* Why it's better */}
        <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Why this is a genuinely better choice:</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>{alternative.verdict}</div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {alternative.keyImprovements.map((imp, idx) => (
              <span key={idx} style={{ fontSize: '0.82rem', color: 'var(--emerald-400)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} /> {imp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Feature 9: Smart Shopping Assistant */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <ArrowLeftRight color="var(--cyan-400)" size={22} />
          <h2 style={{ fontSize: '1.35rem' }}>Feature 9 — Smart Shopping Assistant Comparison</h2>
        </div>

        {/* Plain language verdict */}
        <div className="glass-panel" style={{ padding: '18px', marginBottom: '24px', borderColor: 'var(--cyan-400)', background: 'rgba(6,182,212,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan-400)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}>
            <ShieldCheck size={16} /> Plain-Language Verdict
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>{comparison.plainLanguageVerdict}</div>
        </div>

        {/* Comparison Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.03)' }}>
                <th style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.82rem', textTransform: 'uppercase' }}>Metric</th>
                <th style={{ padding: '14px 16px', color: '#fff', fontSize: '0.92rem' }}>{comparison.productA.name}</th>
                <th style={{ padding: '14px 16px', color: '#fff', fontSize: '0.92rem' }}>{comparison.productB.name}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.comparisonMetrics.map((row: ComparisonMetric, idx: number) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '13px 16px', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{row.metricName}</td>
                  <td style={{ padding: '13px 16px', color: row.betterProduct === 'A' ? 'var(--emerald-400)' : 'var(--text-secondary)', fontWeight: row.betterProduct === 'A' ? 700 : 400, fontSize: '0.88rem' }}>
                    {String(row.productAValue)} {row.betterProduct === 'A' && <CheckCircle2 size={13} style={{ display: 'inline', marginLeft: '4px' }} />}
                  </td>
                  <td style={{ padding: '13px 16px', color: row.betterProduct === 'B' ? 'var(--emerald-400)' : 'var(--text-secondary)', fontWeight: row.betterProduct === 'B' ? 700 : 400, fontSize: '0.88rem' }}>
                    {String(row.productBValue)} {row.betterProduct === 'B' && <CheckCircle2 size={13} style={{ display: 'inline', marginLeft: '4px' }} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => setSelectedProductForModal(comparison.productA)}>
            <Info size={16} /> Product A: Manufacturing Rationale
          </button>
          <button className="btn-secondary" onClick={() => setSelectedProductForModal(comparison.productB)}>
            <Info size={16} /> Product B: Manufacturing Rationale
          </button>
        </div>
      </div>

      {selectedProductForModal && (
        <ManufacturingTransparencyModal product={selectedProductForModal} onClose={() => setSelectedProductForModal(null)} />
      )}
    </div>
  );
};
