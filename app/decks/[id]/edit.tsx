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

import { useDeck } from '../../../src/hooks/useDeck';
import { updateDeck } from '../../../src/services';

export default function EditDeckScreen() {
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
    deck,
    isLoading,
    error,
    reload,
  } = useDeck(deckId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!deck) {
      return;
    }

    setName(deck.name);
    setDescription(deck.description ?? '');
  }, [deck]);

  const handleSubmit = async () => {
    if (deckId === null || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateDeck(deckId, {
        name,
        description,
      });

      router.back();
    } catch (caughtError: unknown) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'デッキの更新に失敗しました。';

      Alert.alert('更新できませんでした', message);
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

          <Text style={styles.title}>デッキ編集</Text>

          {isLoading && (
            <View style={styles.statusContainer}>
              <ActivityIndicator size="large" />
              <Text style={styles.statusText}>
                読み込み中...
              </Text>
            </View>
          )}

          {!isLoading && error && (
            <View style={styles.card}>
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

          {!isLoading && !error && deckId === null && (
            <View style={styles.card}>
              <Text style={styles.errorText}>
                デッキIDが正しくありません。
              </Text>
            </View>
          )}

          {!isLoading &&
            !error &&
            deckId !== null &&
            !deck && (
              <View style={styles.card}>
                <Text style={styles.statusText}>
                  対象のデッキが見つかりません。
                </Text>
              </View>
            )}

          {!isLoading && !error && deck && (
            <View style={styles.card}>
              <Text style={styles.label}>デッキ名</Text>

              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="デッキ名"
                editable={!isSubmitting}
              />

              <Text style={styles.label}>説明・メモ</Text>

              <TextInput
                style={[
                  styles.input,
                  styles.multilineInput,
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="デッキの特徴などを入力"
                editable={!isSubmitting}
                multiline
                textAlignVertical="top"
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
    minHeight: 120,
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