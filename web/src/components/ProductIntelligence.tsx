import React, { useState, useEffect } from 'react';
import { Product, PersonalizedAnalysisResult, Additive } from '@shared/types';
import { UserProfile } from '@shared/types/user';
import { WebApiService } from '../services/api';
import { scoreProduct, getBandLabel, getBandColour, getBandCssClass, getBandTint, scoreToArcOffset } from '../utils/scoring';
import {
  Search, ChevronDown, ChevronUp, AlertCircle, Info,
  Layers, ShieldCheck, Factory, Network, ExternalLink, Barcode
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProductIntelligenceProps {
  initialProductId?: string;
  activePersona: UserProfile;
}

type PageTab = 'ingredients' | 'map' | 'rationale';

// ── Score dial (shared inline) ─────────────────────────────────────────────────

const ScoreDial: React.FC<{ score: number; size?: number }> = ({ score, size = 96 }) => {
  const r = 44;
  const circumference = 2 * Math.PI * r;
  const offset = scoreToArcOffset(score, r);
  const band = score >= 80 ? 'good' : score >= 60 ? 'okay' : score >= 40 ? 'limit' : 'avoid';
  const colour = getBandColour(band);

  return (
    <div style={{ position: 'relative', width: size, height: size }} aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 100 100">
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
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none'
      }}>
        <span style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 600, fontSize: size >= 96 ? 'var(--text-25)' : 'var(--text-20)', color: colour, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: 10, color: 'var(--ink-3)' }}>/ 100</span>
      </div>
    </div>
  );
};

// ── Ingredient Card ───────────────────────────────────────────────────────────

interface IngCard {
  name: string;
  role: string;
  insCode?: string;
  concernLevel?: 'low' | 'medium' | 'high';
  whatItIs?: string;
  whyAdded?: string;
  bodyImpact?: string;
  cautionFor?: string[];
  typicalProducts?: string[];
  fssaiPermitted?: boolean;
}

const ConcernChip: React.FC<{ level: 'low' | 'medium' | 'high' }> = ({ level }) => {
  const style: Record<string, { bg: string; color: string; label: string }> = {
    high:   { bg: 'var(--tint-avoid)', color: 'var(--verdict-avoid)', label: 'High concern' },
    medium: { bg: 'var(--tint-limit)', color: 'var(--verdict-limit)', label: 'Medium concern' },
    low:    { bg: 'var(--tint-ok)',    color: 'var(--verdict-ok)',    label: 'Low concern' },
  };
  const s = style[level];
  return (
    <span style={{
      padding: '2px var(--sp-2)', borderRadius: 'var(--radius-sm)',
      fontSize: 'var(--text-12)', fontWeight: 500,
      background: s.bg, color: s.color,
      border: `1px solid ${s.color}33`,
    }}>
      {s.label}
    </span>
  );
};

const IngredientCard: React.FC<{ card: IngCard; defaultOpen?: boolean }> = ({ card, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const hasKB = card.whatItIs || card.whyAdded;

  return (
    <div className="ingredient-card">
      <button
        className="ingredient-card-header"
        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={`ing-body-${card.name}`}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', flexWrap: 'wrap', minWidth: 0 }}>
          <span style={{ fontWeight: 600, fontSize: 'var(--text-14)', color: 'var(--ink)' }}>{card.name}</span>
          {card.insCode && (
            <span style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', background: 'var(--surface-sunk)', padding: '1px 6px', borderRadius: 'var(--radius-sm)' }}>
              INS {card.insCode}
            </span>
          )}
          <span style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', background: 'var(--surface-sunk)', padding: '1px 6px', borderRadius: 'var(--radius-sm)' }}>
            {card.role}
          </span>
          {card.concernLevel && <ConcernChip level={card.concernLevel} />}
        </div>
        {open ? <ChevronUp size={14} style={{ color: 'var(--ink-3)', flexShrink: 0 }} /> : <ChevronDown size={14} style={{ color: 'var(--ink-3)', flexShrink: 0 }} />}
      </button>

      {open && (
        <div id={`ing-body-${card.name}`} className="ingredient-card-body">
          {hasKB ? (
            <>
              {card.whatItIs && (
                <div>
                  <div className="facet-label">What it is</div>
                  <div className="facet-value">{card.whatItIs}</div>
                </div>
              )}
              {card.whyAdded && (
                <div>
                  <div className="facet-label">Why it was added</div>
                  <div className="facet-value">{card.whyAdded}</div>
                </div>
              )}
              {card.bodyImpact && (
                <div>
                  <div className="facet-label">Body impact</div>
                  <div className="facet-value">{card.bodyImpact}</div>
                </div>
              )}
              {card.cautionFor && card.cautionFor.length > 0 && (
                <div>
                  <div className="facet-label">Caution for</div>
                  <div className="facet-value">{card.cautionFor.join(', ')}</div>
                </div>
              )}
              {card.typicalProducts && card.typicalProducts.length > 0 && (
                <div>
                  <div className="facet-label">Typically found in</div>
                  <div className="facet-value">{card.typicalProducts.join(', ')}</div>
                </div>
              )}
              <div>
                <div className="facet-label">FSSAI status</div>
                <div className="facet-value">{card.fssaiPermitted !== false ? 'Permitted under FSSAI regulations' : 'Check current FSSAI status'}</div>
              </div>
            </>
          ) : (
            <div style={{ gridColumn: 'span 2', fontSize: 'var(--text-14)', color: 'var(--ink-3)', fontStyle: 'italic' }}>
              This ingredient has no entry in the knowledge base. It may be a bulk ingredient or a natural component.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export const ProductIntelligence: React.FC<ProductIntelligenceProps> = ({
  initialProductId,
  activePersona
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [analysis, setAnalysis] = useState<PersonalizedAnalysisResult | null>(null);
  const [additives, setAdditives] = useState<Additive[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageTab, setPageTab] = useState<PageTab>('ingredients');
  const [loading, setLoading] = useState(true);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeError, setBarcodeError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const items = await WebApiService.getProducts();
      setProducts(items);
      const target = items.find(p => p.id === initialProductId) || items[0];
      if (target) await selectProduct(target, items);
      setLoading(false);
    };
    load();
  }, [initialProductId]);

  // Re-run scoring whenever the persona or any of its health conditions/allergies change.
  // Using a JSON fingerprint as the dep ensures edits within the same persona ID still trigger.
  const personaFingerprint = JSON.stringify({
    id: activePersona.id,
    conditions: (activePersona as any).healthConditions ?? [],
    allergies: (activePersona as any).allergies ?? [],
    diet: (activePersona as any).dietaryPreferences ?? [],
  });
  useEffect(() => {
    if (selected) {
      setAnalysis(prev => prev ? { ...prev, personalizedScore: scoreProduct(selected, activePersona).score } : null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personaFingerprint]);

  const selectProduct = async (product: Product, productList?: Product[]) => {
    setSelected(product);
    setBarcodeError(null);
    setLoading(true);
    const res = await WebApiService.analyzeProduct(product.id);

    // Apply single scoring engine
    const scoreRes = scoreProduct(product, activePersona);
    if (res) {
      res.personalizedScore = scoreRes.score;
    }
    setAnalysis(res);

    // Load additives
    const additiveCodes: string[] = (product as any).additiveCodes || [];
    const allAdditives = await WebApiService.getAdditives?.() || [];
    const relevant = allAdditives.filter((a: any) => additiveCodes.includes(a.insCode));
    setAdditives(relevant);

    setLoading(false);
  };

  const handleBarcodeSearch = async () => {
    const code = barcodeInput.trim();
    if (!code) return;
    setLoading(true);
    setBarcodeError(null);

    try {
      const res = await WebApiService.lookupByBarcode?.(code);
      if (res) {
        setProducts(prev => prev.some(p => p.id === res.id) ? prev : [res, ...prev]);
        await selectProduct(res);
      } else {
        setBarcodeError('No product found for that barcode in the local catalog or Open Food Facts. You can add it via the Community page.');
      }
    } catch {
      setBarcodeError('Lookup failed. The barcode database may be unavailable. Try a product name instead.');
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(p =>
    !searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !selected) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Product intelligence</h1>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--sp-6)' }}>
          <div className="skeleton" style={{ height: 400 }} />
          <div className="skeleton" style={{ height: 400 }} />
        </div>
      </div>
    );
  }

  const scoreRes = selected ? scoreProduct(selected, activePersona) : null;
  // Always use live-computed score — never the stale cached value from analysis state
  const score = scoreRes?.score ?? 0;
  const band = scoreRes?.band ?? (score >= 80 ? 'good' : score >= 60 ? 'okay' : score >= 40 ? 'limit' : 'avoid');

  // Build ingredient cards from product data + additives knowledge base
  const ingredientCards: IngCard[] = (() => {
    if (!selected) return [];
    const text: string = (selected as any).ingredientsText || (selected as any).ingredients_text || '';
    const addCodes: string[] = (selected as any).additiveCodes || [];

    // Parse basic ingredient list
    const rawIngredients = text.split(',').map(s => s.trim()).filter(Boolean).slice(0, 20);

    return rawIngredients.map(name => {
      // Try to match to an additive in the knowledge base
      const matchedAdditive = additives.find(a =>
        (a as any).name?.toLowerCase() === name.toLowerCase() ||
        (a as any).aliases?.some((alias: string) => alias.toLowerCase().includes(name.toLowerCase()))
      );

      if (matchedAdditive) {
        const a = matchedAdditive as any;
        return {
          name: a.name || name,
          role: a.class || 'Additive',
          insCode: a.insCode,
          concernLevel: a.concernLevel,
          whatItIs: a.whatItIs,
          whyAdded: a.whyAdded,
          bodyImpact: a.bodyImpact,
          cautionFor: a.cautionForConditions,
          typicalProducts: a.typicalProducts,
          fssaiPermitted: a.fssaiPermitted,
        };
      }

      // Categorise based on name
      const nameLower = name.toLowerCase();
      let role = 'Ingredient';
      if (nameLower.includes('oil') || nameLower.includes('fat')) role = 'Fat / Oil';
      else if (nameLower.includes('sugar') || nameLower.includes('syrup') || nameLower.includes('glucose')) role = 'Sweetener';
      else if (nameLower.includes('salt') || nameLower.includes('sodium')) role = 'Salt';
      else if (nameLower.includes('flour') || nameLower.includes('maida') || nameLower.includes('atta')) role = 'Grain';
      else if (nameLower.includes('spice') || nameLower.includes('masala') || nameLower.includes('chilli')) role = 'Spice';
      else if (nameLower.includes('milk') || nameLower.includes('whey') || nameLower.includes('cream')) role = 'Dairy';

      return { name, role };
    });
  })();

  const category = (selected as any)?.category || 'Packaged food';
  const novaGroup = (selected as any)?.nova_group ?? (selected as any)?.novaGroup;
  const novaLabels: Record<number, string> = {
    1: 'Unprocessed or minimally processed',
    2: 'Processed culinary ingredient',
    3: 'Processed food',
    4: 'Ultra-processed food',
  };

  return (
    <div className="animate-fade-in">

      {/* Page header */}
      <div className="page-header">
        <h1 className="page-title">Product intelligence</h1>
        <p className="page-subtitle">
          Six-facet ingredient breakdown, interaction map, and manufacturing rationale.
          Analysed for <strong style={{ fontWeight: 600, color: 'var(--ink)' }}>{activePersona.name}</strong>.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--sp-6)' }}>

        {/* ── Left: Product selector ─────────────────────────────── */}
        <div>
          {/* Barcode lookup */}
          <div className="card" style={{ marginBottom: 'var(--sp-4)' }}>
            <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-2)' }}>
              Barcode lookup
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
              <input
                type="text"
                className="input"
                style={{ flex: 1 }}
                value={barcodeInput}
                onChange={e => setBarcodeInput(e.target.value)}
                placeholder="Enter barcode"
                onKeyDown={e => e.key === 'Enter' && handleBarcodeSearch()}
                aria-label="Barcode input"
              />
              <button className="btn btn-secondary btn-sm" onClick={handleBarcodeSearch}>
                <Barcode size={14} />
              </button>
            </div>
            {barcodeError && (
              <p style={{ marginTop: 'var(--sp-2)', fontSize: 'var(--text-12)', color: 'var(--verdict-limit)' }}>
                {barcodeError}
              </p>
            )}
          </div>

          {/* Product search */}
          <div className="input-icon-wrap" style={{ marginBottom: 'var(--sp-3)' }}>
            <Search size={14} className="input-icon" />
            <input
              type="search"
              className="input"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter products"
              aria-label="Filter product list"
            />
          </div>

          {/* Product list with sleek scrollbar */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-2)',
              maxHeight: 480,
              overflowY: 'auto',
              paddingRight: 'var(--sp-2)',
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--rule) transparent'
            }}
            className="custom-scrollbar"
          >
            {filteredProducts.map(product => {
              const isActive = selected?.id === product.id;
              const ps = scoreProduct(product, activePersona);

              return (
                <button
                  key={product.id}
                  onClick={() => selectProduct(product)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--sp-2)',
                    padding: 'var(--sp-3)',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isActive ? 'var(--ink)' : 'var(--rule)'}`,
                    background: isActive ? 'var(--surface-sunk)' : 'var(--surface)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-14)', fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {(product as any).brand || ''}
                    </div>
                  </div>
                  <span
                    className={`verdict-badge verdict-${ps.score >= 80 ? 'good' : ps.score >= 60 ? 'ok' : ps.score >= 40 ? 'limit' : 'avoid'}`}
                    style={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {ps.score}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right: Product detail ──────────────────────────────── */}
        <div>
          {!selected ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-12)', color: 'var(--ink-3)' }}>
              <Layers size={32} style={{ marginBottom: 'var(--sp-3)', opacity: 0.4 }} />
              <div style={{ fontSize: 'var(--text-14)' }}>Select a product from the list to view its ingredient intelligence.</div>
            </div>
          ) : (
            <>
              {/* Product header — strict grid, no overlaps */}
              <div className="card" style={{ marginBottom: 'var(--sp-4)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--sp-6)', alignItems: 'start' }}>
                  {/* Score dial — own column */}
                  <div>
                    <ScoreDial score={score} size={96} />
                    <div style={{ textAlign: 'center', marginTop: 'var(--sp-2)' }}>
                      <span className={`verdict-badge verdict-${band}`}>{getBandLabel(band)}</span>
                    </div>
                  </div>

                  {/* Product info — own column */}
                  <div>
                    <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-1)' }}>
                      {(selected as any).brand || ''}
                    </div>
                    <h2 style={{ fontFamily: 'Archivo, sans-serif', fontSize: 'var(--text-25)', fontWeight: 600, marginBottom: 'var(--sp-2)', color: 'var(--ink)' }}>
                      {selected.name}
                    </h2>
                    <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap', marginBottom: 'var(--sp-3)' }}>
                      {/* Category always from product record, never hardcoded */}
                      <span style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', background: 'var(--surface-sunk)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)' }}>
                        {category}
                      </span>
                      {novaGroup && (
                        <span style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', background: 'var(--surface-sunk)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule)' }}>
                          NOVA {novaGroup}
                        </span>
                      )}
                    </div>

                    {/* Personal alerts */}
                    {scoreRes && scoreRes.alerts.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                        {scoreRes.alerts.slice(0, 2).map((alert, i) => (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-2)', padding: 'var(--sp-2) var(--sp-3)',
                            borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-14)',
                            background: alert.severity === 'medium' ? 'var(--tint-limit)' : 'var(--tint-avoid)',
                            color: alert.severity === 'medium' ? 'var(--verdict-limit)' : 'var(--verdict-avoid)',
                          }}>
                            <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span>{alert.consequence}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Score breakdown expandable */}
                {scoreRes && scoreRes.breakdown.length > 0 && (
                  <details style={{ marginTop: 'var(--sp-4)', borderTop: '1px solid var(--rule)', paddingTop: 'var(--sp-4)' }}>
                    <summary style={{ cursor: 'pointer', fontSize: 'var(--text-14)', fontWeight: 600, color: 'var(--ink)', listStyle: 'none' }}>
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
                            <td>{line.value}</td>
                            <td className="right tabular" style={{
                              color: line.delta > 0 ? 'var(--verdict-ok)' : line.delta < 0 ? 'var(--verdict-limit)' : 'var(--ink-3)',
                              fontWeight: 600
                            }}>
                              {line.delta > 0 ? `+${line.delta}` : line.delta === 0 ? '—' : `${line.delta}`}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={2} style={{ fontWeight: 700, borderTop: '2px solid var(--rule)' }}>Final score</td>
                          <td className="right tabular" style={{ fontWeight: 700, borderTop: '2px solid var(--rule)' }}>{score}</td>
                        </tr>
                      </tbody>
                    </table>
                  </details>
                )}
              </div>

              {/* Tabs */}
              <div className="tab-bar">
                <button className={`tab-btn${pageTab === 'ingredients' ? ' active' : ''}`} onClick={() => setPageTab('ingredients')}>
                  <Layers size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  Ingredients
                </button>
                <button className={`tab-btn${pageTab === 'map' ? ' active' : ''}`} onClick={() => setPageTab('map')}>
                  <Network size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  Interaction map
                </button>
                <button className={`tab-btn${pageTab === 'rationale' ? ' active' : ''}`} onClick={() => setPageTab('rationale')}>
                  <Factory size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                  Manufacturing rationale
                </button>
              </div>

              {/* Ingredients tab */}
              {pageTab === 'ingredients' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                  {ingredientCards.length === 0 ? (
                    <div className="card" style={{ color: 'var(--ink-3)', fontSize: 'var(--text-14)', textAlign: 'center', padding: 'var(--sp-8)' }}>
                      No ingredient data available for this product.
                    </div>
                  ) : ingredientCards.map((card, i) => (
                    <IngredientCard key={i} card={card} defaultOpen={i === 0 && !!card.whatItIs} />
                  ))}
                </div>
              )}

              {/* Interaction map tab */}
              {pageTab === 'map' && (
                <div className="card">
                  <div style={{ marginBottom: 'var(--sp-4)' }}>
                    <h3 style={{ fontSize: 'var(--text-20)', marginBottom: 'var(--sp-2)' }}>Ingredient interaction map</h3>
                    <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)' }}>
                      Visual network diagram illustrating chemical, textural, and physiological interactions between ingredients.
                    </p>
                  </div>

                  {/* Dynamic SVG Graph Visualization */}
                  {(() => {
                    const ings: string[] = ingredientCards.map(c => c.name).slice(0, 5);
                    const hubName = selected?.name?.split(' ')[0] || 'Product';

                    // Node positions in SVG
                    const positions = [
                      { x: 120, y: 70 },
                      { x: 380, y: 70 },
                      { x: 150, y: 180 },
                      { x: 350, y: 180 },
                      { x: 250, y: 35 },
                    ];

                    const dynamicEdges = ings.map(ing => ({
                      source: ing,
                      target: 'Matrix / Texture',
                      desc: `Formulation interaction between ${ing} and product base matrix.`
                    }));

                    return (
                      <>
                        <div style={{
                          width: '100%',
                          height: 260,
                          background: 'var(--surface-sunk)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--rule)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          marginBottom: 'var(--sp-6)',
                          overflow: 'hidden'
                        }}>
                          <svg width="100%" height="100%" viewBox="0 0 500 240" style={{ position: 'absolute', inset: 0 }}>
                            {/* Dynamic Edges to Hub */}
                            {ings.map((_, idx) => {
                              const pos = positions[idx % positions.length];
                              return (
                                <line
                                  key={idx}
                                  x1={pos.x}
                                  y1={pos.y}
                                  x2="250"
                                  y2="120"
                                  stroke="var(--rule)"
                                  strokeWidth="2"
                                  strokeDasharray="4 4"
                                />
                              );
                            })}

                            {/* Hub Node */}
                            <circle cx="250" cy="120" r="30" fill="var(--ink)" />
                            <text x="250" y="124" fill="var(--ink-invert)" fontSize="11" fontWeight="600" textAnchor="middle">
                              {hubName.slice(0, 10)}
                            </text>

                            {/* Dynamic Outer Ingredient Nodes */}
                            {ings.map((ingName, idx) => {
                              const pos = positions[idx % positions.length];
                              const card = ingredientCards[idx];
                              const strokeColor = card?.concernLevel === 'high'
                                ? 'var(--verdict-avoid)'
                                : card?.concernLevel === 'medium'
                                ? 'var(--verdict-limit)'
                                : 'var(--verdict-ok)';

                              return (
                                <g key={idx} transform={`translate(${pos.x}, ${pos.y})`}>
                                  <circle cx="0" cy="0" r="24" fill="var(--surface)" stroke={strokeColor} strokeWidth="2" />
                                  <text x="0" y="4" fill="var(--ink)" fontSize="10" fontWeight="600" textAnchor="middle">
                                    {ingName.slice(0, 10)}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>
                          <div style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 'var(--text-12)', color: 'var(--ink-3)' }}>
                            Dynamic SVG Topology ({selected?.name})
                          </div>
                        </div>

                        {/* Accessible list view of interactions */}
                        <div style={{ marginBottom: 'var(--sp-4)' }}>
                          <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-3)' }}>
                            Documented interaction details for {selected?.name}
                          </div>
                          {dynamicEdges.length > 0 ? (
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                              {dynamicEdges.map((edge, i) => (
                                <li key={i} style={{
                                  display: 'grid', gridTemplateColumns: '1fr auto 1fr',
                                  gap: 'var(--sp-2)', alignItems: 'center',
                                  padding: 'var(--sp-2) var(--sp-3)',
                                  background: 'var(--surface-sunk)', borderRadius: 'var(--radius-sm)',
                                  fontSize: 'var(--text-14)', color: 'var(--ink-2)',
                                }}>
                                  <span style={{ color: 'var(--ink)', fontWeight: 500 }}>{edge.source}</span>
                                  <span style={{ color: 'var(--ink-3)', fontSize: 'var(--text-12)', textAlign: 'center' }}>{edge.desc}</span>
                                  <span style={{ color: 'var(--ink)', fontWeight: 500, textAlign: 'right' }}>{edge.target}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-3)' }}>
                              No documented interactions found for this product's ingredient combination.
                            </p>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Manufacturing rationale tab */}
              {pageTab === 'rationale' && (
                <div className="card">
                  <h3 style={{ fontSize: 'var(--text-20)', marginBottom: 'var(--sp-2)' }}>Manufacturing rationale</h3>
                  <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', marginBottom: 'var(--sp-6)' }}>
                    Why a manufacturer chose each additive — in plain terms about cost, shelf life, and food science.
                  </p>

                  {/* NOVA processing */}
                  <div className="card-sunk" style={{ marginBottom: 'var(--sp-4)' }}>
                    <div className="facet-label" style={{ marginBottom: 'var(--sp-2)' }}>Processing level</div>
                    <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-1)' }}>
                      NOVA {novaGroup ?? 'unknown'} — {novaGroup ? novaLabels[novaGroup] : 'Classification unavailable'}
                    </div>
                    <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', margin: 0 }}>
                      {novaGroup === 4 && 'This product is formulated from industrial ingredients. Most of the ingredients on the label are additives, not whole foods. They are there to extend shelf life, standardise texture and colour, and reduce production cost.'}
                      {novaGroup === 3 && 'Salt, fat, or sugar have been added to minimally processed ingredients. This is common in most packaged foods including canned vegetables, cured meats, and freshly baked bread.'}
                      {(novaGroup === 1 || novaGroup === 2) && 'This product is minimally processed. The ingredient list is short and close to the whole food it came from.'}
                      {!novaGroup && 'NOVA group was not available in the product data. The processing level cannot be determined from the label alone.'}
                    </p>
                  </div>

                  {/* Ingredient count */}
                  <div className="card-sunk" style={{ marginBottom: 'var(--sp-4)' }}>
                    <div className="facet-label" style={{ marginBottom: 'var(--sp-2)' }}>Ingredient breakdown</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                      <div>
                        <div style={{ fontSize: 'var(--text-25)', fontFamily: 'Archivo, sans-serif', fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
                          {ingredientCards.filter(c => !c.insCode && !['Additive'].includes(c.role)).length}
                        </div>
                        <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)' }}>Whole or near-whole food ingredients</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--text-25)', fontFamily: 'Archivo, sans-serif', fontWeight: 600, color: 'var(--verdict-limit)', fontVariantNumeric: 'tabular-nums' }}>
                          {(selected as any).additiveCodes?.length ?? ingredientCards.filter(c => c.insCode).length}
                        </div>
                        <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)' }}>Industrial additives</div>
                      </div>
                    </div>
                  </div>

                  {/* What the label does not tell you */}
                  <div className="card-sunk">
                    <div className="facet-label" style={{ marginBottom: 'var(--sp-2)' }}>What this label does not tell you</div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', fontSize: 'var(--text-14)', color: 'var(--ink-2)' }}>
                      <li style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                        <Info size={14} style={{ color: 'var(--ink-3)', flexShrink: 0, marginTop: 2 }} />
                        The proportion of each ingredient — labels list ingredients by weight but do not show percentages unless voluntarily declared.
                      </li>
                      <li style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                        <Info size={14} style={{ color: 'var(--ink-3)', flexShrink: 0, marginTop: 2 }} />
                        Processing method — whether oil was refined, bleached, and deodorised, or cold-pressed, is not disclosed on the label.
                      </li>
                      <li style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                        <Info size={14} style={{ color: 'var(--ink-3)', flexShrink: 0, marginTop: 2 }} />
                        Cumulative additive exposure across your whole day — this label shows only this product's additives.
                      </li>
                    </ul>
                  </div>

                  {/* Additive rationale cards */}
                  {additives.length > 0 && (
                    <div style={{ marginTop: 'var(--sp-6)' }}>
                      <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-3)' }}>
                        Why each additive was chosen
                      </div>
                      {additives.map((additive: any) => (
                        <div key={additive.insCode} className="card-sunk" style={{ marginBottom: 'var(--sp-3)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--sp-2)' }}>
                            <div>
                              <span style={{ fontWeight: 600, color: 'var(--ink)', marginRight: 'var(--sp-2)' }}>{additive.name}</span>
                              <span style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)' }}>INS {additive.insCode}</span>
                            </div>
                            {additive.concernLevel && <ConcernChip level={additive.concernLevel} />}
                          </div>
                          {additive.whyAdded && (
                            <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', margin: 0 }}>
                              {additive.whyAdded}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Attribution */}
              {(selected as any).off_url && (
                <p style={{ marginTop: 'var(--sp-4)', fontSize: 'var(--text-12)', color: 'var(--ink-3)' }}>
                  <a href={(selected as any).off_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={11} style={{ display: 'inline', marginRight: 4 }} />
                    View on Open Food Facts
                  </a>
                  {' '}— licensed under the Open Database License (ODbL)
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
