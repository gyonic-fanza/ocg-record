import {
    useLocalSearchParams,
    useRouter,
} from 'expo-router';
import { useEffect, useState } from 'react';
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

import { useDeckVersion } from '../../../../../src/hooks/useDeckVersion';
import { useLimitRegulations } from '../../../../../src/hooks/useLimitRegulations';
import { updateDeckVersion } from '../../../../../src/services';

export default function EditDeckVersionScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    id?: string | string[];
    versionId?: string | string[];
  }>();

  const rawDeckId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const rawVersionId = Array.isArray(params.versionId)
    ? params.versionId[0]
    : params.versionId;

  const parsedDeckId = rawDeckId
    ? Number(rawDeckId)
    : Number.NaN;

  const parsedVersionId = rawVersionId
    ? Number(rawVersionId)
    : Number.NaN;

  const deckId =
    Number.isSafeInteger(parsedDeckId) && parsedDeckId > 0
      ? parsedDeckId
      : null;

  const deckVersionId =
    Number.isSafeInteger(parsedVersionId) &&
    parsedVersionId > 0
      ? parsedVersionId
      : null;

  const {
    deckVersion,
    isLoading: isDeckVersionLoading,
    error: deckVersionError,
    reload: reloadDeckVersion,
  } = useDeckVersion(deckVersionId);

  const {
    limitRegulations,
    isLoading: areRegulationsLoading,
    error: regulationsError,
    reload: reloadRegulations,
  } = useLimitRegulations();

  const [name, setName] = useState('');
  const [memo, setMemo] = useState('');
  const [neuronUrl, setNeuronUrl] = useState('');
  const [
    selectedLimitRegulationId,
    setSelectedLimitRegulationId,
  ] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!deckVersion) {
      return;
    }

    setName(deckVersion.name);
    setMemo(deckVersion.memo ?? '');
    setNeuronUrl(deckVersion.neuronUrl ?? '');
    setSelectedLimitRegulationId(
      deckVersion.limitRegulationId,
    );
  }, [deckVersion]);

  const belongsToDeck =
    deckVersion !== null &&
    deckId !== null &&
    deckVersion.deckId === deckId;

  const handleSubmit = async () => {
    if (
      isSubmitting ||
      deckVersionId === null ||
      !belongsToDeck
    ) {
      return;
    }

    if (selectedLimitRegulationId === null) {
      Alert.alert(
        '更新できませんでした',
        'リミットレギュレーションを選択してください。',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await updateDeckVersion(deckVersionId, {
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
          : '構築の更新に失敗しました。';

      Alert.alert('更新できませんでした', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading =
    isDeckVersionLoading || areRegulationsLoading;

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

          <Text style={styles.title}>構築編集</Text>

          {isLoading && (
            <View style={styles.statusContainer}>
              <ActivityIndicator size="large" />

              <Text style={styles.statusText}>
                読み込み中...
              </Text>
            </View>
          )}

          {!isLoading && deckVersionError && (
            <View style={styles.card}>
              <Text style={styles.errorText}>
                {deckVersionError.message}
              </Text>

              <Pressable
                style={styles.retryButton}
                onPress={() => void reloadDeckVersion()}
              >
                <Text style={styles.retryButtonText}>
                  再読み込み
                </Text>
              </Pressable>
            </View>
          )}

          {!isLoading && regulationsError && (
            <View style={styles.card}>
              <Text style={styles.errorText}>
                {regulationsError.message}
              </Text>

              <Pressable
                style={styles.retryButton}
                onPress={() => void reloadRegulations()}
              >
                <Text style={styles.retryButtonText}>
                  再読み込み
                </Text>
              </Pressable>
            </View>
          )}

          {!isLoading &&
            !deckVersionError &&
            !regulationsError &&
            (deckId === null || deckVersionId === null) && (
              <View style={styles.card}>
                <Text style={styles.errorText}>
                  構築の指定が正しくありません。
                </Text>
              </View>
            )}

          {!isLoading &&
            !deckVersionError &&
            !regulationsError &&
            deckId !== null &&
            deckVersionId !== null &&
            !deckVersion && (
              <View style={styles.card}>
                <Text style={styles.statusText}>
                  対象の構築が見つかりません。
                </Text>
              </View>
            )}

          {!isLoading &&
            !deckVersionError &&
            !regulationsError &&
            deckVersion &&
            !belongsToDeck && (
              <View style={styles.card}>
                <Text style={styles.errorText}>
                  このデッキに属する構築ではありません。
                </Text>
              </View>
            )}

          {!isLoading &&
            !deckVersionError &&
            !regulationsError &&
            deckVersion &&
            belongsToDeck && (
              <View style={styles.card}>
                <Text style={styles.label}>構築名</Text>

                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  editable={!isSubmitting}
                />

                <Text style={styles.label}>
                  リミットレギュレーション
                </Text>

                {limitRegulations.map((regulation) => {
                  const isSelected =
                    selectedLimitRegulationId ===
                    regulation.id;

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
                  style={[
                    styles.input,
                    styles.multilineInput,
                  ]}
                  value={memo}
                  onChangeText={setMemo}
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
                  editable={!isSubmitting}
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                />

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
                      更新する
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
  statusContainer: {
    alignItems: 'center',
    gap: 12,
    marginTop: 48,
  },
  statusText: {
    fontSize: 15,
    color: '#6b7280',
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
  multilineInput: {
    minHeight: 110,
  },
  errorText: {
    fontSize: 15,
    color: '#b91c1c',
  },
  retryButton: {
    alignSelf: 'flex-start',
    marginTop: 16,
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