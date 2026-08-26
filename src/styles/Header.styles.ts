import { StyleSheet, Platform } from 'react-native';
import { COLORS, FONTS } from '../constants/theme';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 14 : (Platform.OS === 'android' ? 16 : 8),
    paddingBottom: 10,
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    gap: 4,
  },
  cityPillText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.primaryDark,
  },
});
