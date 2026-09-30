import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Bike, Car, CheckCircle, Trash2, Gauge, Fuel, Calendar, ArrowLeft } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Currency } from '../../src/constants/theme';
import { useGarageStore } from '../../src/stores/useGarageStore';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { vehicles, setDefaultVehicle, deleteVehicle } = useGarageStore();

  const vehicle = vehicles.find((v) => v.id === id);

  if (!vehicle) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Vehicle not found in garage.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Return to Garage</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fullRangeKm = Math.round(vehicle.tankCapacityLiters * vehicle.fuelEconomyKmL);
  const estimatedCpk = 62.0 / vehicle.fuelEconomyKmL; // Benchmark Gasoline RON 91

  const handleDelete = () => {
    Alert.alert(
      'Remove Vehicle',
      `Are you sure you want to remove "${vehicle.make} ${vehicle.model}" from your garage?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await deleteVehicle(vehicle.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleSetDefault = async () => {
    await setDefaultVehicle(vehicle.id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Card */}
      <View style={[styles.headerCard, vehicle.isDefault && styles.headerCardDefault]}>
        <View style={styles.iconCircle}>
          {vehicle.category === 'motorcycle' ? (
            <Bike size={32} color={Colors.white} />
          ) : (
            <Car size={32} color={Colors.white} />
          )}
        </View>
        <Text style={styles.vehicleTitle}>{vehicle.make} {vehicle.model}</Text>
        {vehicle.nickname && <Text style={styles.vehicleNickname}>"{vehicle.nickname}"</Text>}
        <Text style={styles.vehicleYear}>{vehicle.year} • {vehicle.category.toUpperCase()}</Text>

        {vehicle.isDefault ? (
          <View style={styles.defaultBadge}>
            <CheckCircle size={16} color={Colors.priceRollback} />
            <Text style={styles.defaultBadgeText}>Active / Default Vehicle</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.setDefaultBtn} onPress={handleSetDefault} activeOpacity={0.8}>
            <Text style={styles.setDefaultBtnText}>Set as Active Vehicle</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Core Specs Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Performance & Capacity</Text>
      </View>
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Gauge size={22} color={Colors.primary} />
          <Text style={styles.metricValue}>{vehicle.fuelEconomyKmL.toFixed(1)} km/L</Text>
          <Text style={styles.metricLabel}>Fuel Economy</Text>
        </View>
        <View style={styles.metricCard}>
          <Fuel size={22} color={Colors.accent} />
          <Text style={styles.metricValue}>{vehicle.tankCapacityLiters.toFixed(1)} L</Text>
          <Text style={styles.metricLabel}>Tank Capacity</Text>
        </View>
        <View style={styles.metricCard}>
          <CheckCircle size={22} color={Colors.priceRollback} />
          <Text style={styles.metricValue}>{fullRangeKm} km</Text>
          <Text style={styles.metricLabel}>Est. Full Range</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.currencyIcon}>{Currency.symbol}</Text>
          <Text style={styles.metricValue}>{Currency.format(estimatedCpk)}</Text>
          <Text style={styles.metricLabel}>Cost per km</Text>
        </View>
      </View>

      {/* Fuel Requirements Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Fuel Grade</Text>
        <Text style={styles.infoValue}>{vehicle.fuelType}</Text>
        <Text style={styles.infoDesc}>
          Recommended minimum fuel rating for this engine to achieve optimal combustion efficiency and fuel economy.
        </Text>
      </View>

      {/* Delete Vehicle Action */}
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8}>
        <Trash2 size={18} color={Colors.error} />
        <Text style={styles.deleteBtnText}>Remove from Garage</Text>
      </TouchableOpacity>
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
    paddingBottom: Spacing.xl,
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  backBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
  },
  backBtnText: {
    color: Colors.white,
    fontWeight: '700',
  },
  headerCard: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerCardDefault: {
    borderColor: Colors.primary,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  vehicleTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  vehicleNickname: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  vehicleYear: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.priceRollbackBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.priceRollback,
  },
  setDefaultBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  setDefaultBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 6,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  currencyIcon: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryLight,
  },
  infoCard: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  infoTitle: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm + 4,
  },
  deleteBtnText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '700',
  },
});
