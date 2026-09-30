import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../../src/constants/theme';
import { registerSchema, RegisterFormData } from '../../src/utils/validation';
import { useAuthStore } from '../../src/stores/useAuthStore';

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser({
        display_name: data.displayName,
        email: data.email,
        password: data.password,
      });
      router.replace('/(tabs)');
    } catch {
      // Error handled in store
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Error Alert */}
        {error && (
          <View style={styles.errorBanner}>
            <AlertCircle size={18} color={Colors.error} />
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Join CarGasPh</Text>
          <Text style={styles.formSubtitle}>Create your account to track fuel expenses and garage</Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name / Nickname</Text>
            <View style={[styles.inputWrapper, errors.displayName && styles.inputError]}>
              <User size={20} color={Colors.textMuted} />
              <Controller
                control={control}
                name="displayName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Emman Cruz"
                    placeholderTextColor={Colors.textMuted}
                    autoCapitalize="words"
                    onBlur={onBlur}
                    onChangeText={(val) => {
                      clearError();
                      onChange(val);
                    }}
                    value={value}
                  />
                )}
              />
            </View>
            {errors.displayName && <Text style={styles.fieldErrorText}>{errors.displayName.message}</Text>}
          </View>

          {/* Email Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
              <Mail size={20} color={Colors.textMuted} />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. motorist@cargas.ph"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={(val) => {
                      clearError();
                      onChange(val);
                    }}
                    value={value}
                  />
                )}
              />
            </View>
            {errors.email && <Text style={styles.fieldErrorText}>{errors.email.message}</Text>}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
              <Lock size={20} color={Colors.textMuted} />
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Min 8 chars, 1 uppercase, 1 digit"
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={(val) => {
                      clearError();
                      onChange(val);
                    }}
                    value={value}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                {showPassword ? (
                  <EyeOff size={20} color={Colors.textMuted} />
                ) : (
                  <Eye size={20} color={Colors.textMuted} />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.fieldErrorText}>{errors.password.message}</Text>}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
              <Lock size={20} color={Colors.textMuted} />
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.textInput}
                    placeholder="Re-enter your password"
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={(val) => {
                      clearError();
                      onChange(val);
                    }}
                    value={value}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} hitSlop={10}>
                {showConfirm ? (
                  <EyeOff size={20} color={Colors.textMuted} />
                ) : (
                  <Eye size={20} color={Colors.textMuted} />
                )}
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.fieldErrorText}>{errors.confirmPassword.message}</Text>
            )}
          </View>

          {/* Privacy Note */}
          <Text style={styles.termsText}>
            By creating an account, you agree to CarGasPh's Terms of Service and Privacy Policy. Location data is never retained as historical tracks.
          </Text>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.md,
    justifyContent: 'center',
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
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  formSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm + 2,
    height: 48,
    gap: Spacing.xs,
  },
  inputError: {
    borderColor: Colors.error,
  },
  textInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
  },
  fieldErrorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
  termsText: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
    marginVertical: Spacing.sm,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
