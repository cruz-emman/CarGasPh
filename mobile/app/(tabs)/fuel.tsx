import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TrendingDown, TrendingUp, Minus, Calendar, ShieldCheck } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Currency } from '../../src/constants/theme';

export default function FuelScreen() {
  const [selectedRange, setSelectedRange] = useState('This Week');

  const movements = [
    { product: 'Gasoline (RON 91/95)', delta: +1.20, type: 'HIKE', effective: 'Oct 6, 2026' },
    { product: 'Diesel', delta: -0.70, type: 'ROLLBACK', effective: 'Oct 6, 2026' },
    { product: 'Kerosene', delta: -0.40, type: 'ROLLBACK', effective: 'Oct 6, 2026' },
  ];

  const prices = [
    { name: 'Gasoline Unleaded (RON 91)', avg: 62.00, low: 59.80, high: 64.50 },
    { name: 'Gasoline Premium (RON 95)', avg: 65.50, low: 62.90, high: 68.20 },
    { name: 'Gasoline Racing (RON 97+)', avg: 69.80, low: 66.50, high: 73.00 },
    { name: 'Automotive Diesel Oil', avg: 58.20, low: 55.40, high: 61.00 },
    { name: 'Kerosene', avg: 72.10, low: 69.00, high: 75.30 },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Official Data Source Banner */}
      <View style={styles.trustBanner}>
        <ShieldCheck size={18} color={Colors.primary} />
        <View style={styles.trustTextCol}>
          <Text style={styles.trustTitle}>Philippine Department of Energy (DOE)</Text>
          <Text style={styles.trustSub}>Official Weekly Monitoring • Metro Manila (NCR)</Text>
        </View>
      </View>

      {/* Price Movements Card */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Price Adjustments</Text>
        <Text style={styles.effectiveBadge}>Effective: Tuesday, 6:00 AM</Text>
      </View>
      <View style={styles.card}>
        {movements.map((item, index) => {
          const isRollback = item.type === 'ROLLBACK';
          return (
            <View key={index} style={[styles.movementItem, index > 0 && styles.itemBorder]}>
              <View>
                <Text style={styles.movementProduct}>{item.product}</Text>
                <Text style={styles.movementDate}>{item.effective}</Text>
              </View>
              <View
                style={[
                  styles.movementDeltaBadge,
                  { backgroundColor: isRollback ? Colors.priceRollbackBg : Colors.priceHikeBg },
                ]}
              >
                {isRollback ? (
                  <TrendingDown size={16} color={Colors.priceRollback} />
                ) : (
                  <TrendingUp size={16} color={Colors.priceHike} />
                )}
                <Text
                  style={[
                    styles.movementDeltaText,
                    { color: isRollback ? Colors.priceRollback : Colors.priceHike },
                  ]}
                >
                  {isRollback ? `-₱${Math.abs(item.delta).toFixed(2)}/L` : `+₱${item.delta.toFixed(2)}/L`}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Historical Range Filter */}
      <View style={styles.timeFilter}>
        {['This Week', 'Last Week', '1 Month', '3 Months', '1 Year'].map((range) => (
          <TouchableOpacity
            key={range}
            style={[styles.filterChip, selectedRange === range && styles.filterChipActive]}
            onPress={() => setSelectedRange(range)}
          >
            <Text
              style={[styles.filterChipText, selectedRange === range && styles.filterChipTextActive]}
            >
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Prevailing Pump Prices List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Prevailing Pump Prices</Text>
      </View>
      {prices.map((fuel, index) => (
        <View key={index} style={styles.priceRowCard}>
          <View style={styles.priceInfo}>
            <Text style={styles.fuelTitle}>{fuel.name}</Text>
            <Text style={styles.fuelRange}>
              Range: {Currency.format(fuel.low)} – {Currency.format(fuel.high)}
            </Text>
          </View>
          <View style={styles.priceValueCol}>
            <Text style={styles.fuelAvg}>{Currency.format(fuel.avg)}</Text>
            <Text style={styles.fuelPerL}>average / liter</Text>
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
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  trustTextCol: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  trustSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  effectiveBadge: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '600',
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  movementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  itemBorder: {
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  movementProduct: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  movementDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  movementDeltaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  movementDeltaText: {
    fontSize: 14,
    fontWeight: '700',
  },
  timeFilter: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  filterChip: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  priceRowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  priceInfo: {
    flex: 1,
  },
  fuelTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  fuelRange: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  priceValueCol: {
    alignItems: 'flex-end',
  },
  fuelAvg: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primaryLight,
  },
  fuelPerL: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
