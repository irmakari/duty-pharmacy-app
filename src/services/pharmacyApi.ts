import { Pharmacy } from '../types/pharmacy';
import { MOCK_PHARMACIES } from '../data/mockPharmacies';
import { extractDistrictFromAddress } from '../utils/districtExtractor';

/**
 * CollectAPI Duty Pharmacy API Integration Service with Rate-limiting & Cache
 */
export const COLLECT_API_KEY: string =
  process.env.EXPO_PUBLIC_COLLECT_API_KEY ||
  process.env.COLLECT_API_KEY ||
  '';

interface CollectApiResultItem {
  name: string;
  dist: string;
  address: string;
  phone: string;
  loc?: string;
  Directions?: string;
  addressNote?: string;
  distance?: string;
}

interface CollectApiResponse {
  success: boolean;
  result?: CollectApiResultItem[];
}

// ------------------------------------------------------------------
// CACHE SYSTEM (API kotalarını korumak için 10 dakikalık hafıza önbelleği)
// ------------------------------------------------------------------
interface CacheEntry {
  timestamp: number;
  data: Pharmacy[];
}

const apiCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 dakika TTL

function getFormattedKey(rawKey: string): string {
  const clean = rawKey.trim();
  if (clean.toLowerCase().startsWith('apikey ')) {
    return clean;
  }
  return `apikey ${clean}`;
}

export async function fetchDutyPharmacies(
  il: string = 'Istanbul',
  ilce: string = '',
  forceRefresh: boolean = false
): Promise<Pharmacy[]> {
  const rawKey = COLLECT_API_KEY.trim();

  // API Key tanımlanmamışsa doğrudan Mock veriyi dön
  if (!rawKey) {
    return MOCK_PHARMACIES;
  }

  const cacheKey = `${il.toLowerCase()}-${(ilce || 'all').toLowerCase()}`;

  // Önbellek kontrolü (Zorunlu yenileme istenmediyse ve 10 dk dolmadıysa önbellekten sun)
  if (!forceRefresh && apiCache.has(cacheKey)) {
    const entry = apiCache.get(cacheKey)!;
    if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
      return entry.data;
    }
  }

  try {
    let url = `https://api.collectapi.com/health/dutyPharmacy?il=${encodeURIComponent(il)}`;
    if (ilce && ilce !== 'Tüm İlçeler') {
      url += `&ilce=${encodeURIComponent(ilce)}`;
    }

    const authHeader = getFormattedKey(rawKey);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': authHeader,
      },
    });

    if (!response.ok) {
      const textError = await response.text();
      console.warn(`CollectAPI HTTP ${response.status} hatası döndü:`, textError);
      return apiCache.get(cacheKey)?.data || MOCK_PHARMACIES;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const textError = await response.text();
      console.warn('CollectAPI beklenmeyen yanıt türü döndü (JSON değil):', textError);
      return apiCache.get(cacheKey)?.data || MOCK_PHARMACIES;
    }

    const json = (await response.json()) as CollectApiResponse;

    if (json && json.success && Array.isArray(json.result) && json.result.length > 0) {
      const formattedPharmacies: Pharmacy[] = json.result.map((item, index) => ({
        id: String(index + 1),
        name: item.name.endsWith('Eczanesi') ? item.name : `${item.name} Eczanesi`,
        dist: extractDistrictFromAddress(item.address, item.dist || ilce),
        city: il,
        address: item.address,
        addressNote: item.Directions || item.addressNote || '',
        phone: item.phone,
        loc: item.loc || '',
        dutyHours: '24 Saat Nöbetçi (08:30 - 08:30)',
        dutyType: '24saat' as const,
        dutyTypeLabel: '24 SAAT NÖBETÇİ',
        distance: item.distance || `${(0.4 + index * 0.7).toFixed(1)} km`,
        isOpenNow: true,
      }));

      // Cache güncelle
      apiCache.set(cacheKey, {
        timestamp: Date.now(),
        data: formattedPharmacies,
      });

      return formattedPharmacies;
    } else {
      console.warn('CollectAPI sonuç döndürmedi. Mock veriye geçiliyor.');
      return apiCache.get(cacheKey)?.data || MOCK_PHARMACIES;
    }
  } catch (error) {
    console.error('CollectAPI isteğinde ağ veya ayrıştırma hatası:', error);
    return apiCache.get(cacheKey)?.data || MOCK_PHARMACIES;
  }
}
