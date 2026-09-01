export const theme = {
  colors: {
    // Primary Brand - Emerald & Dark Slate
    primary: '#0D9488', // Teal 600
    primaryDark: '#0F766E', // Teal 700
    primaryLight: '#CCFBF1', // Teal 100
    primaryBg: '#F0FDF4',

    // Secondary Accent - Indigo / Blue
    accent: '#4F46E5', // Indigo 600
    accentLight: '#EEF2FF',
    accentDark: '#3730A3',

    // Dark Headers & Text
    dark: '#0F172A', // Slate 900
    textPrimary: '#1E293B', // Slate 800
    textSecondary: '#64748B', // Slate 500
    textMuted: '#94A3B8', // Slate 400

    // Neutral Surfaces & Borders
    bg: '#F8FAFC', // Slate 50
    cardBg: '#FFFFFF',
    border: '#E2E8F0', // Slate 200
    borderLight: '#F1F5F9',

    // Health Risk & Status Palette
    safe: '#16A34A', // Green 600
    safeBg: '#DCFCE7',
    moderate: '#D97706', // Amber 600
    moderateBg: '#FEF3C7',
    highRisk: '#EA580C', // Orange 600
    highRiskBg: '#FFEDD5',
    critical: '#DC2626', // Red 600
    criticalBg: '#FEE2E2',

    // Overlay & Glass
    overlay: 'rgba(15, 23, 42, 0.6)',
    glass: 'rgba(255, 255, 255, 0.9)',
  },
  shadows: {
    sm: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  radii: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
};
