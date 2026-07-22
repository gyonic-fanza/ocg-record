import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { db } from '../src/db';
import migrations from '../src/db/migrations/migrations';
import { seedDatabase } from '../src/db/seeds';

export default function RootLayout() {
  const {
    success: migrationSuccess,
    error: migrationError,
  } = useMigrations(db, migrations);

  const [seedSuccess, setSeedSuccess] = useState(false);
  const [seedError, setSeedError] = useState<Error | null>(null);

  useEffect(() => {
    if (!migrationSuccess) {
      return;
    }

    let isActive = true;

    seedDatabase()
      .then(() => {
        if (isActive) {
          setSeedSuccess(true);
        }
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        setSeedError(
          error instanceof Error
            ? error
            : new Error('初期データの登録に失敗しました。'),
        );
      });

    return () => {
      isActive = false;
    };
  }, [migrationSuccess]);

  if (migrationError) {
    return (
      <View style={styles.centeredContainer}>
        <Text>データベースの初期化に失敗しました。</Text>
        <Text>{migrationError.message}</Text>
      </View>
    );
  }

  if (seedError) {
    return (
      <View style={styles.centeredContainer}>
        <Text>初期データの登録に失敗しました。</Text>
        <Text>{seedError.message}</Text>
      </View>
    );
  }

  if (!migrationSuccess || !seedSuccess) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" />
        <Text>データベースを初期化しています...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
});