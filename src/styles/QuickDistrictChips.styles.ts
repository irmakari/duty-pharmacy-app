import { StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export const styles = StyleSheet.create({
  quickChipsContainer: {
    marginBottom: 14,
  },
  quickChipsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  quickChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  quickChipText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  quickChipTextActive: {
    color: '#FFFFFF',
    fontFamily: FONTS.semiBold,
  },
});
