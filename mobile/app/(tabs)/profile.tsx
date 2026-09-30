import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Shield, MapPin, Fuel, HelpCircle, LogOut, ChevronRight } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/useAuthStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [hikeAlerts, setHikeAlerts] = useState(true);
  const [rollbackAlerts, setRollbackAlerts] = useState(true);
  const [newsAlerts, setNewsAlerts] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const displayName = user?.displayName || 'Motorist Member';
  const displayEmail = user?.email || 'motorist@cargas.ph';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Header */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || 'PH'}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{displayEmail}</Text>
          <Text style={styles.userRole}>
            {user?.role === 'ADMIN' ? 'System Administrator 🛡️' : 'Motorist Member 🇵🇭'}
          </Text>
        </View>
      </View>

      {/* Notification Preferences */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Fuel Notification Preferences</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Monday Price Hike Alerts</Text>
            <Text style={styles.settingSub}>Notifies you to gas up before Tuesday increases</Text>
          </View>
          <Switch
            value={hikeAlerts}
            onValueChange={setHikeAlerts}
            trackColor={{ false: Colors.cardBorder, true: Colors.primary }}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Rollback Announcements</Text>
            <Text style={styles.settingSub}>Alerts you when fuel prices drop</Text>
          </View>
          <Switch
            value={rollbackAlerts}
            onValueChange={setRollbackAlerts}
            trackColor={{ false: Colors.cardBorder, true: Colors.primary }}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingLabel}>Fuel Industry News & DOE Updates</Text>
            <Text style={styles.settingSub}>Weekly oil trends and global crude advisories</Text>
          </View>
          <Switch
            value={newsAlerts}
            onValueChange={setNewsAlerts}
            trackColor={{ false: Colors.cardBorder, true: Colors.primary }}
          />
        </View>
      </View>

      {/* App & Privacy Options */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Settings & Privacy</Text>
      </View>
      <View style={styles.card}>
        <TouchableOpacity style={styles.navRow}>
          <View style={styles.navRowLeft}>
            <MapPin size={20} color={Colors.textMuted} />
            <Text style={styles.navRowLabel}>Location Permissions</Text>
          </View>
          <ChevronRight size={18} color={Colors.textMuted} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.navRow}>
          <View style={styles.navRowLeft}>
            <Shield size={20} color={Colors.textMuted} />
            <Text style={styles.navRowLabel}>Privacy Policy & Data Retention</Text>
          </View>
          <ChevronRight size={18} color={Colors.textMuted} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.navRow}>
          <View style={styles.navRowLeft}>
            <HelpCircle size={20} color={Colors.textMuted} />
            <Text style={styles.navRowLabel}>About CarGasPh (v0.1.0)</Text>
          </View>
          <ChevronRight size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
        <LogOut size={18} color={Colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  userEmail: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 1,
  },
  userRole: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 3,
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  settingTextCol: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  settingSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: Spacing.sm,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  navRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  navRowLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  logoutText: {
    color: Colors.error,
    fontWeight: '700',
    fontSize: 15,
  },
});
