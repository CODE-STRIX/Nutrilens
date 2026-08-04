import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CommunitySubmission } from '../../../shared/types';

interface Props {
  submission: CommunitySubmission;
  currentUserId: string;
  onVerify: (submissionId: string) => void;
}

export const CommunitySubmissionCard: React.FC<Props> = ({ submission, currentUserId, onVerify }) => {
  const isVerified = submission.verificationStatus === 'verified';
  const hasUserVerified = submission.verifiedByUsers.includes(currentUserId);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        {submission.labelImageUrl ? (
          <Image source={{ uri: submission.labelImageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholderImg}>
            <Text style={styles.placeholderText}>📷 Label Photo</Text>
          </View>
        )}

        <View style={styles.infoCol}>
          <View style={styles.statusBadgeRow}>
            <View
              style={[
                styles.statusBadge,
                isVerified ? styles.verifiedBadge : styles.pendingBadge,
              ]}
            >
              <Text style={[styles.statusText, isVerified ? styles.verifiedText : styles.pendingText]}>
                {isVerified ? '✓ Verified Product' : '⏳ Pending Multi-User Verification'}
              </Text>
            </View>
          </View>

          <Text style={styles.productName}>{submission.productName}</Text>
          <Text style={styles.brandText}>Brand / Producer: {submission.brand}</Text>
          {submission.region && <Text style={styles.regionText}>📍 Region: {submission.region}</Text>}
        </View>
      </View>

      {/* Verification Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Community Verification Progress:</Text>
          <Text style={styles.progressVal}>
            {submission.verificationCount} / {submission.requiredVerifications} Users Confirmed
          </Text>
        </View>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(100, (submission.verificationCount / submission.requiredVerifications) * 100)}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Extracted Ingredients */}
      <View style={styles.ingredientsBox}>
        <Text style={styles.ingLabel}>Extracted Label Ingredients:</Text>
        <Text style={styles.ingText}>{submission.ingredientText}</Text>
      </View>

      {/* Verification Action */}
      {!isVerified && (
        <TouchableOpacity
          style={[styles.verifyButton, hasUserVerified && styles.verifiedBtnDisabled]}
          onPress={() => !hasUserVerified && onVerify(submission.id)}
          disabled={hasUserVerified}
          activeOpacity={0.7}
        >
          <Text style={styles.verifyButtonText}>
            {hasUserVerified ? '✓ You Confirmed This Match' : '👍 Confirm Label Match & Verify (+1)'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    gap: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  placeholderImg: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    textAlign: 'center',
  },
  infoCol: {
    flex: 1,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedBadge: {
    backgroundColor: '#DCFCE7',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  verifiedText: {
    color: '#15803D',
  },
  pendingText: {
    color: '#B45309',
  },
  productName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  brandText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  regionText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  progressVal: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  ingredientsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  ingLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  ingText: {
    fontSize: 12,
    color: '#334155',
    marginTop: 2,
    lineHeight: 16,
  },
  verifyButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  verifiedBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
