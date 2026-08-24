import React from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pharmacy } from '../types/pharmacy';
import { COLORS } from '../constants/theme';
import { styles } from '../styles/PharmacyCard.styles';

interface PharmacyCardProps {
  item: Pharmacy;
  isFav: boolean;
  onToggleFavorite: (id: string) => void;
  onPressCard: () => void;
}

export default function PharmacyCard({
  item,
  isFav,
  onToggleFavorite,
  onPressCard,
}: PharmacyCardProps) {
  const is24h = item.dutyType === '24saat';

  const handleCall = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${item.phone.replace(/\s+/g, '')}`);
  };

  const handleMap = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const mapUrl = `https://maps.google.com/?q=${item.name}+${item.address}`;
    Linking.openURL(mapUrl);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.card}
      onPress={onPressCard}
    >
      {/* ÜST ROZET VE MESAFE */}
      <View style={styles.cardHeader}>
        <View style={[styles.badge, is24h ? styles.badgeGreen : styles.badgeAmber]}>
          <View
            style={[
              styles.badgeDot,
              { backgroundColor: is24h ? COLORS.primary : COLORS.warning }
            ]}
          />
          <Text
            style={[
              styles.badgeText,
              { color: is24h ? COLORS.primaryDark : '#B45309' }
            ]}
          >
            {item.dutyTypeLabel}
          </Text>
        </View>

        <View style={styles.cardHeaderRight}>
          <View style={styles.distanceChip}>
            <Ionicons name="location-sharp" size={13} color={COLORS.primary} />
            <Text style={styles.distanceText}>{item.distance}</Text>
          </View>
          <TouchableOpacity
            style={styles.favButton}
            onPress={() => onToggleFavorite(item.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={20}
              color={isFav ? COLORS.danger : COLORS.textSubtle}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ECZANE ADI VE İLÇE */}
      <View style={styles.cardTitleRow}>
        <Text style={styles.pharmacyName}>{item.name}</Text>
        <View style={styles.districtChip}>
          <Text style={styles.districtChipText}>{item.dist}</Text>
        </View>
      </View>

      {/* ADRES */}
      <View style={styles.addressRow}>
        <Feather name="map-pin" size={14} color={COLORS.textMuted} style={{ marginTop: 2 }} />
        <Text style={styles.addressText} numberOfLines={2}>
          {item.address}
        </Text>
      </View>

      {/* NÖBET SAATLERİ */}
      <View style={styles.hoursRow}>
        <Feather name="clock" size={13} color={COLORS.primary} />
        <Text style={styles.hoursText}>{item.dutyHours}</Text>
      </View>

      <View style={styles.cardDivider} />

      {/* AKSİYONLAR */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionBtnCall} onPress={handleCall}>
          <Ionicons name="call" size={15} color="#FFFFFF" />
          <Text style={styles.actionBtnCallText}>Hemen Ara</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtnMap} onPress={handleMap}>
          <Feather name="navigation" size={15} color={COLORS.primary} />
          <Text style={styles.actionBtnMapText}>Yol Tarifi</Text>
        </TouchableOpacity>

        <View style={styles.detailArrowContainer}>
          <Feather name="chevron-right" size={20} color={COLORS.textSubtle} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
