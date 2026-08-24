import React from 'react';
import { View, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/theme';
import { styles } from '../styles/SearchBarSection.styles';

interface SearchBarSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFilterActive: boolean;
  onOpenFilter: () => void;
}

export default function SearchBarSection({
  searchQuery,
  setSearchQuery,
  isFilterActive,
  onOpenFilter,
}: SearchBarSectionProps) {
  const handleFilterPress = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onOpenFilter();
  };

  return (
    <View style={styles.searchBarSection}>
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={18} color={COLORS.textSubtle} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Eczane adı veya ilçe ara..."
          placeholderTextColor={COLORS.textSubtle}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
            <Ionicons name="close-circle" size={18} color={COLORS.textSubtle} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.filterButton, isFilterActive && styles.filterButtonActive]}
        onPress={handleFilterPress}
        activeOpacity={0.8}
      >
        <Ionicons
          name="options-outline"
          size={20}
          color={isFilterActive ? '#FFFFFF' : COLORS.primary}
        />
        {isFilterActive && <View style={styles.filterActiveDot} />}
      </TouchableOpacity>
    </View>
  );
}
