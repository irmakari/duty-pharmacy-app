import { Pharmacy } from '../types/pharmacy';

// İstanbul'un 39 İlçesi Listesi
export const ISTANBUL_DISTRICTS: string[] = [
  'Adalar',
  'Arnavutköy',
  'Ataşehir',
  'Avcılar',
  'Bağcılar',
  'Bahçelievler',
  'Bakırköy',
  'Başakşehir',
  'Bayrampaşa',
  'Beşiktaş',
  'Beykoz',
  'Beylikdüzü',
  'Beyoğlu',
  'Büyükçekmece',
  'Çatalca',
  'Çekmeköy',
  'Esenler',
  'Esenyurt',
  'Eyüpsultan',
  'Fatih',
  'Gaziosmanpaşa',
  'Güngören',
  'Kadıköy',
  'Kağıthane',
  'Kartal',
  'Küçükçekmece',
  'Maltepe',
  'Pendik',
  'Sancaktepe',
  'Sarıyer',
  'Silivri',
  'Sultanbeyli',
  'Sultangazi',
  'Şile',
  'Şişli',
  'Tuzla',
  'Ümraniye',
  'Üsküdar',
  'Zeytinburnu',
];

/**
 * Türkçe karakter duyarlı küçük harfe çevirme yardımcısı
 */
function normalizeText(text: string): string {
  if (!text) return '';
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

/**
 * Adres metni içerisinden Kadıköy, Maltepe, Beşiktaş vb. ilçeleri bulan helper fonksiyon
 *
 * @param address - Eczane adres metni (Örn: "Caferağa Mah. Moda Cad. Kadıköy / İstanbul")
 * @param fallbackDist - API'den gelen veya varsayılan ilçe bilgisi
 * @returns Tespit edilen ilçe adı (Örn: "Kadıköy")
 */
export function extractDistrictFromAddress(address: string = '', fallbackDist: string = ''): string {
  // Eğer fallbackDist zaten geçerli bir ilçe adıysa (ve sadece "İstanbul" veya boş değilse) kontrol et
  if (fallbackDist && fallbackDist.trim() !== '' && fallbackDist.trim() !== 'İstanbul') {
    const matched = ISTANBUL_DISTRICTS.find(
      d => normalizeText(d) === normalizeText(fallbackDist.trim())
    );
    if (matched) return matched;
  }

  const normalizedAddress = normalizeText(address);

  // Adres metni içinde ilçeleri tara
  for (const district of ISTANBUL_DISTRICTS) {
    const normalizedDist = normalizeText(district);

    // Kelime sınırı veya regex kontrolü ile tam eşleşme ara
    // Örn: "... Kadıköy / İstanbul ..." veya "... Maltepe mah. ..."
    const regex = new RegExp(`\\b${normalizedDist}\\b`, 'i');
    if (regex.test(normalizedAddress) || normalizedAddress.includes(normalizedDist)) {
      return district;
    }
  }

  // Eğer hiçbir ilçe bulunamadıysa fallback veya "Merkez" döndür
  return fallbackDist && fallbackDist !== 'İstanbul' ? fallbackDist : 'Merkez';
}

/**
 * Mevcut eczane listesindeki benzersiz ilçeleri dinamik olarak filtre menüsüne çıkarır
 *
 * @param pharmacies - Eczane listesi
 * @returns ['Tüm İlçeler', 'Kadıköy', 'Maltepe', ...]
 */
export function getAvailableDistricts(pharmacies: Pharmacy[]): string[] {
  const districtSet = new Set<string>();

  pharmacies.forEach(item => {
    if (item.dist && item.dist !== 'Tüm İlçeler') {
      districtSet.add(item.dist);
    }
  });

  const sortedDistricts = Array.from(districtSet).sort((a, b) => a.localeCompare(b, 'tr'));
  return ['Tüm İlçeler', ...sortedDistricts];
}
