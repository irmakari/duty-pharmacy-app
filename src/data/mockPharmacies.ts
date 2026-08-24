import { Pharmacy } from '../types/pharmacy';
import istanbulPharmaciesData from './istanbulPharmacies.json';

export const MOCK_PHARMACIES: Pharmacy[] = (istanbulPharmaciesData as Pharmacy[]);

export const DISTRICTS: string[] = [
  'Tüm İlçeler',
  'Kadıköy',
  'Beşiktaş',
  'Şişli',
  'Üsküdar',
  'Bakırköy',
  'Fatih',
  'Maltepe',
  'Ataşehir',
  'Ümraniye',
  'Pendik',
  'Kartal',
];
