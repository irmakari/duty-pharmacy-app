import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import Header from '../components/Header';
import SearchBarSection from '../components/SearchBarSection';
import QuickDistrictChips from '../components/QuickDistrictChips';
import PharmacyCard from '../components/PharmacyCard';
import FilterModal from '../components/FilterModal';
import { fetchDutyPharmacies } from '../services/pharmacyApi';
import { getAvailableDistricts } from '../utils/districtExtractor';
import { Pharmacy, DutyType, SortByOption, FavoritesMap } from '../types/pharmacy';
import { HomeScreenProps } from '../types/navigation';
import { COLORS } from '../constants/theme';
import { styles } from '../styles/HomeScreen.styles';

/**
 * Türkçe karakter duyarlı küçük harfe çevirme yardımcısı
 */
function toTurkishLowerCase(text: string = ''): string {
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .replace(/Ğ/g, 'ğ')
    .replace(/Ü/g, 'ü')
    .replace(/Ş/g, 'ş')
    .replace(/Ö/g, 'ö')
    .replace(/Ç/g, 'ç')
    .toLowerCase();
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter States
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Tüm İlçeler');
  const [selectedDutyType, setSelectedDutyType] = useState<DutyType>('all');
  const [sortBy, setSortBy] = useState<SortByOption>('distance');
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  
  // Favorites
  const [favorites, setFavorites] = useState<FavoritesMap>({});

  // Data fetching (with cache & rate limit protection)
  const loadData = useCallback(async (isRefresh: boolean = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const data = await fetchDutyPharmacies('Istanbul', selectedDistrict, isRefresh);
      setPharmacies(data);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDistrict]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    loadData(true);
  };

  const toggleFavorite = (id: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Dinamik olarak eczanelerdeki ilçeleri çıkarma
  const availableDistricts = useMemo(() => {
    return getAvailableDistricts(pharmacies);
  }, [pharmacies]);

  // Türkçe karakter ve kelime arama uyumlu Filtreleme & Sıralama Mantığı
  const filteredPharmacies = useMemo(() => {
    const normQuery = toTurkishLowerCase(searchQuery.trim());
    const normSelectedDist = toTurkishLowerCase(selectedDistrict);

    return pharmacies
      .filter(item => {
        const normName = toTurkishLowerCase(item.name);
        const normDist = toTurkishLowerCase(item.dist);
        const normAddr = toTurkishLowerCase(item.address);

        // Arama Çubuğu Eşleşmesi (Ad, İlçe veya Adres)
        const matchSearch =
          normQuery === '' ||
          normName.includes(normQuery) ||
          normDist.includes(normQuery) ||
          normAddr.includes(normQuery);

        // İlçe Filtre Eşleşmesi
        const matchDistrict =
          selectedDistrict === 'Tüm İlçeler' ||
          normDist === normSelectedDist ||
          normAddr.includes(normSelectedDist);

        // Nöbet / Eczane Türü Eşleşmesi
        const matchDuty =
          selectedDutyType === 'all'
            ? true
            : selectedDutyType === 'nobetci'
            ? item.dutyType === '24saat' || item.dutyType === 'gece'
            : item.dutyType === selectedDutyType;

        return matchSearch && matchDistrict && matchDuty;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name, 'tr');
        }
        const distA = parseFloat(a.distance);
        const distB = parseFloat(b.distance);
        return (isNaN(distA) ? 0 : distA) - (isNaN(distB) ? 0 : distB);
      });
  }, [pharmacies, searchQuery, selectedDistrict, selectedDutyType, sortBy]);

  // Aktif filtre kontrolü
  const isFilterActive =
    selectedDistrict !== 'Tüm İlçeler' ||
    selectedDutyType !== 'all' ||
    sortBy !== 'distance' ||
    searchQuery.trim() !== '';

  const resetFilters = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDistrict('Tüm İlçeler');
    setSelectedDutyType('all');
    setSortBy('distance');
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* HEADER */}
      <Header city="İstanbul" listTitle="İstanbul Nöbet Listesi" />

      {/* SEARCH BAR & FILTER TRIGGER */}
      <SearchBarSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isFilterActive={isFilterActive}
        onOpenFilter={() => setFilterModalVisible(true)}
      />

      {/* QUICK DISTRICT CHIPS */}
      <QuickDistrictChips
        districts={availableDistricts}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
      />

      {/* PHARMACY LIST */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Nöbetçi eczaneler yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPharmacies}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PharmacyCard
              item={item}
              isFav={!!favorites[item.id]}
              onToggleFavorite={toggleFavorite}
              onPressCard={() => {
                if (Platform.OS !== 'web') Haptics.selectionAsync();
                navigation.navigate('DetailScreen', {
                  pharmacy: item,
                  isFav: !!favorites[item.id],
                });
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          }
          ListHeaderComponent={
            <View style={styles.listHeaderSummary}>
              <Text style={styles.listSummaryText}>
                {filteredPharmacies.length} nöbetçi eczane bulundu
              </Text>
              {isFilterActive && (
                <TouchableOpacity onPress={resetFilters}>
                  <Text style={styles.resetFiltersText}>Filtreleri Temizle</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <MaterialCommunityIcons name="pill" size={44} color={COLORS.textSubtle} />
              </View>
              <Text style={styles.emptyTitle}>Eczane Bulunamadı</Text>
              <Text style={styles.emptySubtitle}>
                Arama kriterlerinize veya filtreye uygun nöbetçi eczane bulunamadı.
              </Text>
              <TouchableOpacity style={styles.emptyResetBtn} onPress={resetFilters}>
                <Text style={styles.emptyResetBtnText}>Tüm Listeyi Göster</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* FILTER MODAL */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        districts={availableDistricts}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedDutyType={selectedDutyType}
        setSelectedDutyType={setSelectedDutyType}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onResetFilters={resetFilters}
      />
    </SafeAreaView>
  );
}
