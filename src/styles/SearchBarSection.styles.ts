import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';

export const styles = StyleSheet.create({
  searchBarSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 12,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textPrimary,
    height: '100%',
  },
  clearSearchBtn: {
    padding: 4,
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    ...SHADOWS.soft,
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterActiveDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
