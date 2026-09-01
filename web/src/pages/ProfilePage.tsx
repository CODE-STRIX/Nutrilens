import React, { useState, useEffect } from 'react';
import { UserProfile, HealthCondition, Allergy, DietaryGoal } from '@shared/types/user';
import { api } from '../services/api';
import { User, ShieldAlert, HeartPulse, Target, CheckCircle2, Save, Sparkles, UserCheck } from 'lucide-react';
import { samplePersonas } from '../components/Navbar';

interface ProfilePageProps {
  onProfileUpdated?: (updated: UserProfile) => void;
  activeProfile?: UserProfile;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onProfileUpdated, activeProfile }) => {
  const [profile, setProfile] = useState<UserProfile | null>(activeProfile || null);
  const [loading, setLoading] = useState(!activeProfile);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (activeProfile) {
      setProfile(activeProfile);
      setLoading(false);
    } else {
      loadProfile();
    }
  }, [activeProfile]);

  const loadProfile = async () => {
    setLoading(true);
    const data = await api.getUserProfile();
    setProfile(data);
    setLoading(false);
  };

  const handleSelectPreset = (preset: UserProfile) => {
    setProfile(preset);
    if (onProfileUpdated) onProfileUpdated(preset);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
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
      <div className="container py-16 text-center">
        <div className="text-emerald-400 font-bold animate-pulse">Loading User Profile &amp; Health Persona Settings...</div>
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
    <div className="space-y-8 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-indigo-500/40 bg-indigo-950/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-black">
              <User className="w-4 h-4 text-indigo-400" />
              Health Persona Profile Settings
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl font-black text-white tracking-tight">
              Personalized Health <span className="text-indigo-400 font-black">Guidance Engine</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl font-medium leading-relaxed">
              Configure medical conditions, food allergies, and dietary goals. NutriLens uses these settings to re-evaluate every food barcode scan into tailored safety intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button className="btn-primary py-3 px-6 text-sm font-black shadow-xl shadow-emerald-500/20 cursor-pointer" onClick={handleSave} disabled={saving}>
              <Save className="w-4.5 h-4.5" /> {saving ? 'Saving Profile...' : 'Save Health Profile'}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-5 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs font-black flex items-center gap-2.5 animate-fadeIn shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Health profile settings updated! All product safety scores are re-evaluating live.</span>
          </div>
        )}
      </div>

      {/* Preset Personas Switcher Bar */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-5 bg-slate-900/90 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            <h2 className="font-heading text-lg font-black text-white">1-Click Preset Health Persona Switcher</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Click to test instant score re-evaluations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {samplePersonas.map((preset) => {
            const isSelected = profile.id === preset.id || profile.name === preset.name;

            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-400 shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-500/40 scale-[1.01]'
                    : 'bg-slate-950/80 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-base text-white">{preset.name}</span>
                  {isSelected && (
                    <span className="px-2.5 py-0.5 text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                      Active Persona
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs font-black text-amber-300">
                    Conditions: {preset.healthConditions.join(', ')}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    Allergies: {preset.allergies.join(', ') || 'None'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spacious 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Basic Personal Details Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-6 bg-slate-900/90 shadow-xl">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <User className="w-5 h-5 text-emerald-400" />
            <h2 className="font-heading text-lg font-black text-white">Basic Shopper Info</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="input-field py-3 text-sm text-white font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">Age (Years)</label>
              <input
                type="number"
                value={profile.age}
                onChange={e => setProfile({ ...profile, age: parseInt(e.target.value) || 0 })}
                className="input-field py-3 text-sm text-white font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Health Conditions Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-6 bg-slate-900/90 shadow-xl">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <HeartPulse className="w-5 h-5 text-rose-400" />
            <h2 className="font-heading text-lg font-black text-white">Medical &amp; Health Conditions</h2>
          </div>

          <div className="space-y-3">
            {allConditions.map(cond => {
              const selected = profile.healthConditions.includes(cond.id);
              return (
                <div
                  key={cond.id}
                  onClick={() => handleToggleCondition(cond.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    selected
                      ? 'bg-rose-500/20 border-rose-500/50 text-white shadow-md shadow-rose-500/10'
                      : 'bg-slate-950/80 border-slate-700/80 hover:border-slate-600 text-slate-200'
                  }`}
                >
                  <input type="checkbox" checked={selected} readOnly className="mt-1 accent-rose-500 w-4 h-4 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="font-black text-sm text-white">{cond.name}</div>
                    <div className="text-xs text-slate-300 font-medium leading-relaxed">{cond.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Allergies Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-6 bg-slate-900/90 shadow-xl">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="font-heading text-lg font-black text-white">Allergies &amp; Intolerances</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {allAllergies.map(alg => {
              const selected = profile.allergies.includes(alg.id);
              return (
                <div
                  key={alg.id}
                  onClick={() => handleToggleAllergy(alg.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 text-xs font-black ${
                    selected
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/80 border-slate-700/80 hover:border-slate-600 text-slate-200'
                  }`}
                >
                  <input type="checkbox" checked={selected} readOnly className="accent-amber-500 w-4 h-4 shrink-0" />
                  <span>{alg.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dietary Goals Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-6 bg-slate-900/90 shadow-xl">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <Target className="w-5 h-5 text-indigo-400" />
            <h2 className="font-heading text-lg font-black text-white">Active Dietary Goals</h2>
          </div>

          <div className="space-y-3">
            {allGoals.map(goal => {
              const selected = profile.goals.includes(goal.id);
              return (
                <div
                  key={goal.id}
                  onClick={() => handleToggleGoal(goal.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                    selected
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/80 border-slate-700/80 hover:border-slate-600 text-slate-200'
                  }`}
                >
                  <input type="checkbox" checked={selected} readOnly className="mt-1 accent-indigo-500 w-4 h-4 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="font-black text-sm text-white">{goal.name}</div>
                    <div className="text-xs text-slate-300 font-medium leading-relaxed">{goal.desc}</div>
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

