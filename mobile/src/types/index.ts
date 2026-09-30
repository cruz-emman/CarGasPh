export type VehicleCategory = 'motorcycle' | 'car' | 'suv' | 'mpv' | 'pickup' | 'van';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: 'USER' | 'ADMIN';
}

export interface UserVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  nickname?: string;
  category: VehicleCategory;
  fuelType: 'Gasoline RON 91' | 'Gasoline RON 95' | 'Gasoline RON 97+' | 'Diesel';
  tankCapacityLiters: number;
  fuelEconomyKmL: number;
  personalAverageKmL?: number;
  currentOdometerKm?: number;
  isDefault: boolean;
}

export interface FuelPriceItem {
  id: string;
  fuelTypeCode: 'RON91' | 'RON95' | 'RON97' | 'DIESEL' | 'KEROSENE';
  displayName: string;
  priceAvg: number;
  priceLow?: number;
  priceHigh?: number;
  dateEffective: string;
  source: string;
  verificationStatus: 'OFFICIAL' | 'VERIFIED_PARTNER' | 'COMMUNITY_VERIFIED' | 'COMMUNITY' | 'ESTIMATED';
}

export interface FuelPriceMovement {
  id: string;
  fuelTypeCode: string;
  displayName: string;
  deltaAmount: number;
  movementType: 'HIKE' | 'ROLLBACK' | 'NO_CHANGE';
  effectiveDate: string;
  announcementDate: string;
  source: string;
}

export interface RouteCalculationResult {
  distanceKm: number;
  durationSeconds: number;
  durationFormatted: string;
  polyline: string;
  fuelRequiredLiters: number;
  estimatedCostPhp: number;
  roundTripCostPhp: number;
  costPerKmPhp: number;
  rangeWarning: boolean;
}

export interface GasStationItem {
  id: string;
  brandName: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  distanceMeters: number;
  amenities?: Record<string, boolean>;
}
