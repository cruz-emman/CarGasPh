import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Bike, Car, Check, ChevronRight, Fuel, AlertCircle } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../../src/constants/theme';
import { vehicleService, VehicleCatalogItem } from '../../src/services/vehicle.service';
import { useGarageStore } from '../../src/stores/useGarageStore';
import { VehicleCategory } from '../../src/types';

export default function AddVehicleScreen() {
  const router = useRouter();
  const { addVehicle, isLoading } = useGarageStore();

  const [mode, setMode] = useState<'catalog' | 'custom'>('catalog');
  const [category, setCategory] = useState<VehicleCategory>('motorcycle');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VehicleCatalogItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<VehicleCatalogItem | null>(null);

  // Custom Form Fields
  const [customMake, setCustomMake] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [year, setYear] = useState('2024');
  const [nickname, setNickname] = useState('');
  const [fuelType, setFuelType] = useState('Gasoline RON 91');
  const [tankCapacity, setTankCapacity] = useState('5.5');
  const [fuelEconomy, setFuelEconomy] = useState('40.0');
  const [odometer, setOdometer] = useState('');
  const [isDefault, setIsDefault] = useState(true);

  const [formError, setFormError] = useState<string | null>(null);

  // Debounced catalog search
  useEffect(() => {
    if (mode !== 'catalog' || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await vehicleService.searchCatalog(searchQuery, category);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, category, mode]);

  // When a catalog item is chosen, pre-fill values
  const handleSelectCatalogItem = (item: VehicleCatalogItem) => {
    setSelectedCatalogItem(item);
    setCustomMake(item.make);
    setCustomModel(`${item.model} ${item.variant}`);
    setYear(item.year.toString());
    setFuelType(item.fuel_type);
    setTankCapacity(item.tank_capacity_liters.toString());
    setFuelEconomy(item.official_fuel_economy_kml.toString());
  };

  const handleSave = async () => {
    setFormError(null);

    const tankNum = parseFloat(tankCapacity);
    const economyNum = parseFloat(fuelEconomy);
    const yearNum = parseInt(year, 10);
    const odoNum = odometer ? parseFloat(odometer) : undefined;

    if (!customMake.trim() || !customModel.trim()) {
      setFormError('Please specify the vehicle make and model.');
      return;
    }

    if (isNaN(yearNum) || yearNum < 1970 || yearNum > 2030) {
      setFormError('Please enter a valid model year (e.g. 2024).');
      return;
    }

    if (isNaN(tankNum) || tankNum <= 0) {
      setFormError('Tank capacity must be greater than zero liters.');
      return;
    }

    if (isNaN(economyNum) || economyNum <= 0) {
      setFormError('Fuel economy must be greater than zero km/L.');
      return;
    }

    try {
      await addVehicle({
        variant_id: selectedCatalogItem ? selectedCatalogItem.variant_id : undefined,
        custom_make: customMake.trim(),
        custom_model: customModel.trim(),
        year: yearNum,
        nickname: nickname.trim() || undefined,
        vehicle_type: category,
        fuel_type: fuelType,
        tank_capacity_liters: tankNum,
        custom_fuel_economy_kml: economyNum,
        current_odometer_km: odoNum,
        is_default: isDefault,
      });

      router.back();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save vehicle. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Category Segment Selector */}
      <View style={styles.categorySelector}>
        <TouchableOpacity
          style={[styles.categoryBtn, category === 'motorcycle' && styles.categoryBtnActive]}
          onPress={() => {
            setCategory('motorcycle');
            setSelectedCatalogItem(null);
          }}
        >
          <Bike size={20} color={category === 'motorcycle' ? Colors.white : Colors.textMuted} />
          <Text style={[styles.categoryText, category === 'motorcycle' && styles.categoryTextActive]}>
            Motorcycle
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.categoryBtn, category === 'car' && styles.categoryBtnActive]}
          onPress={() => {
            setCategory('car');
            setSelectedCatalogItem(null);
          }}
        >
          <Car size={20} color={category === 'car' ? Colors.white : Colors.textMuted} />
          <Text style={[styles.categoryText, category === 'car' && styles.categoryTextActive]}>
            Car / SUV / Pickup
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mode Segment (Catalog vs Custom) */}
      <View style={styles.modeTabs}>
        <TouchableOpacity
          style={[styles.modeTab, mode === 'catalog' && styles.modeTabActive]}
          onPress={() => setMode('catalog')}
        >
          <Text style={[styles.modeTabText, mode === 'catalog' && styles.modeTabTextActive]}>
            Philippine Catalog (Verified)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeTab, mode === 'custom' && styles.modeTabActive]}
          onPress={() => setMode('custom')}
        >
          <Text style={[styles.modeTabText, mode === 'custom' && styles.modeTabTextActive]}>
            Custom Entry
          </Text>
        </TouchableOpacity>
      </View>

      {formError && (
        <View style={styles.errorBanner}>
          <AlertCircle size={18} color={Colors.error} />
          <Text style={styles.errorBannerText}>{formError}</Text>
        </View>
      )}

      {/* Catalog Search Mode */}
      {mode === 'catalog' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Search Preloaded Philippine Models</Text>
          <Text style={styles.sectionSubtitle}>
            Top Philippine models with official and audited fuel ratings
          </Text>

          <View style={styles.searchBar}>
            <Search size={18} color={Colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder={category === 'motorcycle' ? "e.g. 'Aerox', 'Click', 'NMAX'" : "e.g. 'Vios', 'Innova', 'Mirage'"}
              placeholderTextColor={Colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {isSearching && <ActivityIndicator size="small" color={Colors.primary} />}
          </View>

          {/* Search Result Items */}
          {searchResults.length > 0 && !selectedCatalogItem && (
            <View style={styles.resultsContainer}>
              {searchResults.map((item) => (
                <TouchableOpacity
                  key={item.variant_id}
                  style={styles.resultItem}
                  onPress={() => handleSelectCatalogItem(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.resultDetails}>
                    <Text style={styles.resultTitle}>{item.make} {item.model}</Text>
                    <Text style={styles.resultSub}>
                      {item.variant} • {item.year} • {item.fuel_type}
                    </Text>
                  </View>
                  <View style={styles.resultMetric}>
                    <Text style={styles.resultKml}>{item.official_fuel_economy_kml.toFixed(1)} km/L</Text>
                    <ChevronRight size={16} color={Colors.textMuted} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Selected Catalog Item Confirmation */}
          {selectedCatalogItem && (
            <View style={styles.selectedBanner}>
              <View style={styles.selectedIcon}>
                <Check size={18} color={Colors.priceRollback} />
              </View>
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedTitle}>
                  {selectedCatalogItem.make} {selectedCatalogItem.model} {selectedCatalogItem.variant}
                </Text>
                <Text style={styles.selectedSpecs}>
                  {selectedCatalogItem.tank_capacity_liters}L Tank • {selectedCatalogItem.official_fuel_economy_kml} km/L verified
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedCatalogItem(null)}>
                <Text style={styles.changeLink}>Change</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Specifications & Customization Form */}
      {(mode === 'custom' || selectedCatalogItem) && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vehicle Specifications</Text>

          <View style={styles.inputRow}>
            <View style={[styles.inputCol, { flex: 2 }]}>
              <Text style={styles.inputLabel}>Make</Text>
              <TextInput
                style={styles.input}
                value={customMake}
                onChangeText={setCustomMake}
                placeholder="e.g. Yamaha"
                placeholderTextColor={Colors.textMuted}
                editable={mode === 'custom'}
              />
            </View>
            <View style={[styles.inputCol, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Year</Text>
              <TextInput
                style={styles.input}
                value={year}
                onChangeText={setYear}
                keyboardType="numeric"
                placeholder="2024"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Model & Variant</Text>
            <TextInput
              style={styles.input}
              value={customModel}
              onChangeText={setCustomModel}
              placeholder="e.g. Aerox 155 Standard"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Fuel Type Required</Text>
            <View style={styles.fuelOptions}>
              {['Gasoline RON 91', 'Gasoline RON 95', 'Gasoline RON 97+', 'Diesel'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.fuelChip, fuelType === type && styles.fuelChipActive]}
                  onPress={() => setFuelType(type)}
                >
                  <Text style={[styles.fuelChipText, fuelType === type && styles.fuelChipTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputCol}>
              <Text style={styles.inputLabel}>Tank Capacity (Liters)</Text>
              <TextInput
                style={styles.input}
                value={tankCapacity}
                onChangeText={setTankCapacity}
                keyboardType="decimal-pad"
                placeholder="e.g. 5.5"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <View style={styles.inputCol}>
              <Text style={styles.inputLabel}>Fuel Economy (km/L)</Text>
              <TextInput
                style={styles.input}
                value={fuelEconomy}
                onChangeText={setFuelEconomy}
                keyboardType="decimal-pad"
                placeholder="e.g. 40.0"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nickname (Optional)</Text>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="e.g. My Daily Ride"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Odometer (km, Optional)</Text>
            <TextInput
              style={styles.input}
              value={odometer}
              onChangeText={setOdometer}
              keyboardType="numeric"
              placeholder="e.g. 12500"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          {/* Default Vehicle Switch */}
          <View style={styles.defaultRow}>
            <View style={styles.defaultTextCol}>
              <Text style={styles.defaultTitle}>Set as Default Vehicle</Text>
              <Text style={styles.defaultSubtitle}>
                Automatically use this vehicle for trip fuel cost calculations
              </Text>
            </View>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: Colors.cardBorder, true: Colors.primary }}
            />
          </View>
        </View>
      )}

      {/* Save Button */}
      {(mode === 'custom' || selectedCatalogItem) && (
        <TouchableOpacity
          style={[styles.saveBtn, isLoading && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={styles.saveBtnText}>Save Vehicle to Garage</Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  categorySelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm + 4,
    gap: Spacing.xs,
  },
  categoryBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  categoryTextActive: {
    color: Colors.white,
  },
  modeTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    marginBottom: Spacing.md,
  },
  modeTab: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
  },
  modeTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  modeTabText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: Colors.primary,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B1219',
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm + 2,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  errorBannerText: {
    flex: 1,
    color: '#FECDD3',
    fontSize: 13,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm + 2,
    height: 46,
    gap: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
  },
  resultsContainer: {
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  resultDetails: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  resultSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  resultMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resultKml: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  selectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F291E',
    borderColor: Colors.priceRollback,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm + 4,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  selectedIcon: {
    backgroundColor: Colors.priceRollbackBg,
    padding: 6,
    borderRadius: BorderRadius.full,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  selectedSpecs: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  changeLink: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: Spacing.sm + 4,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm + 4,
  },
  inputCol: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.background,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm + 2,
    height: 44,
    color: Colors.text,
    fontSize: 14,
  },
  fuelOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  fuelChip: {
    backgroundColor: Colors.background,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 6,
  },
  fuelChipActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primary,
  },
  fuelChipText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  fuelChipTextActive: {
    color: Colors.white,
  },
  defaultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
    marginTop: Spacing.xs,
  },
  defaultTextCol: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  defaultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  defaultSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
