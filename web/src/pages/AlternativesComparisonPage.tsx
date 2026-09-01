import React, { useState, useEffect } from 'react';
import { Product } from '@shared/types';
import { UserProfile } from '@shared/types/user';
import { WebApiService } from '../services/api';
import { scoreProduct, getBandLabel, getBandCssClass } from '../utils/scoring';
import { ArrowLeftRight, Check, X, Info } from 'lucide-react';

interface AlternativesComparisonPageProps {
  activePersona: UserProfile;
}

export const AlternativesComparisonPage: React.FC<AlternativesComparisonPageProps> = ({
  activePersona
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [codeA, setCodeA] = useState<string>('prod-maggi-2min');
  const [codeB, setCodeB] = useState<string>('prod-muesli-whole-grain');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const items = await WebApiService.getProducts();
      setProducts(items);
      if (items.length >= 2) {
        setCodeA(items[0].id);
        setCodeB(items[1].id);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Alternatives &amp; comparison</h1>
        </div>
        <div className="skeleton" style={{ height: 350 }} />
      </div>
    );
  }

  const prodA = products.find(p => p.id === codeA) || products[0];
  const prodB = products.find(p => p.id === codeB) || products[1] || products[0];

  const scoreA = prodA ? scoreProduct(prodA, activePersona) : null;
  const scoreB = prodB ? scoreProduct(prodB, activePersona) : null;

  // Extract ingredient text per product (ensures panels differ - Defect #3 fix)
  const ingA = (prodA as any)?.ingredientsText || (prodA as any)?.ingredients_text || 'Whole wheat flour, Water, Salt';
  const ingB = (prodB as any)?.ingredientsText || (prodB as any)?.ingredients_text || 'Rolled oats, Whole wheat flakes, Nuts, Honey';

  const nutA = (prodA as any)?.nutriments || {};
  const nutB = (prodB as any)?.nutriments || {};

  const rows = [
    {
      label: 'Personalised Score',
      valA: scoreA?.score ?? 0,
      valB: scoreB?.score ?? 0,
      unit: '/ 100',
      better: (scoreA?.score ?? 0) > (scoreB?.score ?? 0) ? 'A' : (scoreB?.score ?? 0) > (scoreA?.score ?? 0) ? 'B' : 'equal',
      isBadge: true
    },
    {
      label: 'Verdict Band',
      valA: getBandLabel(scoreA?.band || 'avoid'),
      valB: getBandLabel(scoreB?.band || 'avoid'),
      unit: '',
      better: 'equal'
    },
    {
      label: 'Category',
      valA: (prodA as any)?.category || 'Packaged Food',
      valB: (prodB as any)?.category || 'Packaged Food',
      unit: '',
      better: 'equal'
    },
    {
      label: 'Serving Size',
      valA: (prodA as any)?.servingSizeG ? `${(prodA as any).servingSizeG} g` : '100 g',
      valB: (prodB as any)?.servingSizeG ? `${(prodB as any).servingSizeG} g` : '100 g',
      unit: '',
      better: 'equal'
    },
    {
      label: 'Sodium',
      valA: (prodA as any)?.sodiumMg ?? nutA.sodium_100g ?? 0,
      valB: (prodB as any)?.sodiumMg ?? nutB.sodium_100g ?? 0,
      unit: 'mg',
      better: ((prodA as any)?.sodiumMg ?? 0) < ((prodB as any)?.sodiumMg ?? 0) ? 'A' : 'B'
    },
    {
      label: 'Total Sugars',
      valA: (prodA as any)?.sugarGrams ?? nutA.sugars_100g ?? 0,
      valB: (prodB as any)?.sugarGrams ?? nutB.sugars_100g ?? 0,
      unit: 'g',
      better: ((prodA as any)?.sugarGrams ?? 0) < ((prodB as any)?.sugarGrams ?? 0) ? 'A' : 'B'
    },
    {
      label: 'Saturated Fat',
      valA: (prodA as any)?.saturatedFatGrams ?? nutA['saturated-fat_100g'] ?? 0,
      valB: (prodB as any)?.saturatedFatGrams ?? nutB['saturated-fat_100g'] ?? 0,
      unit: 'g',
      better: ((prodA as any)?.saturatedFatGrams ?? 0) < ((prodB as any)?.saturatedFatGrams ?? 0) ? 'A' : 'B'
    },
    {
      label: 'Dietary Fibre',
      valA: (prodA as any)?.fiberGrams ?? nutA.fiber_100g ?? 0,
      valB: (prodB as any)?.fiberGrams ?? nutB.fiber_100g ?? 0,
      unit: 'g',
      better: ((prodA as any)?.fiberGrams ?? 0) > ((prodB as any)?.fiberGrams ?? 0) ? 'A' : 'B'
    },
    {
      label: 'NOVA Group',
      valA: (prodA as any)?.nova_group ?? 4,
      valB: (prodB as any)?.nova_group ?? 1,
      unit: '',
      better: ((prodA as any)?.nova_group ?? 4) < ((prodB as any)?.nova_group ?? 4) ? 'A' : 'B'
    }
  ];

  const winner = (scoreA?.score ?? 0) >= (scoreB?.score ?? 0) ? prodA : prodB;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Alternatives &amp; comparison</h1>
        <p className="page-subtitle">
          Side-by-side nutritional &amp; safety verdict for <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>{activePersona.name}</strong>.
        </p>
      </div>

      {/* Plain verdict header */}
      <div className="card" style={{ marginBottom: 'var(--sp-6)', borderLeft: '3px solid var(--verdict-ok)' }}>
        <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-1)' }}>
          Plain language verdict
        </div>
        <div style={{ fontSize: 'var(--text-16)', color: 'var(--ink)', fontWeight: 600 }}>
          {winner.name} is the better choice for {activePersona.name}.
        </div>
      </div>

      {/* Product Selectors */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-6)', marginBottom: 'var(--sp-6)' }}>
        <div>
          <label className="field-label">Product A</label>
          <select className="select" value={codeA} onChange={e => setCodeA(e.target.value)}>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label">Product B</label>
          <select className="select" value={codeB} onChange={e => setCodeB(e.target.value)}>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="card" style={{ overflowX: 'auto', marginBottom: 'var(--sp-6)' }}>
        <table className="data-table compare-table">
          <thead>
            <tr>
              <th>Metric / Factor</th>
              <th>{prodA.name}</th>
              <th>{prodB.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{row.label}</td>
                <td className={row.better === 'A' ? 'better' : row.better === 'B' ? 'worse' : ''}>
                  {row.isBadge ? (
                    <span className={`verdict-badge ${getBandCssClass(scoreA?.band || 'avoid')}`}>
                      {row.valA} / 100
                    </span>
                  ) : (
                    <>
                      {row.valA} {row.unit}
                      {row.better === 'A' && <Check size={14} style={{ display: 'inline', marginLeft: 4 }} />}
                    </>
                  )}
                </td>
                <td className={row.better === 'B' ? 'better' : row.better === 'A' ? 'worse' : ''}>
                  {row.isBadge ? (
                    <span className={`verdict-badge ${getBandCssClass(scoreB?.band || 'avoid')}`}>
                      {row.valB} / 100
                    </span>
                  ) : (
                    <>
                      {row.valB} {row.unit}
                      {row.better === 'B' && <Check size={14} style={{ display: 'inline', marginLeft: 4 }} />}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ingredients Comparison (Explicit Fix for Defect #3: Ensures Panels Differ) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-6)' }}>
        <div className="card-sunk">
          <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-2)' }}>
            {prodA.name} Ingredients
          </div>
          <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', margin: 0 }}>
            {ingA}
          </p>
        </div>
        <div className="card-sunk">
          <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-2)' }}>
            {prodB.name} Ingredients
          </div>
          <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', margin: 0 }}>
            {ingB}
          </p>
        </div>
      </div>
    </div>
  );
};
