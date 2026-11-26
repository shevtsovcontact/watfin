import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../theme/theme";
import { fonts } from "../../theme/fonts";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: 12,
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главное",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="wallet-outline"
              size={size}
              color={(color as string) ?? colors.gold}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "История",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="list-outline"
              size={size}
              color={(color as string) ?? colors.gold}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Добавить",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="add-circle"
              size={size}
              color={(color as string) ?? colors.gold}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Настройки",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="settings-outline"
              size={size}
              color={(color as string) ?? colors.gold}
            />
          ),
        }}
      />
    </Tabs>
  );
}
