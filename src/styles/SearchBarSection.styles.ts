import { StyleSheet, Platform } from 'react-native';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';

export const styles = StyleSheet.create({
  searchBarSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 6,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textPrimary,
    height: '100%',
  },
  clearSearchBtn: {
    padding: 4,
  },
  cityFilterButton: {
    height: 48,
    paddingHorizontal: 12,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    maxWidth: 145,
    ...SHADOWS.soft,
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
    } : {}),
  },
  cityFilterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  cityFilterButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.primaryDark,
  },
  cityFilterButtonTextActive: {
    color: '#FFFFFF',
  },
});
