import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import FloatingTabBar from "../../components/FloatingTabBar";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../theme/theme";
import { fonts } from "../../theme/fonts";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <FloatingTabBar {...(props as any)} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главное",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20, // круг
                backgroundColor: focused ? colors.goldBright : colors.surface,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="wallet"
                size={24}
                color={focused ? colors.background : colors.textMuted}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "История",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20, // круг
                backgroundColor: focused ? colors.goldBright : colors.surface,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="list"
                size={24}
                color={focused ? colors.background : colors.textMuted}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Добавить",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20, // круг
                backgroundColor: focused ? colors.goldBright : colors.surface,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="cash"
                size={24}
                color={focused ? colors.background : colors.textMuted}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Настройки",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20, // круг
                backgroundColor: focused ? colors.goldBright : colors.surface,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="settings"
                size={24}
                color={focused ? colors.background : colors.textMuted}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
