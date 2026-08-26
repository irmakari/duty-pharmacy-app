import React from 'react';
import { View, TextInput, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../constants/theme';
import { styles } from '../styles/SearchBarSection.styles';

interface SearchBarSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDistrict: string;
  onOpenCityPicker: () => void;
}

export default function SearchBarSection({
  searchQuery,
  setSearchQuery,
  selectedDistrict,
  onOpenCityPicker,
}: SearchBarSectionProps) {
  const handleCityPress = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onOpenCityPicker();
  };

  const isDistrictSelected = selectedDistrict !== 'Tüm Şehirler' && selectedDistrict !== 'Tüm İlçeler';

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
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
            <Ionicons name="close-circle" size={18} color={COLORS.textSubtle} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.cityFilterButton, isDistrictSelected && styles.cityFilterButtonActive]}
        onPress={handleCityPress}
        activeOpacity={0.8}
      >
        <Ionicons
          name="location"
          size={16}
          color={isDistrictSelected ? '#FFFFFF' : COLORS.primary}
          style={{ marginRight: 5 }}
        />
        <Text
          style={[
            styles.cityFilterButtonText,
            isDistrictSelected && styles.cityFilterButtonTextActive,
          ]}
          numberOfLines={1}
        >
          {selectedDistrict}
        </Text>
        <Ionicons
          name="chevron-down"
          size={14}
          color={isDistrictSelected ? '#FFFFFF' : COLORS.primary}
          style={{ marginLeft: 3 }}
        />
      </TouchableOpacity>
    </View>
  );
}
