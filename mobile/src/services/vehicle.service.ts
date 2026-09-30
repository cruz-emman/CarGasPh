import { apiClient } from './api';
import { UserVehicle, VehicleCategory } from '../types';

export interface VehicleMake {
  id: number;
  name: string;
  category: VehicleCategory;
}

export interface VehicleVariant {
  id: number;
  model_id: number;
  name: string;
  year: number;
  engine_displacement?: string;
  transmission?: string;
  fuel_type: string;
  tank_capacity_liters: number;
  official_fuel_economy_kml: float;
  fuel_economy_source: string;
}

export interface VehicleModel {
  id: number;
  make_id: number;
  name: string;
  year_start?: number;
  year_end?: number;
  variants: VehicleVariant[];
}

export interface VehicleCatalogItem {
  variant_id: number;
  make: string;
  model: string;
  variant: string;
  year: number;
  category: string;
  fuel_type: string;
  tank_capacity_liters: number;
  official_fuel_economy_kml: number;
  engine_displacement?: string;
  transmission?: string;
}

export interface CreateVehiclePayload {
  variant_id?: number;
  custom_make?: string;
  custom_model?: string;
  year: number;
  nickname?: string;
  vehicle_type: VehicleCategory;
  fuel_type: string;
  tank_capacity_liters: number;
  custom_fuel_economy_kml: number;
  current_odometer_km?: number;
  is_default?: boolean;
}

export const vehicleService = {
  async getMakes(category?: string): Promise<VehicleMake[]> {
    const query = category ? `?category=${category}` : '';
    return apiClient<VehicleMake[]>(`/vehicles/makes${query}`);
  },

  async getModels(makeId: number): Promise<VehicleModel[]> {
    return apiClient<VehicleModel[]>(`/vehicles/models?make_id=${makeId}`);
  },

  async getVariants(modelId: number): Promise<VehicleVariant[]> {
    return apiClient<VehicleVariant[]>(`/vehicles/variants?model_id=${modelId}`);
  },

  async searchCatalog(query: string, category?: string): Promise<VehicleCatalogItem[]> {
    const catQuery = category ? `&category=${category}` : '';
    return apiClient<VehicleCatalogItem[]>(`/vehicles/search?q=${encodeURIComponent(query)}${catQuery}`);
  },

  async getGarage(): Promise<UserVehicle[]> {
    const rawList = await apiClient<any[]>('/garage');
    return rawList.map(mapBackendVehicle);
  },

  async getDefaultVehicle(): Promise<UserVehicle | null> {
    try {
      const raw = await apiClient<any>('/garage/default');
      return mapBackendVehicle(raw);
    } catch {
      return null;
    }
  },

  async addVehicle(payload: CreateVehiclePayload): Promise<UserVehicle> {
    const raw = await apiClient<any>('/garage', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapBackendVehicle(raw);
  },

  async updateVehicle(id: string, payload: Partial<CreateVehiclePayload>): Promise<UserVehicle> {
    const raw = await apiClient<any>(`/garage/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapBackendVehicle(raw);
  },

  async setDefaultVehicle(id: string): Promise<UserVehicle> {
    const raw = await apiClient<any>(`/garage/${id}/default`, {
      method: 'PATCH',
    });
    return mapBackendVehicle(raw);
  },

  async deleteVehicle(id: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/garage/${id}`, {
      method: 'DELETE',
    });
  },
};

function mapBackendVehicle(raw: any): UserVehicle {
  return {
    id: raw.id,
    make: raw.make,
    model: raw.model,
    year: raw.year,
    nickname: raw.nickname,
    category: raw.vehicle_type as VehicleCategory,
    fuelType: raw.fuel_type,
    tankCapacityLiters: raw.tank_capacity_liters,
    fuelEconomyKmL: raw.fuel_economy_kml,
    personalAverageKmL: raw.personal_average_kml,
    currentOdometerKm: raw.current_odometer_km,
    isDefault: raw.is_default,
  };
}
