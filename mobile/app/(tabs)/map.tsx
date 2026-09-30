import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Search, Navigation, Fuel, Clock, Gauge, ArrowRight } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Currency } from '../../src/constants/theme';

export default function MapScreen() {
  const [destination, setDestination] = useState('Tagaytay City');
  const [isRoundTrip, setIsRoundTrip] = useState(false);

  // Mock initial calculated route for display
  const distanceKm = 74.0;
  const durationText = '2 hrs 15 mins';
  const fuelEconomyKmL = 40.0; // Yamaha Aerox
  const fuelPricePhp = 62.0;

  const litersRequired = isRoundTrip ? (distanceKm * 2) / fuelEconomyKmL : distanceKm / fuelEconomyKmL;
  const estimatedCost = litersRequired * fuelPricePhp;

  return (
    <View style={styles.container}>
      {/* Search Bar Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destination in the Philippines..."
            placeholderTextColor={Colors.textMuted}
            value={destination}
            onChangeText={setDestination}
          />
        </View>
      </View>

      {/* Map Canvas Placeholder (Ready for react-native-maps in Phase 4) */}
      <View style={styles.mapCanvas}>
        <View style={styles.mockRouteCenter}>
          <Navigation size={48} color={Colors.primary} />
          <Text style={styles.mapLabel}>Quezon City ➔ {destination}</Text>
          <Text style={styles.mapSubLabel}>Interactive Google Maps will render here</Text>
        </View>
      </View>

      {/* Floating Route & Fuel Cost Estimate Card */}
      <View style={styles.costCard}>
        <View style={styles.costHeader}>
          <View>
            <Text style={styles.destinationTitle}>{destination}</Text>
            <Text style={styles.routeMetrics}>
              {isRoundTrip ? `${distanceKm * 2} km (Round-trip)` : `${distanceKm} km (One-way)`} • {durationText}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.toggleBtn, isRoundTrip && styles.toggleBtnActive]}
            onPress={() => setIsRoundTrip(!isRoundTrip)}
          >
            <Text style={[styles.toggleText, isRoundTrip && styles.toggleTextActive]}>
              {isRoundTrip ? 'Round Trip' : 'One Way'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.costGrid}>
          <View style={styles.costMetric}>
            <Text style={styles.metricLabel}>Estimated Fuel</Text>
            <Text style={styles.metricValue}>{litersRequired.toFixed(2)} L</Text>
          </View>
          <View style={styles.costMetric}>
            <Text style={styles.metricLabel}>Fuel Price</Text>
            <Text style={styles.metricValue}>{Currency.format(fuelPricePhp)}/L</Text>
          </View>
          <View style={styles.costMetric}>
            <Text style={styles.metricLabel}>Trip Expense</Text>
            <Text style={styles.costTotal}>{Currency.format(estimatedCost)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.navigateBtn} activeOpacity={0.8}>
          <Text style={styles.navigateBtnText}>Start Preview Navigation</Text>
          <ArrowRight size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 50,
    gap: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#0B1120',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockRouteCenter: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  mapLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  mapSubLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  costCard: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  costHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destinationTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  routeMetrics: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  toggleBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: Colors.primary,
  },
  toggleText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: Colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: Spacing.sm,
  },
  costGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  costMetric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  costTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.priceRollback,
  },
  navigateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.xs,
  },
  navigateBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
