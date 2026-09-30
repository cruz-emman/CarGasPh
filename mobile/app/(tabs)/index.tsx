import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { TrendingDown, TrendingUp, Navigation, Fuel, Sparkles, ChevronRight, PlusCircle, Car } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Currency } from '../../src/constants/theme';
import { useGarageStore } from '../../src/stores/useGarageStore';

export default function HomeScreen() {
  const router = useRouter();
  const { defaultVehicle, fetchGarage } = useGarageStore();

  useEffect(() => {
    fetchGarage();
  }, []);

  const activeVehicle = defaultVehicle;
  const cpk = activeVehicle ? 62.0 / activeVehicle.fuelEconomyKmL : 1.55;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Magandang araw! 🇵🇭</Text>
        <Text style={styles.subGreeting}>Where are we driving today?</Text>
      </View>

      {/* Fuel Movement Advisory Banner */}
      <View style={styles.movementBanner}>
        <View style={styles.movementBadge}>
          <TrendingDown size={18} color={Colors.priceRollback} />
          <Text style={styles.movementTitle}>Fuel Rollback This Week</Text>
        </View>
        <Text style={styles.movementDetail}>
          Diesel drops by ₱0.70/L • Gasoline increases by ₱1.20/L
        </Text>
        <Text style={styles.movementSource}>Source: DOE Advisory • Effective Tuesday 6:00 AM</Text>
      </View>

      {/* Active Vehicle Card */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Vehicle</Text>
        {activeVehicle && (
          <TouchableOpacity onPress={() => router.push('/(tabs)/garage')}>
            <Text style={styles.switchText}>Switch</Text>
          </TouchableOpacity>
        )}
      </View>

      {activeVehicle ? (
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push(`/garage/${activeVehicle.id}`)}
          activeOpacity={0.85}
        >
          <View style={styles.vehicleRow}>
            <View>
              <Text style={styles.vehicleName}>
                {activeVehicle.make} {activeVehicle.model}
              </Text>
              <Text style={styles.vehicleCategory}>
                {activeVehicle.category.toUpperCase()} • {activeVehicle.year}
                {activeVehicle.nickname ? ` • "${activeVehicle.nickname}"` : ''}
              </Text>
            </View>
            <View style={styles.economyBadge}>
              <Text style={styles.economyText}>{activeVehicle.fuelEconomyKmL.toFixed(1)} km/L</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.vehicleMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Fuel Required</Text>
              <Text style={styles.metricValue}>{activeVehicle.fuelType}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Cost per km</Text>
              <Text style={styles.metricValue}>{Currency.format(cpk)}/km</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Tank Capacity</Text>
              <Text style={styles.metricValue}>{activeVehicle.tankCapacityLiters} L</Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.emptyVehicleCard}
          onPress={() => router.push('/garage/add-vehicle')}
          activeOpacity={0.8}
        >
          <PlusCircle size={28} color={Colors.primary} />
          <View style={styles.emptyVehicleTextCol}>
            <Text style={styles.emptyVehicleTitle}>No Active Vehicle Configured</Text>
            <Text style={styles.emptyVehicleSub}>Tap to add your car or motorcycle to calculate trip fuel cost</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Quick Navigation Action Card */}
      <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
        <View style={styles.actionIconContainer}>
          <Navigation size={24} color={Colors.white} />
        </View>
        <View style={styles.actionTextContainer}>
          <Text style={styles.actionTitle}>Plan Trip & Estimate Fuel Cost</Text>
          <Text style={styles.actionSubtitle}>Search destination to calculate liters & pesos</Text>
        </View>
        <ChevronRight size={20} color={Colors.textMuted} />
      </TouchableOpacity>

      {/* Prevailing Fuel Prices Snapshot */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Metro Manila Prevailing Prices</Text>
        <Text style={styles.sectionBadge}>DOE Official</Text>
      </View>
      <View style={styles.pricesRow}>
        <View style={styles.priceCard}>
          <Text style={styles.priceProduct}>Gasoline 91</Text>
          <Text style={styles.priceAmount}>{Currency.format(62.0)}</Text>
          <Text style={styles.priceUnit}>per liter</Text>
        </View>
        <View style={styles.priceCard}>
          <Text style={styles.priceProduct}>Gasoline 95</Text>
          <Text style={styles.priceAmount}>{Currency.format(65.5)}</Text>
          <Text style={styles.priceUnit}>per liter</Text>
        </View>
        <View style={styles.priceCard}>
          <Text style={styles.priceProduct}>Diesel</Text>
          <Text style={styles.priceAmount}>{Currency.format(58.2)}</Text>
          <Text style={styles.priceUnit}>per liter</Text>
        </View>
      </View>
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
  header: {
    marginBottom: Spacing.md,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  subGreeting: {
    fontSize: 15,
    color: Colors.textMuted,
    marginTop: 2,
  },
  movementBanner: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  movementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  movementTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.priceRollback,
  },
  movementDetail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  movementSource: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionBadge: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  switchText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyVehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  emptyVehicleTextCol: {
    flex: 1,
  },
  emptyVehicleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyVehicleSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  vehicleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  vehicleCategory: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  economyBadge: {
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  economyText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: Spacing.md,
  },
  vehicleMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionIconContainer: {
    backgroundColor: Colors.primary,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.primaryLight,
    marginTop: 2,
  },
  pricesRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priceCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  priceProduct: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  priceAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  priceUnit: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
