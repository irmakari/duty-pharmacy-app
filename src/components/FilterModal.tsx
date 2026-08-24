import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DutyType, SortByOption } from '../types/pharmacy';
import { COLORS } from '../constants/theme';
import { styles } from '../styles/FilterModal.styles';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  districts: string[];
  selectedDistrict: string;
  setSelectedDistrict: (dist: string) => void;
  selectedDutyType: DutyType;
  setSelectedDutyType: (duty: DutyType) => void;
  sortBy: SortByOption;
  setSortBy: (sort: SortByOption) => void;
  onResetFilters: () => void;
}

export default function FilterModal({
  visible,
  onClose,
  districts,
  selectedDistrict,
  setSelectedDistrict,
  selectedDutyType,
  setSelectedDutyType,
  sortBy,
  setSortBy,
  onResetFilters,
}: FilterModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* HEADER */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrele & Sırala</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* ECZANE TÜRÜ & NÖBET DURUMU */}
            <Text style={styles.filterSectionTitle}>Eczane Türü & Nöbet Durumu</Text>
            <View style={styles.filterRow}>
              {[
                { key: 'all' as DutyType, label: 'Tüm Eczaneler' },
                { key: 'nobetci' as DutyType, label: 'Nöbetçiler' },
                { key: 'sabit' as DutyType, label: 'Normal (09:00 - 19:00)' },
                { key: '24saat' as DutyType, label: '24 Saat Nöbetçi' },
                { key: 'gece' as DutyType, label: 'Gece Nöbetçisi' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.filterPill,
                    selectedDutyType === item.key && styles.filterPillActive,
                  ]}
                  onPress={() => setSelectedDutyType(item.key)}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      selectedDutyType === item.key && styles.filterPillTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* İLÇE SEÇİMİ */}
            <Text style={styles.filterSectionTitle}>İlçe Seçimi</Text>
            <View style={styles.filterGrid}>
              {districts.map((dist) => (
                <TouchableOpacity
                  key={dist}
                  style={[
                    styles.filterGridItem,
                    selectedDistrict === dist && styles.filterGridItemActive,
                  ]}
                  onPress={() => setSelectedDistrict(dist)}
                >
                  <Text
                    style={[
                      styles.filterGridItemText,
                      selectedDistrict === dist && styles.filterGridItemTextActive,
                    ]}
                  >
                    {dist}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* SIRALAMA ÖLÇÜTÜ */}
            <Text style={styles.filterSectionTitle}>Sıralama Ölçütü</Text>
            <View style={styles.filterRow}>
              {[
                { key: 'distance' as SortByOption, label: 'En Yakına Göre', icon: 'location-outline' as const },
                { key: 'name' as SortByOption, label: 'İsme Göre (A-Z)', icon: 'text-outline' as const },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.filterPillLarge,
                    sortBy === item.key && styles.filterPillActive,
                  ]}
                  onPress={() => setSortBy(item.key)}
                >
                  <Ionicons
                    name={item.icon}
                    size={16}
                    color={sortBy === item.key ? '#FFFFFF' : COLORS.textMuted}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.filterPillText,
                      sortBy === item.key && styles.filterPillTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* FOOTER BUTTONS */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.modalResetBtn} onPress={onResetFilters}>
              <Text style={styles.modalResetBtnText}>Sıfırla</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalApplyBtn} onPress={onClose}>
              <Text style={styles.modalApplyBtnText}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
