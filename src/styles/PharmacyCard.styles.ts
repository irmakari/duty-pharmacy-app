import { StyleSheet } from 'react-native';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  badgeGreen: {
    backgroundColor: COLORS.primaryLight,
  },
  badgeAmber: {
    backgroundColor: COLORS.warningLight,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    letterSpacing: 0.3,
  },
  distanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  distanceText: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: '#334155',
  },
  favButton: {
    padding: 2,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pharmacyName: {
    fontFamily: FONTS.bold,
    fontSize: 17,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  districtChip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  districtChipText: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: 8,
  },
  addressText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  hoursText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.primary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtnCall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  actionBtnCallText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  actionBtnMap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    gap: 6,
  },
  actionBtnMapText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.primaryDark,
  },
  detailArrowContainer: {
    marginLeft: 'auto',
  },
});
