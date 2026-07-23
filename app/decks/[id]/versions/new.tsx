import { useLocalSearchParams, useRouter } from 'expo-router';
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

import { useLimitRegulations } from '../../../../src/hooks/useLimitRegulations';
import { createDeckVersion } from '../../../../src/services';

export default function NewDeckVersionScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    id?: string | string[];
  }>();

  const rawId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const parsedId = rawId ? Number(rawId) : Number.NaN;

  const deckId =
    Number.isSafeInteger(parsedId) && parsedId > 0
      ? parsedId
      : null;

  const {
    limitRegulations,
    isLoading,
    error,
    reload,
  } = useLimitRegulations();

  const [name, setName] = useState('');
  const [memo, setMemo] = useState('');
  const [neuronUrl, setNeuronUrl] = useState('');
  const [
    selectedLimitRegulationId,
    setSelectedLimitRegulationId,
  ] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    if (deckId === null) {
      Alert.alert(
        '登録できませんでした',
        'デッキが正しく指定されていません。',
      );
      return;
    }

    if (selectedLimitRegulationId === null) {
      Alert.alert(
        '登録できませんでした',
        'リミットレギュレーションを選択してください。',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await createDeckVersion({
        deckId,
        limitRegulationId: selectedLimitRegulationId,
        name,
        memo,
        neuronUrl,
      });

      router.back();
    } catch (caughtError: unknown) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : '構築の登録に失敗しました。';

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

          <Text style={styles.title}>構築登録</Text>

          {deckId === null && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>
                デッキIDが正しくありません。
              </Text>
            </View>
          )}

          {deckId !== null && (
            <View style={styles.card}>
              <Text style={styles.label}>構築名</Text>

              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="例：大会用構築"
                editable={!isSubmitting}
              />

              <Text style={styles.label}>
                リミットレギュレーション
              </Text>

              {isLoading && (
                <View style={styles.statusContainer}>
                  <ActivityIndicator size="small" />
                  <Text style={styles.statusText}>
                    読み込み中...
                  </Text>
                </View>
              )}

              {!isLoading && error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    {error.message}
                  </Text>

                  <Pressable
                    style={styles.retryButton}
                    onPress={() => void reload()}
                  >
                    <Text style={styles.retryButtonText}>
                      再読み込み
                    </Text>
                  </Pressable>
                </View>
              )}

              {!isLoading &&
                !error &&
                limitRegulations.length === 0 && (
                  <Text style={styles.statusText}>
                    リミットレギュレーションが登録されていません。
                  </Text>
                )}

              {!isLoading &&
                !error &&
                limitRegulations.map((regulation) => {
                  const isSelected =
                    selectedLimitRegulationId === regulation.id;

                  return (
                    <Pressable
                      key={regulation.id}
                      style={[
                        styles.regulationOption,
                        isSelected &&
                          styles.selectedRegulationOption,
                      ]}
                      onPress={() =>
                        setSelectedLimitRegulationId(
                          regulation.id,
                        )
                      }
                      disabled={isSubmitting}
                    >
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected &&
                            styles.selectedRadioOuter,
                        ]}
                      >
                        {isSelected && (
                          <View style={styles.radioInner} />
                        )}
                      </View>

                      <Text
                        style={[
                          styles.regulationName,
                          isSelected &&
                            styles.selectedRegulationName,
                        ]}
                      >
                        {regulation.name}
                      </Text>
                    </Pressable>
                  );
                })}

              <Text style={styles.label}>メモ（任意）</Text>

              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={memo}
                onChangeText={setMemo}
                placeholder="構築の特徴や変更内容"
                editable={!isSubmitting}
                multiline
                textAlignVertical="top"
              />

              <Text style={styles.label}>
                デッキレシピURL（任意）
              </Text>

              <TextInput
                style={styles.input}
                value={neuronUrl}
                onChangeText={setNeuronUrl}
                placeholder="https://..."
                editable={!isSubmitting}
                keyboardType="url"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Pressable
                style={[
                  styles.submitButton,
                  (isSubmitting ||
                    limitRegulations.length === 0) &&
                    styles.disabledButton,
                ]}
                onPress={() => void handleSubmit()}
                disabled={
                  isSubmitting ||
                  limitRegulations.length === 0
                }
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
          )}
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
  errorCard: {
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
  multilineInput: {
    minHeight: 110,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  statusText: {
    marginBottom: 20,
    fontSize: 14,
    color: '#6b7280',
  },
  errorContainer: {
    marginBottom: 20,
    gap: 12,
  },
  errorText: {
    fontSize: 15,
    color: '#b91c1c',
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#7c3aed',
  },
  retryButtonText: {
    fontWeight: '700',
    color: '#ffffff',
  },
  regulationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    marginBottom: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
  },
  selectedRegulationOption: {
    borderColor: '#7c3aed',
    backgroundColor: '#f5f3ff',
  },
  radioOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#9ca3af',
    borderRadius: 10,
  },
  selectedRadioOuter: {
    borderColor: '#7c3aed',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7c3aed',
  },
  regulationName: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
  },
  selectedRegulationName: {
    fontWeight: '700',
    color: '#5b21b6',
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    marginTop: 8,
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