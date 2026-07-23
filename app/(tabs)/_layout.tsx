import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7c3aed',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="decks"
        options={{
          title: 'デッキ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="albums-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}