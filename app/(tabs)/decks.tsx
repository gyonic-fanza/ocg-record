import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDecks } from '../../src/hooks/useDecks';

export default function DecksScreen() {
const router = useRouter();
  const {
    decks,
    isLoading,
    error,
    reload,
  } = useDecks();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>デッキ管理</Text>
        <Text style={styles.subtitle}>
          使用するデッキと構築を管理します
        </Text>
<Pressable
  style={styles.createButton}
  onPress={() => router.push('/decks/new')}
>
  <Text style={styles.createButtonText}>
    デッキを登録する
  </Text>
</Pressable>
<Pressable
  style={styles.regulationButton}
  onPress={() => router.push('/limit-regulations')}
>
  <Text style={styles.regulationButtonText}>
    リミットレギュレーションを管理
  </Text>
</Pressable>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>登録済みデッキ</Text>

          {isLoading && (
            <View style={styles.statusContainer}>
              <ActivityIndicator size="small" />
              <Text style={styles.statusText}>読み込み中...</Text>
            </View>
          )}

          {error && (
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

          {!isLoading && !error && decks.length === 0 && (
            <Text style={styles.statusText}>
              デッキはまだ登録されていません。
            </Text>
          )}

          {!isLoading &&
            !error &&
            decks.map((deck) => (
              <Pressable
                key={deck.id}
                style={({ pressed }) => [
                  styles.deckItem,
                  pressed && styles.pressedDeckItem,
                ]}
                onPress={() =>
                  router.push({
                    pathname: '/decks/[id]',
                    params: {
                      id: String(deck.id),
                    },
                  })
                }
              >
                <Text style={styles.deckName}>
                  {deck.name}
                </Text>

                {deck.description && (
                  <Text style={styles.deckDescription}>
                    {deck.description}
                  </Text>
                )}
              </Pressable>
            ))}
            </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
regulationButton: {
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 50,
  marginTop: 12,
  borderWidth: 1,
  borderColor: '#7c3aed',
  borderRadius: 10,
  backgroundColor: '#ffffff',
},
regulationButtonText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#7c3aed',
},
pressedDeckItem: {
  opacity: 0.6,
},
createButton: {
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 50,
  marginTop: 24,
  borderRadius: 10,
  backgroundColor: '#7c3aed',
},
createButtonText: {
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
  title: {
    marginTop: 24,
    fontSize: 30,
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#6b7280',
  },
  card: {
    marginTop: 32,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  cardTitle: {
    marginBottom: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 15,
    color: '#6b7280',
  },
  errorContainer: {
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
  deckItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d1d5db',
  },
  deckName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  deckDescription: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
  },
});