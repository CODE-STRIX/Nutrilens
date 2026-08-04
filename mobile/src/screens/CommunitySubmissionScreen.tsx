import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CommunitySubmission } from '../../../shared/types';
import { CommunitySubmissionCard } from '../components/CommunitySubmissionCard';
import { CommunityService } from '../services/communityService';

interface Props {
  initialOcrText?: string;
}

export const CommunitySubmissionScreen: React.FC<Props> = ({ initialOcrText }) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'submit'>('queue');
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>(
    CommunityService.getSubmissions()
  );

  // Form State
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Regional Unbranded Snack');
  const [region, setRegion] = useState('');
  const [ingredientText, setIngredientText] = useState(initialOcrText || '');

  const handleVerify = (submissionId: string) => {
    const updated = CommunityService.verifySubmission(submissionId, 'user_001', true);
    if (updated) {
      setSubmissions([...CommunityService.getSubmissions()]);
      Alert.alert('Verification Recorded', 'Thank you! Your confirmation brings this product closer to trusted status.');
    }
  };

  const handleSubmitNewProduct = () => {
    if (!productName.trim() || !ingredientText.trim()) {
      Alert.alert('Missing Fields', 'Please provide at least the Product Name and Ingredient Text.');
      return;
    }

    const extracted = ingredientText.split(/[,;\n]/).map((i) => i.trim()).filter((i) => i.length > 2);

    CommunityService.submitProduct({
      submitterId: 'user_001',
      productName: productName.trim(),
      brand: brand.trim() || 'Local Artisan / Unbranded',
      category: category.trim(),
      region: region.trim() || 'Local Market',
      ingredientText: ingredientText.trim(),
      extractedIngredients: extracted,
      labelImageUrl: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400',
    });

    setSubmissions([...CommunityService.getSubmissions()]);
    setProductName('');
    setBrand('');
    setIngredientText('');
    setRegion('');
    setActiveTab('queue');
    Alert.alert('Submission Received!', 'Your product has been added to the community verification queue.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🤝 Community-Verified Products</Text>
        <Text style={styles.subtitle}>
          Crowdsourced nutrition database for India’s regional and unbranded local snacks
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'queue' && styles.activeTabBtn]}
          onPress={() => setActiveTab('queue')}
        >
          <Text style={[styles.tabText, activeTab === 'queue' && styles.activeTabText]}>
            📋 Verification Queue ({submissions.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'submit' && styles.activeTabBtn]}
          onPress={() => setActiveTab('submit')}
        >
          <Text style={[styles.tabText, activeTab === 'submit' && styles.activeTabText]}>
            📷 Submit New Product
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: Queue */}
      {activeTab === 'queue' && (
        <View style={styles.queueSection}>
          {submissions.map((sub) => (
            <CommunitySubmissionCard
              key={sub.id}
              submission={sub}
              currentUserId="user_001"
              onVerify={handleVerify}
            />
          ))}
        </View>
      )}

      {/* Tab 2: Submission Form */}
      {activeTab === 'submit' && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Submit Unlisted Regional Snack</Text>
          <Text style={styles.formSub}>
            Take a photo of the package label or type extracted ingredients. Submissions become verified once 3 independent users confirm the match.
          </Text>

          {/* Photo Capture Placeholder */}
          <TouchableOpacity style={styles.photoPicker}>
            <Text style={styles.photoPickerIcon}>📸</Text>
            <Text style={styles.photoPickerText}>Take Label Photo / Upload Image</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Product Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Surti Locho, Ratlami Sev, Mathura Peda"
            value={productName}
            onChangeText={setProductName}
          />

          <Text style={styles.label}>Brand / Local Producer</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Gokul Namkeen / Unbranded Kirana"
            value={brand}
            onChangeText={setBrand}
          />

          <Text style={styles.label}>Region / City</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Gujarat (Surat), MP (Ratlam)"
            value={region}
            onChangeText={setRegion}
          />

          <Text style={styles.label}>Printed Ingredient Text *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Type or paste printed ingredient label text..."
            value={ingredientText}
            onChangeText={setIngredientText}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitNewProduct}>
            <Text style={styles.submitBtnText}>🚀 Submit to Verification Queue</Text>
          </TouchableOpacity>
        </View>
      )}
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
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTabBtn: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  activeTabText: {
    color: '#2563EB',
    fontWeight: '800',
  },
  queueSection: {
    gap: 12,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  formSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
    lineHeight: 16,
  },
  photoPicker: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  photoPickerIcon: {
    fontSize: 28,
  },
  photoPickerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    height: 90,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
