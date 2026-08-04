import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ALLERGIES_META, HEALTH_CONDITIONS_META, HEALTH_GOALS_META } from '../../../shared/constants';
import { Allergy, HealthCondition, HealthGoal, UserProfile } from '../../../shared/types';

interface Props {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ProfileScreen: React.FC<Props> = ({ userProfile, onUpdateProfile }) => {
  const toggleCondition = (cond: HealthCondition) => {
    const exists = userProfile.conditions.includes(cond);
    const updated = exists
      ? userProfile.conditions.filter((c) => c !== cond)
      : [...userProfile.conditions, cond];

    onUpdateProfile({ ...userProfile, conditions: updated });
  };

  const toggleAllergy = (allg: Allergy) => {
    const exists = userProfile.allergies.includes(allg);
    const updated = exists
      ? userProfile.allergies.filter((a) => a !== allg)
      : [...userProfile.allergies, allg];

    onUpdateProfile({ ...userProfile, allergies: updated });
  };

  const toggleGoal = (gl: HealthGoal) => {
    const exists = userProfile.goals.includes(gl);
    const updated = exists
      ? userProfile.goals.filter((g) => g !== gl)
      : [...userProfile.goals, gl];

    onUpdateProfile({ ...userProfile, goals: updated });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>User Health Profile</Text>
        <Text style={styles.subtitle}>
          Configure your conditions, allergies & dietary targets to power personalized analysis
        </Text>
      </View>

      {/* User Basic Info */}
      <View style={styles.infoCard}>
        <Text style={styles.userName}>{userProfile.name}</Text>
        <Text style={styles.userDetails}>Age: {userProfile.age} • Gender: {userProfile.gender.toUpperCase()}</Text>
      </View>

      {/* Health Conditions Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🏥 Health Conditions</Text>
        <Text style={styles.sectionSub}>Select active conditions to trigger personalized warning flags:</Text>

        <View style={styles.grid}>
          {(Object.keys(HEALTH_CONDITIONS_META) as HealthCondition[]).map((condKey) => {
            const isSelected = userProfile.conditions.includes(condKey);
            const meta = HEALTH_CONDITIONS_META[condKey];

            return (
              <TouchableOpacity
                key={condKey}
                style={[styles.tile, isSelected && styles.tileActive]}
                onPress={() => toggleCondition(condKey)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tileTitle, isSelected && styles.tileTitleActive]}>
                  {isSelected ? '✓ ' : '+ '}{meta.label}
                </Text>
                <Text style={[styles.tileDesc, isSelected && styles.tileDescActive]}>
                  {meta.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Allergies Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🚨 Food Allergies</Text>
        <Text style={styles.sectionSub}>Select ingredients to trigger automatic allergen alerts:</Text>

        <View style={styles.chipGrid}>
          {(Object.keys(ALLERGIES_META) as Allergy[]).map((algKey) => {
            const isSelected = userProfile.allergies.includes(algKey);
            const meta = ALLERGIES_META[algKey];

            return (
              <TouchableOpacity
                key={algKey}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => toggleAllergy(algKey)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {isSelected ? '🚨 ' : ''}{meta.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Goals Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🎯 Health Goals</Text>
        <Text style={styles.sectionSub}>Set targets for food ranking and suitability framing:</Text>

        <View style={styles.grid}>
          {(Object.keys(HEALTH_GOALS_META) as HealthGoal[]).map((goalKey) => {
            const isSelected = userProfile.goals.includes(goalKey);
            const meta = HEALTH_GOALS_META[goalKey];

            return (
              <TouchableOpacity
                key={goalKey}
                style={[styles.tile, isSelected && styles.tileActiveGoal]}
                onPress={() => toggleGoal(goalKey)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tileTitle, isSelected && styles.tileTitleActive]}>
                  {isSelected ? '🎯 ' : ''}{meta.label}
                </Text>
                <Text style={[styles.tileDesc, isSelected && styles.tileDescActive]}>
                  {meta.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userDetails: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  grid: {
    gap: 8,
  },
  tile: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tileActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  tileActiveGoal: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  tileTitleActive: {
    color: '#0F172A',
  },
  tileDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  tileDescActive: {
    color: '#334155',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: '#DC2626',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});
