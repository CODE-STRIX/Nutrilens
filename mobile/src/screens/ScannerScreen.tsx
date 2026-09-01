import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Product } from '../../../shared/types';
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

  const handleBarcodeScan = (code: string) => {
    const product = ScannerService.scanBarcode(code);
    if (product) {
      setScanMessage(`✓ Found product: ${product.name}`);
      onSelectProduct(product);
    } else {
      setScanMessage(`⚠️ No barcode match found for "${code}". Try OCR Label Scan.`);
    }
  };

  // Model 1+2: ML-powered OCR parse → entity normalization
  const handleOcrProcess = async () => {
    if (!rawOcrText.trim()) return;

    // First try ML NLP entity parse for richer INS additive detection
    setMlLoading(true);
    try {
      const mlResult = await MlService.parseOcrLabelText(rawOcrText);
      setMlOcrResult(mlResult);
    } finally {
      setMlLoading(false);
    }

    // Also attempt barcode DB match
    const result = ScannerService.processOcrText(rawOcrText);
    if (result.matchedProduct) {
      setScanMessage(`✓ Matched via Label OCR: ${result.matchedProduct.name}`);
      onSelectProduct(result.matchedProduct);
    } else {
      setScanMessage(`⚠️ Unlisted regional product — ${rawOcrText.split(',').length} ingredients extracted by ML. Submit to community?`);
      onOpenCommunitySubmission(rawOcrText);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📷 Smart Food Scanner</Text>
        <Text style={styles.subtitle}>
          Barcode-first recognition with ML Kit label OCR fallback for unlisted regional snacks
        </Text>
      </View>

      {/* Mode Selector */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeBtn, mode === 'barcode' && styles.activeModeBtn]}
          onPress={() => setMode('barcode')}
          activeOpacity={0.7}
        >
          <Text style={[styles.modeText, mode === 'barcode' && styles.activeModeText]}>
            📱 Barcode Mode
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeBtn, mode === 'ocr' && styles.activeModeBtn]}
          onPress={() => setMode('ocr')}
          activeOpacity={0.7}
        >
          <Text style={[styles.modeText, mode === 'ocr' && styles.activeModeText]}>
            🔍 Label OCR Mode
          </Text>
        </TouchableOpacity>
      </View>

      {/* Simulated Camera Viewfinder Frame */}
      <View style={styles.viewfinder}>
        <View style={styles.cameraOverlay}>
          <Text style={styles.viewfinderIcon}>{mode === 'barcode' ? '║█║▌║█║▌' : '📜'}</Text>
          <Text style={styles.viewfinderText}>
            {mode === 'barcode'
              ? 'Position barcode inside viewfinder frame'
              : 'Point camera at printed ingredient list'}
          </Text>
          <View style={styles.laserLine} />
        </View>
      </View>

      {/* Scan Status Toast */}
      {scanMessage && (
        <View style={styles.statusToast}>
          <Text style={styles.statusToastText}>{scanMessage}</Text>
        </View>
      )}

      {/* Barcode Mode Controls */}
      {mode === 'barcode' ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tap Sample Barcodes to Test:</Text>
          <View style={styles.sampleGrid}>
            <TouchableOpacity
              style={styles.sampleCard}
              onPress={() => handleBarcodeScan('8901058000053')}
            >
              <Text style={styles.sampleName}>🍜 Maggi Masala Noodles</Text>
              <Text style={styles.sampleCode}>8901058000053</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sampleCard}
              onPress={() => handleBarcodeScan('8906070001122')}
            >
              <Text style={styles.sampleName}>🥣 True Elements Muesli</Text>
              <Text style={styles.sampleCode}>8906070001122</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sampleCard}
              onPress={() => handleBarcodeScan('8904000112233')}
            >
              <Text style={styles.sampleName}>🌶️ Haldiram Bhujia Sev</Text>
              <Text style={styles.sampleCode}>8904000112233</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sampleCard}
              onPress={() => handleBarcodeScan('8908000554433')}
            >
              <Text style={styles.sampleName}>🥟 Ratlami Sev (Regional)</Text>
              <Text style={styles.sampleCode}>8908000554433</Text>
            </TouchableOpacity>
          </View>

          {/* Manual Input */}
          <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Or Enter Barcode Manually:</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="e.g. 8901058000053"
              value={manualBarcode}
              onChangeText={setManualBarcode}
              keyboardType="number-pad"
            />
            <TouchableOpacity
              style={styles.scanBtn}
              onPress={() => handleBarcodeScan(manualBarcode)}
            >
              <Text style={styles.scanBtnText}>Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* OCR Mode Controls */
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Simulated On-Device ML Kit OCR Text Input:</Text>
          <TextInput
            style={styles.ocrInput}
            placeholder="Paste printed ingredient list text (e.g. Refined Wheat Flour, Palm Oil, Salt, Preservative INS 211, Flavor Enhancer INS 635)..."
            value={rawOcrText}
            onChangeText={setRawOcrText}
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity style={styles.ocrProcessBtn} onPress={handleOcrProcess}>
            <Text style={styles.ocrProcessText}>🔍 Parse Label Text via ML Kit OCR</Text>
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
  modeRow: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeModeBtn: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  activeModeText: {
    color: '#2563EB',
    fontWeight: '800',
  },
  viewfinder: {
    height: 180,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  viewfinderIcon: {
    fontSize: 32,
    color: '#38BDF8',
    marginBottom: 8,
  },
  viewfinderText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
  },
  laserLine: {
    width: '80%',
    height: 2,
    backgroundColor: '#EF4444',
    marginTop: 16,
  },
  statusToast: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  statusToastText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
  },
  sampleGrid: {
    gap: 8,
  },
  sampleCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sampleName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  sampleCode: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  scanBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  ocrInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    textAlignVertical: 'top',
    height: 100,
    marginBottom: 10,
  },
  ocrProcessBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ocrProcessText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
