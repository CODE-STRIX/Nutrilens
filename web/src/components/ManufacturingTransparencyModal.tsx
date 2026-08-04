import React from 'react';
import { Product, ManufacturingRationale } from '@shared/types/product';
import { X, Factory, DollarSign, Layers, ShieldCheck, Tag } from 'lucide-react';

interface ModalProps {
  product: Product;
  onClose: () => void;
}

export const ManufacturingTransparencyModal: React.FC<ModalProps> = ({ product, onClose }) => {
  const getReasonBadge = (reason: ManufacturingRationale['primaryReason'] | undefined) => {
    switch (reason) {
      case 'cost':
        return <span className="badge badge-amber"><DollarSign size={12} /> Cost Effective</span>;
      case 'texture':
        return <span className="badge badge-indigo"><Layers size={12} /> Texture & Snap</span>;
      case 'shelf_life':
        return <span className="badge badge-emerald"><ShieldCheck size={12} /> Shelf Life</span>;
      default:
        return <span className="badge badge-indigo"><Tag size={12} /> {reason ? reason.replace('_', ' ') : 'Other'}</span>;
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '620px', padding: '28px', background: '#0F172A', borderColor: 'var(--emerald-500)', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Factory color="var(--emerald-400)" size={22} />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--emerald-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Feature 4: Manufacturing Transparency</div>
              <h2 style={{ fontSize: '1.25rem' }}>{product.name}</h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{product.brand}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
          Explaining <strong>why</strong> the manufacturer selected each ingredient — cost efficiency, crisp texture, or long shelf stability — instead of leaving shoppers guessing.
        </p>

        {/* Rationale List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {product.manufacturingRationale && product.manufacturingRationale.length > 0 ? (
            product.manufacturingRationale.map((rat: ManufacturingRationale, idx: number) => (
              <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#fff' }}>{rat.ingredientName}</div>
                  {getReasonBadge(rat.primaryReason)}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{rat.explanation}</div>
              </div>
            ))
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Standard whole food ingredients detected. No industrial preservatives or artificial emulsifiers found.
            </div>
          )}
        </div>

        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onClose}>
          Close Transparency Inspector
        </button>
      </div>
    </div>
  );
};
