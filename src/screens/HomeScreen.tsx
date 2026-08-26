import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Platform,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import Header from '../components/Header';
import SearchBarSection from '../components/SearchBarSection';
import DutyFilterTabs from '../components/DutyFilterTabs';
import CityPickerModal from '../components/CityPickerModal';
import PharmacyCard from '../components/PharmacyCard';
import PharmacyDetailView from '../components/PharmacyDetailView';
import { fetchDutyPharmacies } from '../services/pharmacyApi';
import { getAvailableDistricts, isPharmacyInDistrict } from '../utils/districtExtractor';
import {
  getUserCurrentLocation,
  parseCoordinates,
  calculateHaversineDistance,
  formatDistanceText,
  Coordinates,
} from '../utils/location';
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
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  
  // Filter States
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Tüm Şehirler');
  const [selectedDutyType, setSelectedDutyType] = useState<DutyType>('all');
  const [sortBy, setSortBy] = useState<SortByOption>('distance');
  const [cityModalVisible, setCityModalVisible] = useState<boolean>(false);
  
  // Favorites
  const [favorites, setFavorites] = useState<FavoritesMap>({});

  // Active Pharmacy selection for Split View (Desktop)
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(null);

  // Kullanıcı canlı GPS konumunu alma
  const fetchUserLocation = useCallback(async () => {
    const loc = await getUserCurrentLocation();
    if (loc) {
      setUserLocation(loc);
    }
  }, []);

  // Data fetching (with cache & rate limit protection)
  const loadData = useCallback(async (isRefresh: boolean = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const data = await fetchDutyPharmacies('Istanbul', '', isRefresh);
      setPharmacies(data);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUserLocation();
    loadData();
  }, [loadData, fetchUserLocation]);

  const onRefresh = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRefreshing(true);
    fetchUserLocation();
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

  // Kullanıcı konumu varsa her eczane için gerçek mesafeyi hesaplama
  const pharmaciesWithCalculatedDistance = useMemo(() => {
    if (!userLocation) return pharmacies;
    return pharmacies.map(item => {
      const coords = parseCoordinates(item.loc);
      if (!coords) return item;
      const distKm = calculateHaversineDistance(
        userLocation.latitude,
        userLocation.longitude,
        coords.latitude,
        coords.longitude
      );
      return {
        ...item,
        numericDistance: distKm,
        distance: formatDistanceText(distKm),
      };
    });
  }, [pharmacies, userLocation]);

  // Türkçe karakter ve kelime arama uyumlu Filtreleme & Sıralama Mantığı
  const filteredPharmacies = useMemo(() => {
    const normQuery = toTurkishLowerCase(searchQuery.trim());

    return pharmaciesWithCalculatedDistance
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

        // İlçe / Şehir Filtre Eşleşmesi (Resmi İlçe, Mahalle ve 1.5 km Yakındaki Eczaneler)
        const matchDistrict = isPharmacyInDistrict(
          item.dist,
          item.address,
          selectedDistrict,
          item.numericDistance
        );

        // Nöbet / Eczane Türü Eşleşmesi
        const matchDuty =
          selectedDutyType === 'all'
            ? true
            : selectedDutyType === 'nobetci'
            ? item.dutyType === '24saat' || item.dutyType === 'gece'
            : selectedDutyType === 'open'
            ? item.isOpenNow || item.dutyType === '24saat'
            : item.dutyType === selectedDutyType;

        return matchSearch && matchDistrict && matchDuty;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name, 'tr');
        }
        const distA = a.numericDistance !== undefined ? a.numericDistance : parseFloat(a.distance);
        const distB = b.numericDistance !== undefined ? b.numericDistance : parseFloat(b.distance);
        return (isNaN(distA) ? 999999 : distA) - (isNaN(distB) ? 999999 : distB);
      });
  }, [pharmaciesWithCalculatedDistance, searchQuery, selectedDistrict, selectedDutyType, sortBy]);

  // Masaüstünde seçili eczane belirleme
  const selectedPharmacy = useMemo(() => {
    if (!filteredPharmacies.length) return null;
    return (
      filteredPharmacies.find(p => p.id === selectedPharmacyId) ||
      filteredPharmacies[0]
    );
  }, [filteredPharmacies, selectedPharmacyId]);

  // Aktif filtre kontrolü
  const isFilterActive =
    (selectedDistrict !== 'Tüm Şehirler' && selectedDistrict !== 'Tüm İlçeler') ||
    selectedDutyType !== 'all' ||
    sortBy !== 'distance' ||
    searchQuery.trim() !== '';

  const resetFilters = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDistrict('Tüm Şehirler');
    setSelectedDutyType('all');
    setSortBy('distance');
    setSearchQuery('');
  };

  const handleCardPress = (item: Pharmacy) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    if (isDesktop) {
      setSelectedPharmacyId(item.id);
    } else {
      navigation.navigate('DetailScreen', {
        pharmacy: item,
        isFav: !!favorites[item.id],
      });
    }
  };
  // Dinamik İl & Başlık Hesaplama
  const currentCityName = useMemo(() => {
    if (selectedDistrict === 'Tüm Şehirler' || selectedDistrict === 'Tüm İlçeler') {
      return 'Türkiye';
    }
    const found = filteredPharmacies[0] || pharmacies.find(p => p.dist === selectedDistrict);
    if (found && found.city) {
      return found.city;
    }
    return selectedDistrict;
  }, [selectedDistrict, filteredPharmacies, pharmacies]);

  const listTitleText = useMemo(() => {
    if (selectedDistrict === 'Tüm Şehirler' || selectedDistrict === 'Tüm İlçeler') {
      return 'TÜRKİYE NÖBET LİSTESİ';
    }
    return `${currentCityName.toUpperCase()} NÖBET LİSTESİ`;
  }, [selectedDistrict, currentCityName]);

  // Sol Taraf: Liste Bileşeni
  const renderLeftList = () => (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <Header city={currentCityName} listTitle={listTitleText} />

      {/* SEARCH BAR & CITY FILTER BUTTON */}
      <SearchBarSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDistrict={selectedDistrict}
        onOpenCityPicker={() => setCityModalVisible(true)}
      />

      {/* CHIPS BAR (EN YAKIN, TÜM ECZANELER, NÖBETÇİ ECZANELER, NORMAL ECZANELER) */}
      <DutyFilterTabs
        selectedDutyType={selectedDutyType}
        onSelectDutyType={setSelectedDutyType}
        sortBy={sortBy}
        onToggleSort={() => setSortBy(prev => (prev === 'distance' ? 'name' : 'distance'))}
        hasLocation={!!userLocation}
        onRefreshLocation={fetchUserLocation}
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
              isSelected={isDesktop && selectedPharmacy?.id === item.id}
              onToggleFavorite={toggleFavorite}
              onPressCard={() => handleCardPress(item)}
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
                {filteredPharmacies.length} eczane bulundu
              </Text>
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {isDesktop ? (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* MASAÜSTÜ SOL PANEL (LISTE) */}
          <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: '#E2E8F0' }}>
            {renderLeftList()}
          </View>

          {/* MASAÜSTÜ SAĞ PANEL (DETAY & HARİTA) */}
          <View style={{ flex: 1.2, backgroundColor: '#F8FAFC' }}>
            {selectedPharmacy ? (
              <PharmacyDetailView
                pharmacy={selectedPharmacy}
                isFav={!!favorites[selectedPharmacy.id]}
                onToggleFavorite={toggleFavorite}
                showBackButton={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="pill" size={48} color={COLORS.textSubtle} />
                <Text style={styles.emptyTitle}>Eczane Seçiniz</Text>
                <Text style={styles.emptySubtitle}>
                  Detaylarını incelemek ve haritada görmek istediğiniz eczaneyi soldaki listeden seçiniz.
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        renderLeftList()
      )}

      {/* CITY / DISTRICT PICKER MODAL */}
      <CityPickerModal
        visible={cityModalVisible}
        onClose={() => setCityModalVisible(false)}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={setSelectedDistrict}
      />
    </SafeAreaView>
  );
}
