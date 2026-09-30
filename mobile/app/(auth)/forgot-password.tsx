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
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius } from '../../src/constants/theme';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../src/utils/validation';
import { authService } from '../../src/services/auth.service';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to request password reset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {isSubmitted ? (
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <CheckCircle size={48} color={Colors.priceRollback} />
            </View>
            <Text style={styles.successTitle}>Check Your Inbox</Text>
            <Text style={styles.successMessage}>
              If your email is registered in CarGasPh, we have sent instructions to reset your password.
            </Text>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.replace('/(auth)/login')}
              activeOpacity={0.8}
            >
              <Text style={styles.backBtnText}>Return to Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Reset Password</Text>
            <Text style={styles.formSubtitle}>
              Enter your registered email address and we'll send you a password reset link.
            </Text>

            {errorMessage && (
              <View style={styles.errorBanner}>
                <AlertCircle size={18} color={Colors.error} />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            )}

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
                      placeholder="motorist@cargas.ph"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              </View>
              {errors.email && <Text style={styles.fieldErrorText}>{errors.email.message}</Text>}
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Text style={styles.submitBtnText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelLink}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <ArrowLeft size={16} color={Colors.textMuted} />
              <Text style={styles.cancelLinkText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginTop: 4,
    marginBottom: Spacing.lg,
    lineHeight: 18,
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
  inputGroup: {
    marginBottom: Spacing.lg,
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
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  cancelLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.lg,
  },
  cancelLinkText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  successCard: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: Spacing.md,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  successMessage: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  backBtn: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.xl,
  },
  backBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
