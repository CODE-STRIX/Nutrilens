import React, { useState, useEffect } from 'react';
import { 
  Product, 
  PersonalizedAnalysisResult, 
  Ingredient,
  Additive 
} from '@shared/types';
import { WebApiService } from '../services/api';
import { 
  Sparkles, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Network, 
  ShieldAlert, 
  Info, 
  Layers, 
  HeartPulse, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface ProductIntelligenceProps {
  initialProductId?: string;
}

export const ProductIntelligence: React.FC<ProductIntelligenceProps> = ({ initialProductId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [analysis, setAnalysis] = useState<PersonalizedAnalysisResult | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(null);
  const [selectedMapNode, setSelectedMapNode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'CARDS' | 'MAP' | 'TRANSPARENCY'>('CARDS');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCatalog = async () => {
      setLoading(true);
      const items = await WebApiService.getProducts();
      setProducts(items);

      const targetId = initialProductId || items[0]?.id;
      const targetProduct = items.find(p => p.id === targetId) || items[0];
      
      if (targetProduct) {
        setSelectedProduct(targetProduct);
        const res = await WebApiService.analyzeProduct(targetProduct.id);
        setAnalysis(res);
      }
      setLoading(false);
    };

    loadCatalog();
  }, [initialProductId]);

  const handleSelectProduct = async (product: Product) => {
    setSelectedProduct(product);
    setLoading(true);
    const res = await WebApiService.analyzeProduct(product.id);
    setAnalysis(res);
    setLoading(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header & Product Search Bar */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Features 2 & 3 — Ingredient Intelligence & Interaction Map
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Product & Ingredient <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Intelligence</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Look up any Indian packaged food or regional snack to decode its ingredient list in plain words.
            </p>
          </div>

          {/* Product Picker Dropdown */}
          <div className="relative min-w-[280px]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search products (e.g. Maggi, Lay's, Muesli)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>

            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto divide-y divide-slate-800">
                {filteredProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      handleSelectProduct(p);
                      setSearchQuery('');
                    }}
                    className="p-3 hover:bg-slate-800/80 cursor-pointer transition-colors"
                  >
                    <div className="text-xs font-bold text-white">{p.name}</div>
                    <div className="text-[10px] text-slate-400">{p.brand} • {p.category}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Selector Quick Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-medium text-slate-400 mr-2">Sample Catalog:</span>
          {products.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelectProduct(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedProduct?.id === p.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {selectedProduct && analysis && (
        <div className="space-y-6">
          
          {/* Selected Product Overview Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl shrink-0">
                {selectedProduct.category === 'Instant Noodles' ? '🍜' : selectedProduct.category === 'Potato Chips' ? '🥔' : '🥣'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {selectedProduct.brand}
                  </span>
                  {selectedProduct.isRegionalUnbranded && (
                    <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      Regional Snack
                    </span>
                  )}
                </div>
                <h2 className="font-heading text-2xl font-extrabold text-white mt-1">{selectedProduct.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Barcode: {selectedProduct.barcode} • Serving: {selectedProduct.nutrition?.servingSize}</p>
              </div>
            </div>

            {/* Personalized Safety Rating Gauge */}
            <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800 w-full lg:w-auto justify-between lg:justify-start">
              <div className="text-left">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Personalized Rating</div>
                <div className="text-xs text-slate-300 font-medium">for Rahul Sharma</div>
              </div>
              <div className={`px-4 py-2 rounded-xl text-xl font-black ${
                analysis.personalizedScore >= 75
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : analysis.personalizedScore >= 45
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {analysis.personalizedScore} / 100
              </div>
            </div>
          </div>

          {/* Condition Risk Flags Banner */}
          {analysis.conditionFlags.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Personalized Health Risk Alerts
              </div>
              {analysis.conditionFlags.map((flag, idx) => (
                <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <strong className="text-amber-300">{flag.condition}:</strong> {flag.reasoning}
                </div>
              ))}
            </div>
          )}

          {/* Feature Selector Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('CARDS')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'CARDS'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              6-Facet Ingredient Intelligence Cards ({selectedProduct.ingredients.length})
            </button>

            <button
              onClick={() => setActiveTab('MAP')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'MAP'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-4 h-4" />
              Ingredient Interaction Map (Visual Graph)
            </button>

            <button
              onClick={() => setActiveTab('TRANSPARENCY')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'TRANSPARENCY'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              <Info className="w-4 h-4" />
              Manufacturing Rationale (Why Added)
            </button>
          </div>

          {/* TAB 1: 6-Facet Ingredient Cards (Feature 2 Flagship) */}
          {activeTab === 'CARDS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Click on any ingredient card below to expand the full 6-facet plain language breakdown.
              </p>

              <div className="space-y-3">
                {selectedProduct.ingredients.map((ing, idx) => {
                  const isExpanded = expandedIngredient === ing.name;
                  const details: Additive | undefined = ing.additiveDetails;

                  return (
                    <div 
                      key={idx}
                      className={`glass-panel rounded-2xl border transition-all overflow-hidden ${
                        ing.isAdditive 
                          ? 'border-amber-500/30 bg-amber-950/5' 
                          : 'border-slate-800'
                      }`}
                    >
                      {/* Card Header */}
                      <div 
                        onClick={() => setExpandedIngredient(isExpanded ? null : ing.name)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            ing.isAdditive 
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {ing.isAdditive ? 'ADD' : 'RAW'}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-heading font-bold text-sm text-white">{ing.name}</h4>
                              {ing.insCode && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                                  {ing.insCode}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">{ing.purpose || 'Base component'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {ing.isAdditive && details?.hazardRating && (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              details.hazardRating === 'Safe'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {details.hazardRating}
                            </span>
                          )}

                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>

                      {/* 6-Facet Intelligence Expandable Content */}
                      {isExpanded && (
                        <div className="p-5 border-t border-slate-800/80 bg-slate-900/60 space-y-4 animate-fadeIn">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Facet 1: What It Is */}
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">1. What It Is</div>
                              <p className="text-xs text-slate-300">{details?.description || `${ing.name} is a primary component of this food.`}</p>
                            </div>

                            {/* Facet 2: Why It Was Added */}
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1">2. Why Manufacturer Added It</div>
                              <p className="text-xs text-slate-300">{details?.manufacturingRationale || ing.purpose || 'Used for texture or shelf stability.'}</p>
                            </div>

                            {/* Facet 3: What It Does in Body */}
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">3. Biological Body Effect</div>
                              <p className="text-xs text-slate-300">{details?.biologicalImpact || 'Digested as standard dietary component.'}</p>
                            </div>

                            {/* Facet 4: Safe Frequency Guidance */}
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                              <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-1">4. Consumption Frequency</div>
                              <p className="text-xs text-slate-300">{details?.safeFrequency || 'Safe in standard dietary proportions.'}</p>
                            </div>

                            {/* Facet 5: Healthier Alternatives */}
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">5. Healthier Alternatives</div>
                              <p className="text-xs text-slate-300">{details?.healthierAlternatives?.join(', ') || 'Cold-pressed natural oils or whole food extracts.'}</p>
                            </div>

                            {/* Facet 6: Where Else Found */}
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">6. Where Else Found</div>
                              <p className="text-xs text-slate-300">{details?.commonFoods?.join(', ') || 'Common packaged savory snacks.'}</p>
                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Ingredient Interaction Map (Feature 3 Visual Graph) */}
          {activeTab === 'MAP' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                    <Network className="w-5 h-5 text-cyan-400" />
                    Tappable Ingredient Interaction Topology Graph
                  </h3>
                  <p className="text-xs text-slate-400">Click any graph node to inspect connected relationships across ingredients, purpose, and body impact.</p>
                </div>
              </div>

              {/* Canvas Topological Graph Display */}
              <div className="w-full bg-slate-950 rounded-xl border border-slate-800 p-6 relative overflow-hidden flex flex-col items-center">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-4xl relative z-10">
                  
                  {/* Column 1: Ingredients */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider text-center pb-2 border-b border-slate-800">1. Ingredients</div>
                    {selectedProduct.ingredients.map((ing, i) => (
                      <div 
                        key={i}
                        onClick={() => setSelectedMapNode(ing.name)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all ${
                          selectedMapNode === ing.name 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105' 
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-emerald-500/50'
                        }`}
                      >
                        {ing.name}
                      </div>
                    ))}
                  </div>

                  {/* Column 2: Purpose */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider text-center pb-2 border-b border-slate-800">2. Purpose</div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-center text-cyan-300">
                      Shelf Life & Mold Control
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-center text-cyan-300">
                      Umami Flavor Enhancement
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-center text-cyan-300">
                      Texture & Rapid Rehydration
                    </div>
                  </div>

                  {/* Column 3: Body Impact */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider text-center pb-2 border-b border-slate-800">3. Body Impact</div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-center text-amber-300">
                      Hypertension Risk (+Sodium)
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-center text-amber-300">
                      Serum LDL Cholesterol
                    </div>
                  </div>

                  {/* Column 4: Shared Foods */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider text-center pb-2 border-b border-slate-800">4. Shared Foods</div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-center text-purple-300">
                      Carbonated Sodas & Pickles
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-center text-purple-300">
                      Potato Chips & Instant Soups
                    </div>
                  </div>

                </div>

                {selectedMapNode && (
                  <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-200 max-w-xl text-center">
                    <strong className="text-emerald-400">Selected Node ({selectedMapNode}):</strong> Connected to manufacturing purpose, body sodium response, and shared food additives.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Manufacturing Transparency (Feature 4) */}
          {activeTab === 'TRANSPARENCY' && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-400" />
                Food Manufacturing Industrial Rationale
              </h3>
              <p className="text-xs text-slate-400">Explains *why* the manufacturer selected each ingredient (cost, shelf life, mouthfeel) instead of leaving consumers guessing.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400">💰 Cost Efficiency Rationale</div>
                  <p className="text-xs text-slate-300">{selectedProduct.manufacturingTransparency?.costEfficiency || 'Refined oil and flour minimize raw material expenditure per pack.'}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-cyan-400">⏳ Shelf Life Impact</div>
                  <p className="text-xs text-slate-300">{selectedProduct.manufacturingTransparency?.shelfLifeImpact || 'Dehydration combined with preservatives extends room temperature shelf life to 9 months.'}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-amber-400">😋 Texture & Mouthfeel</div>
                  <p className="text-xs text-slate-300">{selectedProduct.manufacturingTransparency?.textureAndMouthfeel || 'Flash-frying produces porous structure that rehydrates quickly in boiling water.'}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
