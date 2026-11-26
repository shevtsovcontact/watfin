import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CategorySettings from "../../components/settings/CategorySettings";
import { colors, radius } from "../../theme/theme";
import { type as typeStyles } from "../../theme/fonts";

type SettingsTab = "categories" | "general";

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("categories");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки</Text>

      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "general" && styles.tabActive]}
          onPress={() => setActiveTab("general")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "general" && styles.tabTextActive,
            ]}
          >
            Общие
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "categories" && styles.tabActive]}
          onPress={() => setActiveTab("categories")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "categories" && styles.tabTextActive,
            ]}
          >
            Категории
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "categories" ? (
        <CategorySettings />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Раздел в разработке</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    ...typeStyles.h1,
    color: colors.textPrimary,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  tabsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.m,
    alignItems: "center",
    backgroundColor: colors.surface,
  },
  tabActive: {
    backgroundColor: colors.goldBright,
  },
  tabText: {
    ...typeStyles.body,
    color: colors.textMuted,
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.background,
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    ...typeStyles.body,
    color: colors.textMuted,
  },
});
