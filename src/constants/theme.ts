export const COLORS = {
  primary: '#059669',
  primaryDark: '#047857',
  primaryLight: '#ECFDF5',
  primaryBorder: '#A7F3D0',

  secondary: '#0284C7',
  secondaryLight: '#F0F9FF',

  warning: '#D97706',
  warningLight: '#FFFBEB',
  warningBorder: '#FDE68A',

  danger: '#EF4444',
  dangerLight: '#FEF2F2',

  background: '#F8FAFC',
  cardBg: '#FFFFFF',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textSubtle: '#94A3B8',

  border: '#E2E8F0',
  borderLight: '#F1F5F9',
} as const;

export const FONTS = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;
