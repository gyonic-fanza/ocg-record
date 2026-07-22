import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>OCG戦績管理</Text>
        <Text style={styles.subtitle}>
          遊戯王OCGの対戦記録と戦績分析
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>開発を開始しました</Text>
          <Text style={styles.cardText}>
            今後ここに対戦記録、デッキ管理、戦績分析などの機能を追加します。
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f3ff',
  },
  container: {
    flex: 1,
    padding: 24,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  cardText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#4b5563',
  },
});
