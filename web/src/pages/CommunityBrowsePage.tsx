import React, { useState, useEffect } from 'react';
import { CommunitySubmission } from '@shared/types/community';
import { api } from '../services/api';
import { Users, CheckCircle2, AlertTriangle, MapPin, Eye, ThumbsUp, Filter, PlusCircle, X, Check, Image as ImageIcon } from 'lucide-react';
import { ManufacturingTransparencyModal } from '../components/ManufacturingTransparencyModal';
import { Product } from '@shared/types/product';

export const CommunityBrowsePage: React.FC = () => {
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending_verification'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  
  // Submit modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [newProdName, setNewProdName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('Regional Snacks');
  const [newRegion, setNewRegion] = useState('South India');
  const [newIngredients, setNewIngredients] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    const data = await api.getCommunitySubmissions();
    setSubmissions(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVerify = async (submissionId: string) => {
    try {
      // Simulate verification vote
      const updated = submissions.map(s => {
        if (s.id === submissionId) {
          const newCount = s.verificationCount + 1;
          return {
            ...s,
            verificationCount: newCount,
            verificationStatus: (newCount >= s.requiredVerifications ? 'verified' : 'pending_verification') as any
          };
        }
        return s;
      });
      setSubmissions(updated);
      showToast('Consensus vote recorded! Thank you for verifying this regional product label.');
    } catch (e: any) {
      showToast(e.message || 'Verification error');
    }
  };

  const handleAddSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newIngredients) return;

    const extracted = newIngredients.split(',').map(i => i.trim()).filter(Boolean);
    const newEntry = await api.addCommunitySubmission({
      productName: newProdName,
      brand: newBrand || 'Artisanal / Unbranded',
      category: newCategory,
      region: newRegion,
      ingredientText: newIngredients,
      extractedIngredients: extracted,
      labelImageUrl: newImageUrl || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500'
    });

    setSubmissions([newEntry, ...submissions]);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowSubmitModal(false);
      setNewProdName('');
      setNewBrand('');
      setNewIngredients('');
      showToast('New regional snack submitted for community consensus verification!');
    }, 1200);
  };

  const buildFakeProduct = (item: CommunitySubmission): Product => ({
    id: item.id,
    name: item.productName,
    brand: item.brand,
    category: item.category,
    ingredientText: item.ingredientText,
    ingredients: item.extractedIngredients.map((ing, i) => ({
      id: `${i}`,
      name: ing,
      isAdditive: false
    })),
    additives: [],
    manufacturingRationale: [
      {
        ingredientId: '1',
        ingredientName: item.extractedIngredients[1] || 'Cooking Oil',
        primaryReason: 'cost',
        explanation: 'Regional oil selected for authentic flavour and cost efficiency in small-batch artisanal production.'
      }
    ],
    createdAt: item.createdAt
  });

  const filtered = filterStatus === 'all'
    ? submissions
    : submissions.filter(s => s.verificationStatus === filterStatus);

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast-item">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-amber-500/30 bg-amber-950/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-gradient-to-br from-amber-500/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="badge badge-amber"><Users className="w-3.5 h-3.5" /> Community Intelligence</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-white">
              Community-Verified <span className="text-amber-400 font-black">Regional Products</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Global databases miss thousands of regional and unbranded Indian snacks. Community members submit label photos and multi-user consensus promotes entries to trusted, verified status.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="btn-primary py-3 px-4 shadow-lg shadow-amber-500/20 bg-amber-500 border-amber-400 text-slate-950 hover:bg-amber-400 cursor-pointer font-bold"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Regional Snack
            </button>
          </div>
        </div>
      </div>

      {/* Status Filter Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-400">Filter Status:</span>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'verified', 'pending_verification'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === status
                  ? status === 'verified' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' :
                    status === 'pending_verification' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' :
                    'bg-slate-700 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {status === 'all' ? `All (${submissions.length})`
                : status === 'verified' ? `✓ Verified (${submissions.filter(s => s.verificationStatus === 'verified').length})`
                : `⏳ Pending (${submissions.filter(s => s.verificationStatus === 'pending_verification').length})`
              }
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => {
          const isVerified = item.verificationStatus === 'verified';

          return (
            <div key={item.id} className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`badge ${isVerified ? 'badge-emerald' : 'badge-amber'}`}>
                    {isVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    {isVerified ? 'Community Verified' : `Pending (${item.verificationCount}/${item.requiredVerifications} votes)`}
                  </span>
                  {item.region && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" /> {item.region}
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-white">{item.productName}</h3>
                    <div className="text-xs font-semibold text-emerald-400 mt-0.5">
                      {item.brand} • {item.category}
                    </div>
                  </div>

                  {item.labelImageUrl && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-700 shrink-0 shadow-sm">
                      <img src={item.labelImageUrl} alt={item.productName} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">Ingredients:</div>
                  <div className="text-xs text-slate-100 font-medium leading-relaxed">{item.ingredientText}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                {!isVerified ? (
                  <button className="btn-primary flex-1 justify-center py-2 text-xs bg-amber-500 border-amber-400 text-slate-950" onClick={() => handleVerify(item.id)}>
                    <ThumbsUp className="w-4 h-4" /> Confirm &amp; Vote (+1)
                  </button>
                ) : (
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 flex-1">
                    <CheckCircle2 className="w-4 h-4" /> Verified ({item.verificationCount} votes)
                  </div>
                )}
                <button className="btn-secondary py-2 px-3 text-xs" onClick={() => setSelectedProductForModal(buildFakeProduct(item))}>
                  <Eye className="w-4 h-4" /> Rationale
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Regional Product Modal */}
      {showSubmitModal && (
        <div className="modal-backdrop">
          <div className="modal-content relative">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <PlusCircle className="w-6 h-6 text-amber-400" />
              <h2 className="font-heading text-xl font-bold text-white">Submit Regional / Unbranded Snack</h2>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-lg text-white">Submitted to Community Consensus Queue!</h3>
                <p className="text-xs text-slate-400">Other community members can now vote to verify your product label.</p>
              </div>
            ) : (
              <form onSubmit={handleAddSubmission} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Regional Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kolhapuri Special Spicy Chana Bhujia..."
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Brand / Shop Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Malabar Heritage"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Region</label>
                    <select
                      value={newRegion}
                      onChange={(e) => setNewRegion(e.target.value)}
                      className="select-field"
                    >
                      <option value="South India">Kerala / South India</option>
                      <option value="North India">Rajasthan / North India</option>
                      <option value="West India">Gujarat / Maharashtra</option>
                      <option value="East India">Bengal / East India</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Ingredient List (comma separated) *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Raw Plantain, Coconut Oil, Iodised Salt, Turmeric Powder..."
                    value={newIngredients}
                    onChange={(e) => setNewIngredients(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Label Photo Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary bg-amber-500 hover:bg-amber-400 border-amber-400 text-slate-950">
                    Submit Product to Community
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {selectedProductForModal && (
        <ManufacturingTransparencyModal product={selectedProductForModal} onClose={() => setSelectedProductForModal(null)} />
      )}
    </div>
  );
};

