import React, { useState } from 'react';
import { Users, ThumbsUp, ThumbsDown, Plus, CheckCircle2 } from 'lucide-react';

interface CommunityProduct {
  id: string;
  name: string;
  brand: string;
  region: string;
  category: string;
  ingredientsText: string;
  votesConfirm: number;
  votesReject: number;
  status: 'pending' | 'verified';
}

const SEEDED_COMMUNITY: CommunityProduct[] = [
  {
    id: 'comm-1',
    name: 'Local Bikaneri Besan Sev',
    brand: 'Shree Ram Namkeen',
    region: 'Rajasthan',
    category: 'Regional Snacks',
    ingredientsText: 'Gram flour (besan), Vegetable oil, Salt, Ajwain, Black pepper, Spices',
    votesConfirm: 3,
    votesReject: 0,
    status: 'verified'
  },
  {
    id: 'comm-2',
    name: 'Handcrafted Millet Chikki',
    brand: 'Gramin Udyog',
    region: 'Maharashtra',
    category: 'Sweets',
    ingredientsText: 'Jaggery, Foxtail millet, Roasted peanuts, Cardamom',
    votesConfirm: 2,
    votesReject: 0,
    status: 'pending'
  }
];

export const CommunityBrowsePage: React.FC = () => {
  const [items, setItems] = useState<CommunityProduct[]>(SEEDED_COMMUNITY);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProd, setNewProd] = useState({ name: '', brand: '', region: '', category: '', ingredientsText: '' });
  const [votedIds, setVotedIds] = useState<string[]>([]);

  const handleVote = (id: string, type: 'confirm' | 'reject') => {
    if (votedIds.includes(id)) return;
    setVotedIds(prev => [...prev, id]);

    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newConfirm = type === 'confirm' ? item.votesConfirm + 1 : item.votesConfirm;
      const newReject = type === 'reject' ? item.votesReject + 1 : item.votesReject;
      const isVerified = newConfirm >= 3;
      return {
        ...item,
        votesConfirm: newConfirm,
        votesReject: newReject,
        status: isVerified ? 'verified' : item.status
      };
    }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name) return;

    const newItem: CommunityProduct = {
      id: `comm-${Date.now()}`,
      name: newProd.name,
      brand: newProd.brand || 'Local Maker',
      region: newProd.region || 'India',
      category: newProd.category || 'Regional Product',
      ingredientsText: newProd.ingredientsText,
      votesConfirm: 1,
      votesReject: 0,
      status: 'pending'
    };

    setItems(prev => [newItem, ...prev]);
    setNewProd({ name: '', brand: '', region: '', category: '', ingredientsText: '' });
    setShowAddForm(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-4)' }}>
        <div>
          <h1 className="page-title">Community-verified products</h1>
          <p className="page-subtitle">
            Submit and verify regional Indian packaged food items missing from global databases.
            3 confirming votes promote an item to verified status.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={14} />
          Submit regional product
        </button>
      </div>

      {/* Submission Form */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: 'var(--sp-8)', maxWidth: 640 }}>
          <h2 style={{ fontSize: 'var(--text-20)', marginBottom: 'var(--sp-4)' }}>Submit a regional product</h2>
          <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div>
              <label className="field-label">Product Name</label>
              <input
                type="text"
                className="input"
                required
                value={newProd.name}
                onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                placeholder="e.g. Kolhapuri Techa Namkeen"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
              <div>
                <label className="field-label">Brand / Maker</label>
                <input
                  type="text"
                  className="input"
                  value={newProd.brand}
                  onChange={e => setNewProd({ ...newProd, brand: e.target.value })}
                  placeholder="e.g. Desi Snacks"
                />
              </div>
              <div>
                <label className="field-label">Region / State</label>
                <input
                  type="text"
                  className="input"
                  value={newProd.region}
                  onChange={e => setNewProd({ ...newProd, region: e.target.value })}
                  placeholder="e.g. Maharashtra"
                />
              </div>
            </div>
            <div>
              <label className="field-label">Ingredient List (from label)</label>
              <textarea
                className="input textarea"
                required
                value={newProd.ingredientsText}
                onChange={e => setNewProd({ ...newProd, ingredientsText: e.target.value })}
                placeholder="Copy exact ingredient text from the package back..."
              />
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <button type="submit" className="btn btn-primary">Submit for verification</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Product List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        {items.map(item => {
          const isVoted = votedIds.includes(item.id);

          return (
            <div key={item.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-4)', marginBottom: 'var(--sp-3)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
                      {item.name}
                    </h3>
                    {item.status === 'verified' ? (
                      <span className="verdict-badge verdict-good">Verified Community Item</span>
                    ) : (
                      <span className="verdict-badge verdict-limit">Pending Consensus ({item.votesConfirm}/3 votes)</span>
                    )}
                  </div>
                  <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', marginTop: 2 }}>
                    {item.brand} &middot; {item.region} &middot; {item.category}
                  </div>
                </div>

                {/* Consensus Voting Controls */}
                <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={isVoted}
                    onClick={() => handleVote(item.id, 'confirm')}
                  >
                    <ThumbsUp size={12} />
                    Confirm ({item.votesConfirm})
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={isVoted}
                    onClick={() => handleVote(item.id, 'reject')}
                  >
                    <ThumbsDown size={12} />
                    Reject ({item.votesReject})
                  </button>
                </div>
              </div>

              <div className="card-sunk">
                <div className="facet-label" style={{ marginBottom: 4 }}>Ingredient list</div>
                <div style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)' }}>
                  {item.ingredientsText}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
