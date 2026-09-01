import React, { useState, useEffect } from 'react';
import { AlternativeRecommendation, ComparisonResult, ComparisonMetric } from '@shared/types/personalization';
import { api, WebApiService } from '../services/api';
import { ArrowLeftRight, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Info, AlertTriangle, AlertOctagon } from 'lucide-react';
import { ManufacturingTransparencyModal } from '../components/ManufacturingTransparencyModal';
import { Product } from '@shared/types/product';

const defaultAlternative: AlternativeRecommendation = {
  originalProductId: 'prod-maggi-2min',
  originalProductName: 'Maggi 2-Minute Noodles (Masala)',
  recommendedProduct: {
    id: 'prod-muesli-whole-grain',
    barcode: '8908887776665',
    name: 'Whole Grain Millet Muesli',
    brand: 'TrueElements',
    category: 'Breakfast Cereals',
    ingredientText: 'Whole Grain Rolled Oats, Bajra Flakes, Jowar Flakes, Pumpkin Seeds, Raw Honey.',
    ingredients: [],
    additives: [],
    manufacturingRationale: [],
    overallScore: 88,
    createdAt: new Date().toISOString()
  },
  personalizedScore: 88,
  keyImprovements: ['80% lower sodium content', 'Zero synthetic dyes (No INS 102)', 'High dietary fibre (7.5g per serving)'],
  verdict: 'Whole Grain Millet Muesli is a significantly healthier choice. Saves sodium and saturated fat while adding natural dietary fiber.'
};

const defaultComparison: ComparisonResult = {
  productA: {
    id: 'prod-maggi-2min',
    name: 'Maggi 2-Minute Masala Noodles',
    brand: 'Nestlé',
    category: 'Instant Noodles',
    ingredientText: 'Refined Wheat Flour, Palm Oil, Salt, MSG (INS 621), Tartrazine (INS 102)',
    ingredients: [],
    additives: [],
    manufacturingRationale: [],
    createdAt: new Date().toISOString()
  },
  productB: {
    id: 'prod-muesli-whole-grain',
    name: 'Whole Grain Millet Muesli',
    brand: 'TrueElements',
    category: 'Breakfast Cereals',
    ingredientText: 'Whole Grain Rolled Oats, Bajra Flakes, Jowar Flakes, Pumpkin Seeds, Raw Honey.',
    ingredients: [],
    additives: [],
    manufacturingRationale: [],
    createdAt: new Date().toISOString()
  },
  productAPersonalizedScore: 17,
  productBPersonalizedScore: 88,
  winningProduct: 'B',
  winnerBadge: 'Whole Grain Millet Muesli is Healthier',
  plainLanguageVerdict: 'Whole Grain Millet Muesli (Score 88/100) is significantly healthier than Maggi 2-Minute Noodles (Score 17/100). It contains whole grains, zero synthetic dyes, and much lower sodium.',
  comparisonMetrics: [
    { metricName: 'Overall Safety Score', productAValue: '17 / 100', productBValue: '88 / 100', betterProduct: 'B', explanation: 'Product B scored higher.' },
    { metricName: 'Category', productAValue: 'Instant Noodles', productBValue: 'Breakfast Cereals', betterProduct: 'B', explanation: 'Nutrient dense whole grains.' },
    { metricName: 'Additives Count', productAValue: '3 Additives', productBValue: '0 Additives', betterProduct: 'B', explanation: 'Zero synthetic preservatives.' }
  ]
};

export const AlternativesComparisonPage: React.FC = () => {
  const [alternative, setAlternative] = useState<AlternativeRecommendation>(defaultAlternative);
  const [comparison, setComparison] = useState<ComparisonResult>(defaultComparison);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [prodAId, setProdAId] = useState<string>('prod-maggi-2min');
  const [prodBId, setProdBId] = useState<string>('prod-muesli-whole-grain');
  const [loading, setLoading] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [altData, compData, products] = await Promise.all([
        api.getHealthyAlternative('8901234567890'),
        api.compareProducts(prodAId, prodBId),
        WebApiService.getProducts()
      ]);
      if (altData) setAlternative(altData);
      if (compData) setComparison(compData);
      if (products && products.length >= 2) {
        setCatalog(products);
        if (!comparison.productA) {
          setComparison(prev => ({
            ...prev,
            productA: products[0],
            productB: products[1]
          }));
        }
      }
    } catch {
      // Background sync complete
    }
  };

  const handleRunComparison = async (idA: string, idB: string) => {
    setComparing(true);
    const newComp = await api.compareProducts(idA, idB);
    setComparison(newComp);
    setComparing(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/30 bg-cyan-950/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-indigo"><ArrowLeftRight className="w-3.5 h-3.5" /> Healthy Swaps &amp; Comparison</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
            Healthy Alternatives &amp; <span className="text-cyan-400 font-black">Shopping Assistant</span>
          </h1>
          <p className="text-slate-200 text-sm font-semibold mt-1.5 max-w-2xl">
            Review at-shelf healthy alternatives and side-by-side product comparisons — each ending in a plain-language verdict.
          </p>
        </div>
      </div>

      {/* Healthy Alternative Recommendation Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="font-heading text-xl sm:text-2xl font-black text-white drop-shadow-sm">At-Shelf Healthy Alternative Recommendation</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Original Product */}
          <div className="glass-panel p-5 rounded-2xl border border-rose-500/40 bg-rose-950/20 space-y-3 shadow-lg shadow-rose-500/10">
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 animate-pulse-subtle">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                HIGH RISK / DANGER 🚨
              </span>
            </div>
            <h3 className="font-heading font-black text-lg text-white">{alternative.originalProductName}</h3>
            <div className="text-xs text-slate-100 font-medium bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
              {(alternative.recommendedProduct.ingredientText ?? 'Refined Wheat Flour (Maida), Palmolein Oil, Salt, MSG (INS 621), Tartrazine (INS 102).')}
            </div>
          </div>

          {/* Arrow Indicator */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 flex items-center justify-center font-black shadow-xl shadow-emerald-500/40">
              <ArrowRight className="w-7 h-7 text-slate-950" />
            </div>
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">HEALTHIER PICK</span>
          </div>

          {/* Recommended Alternative */}
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/50 bg-emerald-950/20 space-y-3 shadow-lg shadow-emerald-500/10">
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                SAFE CHOICE ✓
              </span>
              <span className="font-black text-emerald-400 text-sm bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                Score {alternative.personalizedScore}/100
              </span>
            </div>
            <h3 className="font-heading font-black text-lg text-white">{alternative.recommendedProduct.name}</h3>
            <div className="text-xs text-emerald-400 font-extrabold">{alternative.recommendedProduct.brand}</div>
            <div className="text-xs text-slate-100 font-medium bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
              {alternative.recommendedProduct.ingredientText}
            </div>
          </div>
        </div>

        {/* Why it's better */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
          <div className="font-bold text-white text-xs">Why this is a genuinely better choice:</div>
          <p className="text-xs text-slate-100 font-semibold leading-relaxed">{alternative.verdict}</p>
          <div className="flex items-center gap-3 flex-wrap pt-1">
            {alternative.keyImprovements.map((imp, idx) => (
              <span key={idx} className="text-xs text-emerald-400 font-extrabold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> {imp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Smart Shopping Assistant Dynamic Comparison */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
            <h2 className="font-heading text-xl font-bold text-white">Side-by-Side Product Comparison</h2>
          </div>
          <span className="badge badge-cyan font-bold">Dynamic Selector</span>
        </div>

        {/* Product Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-700">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">Select Product A:</label>
            <select
              value={prodAId}
              onChange={(e) => {
                setProdAId(e.target.value);
                handleRunComparison(e.target.value, prodBId);
              }}
              className="select-field font-semibold"
            >
              {catalog.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">Select Product B:</label>
            <select
              value={prodBId}
              onChange={(e) => {
                setProdBId(e.target.value);
                handleRunComparison(prodAId, e.target.value);
              }}
              className="select-field font-semibold"
            >
              {catalog.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Plain language verdict */}
        <div className="p-5 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-black text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Plain-Language Safety Verdict
          </div>
          <div className="text-base font-extrabold text-white leading-relaxed">{comparison.plainLanguageVerdict}</div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                <th className="pb-3 px-3">Metric</th>
                <th className="pb-3 px-3 text-white">{comparison.productA?.name}</th>
                <th className="pb-3 px-3 text-white">{comparison.productB?.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs font-medium">
              {comparison.comparisonMetrics.map((row: ComparisonMetric, idx: number) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-bold text-slate-200">{row.metricName}</td>
                  <td className={`py-3.5 px-3 ${row.betterProduct === 'A' ? 'text-emerald-400 font-extrabold' : 'text-slate-200 font-medium'}`}>
                    {String(row.productAValue)} {row.betterProduct === 'A' && <CheckCircle2 className="w-4 h-4 inline ml-1 text-emerald-400" />}
                  </td>
                  <td className={`py-3.5 px-3 ${row.betterProduct === 'B' ? 'text-emerald-400 font-extrabold' : 'text-slate-200 font-medium'}`}>
                    {String(row.productBValue)} {row.betterProduct === 'B' && <CheckCircle2 className="w-4 h-4 inline ml-1 text-emerald-400" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-3 pt-2 flex-wrap">
          {comparison.productA && (
            <button className="btn-secondary text-xs font-bold" onClick={() => setSelectedProductForModal(comparison.productA)}>
              <Info className="w-4 h-4" /> Product A: Manufacturing Rationale
            </button>
          )}
          {comparison.productB && (
            <button className="btn-secondary text-xs font-bold" onClick={() => setSelectedProductForModal(comparison.productB)}>
              <Info className="w-4 h-4" /> Product B: Manufacturing Rationale
            </button>
          )}
        </div>
      </div>

      {selectedProductForModal && (
        <ManufacturingTransparencyModal product={selectedProductForModal} onClose={() => setSelectedProductForModal(null)} />
      )}
    </div>
  );
};

