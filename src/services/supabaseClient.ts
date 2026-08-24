import { createClient } from '@supabase/supabase-js';
import { Pharmacy } from '../types/pharmacy';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Supabase `pharmacies` tablosundan eczaneleri çekme servisi
 */
export async function fetchPharmaciesFromSupabase(district?: string): Promise<Pharmacy[]> {
  try {
    let query = supabase.from('pharmacies').select('*');

    if (district && district !== 'Tüm İlçeler') {
      query = query.eq('dist', district);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase fetch error:', error.message);
      return [];
    }

    if (data && data.length > 0) {
      return data.map((item, index) => ({
        id: String(item.id || index + 1),
        name: item.name,
        dist: item.dist,
        city: item.city || 'İstanbul',
        address: item.address || '',
        addressNote: item.address_note || '',
        phone: item.phone || '',
        loc: item.loc || '',
        dutyHours: item.duty_hours || '09:00 - 19:00',
        dutyType: (item.duty_type as '24saat' | 'gece') || '24saat',
        dutyTypeLabel: item.duty_type_label || 'SABİT ECZANE',
        distance: item.distance || `${(0.5 + index * 0.2).toFixed(1)} km`,
        isOpenNow: item.is_open_now ?? true,
      }));
    }

    return [];
  } catch (err) {
    console.error('Error querying Supabase:', err);
    return [];
  }
}
