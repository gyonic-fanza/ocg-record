import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteDeck } from '../../src/services';

import { useDeck } from '../../src/hooks/useDeck';

export default function DeckDetailScreen() {
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

const [isDeleting, setIsDeleting] = useState(false);
  const {
    deck,
    isLoading,
    error,
    reload,
  } = useDeck(deckId);
const executeDelete = async (id: number) => {
  setIsDeleting(true);

  try {
    await deleteDeck(id);
    router.replace('/(tabs)/decks');
  } catch (caughtError: unknown) {
    const message =
      caughtError instanceof Error
        ? caughtError.message
        : 'デッキの削除に失敗しました。';

    Alert.alert('削除できませんでした', message);
  } finally {
    setIsDeleting(false);
  }
};

const handleDelete = () => {
  if (!deck || isDeleting) {
    return;
  }

  Alert.alert(
    'デッキを削除しますか？',
    `「${deck.name}」を削除します。この操作は取り消せません。`,
    [
      {
        text: 'キャンセル',
        style: 'cancel',
      },
      {
        text: '削除する',
        style: 'destructive',
        onPress: () => void executeDelete(deck.id),
      },
    ],
  );
};
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>戻る</Text>
        </Pressable>

        <Text style={styles.title}>デッキ詳細</Text>

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

            <Text style={styles.deckName}>
              {deck.name}
            </Text>

            <Text style={styles.label}>説明・メモ</Text>

            <Text style={styles.description}>
              {deck.description ||
                '説明は登録されていません。'}
            </Text>

            <Pressable
              style={styles.editButton}
              onPress={() =>
                router.push({
                  pathname: '/decks/[id]/edit',
                  params: {
                    id: String(deck.id),
                  },
                })
              }
            >
              <Text style={styles.editButtonText}>
                編集する
              </Text>
            </Pressable>
<Pressable
  style={[
    styles.deleteButton,
    isDeleting && styles.disabledButton,
  ]}
  onPress={handleDelete}
  disabled={isDeleting}
>
  {isDeleting ? (
    <ActivityIndicator color="#b91c1c" />
  ) : (
    <Text style={styles.deleteButtonText}>
      削除する
    </Text>
  )}
</Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
deleteButton: {
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 50,
  marginTop: 12,
  borderWidth: 1,
  borderColor: '#b91c1c',
  borderRadius: 10,
  backgroundColor: '#ffffff',
},
deleteButtonText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#b91c1c',
},
disabledButton: {
  opacity: 0.6,
},
editButton: {
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 50,
  marginTop: 28,
  borderRadius: 10,
  backgroundColor: '#7c3aed',
},
editButtonText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#ffffff',
},
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f3ff',
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
    marginTop: 8,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  deckName: {
    marginBottom: 20,
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
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
});