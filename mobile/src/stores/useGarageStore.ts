import { create } from 'zustand';
import { UserVehicle } from '../types';
import { vehicleService, CreateVehiclePayload } from '../services/vehicle.service';

interface GarageState {
  vehicles: UserVehicle[];
  defaultVehicle: UserVehicle | null;
  isLoading: boolean;
  error: string | null;

  fetchGarage: () => Promise<void>;
  addVehicle: (payload: CreateVehiclePayload) => Promise<UserVehicle>;
  setDefaultVehicle: (id: string) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useGarageStore = create<GarageState>((set, get) => ({
  vehicles: [],
  defaultVehicle: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchGarage: async () => {
    set({ isLoading: true, error: null });
    try {
      const list = await vehicleService.getGarage();
      const defaultVeh = list.find((v) => v.isDefault) || (list.length > 0 ? list[0] : null);
      set({ vehicles: list, defaultVehicle: defaultVeh, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to load garage vehicles.' });
    }
  },

  addVehicle: async (payload: CreateVehiclePayload) => {
    set({ isLoading: true, error: null });
    try {
      const newVehicle = await vehicleService.addVehicle(payload);
      const updatedList = get().vehicles.map((v) =>
        newVehicle.isDefault ? { ...v, isDefault: false } : v
      );
      const finalList = [newVehicle, ...updatedList];
      const defaultVeh = newVehicle.isDefault ? newVehicle : get().defaultVehicle || newVehicle;

      set({
        vehicles: finalList,
        defaultVehicle: defaultVeh,
        isLoading: false,
      });
      return newVehicle;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to add vehicle.' });
      throw err;
    }
  },

  setDefaultVehicle: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await vehicleService.setDefaultVehicle(id);
      const list = get().vehicles.map((v) => ({
        ...v,
        isDefault: v.id === id,
      }));
      set({ vehicles: list, defaultVehicle: updated, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to set default vehicle.' });
      throw err;
    }
  },

  deleteVehicle: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await vehicleService.deleteVehicle(id);
      const filtered = get().vehicles.filter((v) => v.id !== id);
      const wasDefault = get().defaultVehicle?.id === id;
      let newDefault = get().defaultVehicle;

      if (wasDefault) {
        newDefault = filtered.length > 0 ? { ...filtered[0], isDefault: true } : null;
        if (newDefault) {
          filtered[0].isDefault = true;
        }
      }

      set({ vehicles: filtered, defaultVehicle: newDefault, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Failed to delete vehicle.' });
      throw err;
    }
  },
}));
