import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking,
  Share,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Haptics from 'expo-haptics';
import { DetailScreenProps } from '../types/navigation';
import { COLORS } from '../constants/theme';
import { styles } from '../styles/DetailScreen.styles';

export default function DetailScreen({ route, navigation }: DetailScreenProps) {
  const { pharmacy, isFav: initialFav } = route.params;
  const [isFav, setIsFav] = useState<boolean>(initialFav || false);

  // Koordinat ayrıştırma ("40.9876,29.0234" -> lat, lng)
  const coords = useMemo(() => {
    if (pharmacy.loc && pharmacy.loc.includes(',')) {
      const [latStr, lngStr] = pharmacy.loc.split(',');
      const lat = parseFloat(latStr.trim());
      const lng = parseFloat(lngStr.trim());
      if (!isNaN(lat) && !isNaN(lng)) {
        return { latitude: lat, longitude: lng };
      }
    }
    // Varsayılan koordinatlar (Kadıköy Moda)
    return { latitude: 40.9876, longitude: 29.0234 };
  }, [pharmacy.loc]);

  const handleFavPress = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsFav(!isFav);
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

  return (
    <SafeAreaView style={styles.detailContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.detailHeader}>
        <TouchableOpacity
          style={styles.detailHeaderBack}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={22} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.detailHeaderTitle} numberOfLines={1}>
          Eczane Detayı
        </Text>

        <View style={styles.detailHeaderRightActions}>
          <TouchableOpacity style={styles.detailHeaderIconBtn} onPress={handleShare}>
            <Feather name="share-2" size={19} color="#1E293B" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.detailHeaderIconBtn} onPress={handleFavPress}>
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={22}
              color={isFav ? COLORS.danger : '#1E293B'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.detailScrollContent}
      >
        {/* HERO CARD */}
        <View style={styles.detailHeroCard}>
          <View style={styles.detailIconCircle}>
            <MaterialCommunityIcons name="pill" size={32} color={COLORS.primary} />
          </View>

          <View style={[
            styles.badge,
            is24h ? styles.badgeGreen : styles.badgeAmber,
            { alignSelf: 'center', marginBottom: 12 }
          ]}>
            <View style={[
              styles.badgeDot,
              { backgroundColor: is24h ? COLORS.primary : COLORS.warning }
            ]} />
            <Text style={[
              styles.badgeText,
              { color: is24h ? COLORS.primaryDark : '#B45309' }
            ]}>
              {pharmacy.dutyTypeLabel}
            </Text>
          </View>

          <Text style={styles.detailTitle}>{pharmacy.name}</Text>

          <View style={styles.detailSubtitleRow}>
            <Ionicons name="location-outline" size={15} color={COLORS.textMuted} />
            <Text style={styles.detailSubtitleText}>
              {pharmacy.dist} / {pharmacy.city} • {pharmacy.distance} mesafede
            </Text>
          </View>
        </View>

        {/* ADRES KARTI */}
        <View style={styles.detailSectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBg}>
              <Feather name="map-pin" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Adres ve Konum</Text>
          </View>

          <Text style={styles.detailAddressBody}>{pharmacy.address}</Text>

          {pharmacy.addressNote && (
            <View style={styles.addressNoteBox}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.secondary} />
              <Text style={styles.addressNoteText}>{pharmacy.addressNote}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.primaryActionBtn} onPress={handleOpenMap}>
            <Feather name="navigation" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryActionBtnText}>Haritada Aç & Yol Tarifi Al</Text>
          </TouchableOpacity>
        </View>

        {/* TELEFON KARTI */}
        <View style={styles.detailSectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBg}>
              <Feather name="phone" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>İletişim Telefonu</Text>
          </View>

          <View style={styles.phoneDisplayRow}>
            <Text style={styles.phoneNumberText}>{pharmacy.phone}</Text>
          </View>

          <TouchableOpacity style={styles.callActionBtn} onPress={handleCall}>
            <Ionicons name="call" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.callActionBtnText}>Hemen Eczaneyi Ara</Text>
          </TouchableOpacity>
        </View>

        {/* NÖBET BİLGİSİ KARTI */}
        <View style={styles.detailSectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBg}>
              <Feather name="clock" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Nöbet Bilgileri</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nöbet Periyodu:</Text>
            <Text style={styles.infoValue}>{pharmacy.dutyHours}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hizmet Durumu:</Text>
            <View style={styles.openNowTag}>
              <Text style={styles.openNowTagText}>ŞU AN AÇIK / NÖBETÇİ</Text>
            </View>
          </View>
        </View>

        {/* CANLI HARİTA GÖRÜNÜMÜ */}
        <View style={styles.detailSectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconBg}>
              <Feather name="map" size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Harita Görünümü</Text>
          </View>

          <View style={styles.mapContainer}>
            <MapView
              style={styles.mapView}
              initialRegion={{
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
              }}
              scrollEnabled={false}
              zoomEnabled={true}
            >
              <Marker
                coordinate={{ latitude: coords.latitude, longitude: coords.longitude }}
                title={pharmacy.name}
                description={pharmacy.address}
                pinColor={COLORS.primary}
              />
            </MapView>

            <TouchableOpacity
              style={styles.mapOverlayBtn}
              onPress={handleOpenMap}
              activeOpacity={0.85}
            >
              <Feather name="external-link" size={13} color="#FFFFFF" />
              <Text style={styles.mapOverlayBtnText}>Haritalar Uygulamasında Aç</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ACİL DURUM UYARISI */}
        <View style={styles.emergencyWarningCard}>
          <Ionicons name="alert-circle-outline" size={22} color={COLORS.warning} />
          <Text style={styles.emergencyWarningText}>
            Acil tıbbi müdahale gerektiren hayati durumlarda zaman kaybetmeden 112 Acil Çağrı Merkezini arayınız.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
