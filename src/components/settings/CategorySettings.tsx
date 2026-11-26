import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import {
  DEFAULT_CATEGORIES,
  addCategory,
  getCategories,
  type Category,
  type CategoryType,
} from "../../db/categories";
import { colors, radius } from "../../theme/theme";
import { type as typeStyles } from "../../theme/fonts";

// Палитра для новых категорий — берём случайный цвет
const CATEGORY_COLORS = [
  "#F59E0B",
  "#3B82F6",
  "#8B5CF6",
  "#EF4444",
  "#10B981",
  "#EC4899",
  "#22C55E",
  "#64748B",
];

// Дефолтный эмодзи формы — как у доходной категории «Прочее» в сидах
const defaultEmoji =
  DEFAULT_CATEGORIES.find((c) => c.type === "income" && c.name === "Прочее")
    ?.emoji ?? "😀";

export default function CategorySettings() {
  const [expenseCats, setExpenseCats] = useState<Category[]>([]);
  const [incomeCats, setIncomeCats] = useState<Category[]>([]);

  // форма добавления
  const [formOpen, setFormOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCatType, setNewCatType] = useState<CategoryType>("expense");
  const [newEmoji, setNewEmoji] = useState(defaultEmoji);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerWidth, setPickerWidth] = useState(0);
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    setExpenseCats(await getCategories("expense"));
    setIncomeCats(await getCategories("income"));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name || saving) return;
    setSaving(true);
    try {
      const color =
        CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)];
      await addCategory(name, newCatType, newEmoji, color);
      setNewName("");
      setNewEmoji(defaultEmoji);
      setFormOpen(false);
      await loadCategories(); // перечитываем список после вставки
    } finally {
      setSaving(false);
    }
  };

  const openForm = (catType: CategoryType) => {
    setNewCatType(catType);
    setFormOpen(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ---------- Добавление категории ---------- */}
        {!formOpen ? (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openForm("expense")}
            >
              <Text style={[styles.actionText, { color: colors.expense }]}>
                + Расход
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => openForm("income")}
            >
              <Text style={[styles.actionText, { color: colors.income }]}>
                + Доход
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            {/* ---------- Тип: расход / доход ---------- */}
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  {
                    backgroundColor:
                      newCatType === "expense"
                        ? colors.expense
                        : colors.background,
                  },
                ]}
                onPress={() => setNewCatType("expense")}
              >
                <Text
                  style={[
                    styles.typeText,
                    newCatType === "expense" && styles.typeTextActive,
                  ]}
                >
                  Расход
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  {
                    backgroundColor:
                      newCatType === "income"
                        ? colors.income
                        : colors.background,
                  },
                ]}
                onPress={() => setNewCatType("income")}
              >
                <Text
                  style={[
                    styles.typeText,
                    newCatType === "income" && styles.typeTextActive,
                  ]}
                >
                  Доход
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.emojiNameRow}>
              <TouchableOpacity
                style={styles.emojiButton}
                onPress={() => setPickerOpen((prev) => !prev)}
              >
                <Text style={styles.emojiButtonText}>{newEmoji}</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="Название категории"
                placeholderTextColor={colors.textMuted}
                maxLength={20}
                onSubmitEditing={handleAdd}
              />
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setFormOpen(false)}
              >
                <Text style={styles.cancelText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  { opacity: newName.trim() ? 1 : 0.4 },
                ]}
                onPress={handleAdd}
                disabled={!newName.trim()}
              >
                <Text style={styles.saveText}>Добавить</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ---------- Список расходов ---------- */}
        <Text style={styles.sectionTitle}>Расходы</Text>
        <View style={styles.card}>
          {expenseCats.map((c) => (
            <CategoryRow key={c.id} category={c} />
          ))}
        </View>

        {/* ---------- Список доходов ---------- */}
        <Text style={styles.sectionTitle}>Доходы</Text>
        <View style={styles.card}>
          {incomeCats.map((c) => (
            <CategoryRow key={c.id} category={c} />
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={pickerOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
      >
        <View style={styles.modalOverlay}>
          {/* тап по фону закрывает */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setPickerOpen(false)}
          />
          {/* обёртка глушит тапы, чтобы клик по шторке не дошёл до фона */}
          <Pressable style={styles.pickerSheetWrapper}>
            <View
              style={styles.pickerSheet}
              onLayout={(e) => setPickerWidth(e.nativeEvent.layout.width)}
            >
              {pickerWidth > 0 && (
                <EmojiSelector
                  category={Categories.history}
                  onEmojiSelected={(emoji: string) => {
                    setNewEmoji(emoji);
                    setPickerOpen(false);
                  }}
                  theme="#D4A843"
                  showTabs
                  showSearchBar={false}
                  showSectionTitles={false}
                />
              )}
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

function CategoryRow({ category }: { category: Category }) {
  return (
    <View style={styles.categoryRow}>
      <View
        style={[
          styles.categoryIcon,
          { backgroundColor: category.color ?? colors.surface },
        ]}
      >
        <Text style={styles.categoryEmoji}>{category.emoji || "•"}</Text>
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // кнопки добавления
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.l,
    paddingVertical: 14,
    alignItems: "center",
  },
  actionText: {
    ...typeStyles.body,
    fontWeight: "600",
  },

  // форма
  form: {
    backgroundColor: colors.surface,
    borderRadius: radius.l,
    padding: 16,
    marginBottom: 24,
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: radius.m,
    backgroundColor: colors.background,
  },
  typeButtonActive: {
    backgroundColor: colors.goldBright,
  },
  typeText: {
    ...typeStyles.body,
    color: colors.textMuted,
    fontWeight: "600",
  },
  typeTextActive: {
    color: colors.background,
  },

  input: {
    ...typeStyles.body,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    borderRadius: radius.m,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flex: 1,
    height: 56,
  },
  emojiNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  emojiButton: {
    width: 56,
    height: 56,
    borderRadius: radius.m,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  emojiButtonText: {
    fontSize: 28,
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.textMuted,
  },
  cancelText: {
    ...typeStyles.body,
    color: colors.textMuted,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: radius.m,
    backgroundColor: colors.goldBright,
  },
  saveText: {
    ...typeStyles.body,
    fontWeight: "600",
    color: colors.background,
  },

  // секции списков
  sectionTitle: {
    ...typeStyles.h2,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.l,
    padding: 8,
    marginBottom: 24,
  },

  // строка категории
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.m,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryName: {
    ...typeStyles.body,
    color: colors.textPrimary,
  },

  // модалка с пикером
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerSheetWrapper: {
    // без стилей — просто барьер, гасящий тапы
  },
  pickerSheet: {
    height: 420,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.l,
    borderTopRightRadius: radius.l,
    paddingTop: 8,
  },
});
