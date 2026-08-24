export type DutyType = '24saat' | 'gece' | 'all';

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
  dutyType: '24saat' | 'gece';
  dutyTypeLabel: string;
  distance: string;
  isOpenNow: boolean;
  rating?: number;
}

export type SortByOption = 'distance' | 'name';

export interface FavoritesMap {
  [id: string]: boolean;
}
