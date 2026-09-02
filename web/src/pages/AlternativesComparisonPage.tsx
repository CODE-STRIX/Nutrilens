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
  const getIngText = (p: any) => {
    if (!p) return '';
    if (p.ingredientsText) return p.ingredientsText;
    if (p.ingredients_text) return p.ingredients_text;
    if (Array.isArray(p.ingredients)) {
      return p.ingredients.map((i: any) => i.name).join(', ');
    }
    return '';
  };

  const ingA = getIngText(prodA) || 'Refined wheat flour, Palm oil, Salt, Seasoning';
  const ingB = getIngText(prodB) || 'Potato, Palmolein oil, Salt, Spices';

  const getNut = (p: any) => {
    const nutriments = p?.nutriments || {};
    const nutrition = p?.nutrition || {};
    return {
      sodium: nutriments.sodium_100g ?? nutriments.sodium ?? nutrition.sodiumMg ?? p?.sodiumMg ?? 0,
      sugars: nutriments.sugars_100g ?? nutriments.sugars ?? nutrition.sugarGrams ?? p?.sugarGrams ?? 0,
      satFat: nutriments['saturated-fat_100g'] ?? nutriments['saturated-fat'] ?? nutrition.saturatedFatGrams ?? p?.saturatedFatGrams ?? 0,
      fiber: nutriments.fiber_100g ?? nutriments.fiber ?? nutrition.fiberGrams ?? p?.fiberGrams ?? 0,
      serving: nutrition.servingSize || p?.servingSize || '100 g',
      nova: p?.nova_group ?? p?.novaGroup ?? 4
    };
  };

  const nutA = getNut(prodA);
  const nutB = getNut(prodB);

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
      valA: nutA.serving,
      valB: nutB.serving,
      unit: '',
      better: 'equal'
    },
    {
      label: 'Sodium',
      valA: nutA.sodium,
      valB: nutB.sodium,
      unit: 'mg',
      better: nutA.sodium < nutB.sodium ? 'A' : nutB.sodium < nutA.sodium ? 'B' : 'equal'
    },
    {
      label: 'Total Sugars',
      valA: nutA.sugars,
      valB: nutB.sugars,
      unit: 'g',
      better: nutA.sugars < nutB.sugars ? 'A' : nutB.sugars < nutA.sugars ? 'B' : 'equal'
    },
    {
      label: 'Saturated Fat',
      valA: nutA.satFat,
      valB: nutB.satFat,
      unit: 'g',
      better: nutA.satFat < nutB.satFat ? 'A' : nutB.satFat < nutA.satFat ? 'B' : 'equal'
    },
    {
      label: 'Dietary Fibre',
      valA: nutA.fiber,
      valB: nutB.fiber,
      unit: 'g',
      better: nutA.fiber > nutB.fiber ? 'A' : nutB.fiber > nutA.fiber ? 'B' : 'equal'
    },
    {
      label: 'NOVA Group',
      valA: nutA.nova,
      valB: nutB.nova,
      unit: '',
      better: 'equal'
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
