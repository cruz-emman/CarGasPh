export const Colors = {
  primary: '#0284C7', // Ocean / Petroleum Blue
  primaryDark: '#0369A1',
  primaryLight: '#E0F2FE',
  
  // Fuel Price Movement Indicators
  priceHike: '#EF4444', // Red for price increases
  priceHikeBg: '#FEE2E2',
  priceRollback: '#10B981', // Green for rollbacks (savings)
  priceRollbackBg: '#D1FAE5',
  priceUnchanged: '#6B7280',
  priceUnchangedBg: '#F3F4F6',

  // UI Theme (Dark mode first for dashboard visibility)
  background: '#0F172A', // Slate 900
  cardBackground: '#1E293B', // Slate 800
  cardBorder: '#334155', // Slate 700
  
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  textSecondary: '#CBD5E1',

  accent: '#F59E0B', // Amber for warnings / highlights
  white: '#FFFFFF',
  black: '#000000',
  error: '#F43F5E',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Currency = {
  symbol: '₱',
  code: 'PHP',
  format: (amount: number): string => {
    return `₱${amount.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  },
};
