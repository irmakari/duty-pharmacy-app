export type DutyType = 'sabit' | '24saat' | 'gece' | 'nobetci' | 'open' | 'all';

export interface Pharmacy {
  id: string;
  name: string;
  dist: string;
  city: string;
  address: string;
  addressNote?: string;
  phone: string;
  loc?: string;
  dutyHours: string;
  dutyType: 'sabit' | '24saat' | 'gece';
  dutyTypeLabel: string;
  distance: string;
  isOpenNow: boolean;
  workingHours?: string;
  rating?: number;
}

export type SortByOption = 'distance' | 'name';

export interface FavoritesMap {
  [id: string]: boolean;
}
