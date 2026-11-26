// app/(tabs)/add.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, Stack } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

import { colors, radius, currency } from "../../theme/theme";
import { fonts, type } from "../../theme/fonts";
import { getCategories, type Category } from "../../db/categories";
import { addTransaction, type TxType } from "../../db/transactions";

export default function AddScreen() {
  const [txType, setTxType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    getCategories(txType).then((rows) => {
      setCategories(rows);
      setCategoryId(null); // сброс при смене типа
    });
  }, [txType]);

  // строка -> число, поддерживаем запятую
  const parsedAmount = useMemo(
    () => Number(amount.replace(",", ".")),
    [amount],
  );
  const isAmountValid = !Number.isNaN(parsedAmount) && parsedAmount > 0;
  const canSave = isAmountValid && categoryId !== null;
  const amountColor = txType === "income" ? colors.income : colors.expense;

  const save = async () => {
    if (!canSave || categoryId === null) return;
    const ymd = date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
    await addTransaction({
      amount: parsedAmount,
      type: txType,
      categoryId,
      note: note.trim() || null,
      date: ymd,
    });
    router.replace({
      pathname: "/tabs",
      params: { refresh: Date.now().toString() },
    });
  };

  const fmtDate = useMemo(
    () =>
      date.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [date],
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Новая операция",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
        }}
      />

      {/* Тип: расход / доход */}
      <View style={styles.segment}>
        <Pressable
          style={[
            styles.segmentBtn,
            txType === "expense" && styles.segmentExpense,
          ]}
          onPress={() => setTxType("expense")}
        >
          <Text
            style={[
              styles.segmentText,
              txType === "expense" && styles.segmentTextActive,
            ]}
          >
            Расход
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.segmentBtn,
            txType === "income" && styles.segmentIncome,
          ]}
          onPress={() => setTxType("income")}
        >
          <Text
            style={[
              styles.segmentText,
              txType === "income" && styles.segmentTextActive,
            ]}
          >
            Доход
          </Text>
        </Pressable>
      </View>

      {/* Сумма */}
      <View style={styles.amountBlock}>
        <TextInput
          style={{ ...styles.amountInput, color: amountColor }}
          value={amount}
          onChangeText={(t) => setAmount(t.replace(/[^\d.,]/g, ""))}
          placeholder="0"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          multiline={false}
        />
        <Text style={{ ...styles.currency, color: amountColor }}>
          {currency}
        </Text>
      </View>

      {/* Категории */}
      <Text style={styles.sectionTitle}>Категория</Text>
      <View style={styles.chips}>
        {categories.map((c) => (
          <Pressable
            key={c.id}
            style={[styles.chip, categoryId === c.id && styles.chipActive]}
            onPress={() => setCategoryId(c.id)}
          >
            <Text
              style={[
                styles.chipText,
                categoryId === c.id && styles.chipTextActive,
              ]}
            >
              {c.name}
            </Text>
          </Pressable>
        ))}
        {categories.length === 0 && (
          <Text style={styles.hint}>
            Категории пока пустые — добавим их в настройках
          </Text>
        )}
      </View>

      {/* Дата */}
      <Text style={styles.sectionTitle}>Дата</Text>
      <Pressable style={styles.field} onPress={() => setShowPicker(true)}>
        <Text style={styles.fieldText}>{fmtDate}</Text>
      </Pressable>
      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(_, d) => {
            setShowPicker(false);
            if (d) setDate(d);
          }}
        />
      )}

      {/* Заметка */}
      <Text style={styles.sectionTitle}>Заметка</Text>
      <TextInput
        style={[styles.field, styles.fieldInput]}
        value={note}
        onChangeText={setNote}
        placeholder="Например: обед с друзьями"
        placeholderTextColor={colors.textMuted}
      />

      {/* Сохранить */}
      <Pressable
        style={({ pressed }) => [
          styles.saveBtn,
          (!canSave || pressed) && styles.saveBtnDisabled,
        ]}
        onPress={save}
      >
        <Text style={styles.saveText}>Сохранить</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, gap: 8, paddingBottom: 48 },

  segment: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.pill,
    alignItems: "center",
  },
  segmentExpense: { backgroundColor: colors.expense },
  segmentIncome: { backgroundColor: colors.ice },
  segmentText: {
    ...type.body,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  segmentTextActive: { color: colors.background, fontWeight: "700" },

  amountBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end", // было 'center'
    backgroundColor: colors.surface,
    borderRadius: radius.l,
    padding: 20,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingRight: 24,
  },

  amountInput: {
    ...type.balance,
    color: colors.goldBright,
    flex: 1, // занимает всё свободное место, но не распирает блок
    textAlign: "right",
    padding: 0,
    paddingVertical: 0,
    height: type.balance.fontSize * 1.2,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  currency: {
    ...type.balance,
    color: colors.goldBright,
    marginLeft: 8,
    height: type.balance.fontSize * 1.2,
    lineHeight: type.balance.fontSize * 1.2,
    textAlignVertical: "center",
    includeFontPadding: false,
  },

  sectionTitle: {
    ...type.caption,
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 8,
  },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.iceDeep, borderColor: colors.ice },
  chipText: { ...type.body, color: colors.textPrimary },
  chipTextActive: { color: colors.background, fontWeight: "700" },
  hint: { ...type.caption, color: colors.textMuted },

  field: {
    backgroundColor: colors.surface,
    borderRadius: radius.m,
    padding: 14,
  },
  fieldText: { ...type.body, color: colors.textPrimary },
  fieldInput: { ...type.body, color: colors.textPrimary },

  saveBtn: {
    backgroundColor: colors.gold,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  saveBtnDisabled: { backgroundColor: colors.goldDeep, opacity: 0.6 },
  saveText: { ...type.h2, fontFamily: fonts.bold, color: colors.background },
});
