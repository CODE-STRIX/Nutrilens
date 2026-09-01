import React, { useState, useEffect } from 'react';
import { CommunitySubmission } from '@shared/types/community';
import { api } from '../services/api';
import { Users, CheckCircle2, AlertTriangle, MapPin, Eye, ThumbsUp, Filter } from 'lucide-react';
import { ManufacturingTransparencyModal } from '../components/ManufacturingTransparencyModal';
import { Product } from '@shared/types/product';

export const CommunityBrowsePage: React.FC = () => {
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending_verification'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    const data = await api.getCommunitySubmissions();
    setSubmissions(data);
    setLoading(false);
  };

  const handleVerify = async (submissionId: string) => {
    try {
      const res = await api.verifyCommunitySubmission(submissionId, 'user_default', true);
      alert(res.message || 'Verification recorded!');
      await loadSubmissions();
    } catch (e: any) {
      alert(e.message || 'Verification error');
    }
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
    <div className="container animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-emerald"><Users size={14} /> Community Intelligence</span>
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Community-Verified Regional Products</h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.95rem' }}>
              Browse regional products, user-submitted label photos, and verified ingredient data.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(['all', 'verified', 'pending_verification'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className="btn-secondary"
                style={{
                  background: filterStatus === status
                    ? status === 'verified' ? 'rgba(16,185,129,0.2)' : status === 'pending_verification' ? 'rgba(99,102,241,0.2)' : 'rgba(245,158,11,0.2)'
                    : 'transparent',
                  borderColor: filterStatus === status
                    ? status === 'verified' ? 'var(--emerald-400)' : status === 'pending_verification' ? 'var(--indigo-400)' : 'var(--amber-400)'
                    : 'var(--border-subtle)',
                  fontSize: '0.85rem',
                  padding: '7px 14px'
                }}
              >
                {status === 'all' ? `All (${submissions.length})`
                  : status === 'verified' ? `✓ Verified (${submissions.filter(s => s.verificationStatus === 'verified').length})`
                  : `⏳ Pending (${submissions.filter(s => s.verificationStatus === 'pending_verification').length})`
                }
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {filtered.map(item => {
          const isVerified = item.verificationStatus === 'verified';
          return (
            <div key={item.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span className={`badge ${isVerified ? 'badge-emerald' : 'badge-amber'}`}>
                    {isVerified ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    {isVerified ? 'Community Verified' : `Pending (${item.verificationCount}/${item.requiredVerifications} votes)`}
                  </span>
                  {item.region && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {item.region}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{item.productName}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--emerald-400)', fontWeight: 600, marginBottom: '14px' }}>
                  {item.brand} • {item.category}
                </div>

                {item.labelImageUrl && (
                  <div style={{ height: '140px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '14px' }}>
                    <img src={item.labelImageUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Ingredients:</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.ingredientText}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                {!isVerified ? (
                  <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleVerify(item.id)}>
                    <ThumbsUp size={16} /> Confirm & Verify (+1 Vote)
                  </button>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: 'var(--emerald-400)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                    <CheckCircle2 size={16} /> Consensus reached ({item.verificationCount} votes)
                  </div>
                )}
                <button className="btn-secondary" onClick={() => setSelectedProductForModal(buildFakeProduct(item))}>
                  <Eye size={16} /> Rationale
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProductForModal && (
        <ManufacturingTransparencyModal product={selectedProductForModal} onClose={() => setSelectedProductForModal(null)} />
      )}
    </div>
  );
};
