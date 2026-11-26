// app/(tabs)/index.tsx
import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radius, currency } from "../../theme/theme";
import { fonts, type } from "../../theme/fonts";
import { getMonthlyTotals } from "../../db/transactions";
import { getRecentTransactions, type Transaction } from "../../db/transactions";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ refresh?: string }>();

  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [recent, setRecent] = useState<Transaction[]>([]);

  const load = useCallback(async () => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    setTotals(await getMonthlyTotals(month));
    setRecent(await getRecentTransactions(10));
  }, []);

  // подхват: пересоздаём load при изменении params.refresh
  useEffect(() => {
    load();
  }, [params.refresh, load]);

  // плюс обновление при каждом возврате на экран (переключение табов)
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const fmt = (n: number) =>
    n.toLocaleString("ru-RU", { maximumFractionDigits: 2 });

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
      {/* Баланс за месяц */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Баланс за месяц</Text>
        <Text style={styles.balance}>
          {fmt(totals.balance)} {currency}
        </Text>
        <View style={styles.row}>
          <Text style={styles.income}>
            +{fmt(totals.income)} {currency}
          </Text>
          <Text style={styles.expense}>
            −{fmt(totals.expense)} {currency}
          </Text>
        </View>
      </View>

      {/* Последние операции */}
      <Text style={styles.sectionTitle}>Последние операции</Text>
      <FlatList
        data={recent}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.txItem}>
            <Text style={styles.txNote}>{item.note ?? "Без заметки"}</Text>
            <Text
              style={
                item.type === "income" ? styles.txIncome : styles.txExpense
              }
            >
              {item.type === "income" ? "+" : "−"}
              {fmt(item.amount)} ₽
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Пока пусто — добавь первую операцию</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.l,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  cardLabel: { ...type.caption, color: colors.textSecondary, marginBottom: 8 },
  balance: { ...type.balance, color: colors.goldBright },
  row: { flexDirection: "row", gap: 24, marginTop: 12 },
  income: { ...type.amount, color: colors.income },
  expense: { ...type.amount, color: colors.expense },

  sectionTitle: { ...type.h2, color: colors.textPrimary, marginBottom: 12 },

  txItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.m,
    padding: 16,
    marginBottom: 8,
  },
  txNote: { ...type.body, color: colors.textPrimary, flex: 1 },
  txIncome: {
    ...type.amount,
    fontVariant: ["tabular-nums"],
    color: colors.income,
  },
  txExpense: {
    ...type.amount,
    fontVariant: ["tabular-nums"],
    color: colors.expense,
  },
  empty: {
    ...type.caption,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 24,
  },
});
