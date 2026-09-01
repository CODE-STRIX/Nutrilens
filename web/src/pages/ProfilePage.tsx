import React from 'react';
import { UserProfile } from '@shared/types/user';
import { DEMO_PERSONAS, conditionLabel, allergenLabel } from '../store/persona';
import { UserCircle2, CheckCircle2, Shield } from 'lucide-react';

interface ProfilePageProps {
  activePersona: UserProfile;
  onPersonaUpdated: (persona: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  activePersona,
  onPersonaUpdated
}) => {
  const allConditions = [
    { code: 'Hypertension', label: 'Hypertension', desc: 'Caps score at 25 if sodium exceeds 500 mg per serving. Recommends <140 mg.' },
    { code: 'Type2Diabetes', label: 'Type 2 Diabetes', desc: 'Caps score at 30 if added sugars exceed 10 g per 100 g or rapid-glucose ingredients present.' },
    { code: 'HighCholesterol', label: 'High Cholesterol', desc: 'Caps score at 35 if saturated fat exceeds 6 g per 100 g or palm oil / hydrogenated fats present.' },
    { code: 'GERD', label: 'GERD / Acid Reflux', desc: 'Caps score at 50 if citric acid, high chilli content, or acidity regulators present.' },
    { code: 'KidneySupport', label: 'Kidney Support', desc: 'Caps score at 40 if phosphate additives (INS 338–452) or high potassium present.' },
  ];

  const allAllergens = [
    { code: 'Peanuts', label: 'Peanuts', desc: 'Forces hard block (score 0) if peanuts or traces detected.' },
    { code: 'TreeNuts', label: 'Tree Nuts', desc: 'Forces hard block (score 0) if almonds, cashews, walnuts present.' },
    { code: 'Gluten', label: 'Gluten / Wheat', desc: 'Forces hard block (score 0) if wheat, barley, rye present.' },
    { code: 'Dairy', label: 'Dairy / Lactose', desc: 'Forces hard block (score 0) if milk, whey, butter present.' },
    { code: 'Soy', label: 'Soy', desc: 'Forces hard block (score 0) if soy lecithin or soy flour present.' },
    { code: 'Sulfites', label: 'Sulfites', desc: 'Forces hard block (score 0) if INS 220–228 preservatives present.' },
  ];

  const toggleCondition = (code: string) => {
    const exists = activePersona.healthConditions.includes(code as any);
    const updatedConditions = exists
      ? activePersona.healthConditions.filter(c => c !== code)
      : [...activePersona.healthConditions, code];

    const updated: UserProfile = {
      ...activePersona,
      healthConditions: updatedConditions as any
    };
    onPersonaUpdated(updated);
  };

  const toggleAllergen = (code: string) => {
    const exists = activePersona.allergies.includes(code as any);
    const updatedAllergies = exists
      ? activePersona.allergies.filter(a => a !== code)
      : [...activePersona.allergies, code];

    const updated: UserProfile = {
      ...activePersona,
      allergies: updatedAllergies as any
    };
    onPersonaUpdated(updated);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Health persona profile</h1>
        <p className="page-subtitle">
          Configure health conditions, declared allergens, and nutrition goals.
          All scoring engine caps and alerts adapt instantly to these settings.
        </p>
      </div>

      {/* Preset Personas Quick Switch */}
      <div className="card" style={{ marginBottom: 'var(--sp-8)' }}>
        <div style={{ fontSize: 'var(--text-12)', fontWeight: 600, color: 'var(--ink-3)', marginBottom: 'var(--sp-3)' }}>
          Preset Health Personas (Click to activate)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--sp-4)' }}>
          {DEMO_PERSONAS.map(p => {
            const isActive = p.id === activePersona.id;
            return (
              <button
                key={p.id}
                onClick={() => onPersonaUpdated(p)}
                className="card"
                style={{
                  padding: 'var(--sp-4)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: `1px solid ${isActive ? 'var(--ink)' : 'var(--rule)'}`,
                  background: isActive ? 'var(--surface-sunk)' : 'var(--surface)',
                  fontFamily: 'inherit'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 'var(--text-16)', fontWeight: 600, color: 'var(--ink)' }}>{p.name}</span>
                  {isActive && <CheckCircle2 size={16} style={{ color: 'var(--verdict-ok)' }} />}
                </div>
                <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)' }}>
                  Conditions: {p.healthConditions.join(', ') || 'None'}
                </div>
                <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)' }}>
                  Avoids: {p.allergies.join(', ') || 'None'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Health Conditions Form */}
      <div className="card" style={{ marginBottom: 'var(--sp-8)' }}>
        <h2 style={{ fontSize: 'var(--text-20)', marginBottom: 'var(--sp-2)' }}>Health Conditions &amp; Risk Rules</h2>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', marginBottom: 'var(--sp-6)' }}>
          Checking a condition enforces deterministic score caps when trigger thresholds are crossed.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {allConditions.map(item => {
            const checked = activePersona.healthConditions.includes(item.code as any);
            return (
              <label
                key={item.code}
                className="card-sunk"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--sp-3)',
                  cursor: 'pointer',
                  border: `1px solid ${checked ? 'var(--ink)' : 'var(--rule)'}`
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCondition(item.code)}
                  style={{ marginTop: 4, accentColor: 'var(--ink)' }}
                />
                <div>
                  <div style={{ fontSize: 'var(--text-14)', fontWeight: 600, color: 'var(--ink)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', marginTop: 2 }}>
                    {item.desc}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Allergens Form */}
      <div className="card">
        <h2 style={{ fontSize: 'var(--text-20)', marginBottom: 'var(--sp-2)' }}>Declared Allergens (Hard Stop)</h2>
        <p style={{ fontSize: 'var(--text-14)', color: 'var(--ink-2)', marginBottom: 'var(--sp-6)' }}>
          Any presence of a checked allergen immediately forces score 0, "Avoid" band, and blocks the product.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--sp-4)' }}>
          {allAllergens.map(item => {
            const checked = activePersona.allergies.includes(item.code as any);
            return (
              <label
                key={item.code}
                className="card-sunk"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--sp-3)',
                  cursor: 'pointer',
                  border: `1px solid ${checked ? 'var(--verdict-avoid)' : 'var(--rule)'}`
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAllergen(item.code)}
                  style={{ marginTop: 4, accentColor: 'var(--verdict-avoid)' }}
                />
                <div>
                  <div style={{ fontSize: 'var(--text-14)', fontWeight: 600, color: 'var(--ink)' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 'var(--text-12)', color: 'var(--ink-3)', marginTop: 2 }}>
                    {item.desc}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
