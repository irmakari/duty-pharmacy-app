import { Pharmacy } from '../types/pharmacy';

export interface CityData {
  cityName: string;
  districts: string[];
}

// Türkiye'nin başlıca il ve ilçeleri için standart eşleştirme ve temizleme yapısı
export const TURKEY_CITIES_MAP: Record<string, string[]> = {
  'İstanbul': [
    'Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler',
    'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü',
    'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt',
    'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane',
    'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer',
    'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla',
    'Ümraniye', 'Üsküdar', 'Zeytinburnu'
  ],
  'Ankara': [
    'Altındağ', 'Ayaş', 'Bala', 'Beypazarı', 'Çamlıdere', 'Çankaya', 'Çubuk',
    'Elmadağ', 'Etimesgut', 'Evren', 'Gölbaşı', 'Güdül', 'Haymana', 'Kahramankazan',
    'Kalecik', 'Keçiören', 'Kızılcahamam', 'Mamak', 'Nallıhan', 'Polatlı',
    'Pursaklar', 'Sincan', 'Şereflikoçhisar', 'Yenimahalle'
  ],
  'İzmir': [
    'Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Beydağ', 'Bornova',
    'Buca', 'Çeşme', 'Çiğli', 'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe',
    'Karabağlar', 'Karaburun', 'Karşıyaka', 'Kemalpaşa', 'Kınık', 'Kiraz',
    'Konak', 'Menderes', 'Menemen', 'Narlıdere', 'Ödemiş', 'Seferihisar',
    'Selçuk', 'Tire', 'Torbalı', 'Urla'
  ],
  'Antalya': [
    'Akseki', 'Aksu', 'Alanya', 'Demre', 'Döşemealtı', 'Elmalı', 'Finike',
    'Gazipaşa', 'Gündoğmuş', 'İbradı', 'Kaş', 'Kemer', 'Kepez', 'Konyaaltı',
    'Korkuteli', 'Kumluca', 'Manavgat', 'Muratpaşa', 'Serik'
  ],
  'Bursa': [
    'Büyükorhan', 'Gemlik', 'Gürsu', 'Harmancık', 'İnegöl', 'İznik', 'Karacabey',
    'Keles', 'Kestel', 'Mudanya', 'Mustafakemalpaşa', 'Nilüfer', 'Orhaneli',
    'Orhangazi', 'Osmangazi', 'Yenişehir', 'Yıldırım'
  ],
  'Adana': [
    'Aladağ', 'Ceyhan', 'Çukurova', 'Feke', 'İmamoğlu', 'Karaisalı', 'Karataş',
    'Kozan', 'Pozantı', 'Saimbeyli', 'Sarıçam', 'Seyhan', 'Tufanbeyli', 'Yumurtalık', 'Yüreğir'
  ],
  'Konya': [
    'Ahırlı', 'Akören', 'Akşehir', 'Altınekin', 'Beyşehir', 'Bozkır', 'Cihanbeyli',
    'Çeltik', 'Çumra', 'Derbent', 'Derebucak', 'Doğanhisar', 'Emirgazi', 'Ereğli',
    'Güneysınır', 'Hadim', 'Halkapınar', 'Hüyük', 'Ilgın', 'Kadınhanı', 'Karapınar',
    'Karatay', 'Kulu', 'Meram', 'Sarayönü', 'Selçuklu', 'Seydişehir', 'Taşkent',
    'Tuzlukçu', 'Yalıhüyük', 'Yunak'
  ],
  'Muğla': [
    'Bodrum', 'Dalaman', 'Datça', 'Fethiye', 'Kavaklıdere', 'Köyceğiz', 'Marmaris',
    'Menteşe', 'Milas', 'Ortaca', 'Seydikemer', 'Ula', 'Yatağan'
  ]
};

/**
 * Verilen ilçe veya metinden Şehir ve İlçe eşleştirmesi yapar
 */
export function normalizeDistrictAndCity(rawDist: string, rawAddress: string = ''): { city: string; dist: string } {
  if (!rawDist && !rawAddress) return { city: 'İstanbul', dist: 'Merkez' };

  // Eğer "Alanya/Antalya" gibi gelmişse ayır
  if (rawDist.includes('/')) {
    const parts = rawDist.split('/');
    const d = parts[0].trim();
    const c = parts[1].trim();
    return { city: c, dist: d };
  }

  const cleanDist = rawDist.trim();
  
  // Şehir Haritasında Ara
  for (const [cityName, districts] of Object.entries(TURKEY_CITIES_MAP)) {
    // Şehir adıyla birebir örtüşüyorsa
    if (cityName.toLowerCase() === cleanDist.toLowerCase()) {
      return { city: cityName, dist: `Tüm ${cityName}` };
    }
    // İlçe adıyla örtüşüyorsa
    const matchedDist = districts.find(d => d.toLowerCase() === cleanDist.toLowerCase());
    if (matchedDist) {
      return { city: cityName, dist: matchedDist };
    }
  }

  // Varsayılan
  return { city: 'İstanbul', dist: cleanDist || 'Merkez' };
}
