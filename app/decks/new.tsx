import { useRouter } from 'expo-router';
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

import { createDeck } from '../../src/services';

export default function NewDeckScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createDeck({
        name,
        description,
      });

      router.back();
    } catch (caughtError: unknown) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : 'デッキの登録に失敗しました。';

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
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
              disabled={isSubmitting}
            >
              <Text style={styles.backButtonText}>戻る</Text>
            </Pressable>

            <Text style={styles.title}>デッキ登録</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>デッキ名</Text>

            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="例：サイバーストゥーン"
              editable={!isSubmitting}
              returnKeyType="next"
            />

            <Text style={styles.label}>説明・メモ</Text>

            <TextInput
              style={[styles.input, styles.multilineInput]}
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
                  登録する
                </Text>
              )}
            </Pressable>
          </View>
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
  header: {
    marginTop: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
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