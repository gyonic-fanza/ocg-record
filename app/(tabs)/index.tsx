import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useEventTypes } from '../../src/hooks/useEventTypes';

export default function HomeScreen() {
  const {
    eventTypes,
    isLoading,
    error,
    reload,
  } = useEventTypes();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>OCG戦績管理</Text>
        <Text style={styles.subtitle}>
          遊戯王OCGの対戦記録と戦績分析
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>イベント種別</Text>

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

          {!isLoading && !error && eventTypes.length === 0 && (
            <Text style={styles.statusText}>
              イベント種別が登録されていません。
            </Text>
          )}

          {!isLoading &&
            !error &&
            eventTypes.map((eventType) => (
              <View
                key={eventType.id}
                style={styles.eventTypeItem}
              >
                <Text style={styles.eventTypeName}>
                  {eventType.name}
                </Text>

                {eventType.description && (
                  <Text style={styles.eventTypeDescription}>
                    {eventType.description}
                  </Text>
                )}
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
  eventTypeItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d1d5db',
  },
  eventTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  eventTypeDescription: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
  },
});