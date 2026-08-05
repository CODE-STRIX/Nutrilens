import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Product, UserProfile } from '../shared/types';

// Person C Screens
import { CommunitySubmissionScreen } from './src/screens/CommunitySubmissionScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { RecallAlertScreen } from './src/screens/RecallAlertScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { PERSON_C_MOCK_PRODUCTS } from './src/services/scannerService';

// Person D Screens
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LearningScreen } from './src/screens/LearningScreen';
import { PersonalizedAnalysisScreen } from './src/screens/PersonalizedAnalysisScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SmartShoppingScreen } from './src/screens/SmartShoppingScreen';

// Mock Profile
import { SAMPLE_USER_PROFILE } from './src/services/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'scan' | 'detail' | 'analysis' | 'recalls' | 'community' | 'dashboard' | 'shopping' | 'learning' | 'profile'
  >('scan');

  const [selectedProduct, setSelectedProduct] = useState<Product>(PERSON_C_MOCK_PRODUCTS.p_maggi);
  const [userProfile, setUserProfile] = useState<UserProfile>(SAMPLE_USER_PROFILE);
  const [initialOcrText, setInitialOcrText] = useState<string | undefined>(undefined);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('detail');
  };

  const handleOpenCommunitySubmission = (ocrText?: string) => {
    setInitialOcrText(ocrText);
    setActiveTab('community');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top App Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.appName}>Nutri Lens</Text>
          <Text style={styles.appTagline}>Food Label & Ingredient Intelligence Platform</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.profileBadge} onPress={() => setActiveTab('profile')}>
            <Text style={styles.profileInitial}>{userProfile.name[0]}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Secondary Quick Navigation Bar for Full SIH Demo Access */}
      <View style={styles.quickNavScroll}>
        <ScrollViewHorizontal>
          <TouchableOpacity
            style={[styles.quickNavChip, activeTab === 'scan' && styles.activeQuickNav]}
            onPress={() => setActiveTab('scan')}
          >
            <Text style={[styles.quickNavText, activeTab === 'scan' && styles.activeQuickNavText]}>📷 Scanner (F1)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickNavChip, activeTab === 'detail' && styles.activeQuickNav]}
            onPress={() => setActiveTab('detail')}
          >
            <Text style={[styles.quickNavText, activeTab === 'detail' && styles.activeQuickNavText]}>🧪 Ingredient Intel (F2,3)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickNavChip, activeTab === 'recalls' && styles.activeQuickNav]}
            onPress={() => setActiveTab('recalls')}
          >
            <Text style={[styles.quickNavText, activeTab === 'recalls' && styles.activeQuickNavText]}>⚠️ Recalls (F11)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickNavChip, activeTab === 'community' && styles.activeQuickNav]}
            onPress={() => setActiveTab('community')}
          >
            <Text style={[styles.quickNavText, activeTab === 'community' && styles.activeQuickNavText]}>🤝 Community (F12)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickNavChip, activeTab === 'analysis' && styles.activeQuickNav]}
            onPress={() => setActiveTab('analysis')}
          >
            <Text style={[styles.quickNavText, activeTab === 'analysis' && styles.activeQuickNavText]}>🛡️ Health Flags (F4,5)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickNavChip, activeTab === 'dashboard' && styles.activeQuickNav]}
            onPress={() => setActiveTab('dashboard')}
          >
            <Text style={[styles.quickNavText, activeTab === 'dashboard' && styles.activeQuickNavText]}>📊 Trends (F6,7)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickNavChip, activeTab === 'shopping' && styles.activeQuickNav]}
            onPress={() => setActiveTab('shopping')}
          >
            <Text style={[styles.quickNavText, activeTab === 'shopping' && styles.activeQuickNavText]}>🛒 Assistant (F8,9)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickNavChip, activeTab === 'learning' && styles.activeQuickNav]}
            onPress={() => setActiveTab('learning')}
          >
            <Text style={[styles.quickNavText, activeTab === 'learning' && styles.activeQuickNavText]}>🎓 Learning (F10)</Text>
          </TouchableOpacity>
        </ScrollViewHorizontal>
      </View>

      {/* Screen Container */}
      <View style={styles.screenContainer}>
        {activeTab === 'scan' && (
          <ScannerScreen
            onSelectProduct={handleSelectProduct}
            onOpenCommunitySubmission={handleOpenCommunitySubmission}
          />
        )}
        {activeTab === 'detail' && <ProductDetailScreen product={selectedProduct} />}
        {activeTab === 'recalls' && <RecallAlertScreen />}
        {activeTab === 'community' && <CommunitySubmissionScreen initialOcrText={initialOcrText} />}
        {activeTab === 'analysis' && <PersonalizedAnalysisScreen userProfile={userProfile} />}
        {activeTab === 'dashboard' && <DashboardScreen />}
        {activeTab === 'shopping' && <SmartShoppingScreen />}
        {activeTab === 'learning' && <LearningScreen />}
        {activeTab === 'profile' && <ProfileScreen userProfile={userProfile} onUpdateProfile={setUserProfile} />}
      </View>

      {/* Bottom Main Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'scan' && styles.activeTabItem]}
          onPress={() => setActiveTab('scan')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>📷</Text>
          <Text style={[styles.tabLabel, activeTab === 'scan' && styles.activeTabLabel]}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'detail' && styles.activeTabItem]}
          onPress={() => setActiveTab('detail')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>🧪</Text>
          <Text style={[styles.tabLabel, activeTab === 'detail' && styles.activeTabLabel]}>Intel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'recalls' && styles.activeTabItem]}
          onPress={() => setActiveTab('recalls')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>⚠️</Text>
          <Text style={[styles.tabLabel, activeTab === 'recalls' && styles.activeTabLabel]}>Recalls</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'community' && styles.activeTabItem]}
          onPress={() => setActiveTab('community')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>🤝</Text>
          <Text style={[styles.tabLabel, activeTab === 'community' && styles.activeTabLabel]}>Community</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'profile' && styles.activeTabItem]}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
        >
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.activeTabLabel]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Simple horizontal scroll helper for quick SIH feature switching
const ScrollViewHorizontal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View style={{ flexDirection: 'row', gap: 6 }}>{children}</View>
);

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
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  quickNavScroll: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  quickNavChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  activeQuickNav: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  quickNavText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  activeQuickNavText: {
    color: '#FFFFFF',
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
    paddingVertical: 6,
    paddingBottom: 8,
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
