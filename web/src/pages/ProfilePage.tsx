import React, { useState, useEffect } from 'react';
import { UserProfile, HealthCondition, Allergy, DietaryGoal } from '@shared/types/user';
import { api } from '../services/api';
import { User, ShieldAlert, HeartPulse, Target, CheckCircle2, Save, Sparkles } from 'lucide-react';

interface ProfilePageProps {
  onProfileUpdated?: (updated: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onProfileUpdated }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const data = await api.getUserProfile();
    setProfile(data);
    setLoading(false);
  };

  const handleToggleCondition = (condition: HealthCondition) => {
    if (!profile) return;
    const exists = profile.healthConditions.includes(condition);
    const updated = exists
      ? profile.healthConditions.filter(c => c !== condition)
      : [...profile.healthConditions, condition];
    setProfile({ ...profile, healthConditions: updated });
  };

  const handleToggleAllergy = (allergy: Allergy) => {
    if (!profile) return;
    const exists = profile.allergies.includes(allergy);
    const updated = exists
      ? profile.allergies.filter(a => a !== allergy)
      : [...profile.allergies, allergy];
    setProfile({ ...profile, allergies: updated });
  };

  const handleToggleGoal = (goal: DietaryGoal) => {
    if (!profile) return;
    const exists = profile.goals.includes(goal);
    const updated = exists
      ? profile.goals.filter(g => g !== goal)
      : [...profile.goals, goal];
    setProfile({ ...profile, goals: updated });
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await api.updateUserProfile(profile.id, profile);
      setProfile(updated);
      if (onProfileUpdated) onProfileUpdated(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ color: 'var(--emerald-400)', fontWeight: 600 }}>Loading User Profile & Health Settings...</div>
      </div>
    );
  }

  const allConditions: { id: HealthCondition; name: string; desc: string }[] = [
    { id: 'Hypertension', name: 'Hypertension / High BP', desc: 'Flags high sodium (>400mg) and INS preservatives' },
    { id: 'Type2Diabetes', name: 'Type 2 Diabetes', desc: 'Flags added sugars, maltodextrin & high glycemic index' },
    { id: 'HighCholesterol', name: 'High Cholesterol', desc: 'Flags palm oil, trans fats & saturated fatty acids' },
    { id: 'GERD', name: 'GERD / Acid Reflux', desc: 'Flags high citric acid, spices and acidic preservatives' },
    { id: 'KidneyDisease', name: 'Kidney Health Support', desc: 'Limits excess potassium & artificial phosphate additives' }
  ];

  const allAllergies: { id: Allergy; name: string }[] = [
    { id: 'Peanuts', name: 'Peanuts' },
    { id: 'TreeNuts', name: 'Tree Nuts (Almond, Walnut)' },
    { id: 'Dairy', name: 'Dairy / Milk Protein' },
    { id: 'Gluten', name: 'Gluten / Wheat (Maida)' },
    { id: 'Soy', name: 'Soy / Soy Lecithin' },
    { id: 'Sulfites', name: 'Sulfites & Preservative Salts' }
  ];

  const allGoals: { id: DietaryGoal; name: string; desc: string }[] = [
    { id: 'LowSodium', name: 'Low Sodium Intake', desc: 'Maintain daily sodium under 1,500mg' },
    { id: 'WeightLoss', name: 'Weight & Calorie Management', desc: 'Prioritize high fibre and low energy density' },
    { id: 'HighProtein', name: 'Protein & Muscle Support', desc: 'Highlights high-protein snack alternatives' },
    { id: 'HeartHealth', name: 'Cardiovascular Wellness', desc: 'Avoid hydrogenated trans fats & palm oil' }
  ];

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(99, 102, 241, 0.1))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-emerald"><User size={14} /> Profile & Health Persona</span>
              <span className="badge badge-indigo">Person B Scope</span>
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Personalized Health Guidance Profile</h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', fontSize: '0.95rem' }}>
              Configure your age, medical conditions, food allergies, and health goals. Nutri Lens uses these settings to personalize every food scan into tailored safety intelligence.
            </p>
          </div>

          <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '12px 24px', fontSize: '1rem' }}>
            <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Profile Settings'}
          </button>
        </div>

        {savedSuccess && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--emerald-400)', borderRadius: 'var(--radius-sm)', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <CheckCircle2 size={18} color="var(--emerald-400)" /> Profile settings updated successfully! All future scans will adjust to your new profile.
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Basic Personal Details Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <User color="var(--emerald-400)" size={22} />
            <h2 style={{ fontSize: '1.25rem' }}>Basic Shopper Info</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Age (Years)</label>
              <input
                type="number"
                value={profile.age}
                onChange={e => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>
          </div>
        </div>

        {/* Health Conditions Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <HeartPulse color="var(--rose-400)" size={22} />
            <h2 style={{ fontSize: '1.25rem' }}>Medical & Health Conditions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {allConditions.map(cond => {
              const selected = profile.healthConditions.includes(cond.id);
              return (
                <div
                  key={cond.id}
                  onClick={() => handleToggleCondition(cond.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: selected ? '1px solid var(--rose-400)' : '1px solid var(--border-subtle)',
                    background: selected ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input type="checkbox" checked={selected} readOnly style={{ marginTop: '3px' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: selected ? '#fff' : 'var(--text-secondary)' }}>{cond.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{cond.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Allergies Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <ShieldAlert color="var(--amber-400)" size={22} />
            <h2 style={{ fontSize: '1.25rem' }}>Allergies & Intolerances</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {allAllergies.map(alg => {
              const selected = profile.allergies.includes(alg.id);
              return (
                <div
                  key={alg.id}
                  onClick={() => handleToggleAllergy(alg.id)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: selected ? '1px solid var(--amber-400)' : '1px solid var(--border-subtle)',
                    background: selected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.88rem',
                    fontWeight: 500
                  }}
                >
                  <input type="checkbox" checked={selected} readOnly />
                  <span>{alg.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dietary Goals Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <Target color="var(--indigo-400)" size={22} />
            <h2 style={{ fontSize: '1.25rem' }}>Active Dietary Goals</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {allGoals.map(goal => {
              const selected = profile.goals.includes(goal.id);
              return (
                <div
                  key={goal.id}
                  onClick={() => handleToggleGoal(goal.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: selected ? '1px solid var(--indigo-400)' : '1px solid var(--border-subtle)',
                    background: selected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}
                >
                  <input type="checkbox" checked={selected} readOnly style={{ marginTop: '3px' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: selected ? '#fff' : 'var(--text-secondary)' }}>{goal.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{goal.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
