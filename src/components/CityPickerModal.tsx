import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { TURKEY_CITIES_MAP } from '../utils/cityDistrictMap';

interface CityPickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDistrict: string;
  onSelectDistrict: (district: string) => void;
}

export default function CityPickerModal({
  visible,
  onClose,
  selectedDistrict,
  onSelectDistrict,
}: CityPickerModalProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [filterText, setFilterText] = useState<string>('');

  // Tüm şehirlerin listesi
  const cityNames = useMemo(() => Object.keys(TURKEY_CITIES_MAP), []);

  // Arama Modu Filtrelemesi (Şehir veya İlçe Arama)
  const searchResults = useMemo(() => {
    if (!filterText.trim()) return [];
    const query = filterText.toLowerCase().trim();
    const results: { city: string; dist: string }[] = [];

    // Şehirler içinde ara
    cityNames.forEach((cityName) => {
      if (cityName.toLowerCase().includes(query)) {
        results.push({ city: cityName, dist: `Tüm ${cityName}` });
      }
    });

    // İlçeler içinde ara
    Object.entries(TURKEY_CITIES_MAP).forEach(([cityName, districts]) => {
      districts.forEach((dist) => {
        if (dist.toLowerCase().includes(query) && !results.some(r => r.dist === dist)) {
          results.push({ city: cityName, dist });
        }
      });
    });

    return results;
  }, [filterText, cityNames]);

  const handleSelect = (distName: string) => {
    onSelectDistrict(distName);
    setSelectedCity(null);
    setFilterText('');
    onClose();
  };

  const handleClose = () => {
    setSelectedCity(null);
    setFilterText('');
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* HEADER */}
          <View style={styles.modalHeader}>
            {selectedCity && !filterText ? (
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => setSelectedCity(null)}
              >
                <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
                <Text style={styles.backBtnText}>Şehirler</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.modalTitleRow}>
                <Ionicons name="location" size={22} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={styles.modalTitle}>
                  {filterText
                    ? 'Arama Sonuçları'
                    : selectedCity
                    ? `${selectedCity} İlçeleri`
                    : 'Şehir Seçimi'}
                </Text>
              </View>
            )}

            <TouchableOpacity onPress={handleClose} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={22} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* SEARCH INPUT */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={16} color={COLORS.textSubtle} style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Şehir veya ilçe ara (Örn: Alanya, Kadıköy)..."
              placeholderTextColor={COLORS.textSubtle}
              value={filterText}
              onChangeText={setFilterText}
            />
            {filterText.length > 0 && (
              <TouchableOpacity onPress={() => setFilterText('')}>
                <Ionicons name="close-circle" size={16} color={COLORS.textSubtle} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* 1. ARAMA SONUÇLARI GÖRÜNÜMÜ */}
            {filterText.trim().length > 0 ? (
              searchResults.length > 0 ? (
                <View style={styles.gridContent}>
                  {searchResults.map((item) => (
                    <TouchableOpacity
                      key={`${item.city}-${item.dist}`}
                      style={[
                        styles.gridItem,
                        selectedDistrict === item.dist && styles.gridItemActive,
                      ]}
                      onPress={() => handleSelect(item.dist)}
                    >
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color={selectedDistrict === item.dist ? '#FFFFFF' : COLORS.primary}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          styles.gridItemText,
                          selectedDistrict === item.dist && styles.gridItemTextActive,
                        ]}
                      >
                        {item.dist} ({item.city})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.emptySearch}>
                  <Text style={styles.emptySearchText}>Aradığınız şehir veya ilçe bulunamadı.</Text>
                </View>
              )
            ) : selectedCity ? (
              /* 2. SEVİYE 2: SEÇİLİ ŞEHRİN İLÇELERİ */
              <View style={styles.gridContent}>
                {/* TÜM İL / ŞEHİR SEÇENEĞİ */}
                <TouchableOpacity
                  style={[
                    styles.gridItem,
                    (selectedDistrict === selectedCity || selectedDistrict === `Tüm ${selectedCity}`) &&
                      styles.gridItemActive,
                  ]}
                  onPress={() => handleSelect(selectedCity)}
                >
                  <Ionicons
                    name="map-outline"
                    size={16}
                    color={
                      selectedDistrict === selectedCity || selectedDistrict === `Tüm ${selectedCity}`
                        ? '#FFFFFF'
                        : COLORS.primary
                    }
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.gridItemText,
                      (selectedDistrict === selectedCity || selectedDistrict === `Tüm ${selectedCity}`) &&
                        styles.gridItemTextActive,
                    ]}
                  >
                    Tüm {selectedCity}
                  </Text>
                </TouchableOpacity>

                {/* İLÇELER */}
                {TURKEY_CITIES_MAP[selectedCity]?.map((dist) => {
                  const isSelected = selectedDistrict === dist;
                  return (
                    <TouchableOpacity
                      key={dist}
                      style={[styles.gridItem, isSelected && styles.gridItemActive]}
                      onPress={() => handleSelect(dist)}
                    >
                      <Ionicons
                        name={isSelected ? 'checkmark-circle' : 'location-outline'}
                        size={16}
                        color={isSelected ? '#FFFFFF' : COLORS.textMuted}
                        style={{ marginRight: 6 }}
                      />
                      <Text style={[styles.gridItemText, isSelected && styles.gridItemTextActive]}>
                        {dist}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              /* 3. SEVİYE 1: ŞEHİR LİSTESİ (TÜM ŞEHİRLER & İLLER) */
              <View style={styles.gridContent}>
                {/* TÜM ŞEHİRLER (TÜRKİYE) */}
                <TouchableOpacity
                  style={[
                    styles.gridItem,
                    styles.gridItemTurkey,
                    selectedDistrict === 'Tüm Şehirler' && styles.gridItemActive,
                  ]}
                  onPress={() => handleSelect('Tüm Şehirler')}
                >
                  <Ionicons
                    name="globe-outline"
                    size={18}
                    color={selectedDistrict === 'Tüm Şehirler' ? '#FFFFFF' : COLORS.primary}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.gridItemText,
                      styles.gridItemTextTurkey,
                      selectedDistrict === 'Tüm Şehirler' && styles.gridItemTextActive,
                    ]}
                  >
                    Tüm Şehirler (Türkiye)
                  </Text>
                </TouchableOpacity>

                {/* ŞEHİRLER */}
                {cityNames.map((cityName) => {
                  const districtCount = TURKEY_CITIES_MAP[cityName].length;
                  return (
                    <TouchableOpacity
                      key={cityName}
                      style={styles.cityCardItem}
                      onPress={() => setSelectedCity(cityName)}
                    >
                      <View style={styles.cityCardLeft}>
                        <Ionicons name="business-outline" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
                        <Text style={styles.cityCardName}>{cityName}</Text>
                      </View>
                      <View style={styles.cityCardBadge}>
                        <Text style={styles.cityCardBadgeText}>{districtCount} İlçe</Text>
                        <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} style={{ marginLeft: 4 }} />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '82%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    boxShadow: '0px 12px 36px rgba(0, 0, 0, 0.16)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
  },
  backBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: COLORS.primaryDark,
    marginLeft: 4,
  },
  modalCloseBtn: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 10,
  },
  gridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
    } : {}),
  },
  gridItemTurkey: {
    width: '100%',
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primaryBorder,
    justifyContent: 'center',
    paddingVertical: 12,
  },
  gridItemActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  gridItemText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#334155',
  },
  gridItemTextTurkey: {
    color: COLORS.primaryDark,
    fontFamily: 'Poppins_600SemiBold',
  },
  gridItemTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
  },
  cityCardItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
    } : {}),
  },
  cityCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityCardName: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0F172A',
  },
  cityCardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cityCardBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: COLORS.textMuted,
  },
  emptySearch: {
    padding: 20,
    alignItems: 'center',
  },
  emptySearchText: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: COLORS.textMuted,
  },
});
