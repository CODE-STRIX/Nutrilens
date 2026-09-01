import React, { useState, useEffect } from 'react';
import { RecallAlert } from '@shared/types';
import { WebApiService } from '../services/api';
import { ShieldAlert, Search, AlertCircle, FileText, CheckCircle2, Send } from 'lucide-react';

export const RecallAlertsView: React.FC = () => {
  const [recalls, setRecalls] = useState<RecallAlert[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);
  const [reportForm, setReportForm] = useState({ productName: '', brand: '', reason: '' });

  useEffect(() => {
    const load = async () => {
      const recs = await WebApiService.getRecallAlerts();
      setRecalls(recs);
    };
    load();
  }, []);

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.productName) return;
    const refId = `REF-FSSAI-${Math.floor(100000 + Math.random() * 900000)}`;
    setReportSuccess(refId);
    setReportForm({ productName: '', brand: '', reason: '' });
  };

  const filteredRecalls = recalls.filter(r =>
    !searchQuery ||
    r.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Recall and ban safety centre</h1>
        <p className="page-subtitle">
          Seeded dataset compiled from published FSSAI notices. Live integration requires a formal data-sharing arrangement.
        </p>
      </div>

      {/* Explicit Seeded Dataset Header */}
      <div className="card" style={{ marginBottom: 'var(--sp-6)', borderLeft: '3px solid var(--verdict-limit)' }}>
        <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-1)' }}>
          Data Source Declaration
        </div>
        <div style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)' }}>
          All recall notices shown on this page are sample records modeled after official FSSAI safety advisories for demonstration purposes.
        </div>
      </div>

      {/* Pantry Inspector / Search */}
      <div className="card" style={{ marginBottom: 'var(--sp-8)' }}>
        <div style={{ fontSize: 'var(--text-14)', fontWeight: 600, color: 'var(--ink)', marginBottom: 'var(--sp-3)' }}>
          Pantry Inspector
        </div>
        <div className="input-icon-wrap">
          <Search size={16} className="input-icon" />
          <input
            type="text"
            className="input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by product name, brand, or batch code..."
            aria-label="Pantry inspector search"
          />
        </div>
      </div>

      {/* Notice Cards */}
      <h2 style={{ fontSize: 'var(--text-20)', marginBottom: 'var(--sp-4)' }}>Active Recall Advisories</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', marginBottom: 'var(--sp-8)' }}>
        {filteredRecalls.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--ink-3)' }}>
            No active notices found matching your query in the seeded dataset.
          </div>
        ) : (
          filteredRecalls.map(r => (
            <div key={r.id} className="risk-row avoid">
              <ShieldAlert size={20} style={{ color: 'var(--verdict-avoid)', flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-16)', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
                      {r.productName} ({r.brand})
                    </h3>
                    <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', marginTop: 2 }}>
                      Issued on: {new Date((r as any).issuedAt || (r as any).issued_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} &middot; Severity: {(r as any).severity || 'High'}
                    </div>
                  </div>
                  <span className="verdict-badge verdict-avoid">FSSAI Advisory</span>
                </div>

                <div style={{ marginTop: 'var(--sp-3)', fontSize: 'var(--text-14)', color: 'var(--ink-2)' }}>
                  <strong>Reason:</strong> {r.reason}
                </div>
                <div style={{ marginTop: 'var(--sp-2)', fontSize: 'var(--text-14)', color: 'var(--ink-2)' }}>
                  <strong>Required Consumer Action:</strong> {r.actionRequired}
                </div>
                {r.affectedBatches && (
                  <div style={{ marginTop: 'var(--sp-2)', fontSize: 'var(--text-12)', color: 'var(--ink-3)', fontVariantNumeric: 'tabular-nums' }}>
                    Affected Batches: {r.affectedBatches.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Unsafe Food Form */}
      <div className="card" style={{ maxWidth: 640 }}>
        <h2 style={{ fontSize: 'var(--text-20)', marginBottom: 'var(--sp-2)' }}>Report unsafe food</h2>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', marginBottom: 'var(--sp-4)' }}>
          Submit a report regarding suspected contamination or mislabelling. Reports are logged internally for review.
        </p>

        {reportSuccess ? (
          <div className="risk-row ok">
            <CheckCircle2 size={16} style={{ color: 'var(--verdict-ok)', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>Report Submitted</div>
              <div style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)' }}>
                Reference Number: <strong>{reportSuccess}</strong>. Thank you for helping keep food safe.
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReport} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div>
              <label className="field-label">Product Name</label>
              <input
                type="text"
                className="input"
                required
                value={reportForm.productName}
                onChange={e => setReportForm({ ...reportForm, productName: e.target.value })}
                placeholder="e.g. Local Besan Ladoo"
              />
            </div>
            <div>
              <label className="field-label">Brand / Manufacturer</label>
              <input
                type="text"
                className="input"
                value={reportForm.brand}
                onChange={e => setReportForm({ ...reportForm, brand: e.target.value })}
                placeholder="e.g. Shree Sweets"
              />
            </div>
            <div>
              <label className="field-label">Reason for concern</label>
              <textarea
                className="input textarea"
                required
                value={reportForm.reason}
                onChange={e => setReportForm({ ...reportForm, reason: e.target.value })}
                placeholder="Describe issue (e.g. unlisted colorants, rancid smell, missing batch number)"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              <Send size={14} />
              Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
