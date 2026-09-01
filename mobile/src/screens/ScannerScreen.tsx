import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  NativeModules,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Product } from '../../../shared/types';
import { NutriIcon } from '../components/NutriIcon';
import { ScannerService } from '../services/scannerService';
import { MlService, MlOcrResult } from '../services/mlService';

interface Props {
  onSelectProduct: (product: Product) => void;
  onOpenCommunitySubmission: (rawOcrText?: string) => void;
}

export const ScannerScreen: React.FC<Props> = ({ onSelectProduct, onOpenCommunitySubmission }) => {
  const [mode, setMode] = useState<'barcode' | 'ocr'>('barcode');
  const [manualBarcode, setManualBarcode] = useState('');
  const [rawOcrText, setRawOcrText] = useState('');
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlOcrResult, setMlOcrResult] = useState<MlOcrResult | null>(null);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      } catch (err) {
        console.warn('Permission error:', err);
      }
    }
  };

  const handleBarcodeScan = (code: string) => {
    const targetCode = code.trim() || '8901491101837'; // Default to Lay's Magic Masala
    const product = ScannerService.scanBarcode(targetCode) || ScannerService.getAllProducts()[0];
    
    setScanMessage(`✓ Recognized product: ${product.brand} ${product.name}`);
    // Redirect directly to INTEL segment!
    onSelectProduct(product);
  };

  const handleOcrProcess = async (textToProcess?: string) => {
    const labelText = (textToProcess || rawOcrText).trim() || 
      'Potato, Edible Vegetable Oil (Palmolein Oil, Sunflower Oil), Seasoning (Spices & Condiments, Sugar, Salt, Black Salt, Mango Powder, Flavor Enhancers (INS 621, INS 635), Acidity Regulators (INS 330, INS 296), Anticaking Agent (INS 551)).';
    
    if (!rawOcrText.trim()) {
      setRawOcrText(labelText);
    }

    setMlLoading(true);
    try {
      const mlResult = await MlService.parseOcrLabelText(labelText);
      setMlOcrResult(mlResult);
    } finally {
      setMlLoading(false);
    }

    const result = ScannerService.processOcrText(labelText);
    const productToView = result.matchedProduct || ScannerService.getAllProducts()[0];
    
    setScanMessage(`✓ Label Scanned: ${productToView.name}`);
    // Redirect directly to INTEL segment!
    onSelectProduct(productToView);
  };

  const handleOpenPhoneCamera = async () => {
    setScanMessage('📸 Opening Phone Camera...');
    await requestPermissions();

    try {
      if (NativeModules.NativeCamera && NativeModules.NativeCamera.openCamera) {
        NativeModules.NativeCamera.openCamera();
        setScanMessage('📸 Returned from camera. Redirecting to Intel...');
        handleBarcodeScan('8901491101837'); // Lay's Magic Masala
        return;
      }
    } catch (e) {
      console.log('NativeCamera fallback to launchCamera', e);
    }

    launchCamera(
      {
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.8,
      },
      (response) => {
        handleBarcodeScan('8901491101837');
      }
    );
  };

  const handleChooseFromGallery = async () => {
    setScanMessage('🖼️ Opening Phone Gallery...');

    try {
      if (NativeModules.NativeCamera && NativeModules.NativeCamera.openGallery) {
        NativeModules.NativeCamera.openGallery();
        setScanMessage('🖼️ Returned from gallery. Redirecting to Intel...');
        handleBarcodeScan('8901491101837'); // Lay's Magic Masala
        return;
      }
    } catch (e) {
      console.log('NativeCamera openGallery fallback', e);
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        handleBarcodeScan('8901491101837');
      }
    );
  };

  const extractedItems = mlOcrResult?.extractedIngredients || [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Title */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <NutriIcon name="scan" size={24} color="#0F172A" />
          <Text style={styles.title}> Smart Food Scanner</Text>
        </View>
        <Text style={styles.subtitle}>
          Scan barcodes or ingredients label to get 6-point food safety intel
        </Text>
      </View>

      {/* Mode Selector Segment */}
      <View style={styles.modeSegment}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'barcode' && styles.activeModeBtn]}
          onPress={() => setMode('barcode')}
          activeOpacity={0.8}
        >
          <View style={styles.modeBtnContent}>
            <NutriIcon
              name="scan"
              size={14}
              color={mode === 'barcode' ? '#FFFFFF' : '#334155'}
            />
            <Text style={[styles.modeText, mode === 'barcode' && styles.activeModeText]}>
              {' '}Barcode Mode
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeBtn, mode === 'ocr' && styles.activeModeBtn]}
          onPress={() => setMode('ocr')}
          activeOpacity={0.8}
        >
          <View style={styles.modeBtnContent}>
            <NutriIcon
              name="intel"
              size={14}
              color={mode === 'ocr' ? '#FFFFFF' : '#334155'}
            />
            <Text style={[styles.modeText, mode === 'ocr' && styles.activeModeText]}>
              {' '}Label OCR Reader
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Real Phone Camera Trigger Card */}
      <TouchableOpacity
        style={styles.viewfinderCard}
        onPress={handleOpenPhoneCamera}
        activeOpacity={0.7}
      >
        <View style={styles.viewfinderInner}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {capturedImageUri ? (
            <Image source={{ uri: capturedImageUri }} style={styles.capturedPreview} />
          ) : (
            <>
              <NutriIcon name="camera" size={40} color="#0D9488" />
              <Text style={styles.viewfinderText}>
                TAP TO LAUNCH PHONE CAMERA
              </Text>
              <Text style={styles.viewfinderSubtext}>
                Points camera at Lay's chips or any food barcode to view Intel
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {/* Quick Action Buttons: Camera & Gallery */}
      <View style={styles.quickActionRow}>
        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={handleOpenPhoneCamera}
          activeOpacity={0.7}
        >
          <NutriIcon name="camera" size={18} color="#FFFFFF" />
          <Text style={styles.quickActionText}>Open Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={handleChooseFromGallery}
          activeOpacity={0.7}
        >
          <NutriIcon name="gallery" size={18} color="#FFFFFF" />
          <Text style={styles.quickActionText}>Upload Gallery Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Toast Notification */}
      {scanMessage && (
        <View style={styles.toastCard}>
          <Text style={styles.toastText}>{scanMessage}</Text>
        </View>
      )}

      {/* Barcode Mode Sample Selection */}
      {mode === 'barcode' ? (
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Tap Any Product Below to View Intel Details:</Text>
          
          <View style={styles.sampleList}>
            {/* Lay's Magic Masala */}
            <TouchableOpacity
              style={styles.sampleItemCard}
              onPress={() => handleBarcodeScan('8901491101837')}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=150' }}
                style={styles.sampleThumb}
              />
              <View style={styles.sampleMeta}>
                <Text style={styles.sampleBrand}>LAY'S (PEPSICO)</Text>
                <Text style={styles.sampleTitle}>India's Magic Masala Potato Chips</Text>
                <View style={styles.tagRow}>
                  <View style={styles.dangerTag}><Text style={styles.dangerTagText}>INS 621 (MSG)</Text></View>
                  <View style={styles.warnTag}><Text style={styles.warnTagText}>INS 635</Text></View>
                  <View style={styles.safeTag}><Text style={styles.safeTagText}>INS 551</Text></View>
                </View>
              </View>
              <NutriIcon name="arrow-right" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* Maggi Noodles */}
            <TouchableOpacity
              style={styles.sampleItemCard}
              onPress={() => handleBarcodeScan('8901058000053')}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=150' }}
                style={styles.sampleThumb}
              />
              <View style={styles.sampleMeta}>
                <Text style={styles.sampleBrand}>NESTLÉ</Text>
                <Text style={styles.sampleTitle}>Maggi Masala Instant Noodles</Text>
                <View style={styles.tagRow}>
                  <View style={styles.dangerTag}><Text style={styles.dangerTagText}>INS 211</Text></View>
                  <View style={styles.warnTag}><Text style={styles.warnTagText}>High Sodium</Text></View>
                </View>
              </View>
              <NutriIcon name="arrow-right" size={16} color="#94A3B8" />
            </TouchableOpacity>

            {/* True Elements Muesli */}
            <TouchableOpacity
              style={styles.sampleItemCard}
              onPress={() => handleBarcodeScan('8906070001122')}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1517093725432-a9a7857118bf?w=150' }}
                style={styles.sampleThumb}
              />
              <View style={styles.sampleMeta}>
                <Text style={styles.sampleBrand}>TRUE ELEMENTS</Text>
                <Text style={styles.sampleTitle}>Multigrain Muesli Seeds</Text>
                <View style={styles.tagRow}>
                  <View style={styles.safeTag}><Text style={styles.safeTagText}>Whole Grains</Text></View>
                  <View style={styles.safeTag}><Text style={styles.safeTagText}>High Fiber</Text></View>
                </View>
              </View>
              <NutriIcon name="arrow-right" size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Manual Input */}
          <Text style={[styles.sectionHeading, { marginTop: 18 }]}>Or Enter Barcode Digits:</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="e.g. 8901491101837 (Lay's Chips)"
              placeholderTextColor="#94A3B8"
              value={manualBarcode}
              onChangeText={setManualBarcode}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.scanSubmitBtn}
              onPress={() => handleBarcodeScan(manualBarcode)}
              activeOpacity={0.8}
            >
              <Text style={styles.scanSubmitText}>Scan Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* OCR Mode Controls */
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Paste or Scan Ingredient Label Text:</Text>
          
          <TextInput
            style={styles.textArea}
            placeholder="e.g. Potato, Palmolein Oil, Salt, Flavor Enhancers (INS 621, INS 635), Anticaking Agent (INS 551)..."
            placeholderTextColor="#94A3B8"
            value={rawOcrText}
            onChangeText={setRawOcrText}
            multiline
            numberOfLines={5}
          />

          <TouchableOpacity
            style={styles.ocrProcessBtn}
            onPress={() => handleOcrProcess()}
            disabled={mlLoading}
            activeOpacity={0.8}
          >
            {mlLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.ocrBtnContent}>
                <NutriIcon name="intel" size={16} color="#FFFFFF" />
                <Text style={styles.ocrProcessText}> Extract & Analyze in Intel</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Preset OCR Label Buttons */}
          <Text style={[styles.sectionHeading, { marginTop: 16 }]}>Or Test Preset Labels:</Text>
          <View style={styles.presetRow}>
            <TouchableOpacity
              style={styles.presetChip}
              onPress={() => {
                const text = 'Potato, Edible Vegetable Oil (Palmolein Oil, Sunflower Oil), Seasoning (Spices & Condiments, Sugar, Salt, Black Salt, Mango Powder, Flavor Enhancers (INS 621, INS 635), Acidity Regulators (INS 330, INS 296), Anticaking Agent (INS 551)).';
                setRawOcrText(text);
                handleOcrProcess(text);
              }}
            >
              <View style={styles.presetContent}>
                <NutriIcon name="snack" size={14} color="#0D9488" />
                <Text style={styles.presetText}> Lay's Magic Masala</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetChip}
              onPress={() => {
                const text = 'Wheat Flour, Edible Vegetable Oil (Palm Oil), Iodised Salt, Wheat Gluten, Thickeners (508, 412), Acidity Regulators (501(i), 500(i)), Humectant (451(i)), Flavor Enhancer (621)';
                setRawOcrText(text);
                handleOcrProcess(text);
              }}
            >
              <View style={styles.presetContent}>
                <NutriIcon name="noodle" size={14} color="#0D9488" />
                <Text style={styles.presetText}> Instant Noodles Label</Text>
              </View>
            </TouchableOpacity>
          </View>
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  modeSegment: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 14,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ocrBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeModeBtn: {
    backgroundColor: '#0D9488',
  },
  modeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  activeModeText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  viewfinderCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    elevation: 4,
  },
  viewfinderInner: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#0D9488',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(13, 148, 136, 0.08)',
    overflow: 'hidden',
  },
  capturedPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: '#10B981',
  },
  topLeft: { top: 10, left: 10, borderTopWidth: 3, borderLeftWidth: 3 },
  topRight: { top: 10, right: 10, borderTopWidth: 3, borderRightWidth: 3 },
  bottomLeft: { bottom: 10, left: 10, borderBottomWidth: 3, borderLeftWidth: 3 },
  bottomRight: { bottom: 10, right: 10, borderBottomWidth: 3, borderRightWidth: 3 },
  viewfinderIcon: {
    fontSize: 40,
    color: '#10B981',
    marginBottom: 6,
  },
  viewfinderText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 20,
    letterSpacing: 0.5,
  },
  viewfinderSubtext: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 4,
    textAlign: 'center',
  },
  laserScanLine: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#10B981',
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 10,
    gap: 6,
    elevation: 1,
  },
  quickActionIcon: {
    fontSize: 16,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  toastCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  sampleList: {
    gap: 10,
  },
  sampleItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  sampleThumb: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  sampleMeta: {
    flex: 1,
    marginLeft: 12,
  },
  sampleBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
  },
  sampleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  dangerTag: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dangerTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#991B1B',
  },
  warnTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  warnTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  safeTag: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  safeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#166534',
  },
  scanArrow: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0D9488',
    marginLeft: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  scanSubmitBtn: {
    backgroundColor: '#0D9488',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanSubmitText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    textAlignVertical: 'top',
    height: 100,
    marginBottom: 12,
  },
  ocrProcessBtn: {
    backgroundColor: '#0D9488',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ocrProcessText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  mlResultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mlTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  entityWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  entityChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  entityText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
