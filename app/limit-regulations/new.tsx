import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createLimitRegulation } from '../../src/services';

function parseDate(value: string): Date | null {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(year, month - 1, day);

  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isValid ? date : null;
}

export default function NewLimitRegulationScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [startDateText, setStartDateText] = useState('');
  const [endDateText, setEndDateText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    const startDate = parseDate(startDateText.trim());

    if (!startDate) {
      Alert.alert(
        '登録できませんでした',
        '開始日はYYYY-MM-DD形式で入力してください。',
      );
      return;
    }

    const trimmedEndDate = endDateText.trim();
    const endDate = trimmedEndDate
      ? parseDate(trimmedEndDate)
      : null;

    if (trimmedEndDate && !endDate) {
      Alert.alert(
        '登録できませんでした',
        '終了日はYYYY-MM-DD形式で入力してください。',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await createLimitRegulation({
        name,
        startDate,
        endDate,
      });

      router.back();
    } catch (caughtError: unknown) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'リミットレギュレーションの登録に失敗しました。';

      Alert.alert('登録できませんでした', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <Text style={styles.backButtonText}>戻る</Text>
          </Pressable>

          <Text style={styles.title}>
            リミットレギュレーション登録
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>名称</Text>

            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="例：2026年7月"
              editable={!isSubmitting}
            />

            <Text style={styles.label}>開始日</Text>

            <TextInput
              style={styles.input}
              value={startDateText}
              onChangeText={setStartDateText}
              placeholder="2026-07-01"
              editable={!isSubmitting}
              keyboardType="numbers-and-punctuation"
              autoCapitalize="none"
            />

            <Text style={styles.label}>
              終了日（任意）
            </Text>

            <TextInput
              style={styles.input}
              value={endDateText}
              onChangeText={setEndDateText}
              placeholder="2026-09-30"
              editable={!isSubmitting}
              keyboardType="numbers-and-punctuation"
              autoCapitalize="none"
            />

            <Text style={styles.helpText}>
              日付はYYYY-MM-DD形式で入力してください。
            </Text>

            <Pressable
              style={[
                styles.submitButton,
                isSubmitting && styles.disabledButton,
              ]}
              onPress={() => void handleSubmit()}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  登録する
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f3ff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7c3aed',
  },
  title: {
    marginTop: 12,
    fontSize: 30,
    fontWeight: '700',
    color: '#1f2937',
  },
  card: {
    marginTop: 28,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  label: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    minHeight: 48,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  helpText: {
    marginTop: -8,
    marginBottom: 20,
    fontSize: 13,
    color: '#6b7280',
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderRadius: 10,
    backgroundColor: '#7c3aed',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});