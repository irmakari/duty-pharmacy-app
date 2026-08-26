import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Share,
  Platform,
  StyleSheet
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import MapViewWrapper from './MapViewWrapper';
import { Pharmacy } from '../types/pharmacy';
import { COLORS } from '../constants/theme';

interface PharmacyDetailViewProps {
  pharmacy: Pharmacy;
  isFav?: boolean;
  onToggleFavorite?: (id: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function PharmacyDetailView({
  pharmacy,
  isFav = false,
  onToggleFavorite,
  onBack,
  showBackButton = false,
}: PharmacyDetailViewProps) {
  // Parse coordinates ("40.9876,29.0234" -> lat, lng)
  const coords = useMemo(() => {
    if (pharmacy.loc && pharmacy.loc.includes(',')) {
      const [latStr, lngStr] = pharmacy.loc.split(',');
      const lat = parseFloat(latStr.trim());
      const lng = parseFloat(lngStr.trim());
      if (!isNaN(lat) && !isNaN(lng)) {
        return { latitude: lat, longitude: lng };
      }
    }
    // Default fallback (Kadıköy Istanbul)
    return { latitude: 40.9876, longitude: 29.0234 };
  }, [pharmacy.loc]);

  const handleFavPress = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (onToggleFavorite) {
      onToggleFavorite(pharmacy.id);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${pharmacy.name}\nAdres: ${pharmacy.address}\nTelefon: ${pharmacy.phone}\nNöbet Saatleri: ${pharmacy.dutyHours}`,
        title: pharmacy.name,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const handleCall = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`tel:${pharmacy.phone.replace(/\s+/g, '')}`);
  };

  const handleOpenMap = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const mapUrl = `https://maps.google.com/?q=${pharmacy.name}+${pharmacy.address}`;
    Linking.openURL(mapUrl);
  };

  const is24h = pharmacy.dutyType === '24saat';

  const isPhoneAvailable =
    !!pharmacy.phone &&
    pharmacy.phone.trim() !== '' &&
    !pharmacy.phone.toLowerCase().includes('belirtilmedi') &&
    pharmacy.phone !== '-' &&
    pharmacy.phone.toLowerCase() !== 'yok';

  return (
    <View style={styles.container}>
      {/* HEADER BAR */}
      {showBackButton ? (
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.headerBackBtn} onPress={onBack}>
            <Feather name="arrow-left" size={22} color="#1E293B" />
          </TouchableOpacity>

          <Text style={styles.headerTitle} numberOfLines={1}>
            Eczane Detayı
          </Text>

          <View style={styles.headerRightActions}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={handleShare}>
              <Feather name="share-2" size={19} color="#1E293B" />
            </TouchableOpacity>

            {Platform.OS !== 'web' && (
              <TouchableOpacity style={styles.headerIconBtn} onPress={handleFavPress}>
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isFav ? COLORS.danger : '#1E293B'}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.desktopHeaderBar}>
          <Text style={styles.desktopHeaderTitle}>Eczane Detayı</Text>
          <View style={styles.headerRightActions}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={handleShare}>
              <Feather name="share-2" size={19} color="#1E293B" />
            </TouchableOpacity>

            {Platform.OS !== 'web' && (
              <TouchableOpacity style={styles.headerIconBtn} onPress={handleFavPress}>
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isFav ? COLORS.danger : '#1E293B'}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="pill" size={32} color={COLORS.primary} />
          </View>

          <View
            style={[
              styles.badge,
              is24h ? styles.badgeGreen : styles.badgeAmber,
              { alignSelf: 'center', marginBottom: 12 },
            ]}
          >
            <View
              style={[
                styles.badgeDot,
                { backgroundColor: is24h ? COLORS.primary : COLORS.warning },
              ]}
            />
            <Text
              style={[
                styles.badgeText,
                { color: is24h ? COLORS.primaryDark : '#B45309' },
              ]}
            >
              {pharmacy.dutyTypeLabel}
            </Text>
          </View>

          <Text style={styles.title}>{pharmacy.name}</Text>

          <View style={styles.subtitleRow}>
            <Ionicons name="location-outline" size={15} color={COLORS.textMuted} />
            <Text style={styles.subtitleText}>
              {pharmacy.dist} / {pharmacy.city} • {pharmacy.distance} mesafede
            </Text>
          </View>
        </View>

        {/* ADRES VE KONUM KARTI */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBg}>
              <Feather name="map-pin" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Adres ve Konum</Text>
          </View>

          <Text style={styles.addressBody}>{pharmacy.address}</Text>

          {pharmacy.addressNote && (
            <View style={styles.addressNoteBox}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.secondary} />
              <Text style={styles.addressNoteText}>{pharmacy.addressNote}</Text>
            </View>
          )}

          {/* HARİTA GÖRÜNÜMÜ (ADRES KARTI İÇİNDE) */}
          <View style={{ marginBottom: 14 }}>
            <MapViewWrapper
              coords={coords}
              title={pharmacy.name}
              description={pharmacy.address}
              onOpenMap={handleOpenMap}
            />
          </View>

          <TouchableOpacity style={styles.primaryActionBtn} onPress={handleOpenMap}>
            <Feather name="navigation" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryActionBtnText}>Haritada Aç & Yol Tarifi Al</Text>
          </TouchableOpacity>
        </View>

        {/* TELEFON KARTI */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBg}>
              <Feather name="phone" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>İletişim Telefonu</Text>
          </View>

          <View style={styles.phoneDisplayRow}>
            <Text style={[
              styles.phoneNumberText,
              !isPhoneAvailable && { color: COLORS.textMuted, fontSize: 15, fontFamily: 'Poppins_400Regular' }
            ]}>
              {isPhoneAvailable ? pharmacy.phone : 'Telefon Bilgisi Bulunmuyor'}
            </Text>
          </View>

          {isPhoneAvailable && (
            <TouchableOpacity style={styles.callActionBtn} onPress={handleCall}>
              <Ionicons name="call" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.callActionBtnText}>Hemen Eczaneyi Ara</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ÇALIŞMA SAATLERİ VEYA NÖBET BİLGİSİ KARTI */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBg}>
              <Feather name="clock" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>
              {pharmacy.dutyType === 'sabit' ? 'Çalışma Saatleri' : 'Nöbet Bilgileri'}
            </Text>
          </View>

          {pharmacy.dutyType === 'sabit' ? (
            /* NORMAL ECZANELER İÇİN GÜN GÜN HAFTALIK ÇALIŞMA ÇİZELGESİ */
            <View style={styles.scheduleContainer}>
              {[
                { id: 1, name: 'Pazartesi', hours: '09:00 - 19:00', isClosed: false },
                { id: 2, name: 'Salı', hours: '09:00 - 19:00', isClosed: false },
                { id: 3, name: 'Çarşamba', hours: '09:00 - 19:00', isClosed: false },
                { id: 4, name: 'Perşembe', hours: '09:00 - 19:00', isClosed: false },
                { id: 5, name: 'Cuma', hours: '09:00 - 19:00', isClosed: false },
                { id: 6, name: 'Cumartesi', hours: '09:00 - 19:00', isClosed: false },
                { id: 0, name: 'Pazar', hours: 'Kapalı (Nöbetçiler Açık)', isClosed: true },
              ].map((day, index, arr) => {
                const todayDayIndex = new Date().getDay(); // 0 = Pazar, 1 = Pzt ... 6 = Cmt
                const isToday = day.id === todayDayIndex;
                const isLast = index === arr.length - 1;

                return (
                  <View
                    key={day.name}
                    style={[
                      styles.scheduleRow,
                      isLast && { borderBottomWidth: 0 },
                      isToday && styles.todayScheduleRow,
                    ]}
                  >
                    <View style={styles.dayCol}>
                      <Feather
                        name={isToday ? 'check-circle' : 'calendar'}
                        size={14}
                        color={isToday ? COLORS.primary : day.isClosed ? COLORS.textSubtle : '#64748B'}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        style={[
                          styles.dayText,
                          isToday && styles.todayDayText,
                          day.isClosed && !isToday && styles.dayTextMuted,
                        ]}
                      >
                        {day.name}
                      </Text>
                      {isToday && (
                        <View style={styles.todayBadge}>
                          <Text style={styles.todayBadgeText}>BUGÜN</Text>
                        </View>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.hoursTextBold,
                        isToday && styles.todayHoursText,
                        day.isClosed && !isToday && styles.closedText,
                      ]}
                    >
                      {day.hours}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            /* NÖBETÇİ ECZANELER İÇİN NÖBET BİLGİSİ */
            <View style={styles.scheduleContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nöbet Türü:</Text>
                <View style={styles.openNowTag}>
                  <Text style={styles.openNowTagText}>{pharmacy.dutyTypeLabel}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Nöbet Periyodu:</Text>
                <Text style={styles.infoValue}>{pharmacy.dutyHours}</Text>
              </View>

              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoLabel}>Hizmet Durumu:</Text>
                <View style={[styles.openNowTag, { backgroundColor: COLORS.primaryLight }]}>
                  <Text style={[styles.openNowTagText, { color: COLORS.primaryDark }]}>
                    ŞU AN AÇIK / NÖBETÇİ
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* ACİL DURUM UYARISI */}
        <View style={styles.emergencyWarningCard}>
          <Ionicons name="alert-circle-outline" size={22} color={COLORS.warning} />
          <Text style={styles.emergencyWarningText}>
            Acil tıbbi müdahale gerektiren hayati durumlarda zaman kaybetmeden 112 Acil Çağrı Merkezini arayınız.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  desktopHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  desktopHeaderTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerBackBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.03)',
    } : {}),
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeGreen: {
    backgroundColor: COLORS.primaryLight,
  },
  badgeAmber: {
    backgroundColor: '#FEF3C7',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subtitleText: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: COLORS.textMuted,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#1E293B',
  },
  addressBody: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#334155',
    lineHeight: 20,
    marginBottom: 12,
  },
  addressNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    gap: 8,
  },
  addressNoteText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#1D4ED8',
    flex: 1,
  },
  primaryActionBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  phoneDisplayRow: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  phoneNumberText: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  callActionBtn: {
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  callActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  scheduleContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  todayScheduleRow: {
    backgroundColor: '#F0FDF4',
    marginHorizontal: -10,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderBottomWidth: 0,
  },
  todayDayText: {
    fontFamily: 'Poppins_700Bold',
    color: COLORS.primaryDark,
  },
  todayHoursText: {
    fontFamily: 'Poppins_700Bold',
    color: COLORS.primaryDark,
  },
  todayBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  todayBadgeText: {
    fontSize: 9,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  dayCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#334155',
  },
  dayTextMuted: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: COLORS.textMuted,
  },
  hoursTextBold: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0F172A',
  },
  closedText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: COLORS.textMuted,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#64748B',
  },
  infoValue: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0F172A',
  },
  openNowTag: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  openNowTagText: {
    fontSize: 11,
    fontFamily: 'Poppins_700Bold',
    color: COLORS.primaryDark,
  },
  emergencyWarningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  emergencyWarningText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#92400E',
    flex: 1,
    lineHeight: 17,
  },
});
