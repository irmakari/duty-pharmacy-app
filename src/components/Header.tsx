import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { styles } from '../styles/Header.styles';

interface HeaderProps {
  city?: string;
  listTitle?: string;
}

export default function Header({
  city = 'İstanbul',
  listTitle = 'İstanbul Nöbet Listesi',
}: HeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <View style={styles.headerSubtitleRow}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.primary} />
          <Text style={styles.headerSubtitle}>{listTitle}</Text>
        </View>
        <Text style={styles.headerTitle}>Nöbetçi Eczaneler</Text>
      </View>

      <TouchableOpacity style={styles.cityPill} activeOpacity={0.8}>
        <Ionicons name="location" size={15} color={COLORS.primary} />
        <Text style={styles.cityPillText}>{city}</Text>
      </TouchableOpacity>
    </View>
  );
}
