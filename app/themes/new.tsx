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

import { useThemes } from '../../src/hooks/useThemes';
import { createTheme } from '../../src/services';

export default function NewThemeScreen() {
    const router = useRouter();

    const {
        themes,
        isLoading,
        error,
        reload,
    } = useThemes();

    const [name, setName] = useState('');
    const [parentThemeId, setParentThemeId] =
        useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            await createTheme({
                name,
                parentThemeId,
            });

            router.back();
        } catch (caughtError: unknown) {
            const message =
                caughtError instanceof Error
                    ? caughtError.message
                    : 'テーマの登録に失敗しました。';

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
                    <Pressable
                        style={styles.backButton}
                        onPress={() => router.back()}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.backButtonText}>戻る</Text>
                    </Pressable>

                    <Text style={styles.title}>テーマ登録</Text>

                    <View style={styles.card}>
                        <Text style={styles.label}>テーマ名</Text>

                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="例：烙印"
                            editable={!isSubmitting}
                        />

                        <Text style={styles.label}>
                            親テーマ（任意）
                        </Text>

                        <Pressable
                            style={[
                                styles.themeOption,
                                parentThemeId === null &&
                                styles.selectedThemeOption,
                            ]}
                            onPress={() => setParentThemeId(null)}
                            disabled={isSubmitting}
                        >
                            <Text
                                style={[
                                    styles.themeOptionText,
                                    parentThemeId === null &&
                                    styles.selectedThemeOptionText,
                                ]}
                            >
                                親テーマなし
                            </Text>
                        </Pressable>

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
                            themes.map((theme) => {
                                const isSelected =
                                    parentThemeId === theme.id;

                                return (
                                    <Pressable
                                        key={theme.id}
                                        style={[
                                            styles.themeOption,
                                            isSelected &&
                                            styles.selectedThemeOption,
                                        ]}
                                        onPress={() =>
                                            setParentThemeId(theme.id)
                                        }
                                        disabled={isSubmitting}
                                    >
                                        <Text
                                            style={[
                                                styles.themeOptionText,
                                                isSelected &&
                                                styles.selectedThemeOptionText,
                                            ]}
                                        >
                                            {theme.name}
                                        </Text>
                                    </Pressable>
                                );
                            })}

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
    themeOption: {
        justifyContent: 'center',
        minHeight: 46,
        marginBottom: 10,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
    },
    selectedThemeOption: {
        borderColor: '#7c3aed',
        backgroundColor: '#f5f3ff',
    },
    themeOptionText: {
        fontSize: 15,
        color: '#374151',
    },
    selectedThemeOptionText: {
        fontWeight: '700',
        color: '#5b21b6',
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    statusText: {
        fontSize: 14,
        color: '#6b7280',
    },
    errorContainer: {
        marginBottom: 16,
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
    submitButton: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
        marginTop: 12,
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