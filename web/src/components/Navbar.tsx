import React from 'react';
import { ShieldCheck, User, BookOpen, Users, ArrowLeftRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'profile' | 'learning' | 'community' | 'compare';
  setActiveTab: (tab: 'profile' | 'learning' | 'community' | 'compare') => void;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, userName }) => {
  return (
    <nav style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
          <div style={{
            background: 'linear-gradient(135deg, #10B981, #059669)',
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
          }}>
            <ShieldCheck size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #ffffff, #94A3B8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Nutri Lens
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--emerald-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Person B — Web Dashboard
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveTab('profile')}
            className={`btn-secondary ${activeTab === 'profile' ? 'active-tab' : ''}`}
            style={{
              padding: '8px 16px',
              fontSize: '0.88rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'profile' ? 'linear-gradient(135deg, var(--emerald-500), var(--emerald-600))' : 'transparent',
              color: activeTab === 'profile' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600
            }}
          >
            <User size={16} /> Profile & Settings
          </button>

          <button
            onClick={() => setActiveTab('learning')}
            style={{
              padding: '8px 16px',
              fontSize: '0.88rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'learning' ? 'linear-gradient(135deg, var(--indigo-500), #4F46E5)' : 'transparent',
              color: activeTab === 'learning' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <BookOpen size={16} /> Learning Library
          </button>

          <button
            onClick={() => setActiveTab('community')}
            style={{
              padding: '8px 16px',
              fontSize: '0.88rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'community' ? 'linear-gradient(135deg, var(--amber-500), #D97706)' : 'transparent',
              color: activeTab === 'community' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Users size={16} /> Community Products
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            style={{
              padding: '8px 16px',
              fontSize: '0.88rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'compare' ? 'linear-gradient(135deg, var(--cyan-500), #0284C7)' : 'transparent',
              color: activeTab === 'compare' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeftRight size={16} /> Alternatives & Compare
          </button>
        </div>

        {/* Active User Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="badge badge-emerald">
            <Sparkles size={12} /> {userName}
          </div>
        </div>
      </div>
    </nav>
  );
};
