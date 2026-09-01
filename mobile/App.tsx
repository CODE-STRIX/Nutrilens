import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { Product, UserProfile } from '../shared/types';
import { theme } from './src/theme/colors';

// Icons
import { NutriIcon } from './src/components/NutriIcon';

// Screens
import { CommunitySubmissionScreen } from './src/screens/CommunitySubmissionScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { RecallAlertScreen } from './src/screens/RecallAlertScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { PERSON_C_MOCK_PRODUCTS } from './src/services/scannerService';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LearningScreen } from './src/screens/LearningScreen';
import { PersonalizedAnalysisScreen } from './src/screens/PersonalizedAnalysisScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SmartShoppingScreen } from './src/screens/SmartShoppingScreen';

// Mock Profile
import { SAMPLE_USER_PROFILE } from './src/services/mockData';

type CoreTab = 'scan' | 'intel' | 'health' | 'trends' | 'profile';
type SubFeature = 'recalls' | 'shopping' | 'community' | 'learning' | null;

export default function App() {
  const [activeTab, setActiveTab] = useState<CoreTab>('scan');
  const [subFeature, setSubFeature] = useState<SubFeature>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product>(PERSON_C_MOCK_PRODUCTS.p_maggi);
  const [userProfile, setUserProfile] = useState<UserProfile>(SAMPLE_USER_PROFILE);
  const [initialOcrText, setInitialOcrText] = useState<string | undefined>(undefined);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSubFeature(null);
    setActiveTab('intel');
  };

  const handleOpenCommunitySubmission = (ocrText?: string) => {
    setInitialOcrText(ocrText);
    setSubFeature('community');
  };

  const getScreenTitle = () => {
    if (subFeature === 'recalls') return 'FSSAI Safety Recalls';
    if (subFeature === 'shopping') return 'Smart Assistant';
    if (subFeature === 'community') return 'Community Verified';
    if (subFeature === 'learning') return 'Food Literacy';

    switch (activeTab) {
      case 'scan': return 'Food Label Scanner';
      case 'intel': return 'Ingredient Intel';
      case 'health': return 'Personalized Health';
      case 'trends': return 'Nutrition Dashboard';
      case 'profile': return 'Health Profile';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0F172A"
        translucent={false}
      />

      {/* Modern Compact Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBadge}>
            <NutriIcon name="leaf" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.titleWrapper}>
            <Text style={styles.appName}>NutriLens</Text>
            <Text style={styles.screenTitle}>{getScreenTitle()}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={() => setShowMoreMenu(true)}
            activeOpacity={0.8}
          >
            <NutriIcon name="flavour" size={14} color="#10B981" />
            <Text style={styles.moreBtnText}> More</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileBadge}
            onPress={() => {
              setSubFeature(null);
              setActiveTab('profile');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.profileInitial}>{userProfile.name[0]}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Screen Body */}
      <View style={styles.screenContainer}>
        {subFeature === 'recalls' && <RecallAlertScreen />}
        {subFeature === 'shopping' && <SmartShoppingScreen />}
        {subFeature === 'community' && <CommunitySubmissionScreen initialOcrText={initialOcrText} />}
        {subFeature === 'learning' && <LearningScreen />}

        {!subFeature && activeTab === 'scan' && (
          <ScannerScreen
            onSelectProduct={handleSelectProduct}
            onOpenCommunitySubmission={handleOpenCommunitySubmission}
          />
        )}
        {!subFeature && activeTab === 'intel' && <ProductDetailScreen product={selectedProduct} />}
        {!subFeature && activeTab === 'health' && <PersonalizedAnalysisScreen userProfile={userProfile} />}
        {!subFeature && activeTab === 'trends' && <DashboardScreen />}
        {!subFeature && activeTab === 'profile' && (
          <ProfileScreen userProfile={userProfile} onUpdateProfile={setUserProfile} />
        )}
      </View>

      {/* Sleek Bottom Navigation Bar with SVG NutriIcons */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'scan' && !subFeature && styles.activeTabItem]}
          onPress={() => { setSubFeature(null); setActiveTab('scan'); }}
          activeOpacity={0.7}
        >
          <NutriIcon
            name="scan"
            size={20}
            color={activeTab === 'scan' && !subFeature ? '#0F766E' : '#64748B'}
          />
          <Text style={[styles.tabLabel, activeTab === 'scan' && !subFeature && styles.activeTabLabel]}>
            Scan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'intel' && !subFeature && styles.activeTabItem]}
          onPress={() => { setSubFeature(null); setActiveTab('intel'); }}
          activeOpacity={0.7}
        >
          <NutriIcon
            name="flask"
            size={20}
            color={activeTab === 'intel' && !subFeature ? '#0F766E' : '#64748B'}
          />
          <Text style={[styles.tabLabel, activeTab === 'intel' && !subFeature && styles.activeTabLabel]}>
            Intel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'health' && !subFeature && styles.activeTabItem]}
          onPress={() => { setSubFeature(null); setActiveTab('health'); }}
          activeOpacity={0.7}
        >
          <NutriIcon
            name="shield"
            size={20}
            color={activeTab === 'health' && !subFeature ? '#0F766E' : '#64748B'}
          />
          <Text style={[styles.tabLabel, activeTab === 'health' && !subFeature && styles.activeTabLabel]}>
            Health
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'trends' && !subFeature && styles.activeTabItem]}
          onPress={() => { setSubFeature(null); setActiveTab('trends'); }}
          activeOpacity={0.7}
        >
          <NutriIcon
            name="trends"
            size={20}
            color={activeTab === 'trends' && !subFeature ? '#0F766E' : '#64748B'}
          />
          <Text style={[styles.tabLabel, activeTab === 'trends' && !subFeature && styles.activeTabLabel]}>
            Trends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'profile' && !subFeature && styles.activeTabItem]}
          onPress={() => { setSubFeature(null); setActiveTab('profile'); }}
          activeOpacity={0.7}
        >
          <NutriIcon
            name="profile"
            size={20}
            color={activeTab === 'profile' && !subFeature ? '#0F766E' : '#64748B'}
          />
          <Text style={[styles.tabLabel, activeTab === 'profile' && !subFeature && styles.activeTabLabel]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* Feature Explorer Modal */}
      <Modal
        visible={showMoreMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMoreMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMoreMenu(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <NutriIcon name="flavour" size={18} color="#0F172A" />
              <Text style={styles.modalTitle}> Extra Modules & Features</Text>
            </View>
            <Text style={styles.modalSubtitle}>Access specialized food safety tools</Text>

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                setSubFeature('recalls');
                setShowMoreMenu(false);
              }}
            >
              <View style={styles.menuIconBox}>
                <NutriIcon name="recall" size={22} color="#EF4444" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>FSSAI Recall Warnings</Text>
                <Text style={styles.menuSub}>Retroactive product recall alerts in India</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                setSubFeature('shopping');
                setShowMoreMenu(false);
              }}
            >
              <View style={styles.menuIconBox}>
                <NutriIcon name="shop" size={22} color="#0D9488" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>Smart Shopping Assistant</Text>
                <Text style={styles.menuSub}>Side-by-side product comparison & healthy swaps</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                setSubFeature('community');
                setShowMoreMenu(false);
              }}
            >
              <View style={styles.menuIconBox}>
                <NutriIcon name="community" size={22} color="#4F46E5" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>Community Verified Foods</Text>
                <Text style={styles.menuSub}>Crowdsourced database for regional snacks</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuRow}
              onPress={() => {
                setSubFeature('learning');
                setShowMoreMenu(false);
              }}
            >
              <View style={styles.menuIconBox}>
                <NutriIcon name="book" size={22} color="#F59E0B" />
              </View>
              <View style={styles.menuTextCol}>
                <Text style={styles.menuTitle}>Food Literacy Lessons</Text>
                <Text style={styles.menuSub}>Bite-sized guide to INS additives & packaging</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowMoreMenu(false)}
            >
              <Text style={styles.closeBtnText}>Close Menu</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrapper: {
    flex: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  screenTitle: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  moreBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreBtnText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '800',
  },
  profileBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 16,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  tabItem: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
  },
  activeTabItem: {
    backgroundColor: '#CCFBF1',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 3,
  },
  activeTabLabel: {
    color: '#0F766E',
    fontWeight: '900',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextCol: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  menuSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
