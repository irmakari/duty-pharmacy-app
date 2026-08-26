import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { DutyType, SortByOption } from '../types/pharmacy';
import { COLORS } from '../constants/theme';

interface DutyFilterTabsProps {
  selectedDutyType: DutyType;
  onSelectDutyType: (duty: DutyType) => void;
  sortBy: SortByOption;
  onToggleSort: () => void;
}

export default function DutyFilterTabs({
  selectedDutyType,
  onSelectDutyType,
  sortBy,
  onToggleSort,
}: DutyFilterTabsProps) {
  const isNearestActive = sortBy === 'distance';

  return (
    <View style={styles.tabsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScroll}
      >
        {/* EN YAKIN CHIP */}
        <TouchableOpacity
          style={[styles.tabBtn, isNearestActive && styles.tabBtnActiveNearest]}
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            onToggleSort();
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name="location"
            size={15}
            color={isNearestActive ? COLORS.primaryDark : COLORS.textMuted}
            style={{ marginRight: 5 }}
          />
          <Text style={[styles.tabText, isNearestActive && styles.tabTextActiveNearest]}>
            En Yakın
          </Text>
        </TouchableOpacity>

        {/* TÜM ECZANELER */}
        <TouchableOpacity
          style={[styles.tabBtn, selectedDutyType === 'all' && styles.tabBtnActive]}
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            onSelectDutyType('all');
          }}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="hospital-building"
            size={16}
            color={selectedDutyType === 'all' ? '#FFFFFF' : COLORS.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabText, selectedDutyType === 'all' && styles.tabTextActive]}>
            Tüm Eczaneler
          </Text>
        </TouchableOpacity>

        {/* NÖBETÇİ ECZANELER */}
        <TouchableOpacity
          style={[styles.tabBtn, selectedDutyType === 'nobetci' && styles.tabBtnActive]}
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            onSelectDutyType(selectedDutyType === 'nobetci' ? 'all' : 'nobetci');
          }}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="pill"
            size={16}
            color={selectedDutyType === 'nobetci' ? '#FFFFFF' : COLORS.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabText, selectedDutyType === 'nobetci' && styles.tabTextActive]}>
            Nöbetçi Eczaneler
          </Text>
        </TouchableOpacity>

        {/* ŞU AN AÇIK ECZANELER */}
        <TouchableOpacity
          style={[styles.tabBtn, selectedDutyType === 'open' && styles.tabBtnActive]}
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.selectionAsync();
            onSelectDutyType(selectedDutyType === 'open' ? 'all' : 'open');
          }}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="store-clock-outline"
            size={16}
            color={selectedDutyType === 'open' ? '#FFFFFF' : COLORS.textMuted}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabText, selectedDutyType === 'open' && styles.tabTextActive]}>
            Şu An Açık
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    paddingVertical: 6,
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
    } : {}),
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabBtnActiveNearest: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#475569',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
  },
  tabTextActiveNearest: {
    color: COLORS.primaryDark,
    fontFamily: 'Poppins_700Bold',
  },
});
