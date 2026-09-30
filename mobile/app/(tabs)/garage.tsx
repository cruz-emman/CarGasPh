import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, CheckCircle, Car, Bike, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Currency } from '../../src/constants/theme';

export default function GarageScreen() {
  const vehicles = [
    {
      id: '1',
      name: 'Yamaha Aerox 155',
      year: 2026,
      category: 'motorcycle',
      fuelType: 'Gasoline RON 91',
      tankLiters: 5.5,
      kmL: 40.0,
      isDefault: true,
      cpk: 1.55,
    },
    {
      id: '2',
      name: 'Toyota Vios 1.3E Dual VVT-i',
      year: 2024,
      category: 'car',
      fuelType: 'Gasoline RON 95',
      tankLiters: 42.0,
      kmL: 14.5,
      isDefault: false,
      cpk: 4.52,
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Add Vehicle Button Header */}
      <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
        <Plus size={20} color={Colors.white} />
        <Text style={styles.addBtnText}>Add Vehicle to Garage</Text>
      </TouchableOpacity>

      {/* Vehicles List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Vehicles ({vehicles.length})</Text>
      </View>

      {vehicles.map((v) => (
        <View key={v.id} style={[styles.vehicleCard, v.isDefault && styles.defaultCard]}>
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
                <Text style={styles.vehicleName}>{v.name}</Text>
                {v.isDefault && (
                  <View style={styles.defaultBadge}>
                    <CheckCircle size={14} color={Colors.priceRollback} />
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.specsSub}>
                {v.year} • {v.fuelType} • {v.tankLiters}L Tank
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Fuel Economy</Text>
              <Text style={styles.statValue}>{v.kmL.toFixed(1)} km/L</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Cost per km</Text>
              <Text style={styles.statValue}>{Currency.format(v.cpk)}/km</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Est. Full Range</Text>
              <Text style={styles.statValue}>{(v.tankLiters * v.kmL).toFixed(0)} km</Text>
            </View>
          </View>
        </View>
      ))}
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
  },
  addBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
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
