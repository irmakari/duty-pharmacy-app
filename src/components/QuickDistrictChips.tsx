import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { styles } from '../styles/QuickDistrictChips.styles';

interface QuickDistrictChipsProps {
  districts: string[];
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
}

export default function QuickDistrictChips({
  districts,
  selectedDistrict,
  onSelectDistrict,
}: QuickDistrictChipsProps) {
  return (
    <View style={styles.quickChipsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickChipsScroll}
      >
        {districts.map((district) => {
          const isSelected = selectedDistrict === district;
          return (
            <TouchableOpacity
              key={district}
              style={[styles.quickChip, isSelected && styles.quickChipActive]}
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.selectionAsync();
                onSelectDistrict(district);
              }}
            >
              <Text style={[styles.quickChipText, isSelected && styles.quickChipTextActive]}>
                {district}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
