import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LearningScreen } from './src/screens/LearningScreen';
import { PersonalizedAnalysisScreen } from './src/screens/PersonalizedAnalysisScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SmartShoppingScreen } from './src/screens/SmartShoppingScreen';
import { SAMPLE_USER_PROFILE } from './src/services/mockData';
import { UserProfile } from '../shared/types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'dashboard' | 'shopping' | 'learning' | 'profile'>('analysis');
  const [userProfile, setUserProfile] = useState<UserProfile>(SAMPLE_USER_PROFILE);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Banner */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.appName}>Nutri Lens</Text>
          <Text style={styles.appTagline}>Food Label & Ingredient Intelligence</Text>
        </View>
        <View style={styles.profileQuickBadge}>
          <Text style={styles.profileInitial}>{userProfile.name[0]}</Text>
        </View>
      </View>

      {/* Screen Content */}
      <View style={styles.screenContainer}>
        {activeTab === 'analysis' && <PersonalizedAnalysisScreen userProfile={userProfile} />}
        {activeTab === 'dashboard' && <DashboardScreen />}
        {activeTab === 'shopping' && <SmartShoppingScreen />}
        {activeTab === 'learning' && <LearningScreen />}
        {activeTab === 'profile' && <ProfileScreen userProfile={userProfile} onUpdateProfile={setUserProfile} />}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'analysis' && styles.activeTabItem]}
          onPress={() => setActiveTab('analysis')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>🔍</Text>
          <Text style={[styles.tabLabel, activeTab === 'analysis' && styles.activeTabLabel]}>
            Analysis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'dashboard' && styles.activeTabItem]}
          onPress={() => setActiveTab('dashboard')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>📊</Text>
          <Text style={[styles.tabLabel, activeTab === 'dashboard' && styles.activeTabLabel]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'shopping' && styles.activeTabItem]}
          onPress={() => setActiveTab('shopping')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>🛒</Text>
          <Text style={[styles.tabLabel, activeTab === 'shopping' && styles.activeTabLabel]}>
            Assistant
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'learning' && styles.activeTabItem]}
          onPress={() => setActiveTab('learning')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>🎓</Text>
          <Text style={[styles.tabLabel, activeTab === 'learning' && styles.activeTabLabel]}>
            Learning
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'profile' && styles.activeTabItem]}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.activeTabLabel]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  appName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  appTagline: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  profileQuickBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
    paddingBottom: 10,
  },
  tabItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeTabItem: {
    backgroundColor: '#EFF6FF',
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#2563EB',
    fontWeight: '800',
  },
});
