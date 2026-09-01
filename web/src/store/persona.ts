/**
 * Global Persona Store
 *
 * Every component that displays personalised data reads from here.
 * This ensures the persona name in the sidebar always matches the name
 * on every product card — one of the hard requirements from the spec.
 */

import { useState, useCallback } from 'react';
import { UserProfile } from '@shared/types/user';

// ── Seed personas (three demo users) ─────────────────────────────────────────

export const DEMO_PERSONAS: UserProfile[] = [
  {
    id: 'usr-rahul',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@demo.nutrilens',
    age: 32,
    healthConditions: ['Hypertension'],
    allergies: ['Peanuts'],
    goals: ['LowSodium', 'HeartHealth'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'usr-priya',
    name: 'Priya Nair',
    email: 'priya.nair@demo.nutrilens',
    age: 27,
    healthConditions: ['Type2Diabetes'],
    allergies: ['Gluten'],
    goals: ['WeightLoss', 'LowSodium'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'usr-anand',
    name: 'Anand Verma',
    email: 'anand.verma@demo.nutrilens',
    age: 45,
    healthConditions: ['HighCholesterol'],
    allergies: ['Dairy'],
    goals: ['HighProtein', 'HeartHealth'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// ── Simple React state-based store (no external dep needed) ──────────────────
// Pattern: call createPersonaStore() once at the top of App, pass result down.

export interface PersonaStore {
  active: UserProfile;
  all: UserProfile[];
  setActive: (persona: UserProfile) => void;
}

/**
 * usePersonaStore — top-level hook. Call once at App root, pass as prop or
 * lift state. For a larger app swap this for Zustand; the shape is identical.
 */
export function usePersonaStore(): PersonaStore {
  const [active, setActiveRaw] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nutrilens_persona_id');
    return DEMO_PERSONAS.find(p => p.id === saved) ?? DEMO_PERSONAS[0];
  });

  const setActive = useCallback((persona: UserProfile) => {
    setActiveRaw(persona);
    localStorage.setItem('nutrilens_persona_id', persona.id);
  }, []);

  return { active, all: DEMO_PERSONAS, setActive };
}

// ── Helper to get condition display label ────────────────────────────────────

export function conditionLabel(condition: string): string {
  const map: Record<string, string> = {
    Hypertension:    'Hypertension',
    Type2Diabetes:   'Type 2 diabetes',
    HighCholesterol: 'High cholesterol',
    GERD:            'GERD / Acid reflux',
    KidneySupport:   'Kidney support',
  };
  return map[condition] ?? condition;
}

export function allergenLabel(allergen: string): string {
  const map: Record<string, string> = {
    Peanuts:   'Peanuts',
    TreeNuts:  'Tree nuts',
    Dairy:     'Dairy / Lactose',
    Gluten:    'Gluten / Wheat',
    Soy:       'Soy',
    Sulfites:  'Sulfites',
  };
  return map[allergen] ?? allergen;
}
