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

import { useLimitRegulations } from '../../src/hooks/useLimitRegulations';

function formatDate(date: Date): string {
  return date.toLocaleDateString('ja-JP');
}

export default function LimitRegulationsScreen() {
  const router = useRouter();

  const {
    limitRegulations,
    isLoading,
    error,
    reload,
  } = useLimitRegulations();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>戻る</Text>
        </Pressable>

        <Text style={styles.title}>
          リミットレギュレーション
        </Text>

        <Text style={styles.subtitle}>
          構築に適用するリミットレギュレーションを管理します
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>登録済み一覧</Text>

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
                リミットレギュレーションはまだ登録されていません。
              </Text>
            )}

          {!isLoading &&
            !error &&
            limitRegulations.map((regulation) => (
              <View
                key={regulation.id}
                style={styles.regulationItem}
              >
                <Text style={styles.regulationName}>
                  {regulation.name}
                </Text>

                <Text style={styles.regulationPeriod}>
                  {formatDate(regulation.startDate)}
                  {' ～ '}
                  {regulation.endDate
                    ? formatDate(regulation.endDate)
                    : '終了日未定'}
                </Text>
              </View>
            ))}
        </View>
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
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 23,
    color: '#6b7280',
  },
  card: {
    marginTop: 28,
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
  regulationItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d1d5db',
  },
  regulationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  regulationPeriod: {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
  },
});