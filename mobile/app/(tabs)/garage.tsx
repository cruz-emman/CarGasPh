import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, CheckCircle, Car, Bike, ChevronRight, AlertCircle, Fuel } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Currency } from '../../src/constants/theme';
import { useGarageStore } from '../../src/stores/useGarageStore';

export default function GarageScreen() {
  const router = useRouter();
  const { vehicles, isLoading, error, fetchGarage, setDefaultVehicle } = useGarageStore();

  useEffect(() => {
    fetchGarage();
  }, []);

  const onRefresh = () => {
    fetchGarage();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      {/* Add Vehicle Button Header */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push('/garage/add-vehicle')}
        activeOpacity={0.8}
      >
        <Plus size={20} color={Colors.white} />
        <Text style={styles.addBtnText}>Add Vehicle to Garage</Text>
      </TouchableOpacity>

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <AlertCircle size={18} color={Colors.error} />
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}

      {/* Empty State */}
      {!isLoading && vehicles.length === 0 && (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIconCircle}>
            <Car size={36} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your Garage is Empty</Text>
          <Text style={styles.emptySub}>
            Add your motorcycle or car to unlock customized trip fuel consumption and cost calculations.
          </Text>
          <TouchableOpacity
            style={styles.emptyActionBtn}
            onPress={() => router.push('/garage/add-vehicle')}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyActionText}>Add Your First Vehicle</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Vehicles List */}
      {vehicles.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Vehicles ({vehicles.length})</Text>
            <Text style={styles.sectionSub}>Tap to view details or change default</Text>
          </View>

          {vehicles.map((v) => {
            const range = Math.round(v.tankCapacityLiters * v.fuelEconomyKmL);
            const cpk = 62.0 / v.fuelEconomyKmL;

            return (
              <TouchableOpacity
                key={v.id}
                style={[styles.vehicleCard, v.isDefault && styles.defaultCard]}
                onPress={() => router.push(`/garage/${v.id}`)}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.typeIcon}>
                    {v.category === 'motorcycle' ? (
                      <Bike size={24} color={Colors.primary} />
                    ) : (
                      <Car size={24} color={Colors.primary} />
                    )}
                  </View>
                  <View style={styles.vehicleInfo}>
                    <View style={styles.titleRow}>
                      <Text style={styles.vehicleName}>
                        {v.make} {v.model}
                      </Text>
                      {v.isDefault && (
                        <View style={styles.defaultBadge}>
                          <CheckCircle size={14} color={Colors.priceRollback} />
                          <Text style={styles.defaultText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.specsSub}>
                      {v.year} • {v.fuelType} • {v.tankCapacityLiters}L Tank
                    </Text>
                    {v.nickname && <Text style={styles.nicknameText}>"{v.nickname}"</Text>}
                  </View>
                  <ChevronRight size={18} color={Colors.textMuted} />
                </View>

                <View style={styles.divider} />

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Fuel Economy</Text>
                    <Text style={styles.statValue}>{v.fuelEconomyKmL.toFixed(1)} km/L</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Cost per km</Text>
                    <Text style={styles.statValue}>{Currency.format(cpk)}/km</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Est. Full Range</Text>
                    <Text style={styles.statValue}>{range} km</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </>
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
    paddingBottom: Spacing.xl,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
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
  emptyCard: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.full,
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  emptyActionBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.lg,
  },
  emptyActionText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  vehicleCard: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  defaultCard: {
    borderColor: Colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  typeIcon: {
    backgroundColor: '#1E3A5F',
    padding: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
  },
  vehicleInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.priceRollbackBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  defaultText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.priceRollback,
  },
  specsSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  nicknameText: {
    fontSize: 12,
    color: Colors.primaryLight,
    fontStyle: 'italic',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: Spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
});
