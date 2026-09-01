import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ALLERGIES_META, HEALTH_CONDITIONS_META, HEALTH_GOALS_META } from '../../../shared/constants';
import { Allergy, HealthCondition, HealthGoal, UserProfile } from '../../../shared/types';
import { NutriIcon } from '../components/NutriIcon';

interface Props {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ProfileScreen: React.FC<Props> = ({ userProfile, onUpdateProfile }) => {
  const [saveToast, setSaveToast] = useState(false);

  const triggerSaveToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const toggleCondition = (cond: HealthCondition) => {
    const exists = userProfile.conditions.includes(cond);
    const updated = exists
      ? userProfile.conditions.filter((c) => c !== cond)
      : [...userProfile.conditions, cond];

    onUpdateProfile({ ...userProfile, conditions: updated });
    triggerSaveToast();
  };

  const toggleAllergy = (allg: Allergy) => {
    const exists = userProfile.allergies.includes(allg);
    const updated = exists
      ? userProfile.allergies.filter((a) => a !== allg)
      : [...userProfile.allergies, allg];

    onUpdateProfile({ ...userProfile, allergies: updated });
    triggerSaveToast();
  };

  const toggleGoal = (gl: HealthGoal) => {
    const exists = userProfile.goals.includes(gl);
    const updated = exists
      ? userProfile.goals.filter((g) => g !== gl)
      : [...userProfile.goals, gl];

    onUpdateProfile({ ...userProfile, goals: updated });
    triggerSaveToast();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>User Health Profile</Text>
        <Text style={styles.subtitle}>
          Configure your conditions, allergies & dietary goals to power personalized health analysis across all screens
        </Text>
      </View>

      {/* Save Notification Toast */}
      {saveToast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>✓ Profile preferences updated live!</Text>
        </View>
      )}

      {/* User Basic Info */}
      <View style={styles.infoCard}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>{userProfile.name[0]}</Text>
        </View>
        <View style={styles.userMeta}>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userDetails}>
            Age: {userProfile.age} • Gender: {(userProfile.gender || 'Other').toUpperCase()} • Active Conditions: {userProfile.conditions.length}
          </Text>
        </View>
      </View>

      {/* Health Conditions Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <NutriIcon name="health" size={16} color="#0F172A" />
          <Text style={styles.sectionTitle}> Health Conditions</Text>
        </View>
        <Text style={styles.sectionSub}>
          Select active health conditions to trigger personalized warning flags:
        </Text>

        <View style={styles.grid}>
          {(Object.keys(HEALTH_CONDITIONS_META) as HealthCondition[]).map((condKey) => {
            const isSelected = userProfile.conditions.includes(condKey);
            const meta = HEALTH_CONDITIONS_META[condKey];

            return (
              <TouchableOpacity
                key={condKey}
                style={[styles.tile, isSelected && styles.tileActive]}
                onPress={() => toggleCondition(condKey)}
                activeOpacity={0.8}
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
        <View style={styles.sectionTitleRow}>
          <NutriIcon name="allergy" size={16} color="#EF4444" />
          <Text style={styles.sectionTitle}> Food Allergies</Text>
        </View>
        <Text style={styles.sectionSub}>
          Select ingredients to trigger automatic allergen alerts:
        </Text>

        <View style={styles.chipGrid}>
          {(Object.keys(ALLERGIES_META) as Allergy[]).map((algKey) => {
            const isSelected = userProfile.allergies.includes(algKey);
            const meta = ALLERGIES_META[algKey];

            return (
              <TouchableOpacity
                key={algKey}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => toggleAllergy(algKey)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {isSelected ? '✓ ' : '+ '}{meta.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Health Goals Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTitleRow}>
          <NutriIcon name="target" size={16} color="#0D9488" />
          <Text style={styles.sectionTitle}> Health & Nutrition Goals</Text>
        </View>
        <Text style={styles.sectionSub}>Set dietary targets for smart shopping assistant:</Text>

        <View style={styles.chipGrid}>
          {(Object.keys(HEALTH_GOALS_META) as HealthGoal[]).map((goalKey) => {
            const isSelected = userProfile.goals.includes(goalKey);
            const meta = HEALTH_GOALS_META[goalKey];

            return (
              <TouchableOpacity
                key={goalKey}
                style={[styles.chip, isSelected && styles.goalChipActive]}
                onPress={() => toggleGoal(goalKey)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {isSelected ? '✓ ' : '+ '}{meta.label}
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
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 18,
  },
  toast: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#16A34A',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  toastText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '800',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  avatarLarge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  userMeta: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  userDetails: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
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
    backgroundColor: '#CCFBF1',
    borderColor: '#0D9488',
  },
  tileTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  tileTitleActive: {
    color: '#0F766E',
    fontWeight: '900',
  },
  tileDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  tileDescActive: {
    color: '#0D9488',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  goalChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  chipTextActive: {
    color: '#1E293B',
    fontWeight: '800',
  },
});
