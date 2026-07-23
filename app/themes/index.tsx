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

import { useThemes } from '../../src/hooks/useThemes';

export default function ThemesScreen() {
    const router = useRouter();

    const {
        themes,
        isLoading,
        error,
        reload,
    } = useThemes();

    const themeNameById = new Map(
        themes.map((theme) => [theme.id, theme.name]),
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>戻る</Text>
                </Pressable>

                <Text style={styles.title}>テーマ管理</Text>

                <Text style={styles.subtitle}>
                    デッキ構築や対戦相手に設定するテーマを管理します
                </Text>

                <Pressable
                    style={styles.createButton}
                    onPress={() => router.push('/themes/new')}
                >
                    <Text style={styles.createButtonText}>
                        新しく登録する
                    </Text>
                </Pressable>

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
                        themes.length === 0 && (
                            <Text style={styles.statusText}>
                                テーマはまだ登録されていません。
                            </Text>
                        )}

                    {!isLoading &&
                        !error &&
                        themes.map((theme) => {
                            const parentThemeName =
                                theme.parentThemeId !== null
                                    ? themeNameById.get(theme.parentThemeId)
                                    : null;

                            return (
                                <View
                                    key={theme.id}
                                    style={styles.themeItem}
                                >
                                    <Text style={styles.themeName}>
                                        {theme.name}
                                    </Text>

                                    {parentThemeName ? (
                                        <Text style={styles.parentThemeName}>
                                            親テーマ：{parentThemeName}
                                        </Text>
                                    ) : null}
                                </View>
                            );
                        })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    themeItem: {
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#d1d5db',
    },
    themeName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    parentThemeName: {
        marginTop: 4,
        fontSize: 14,
        color: '#6b7280',
    },
});