import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDeckVersion } from '../../../../src/hooks/useDeckVersion';
import { deleteDeckVersion } from '../../../../src/services';

export default function DeckVersionDetailScreen() {
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
    Number.isSafeInteger(parsedDeckId) &&
    parsedDeckId > 0
      ? parsedDeckId
      : null;

  const deckVersionId =
    Number.isSafeInteger(parsedVersionId) &&
    parsedVersionId > 0
      ? parsedVersionId
      : null;

  const {
    deckVersion,
    isLoading,
    error,
    reload,
  } = useDeckVersion(deckVersionId);
const [isDeleting, setIsDeleting] = useState(false);

const executeDelete = async () => {
  if (!deckVersion || deckId === null) {
    return;
  }

  setIsDeleting(true);

  try {
    await deleteDeckVersion(deckVersion.id);

    router.replace({
      pathname: '/decks/[id]',
      params: {
        id: String(deckId),
      },
    });
  } catch (caughtError: unknown) {
    const message =
      caughtError instanceof Error
        ? caughtError.message
        : '構築の削除に失敗しました。';

    Alert.alert('削除できませんでした', message);
  } finally {
    setIsDeleting(false);
  }
};

const handleDelete = () => {
  if (!deckVersion || isDeleting) {
    return;
  }

  Alert.alert(
    '構築を削除しますか？',
    `「${deckVersion.name}」を削除します。この操作は取り消せません。`,
    [
      {
        text: 'キャンセル',
        style: 'cancel',
      },
      {
        text: '削除する',
        style: 'destructive',
        onPress: () => void executeDelete(),
      },
    ],
  );
};
  const belongsToDeck =
    deckVersion !== null &&
    deckId !== null &&
    deckVersion.deckId === deckId;

  const handleOpenNeuronUrl = async () => {
    if (!deckVersion?.neuronUrl) {
      return;
    }

    await Linking.openURL(deckVersion.neuronUrl);
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

        <Text style={styles.title}>構築詳細</Text>

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

        {!isLoading &&
          !error &&
          (deckId === null || deckVersionId === null) && (
            <View style={styles.card}>
              <Text style={styles.errorText}>
                構築の指定が正しくありません。
              </Text>
            </View>
          )}

        {!isLoading &&
          !error &&
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
          !error &&
          deckVersion &&
          !belongsToDeck && (
            <View style={styles.card}>
              <Text style={styles.errorText}>
                このデッキに属する構築ではありません。
              </Text>
            </View>
          )}

        {!isLoading &&
          !error &&
          deckVersion &&
          belongsToDeck && (
            <View style={styles.card}>
              <Text style={styles.label}>構築名</Text>

              <Text style={styles.versionName}>
                {deckVersion.name}
              </Text>

              <Text style={styles.label}>
                リミットレギュレーション
              </Text>

              <Text style={styles.regulationName}>
                {deckVersion.limitRegulationName}
              </Text>

              <Text style={styles.label}>メモ</Text>

              <Text style={styles.contentText}>
                {deckVersion.memo ||
                  'メモは登録されていません。'}
              </Text>

              <Text style={styles.label}>
                デッキレシピURL
              </Text>

              {deckVersion.neuronUrl ? (
                <Pressable
                  style={styles.urlButton}
                  onPress={() =>
                    void handleOpenNeuronUrl()
                  }
                >
                  <Text style={styles.urlButtonText}>
                    デッキレシピを開く
                  </Text>
                </Pressable>
              ) : (
                <Text style={styles.contentText}>
                  URLは登録されていません。
                </Text>
              )}

              <Pressable
                style={styles.editButton}
                onPress={() =>
                  router.push({
                    pathname:
                      '/decks/[id]/versions/[versionId]/edit',
                    params: {
                      id: String(deckId),
                      versionId: String(deckVersion.id),
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
  versionName: {
    marginBottom: 20,
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
  },
  regulationName: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '700',
    color: '#7c3aed',
  },
  contentText: {
    marginBottom: 20,
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
  urlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#7c3aed',
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  urlButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7c3aed',
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    marginTop: 24,
    borderRadius: 10,
    backgroundColor: '#7c3aed',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
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
});