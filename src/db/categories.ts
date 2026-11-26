import type { SQLiteDatabase } from "expo-sqlite";
import { getDb } from "./index";

export interface Category {
  id: number;
  name: string;
  type: "income" | "expense";
  icon?: string;
  color?: string;
  emoji?: string;
  is_default?: number;
}

export type CategoryType = "income" | "expense";

export const DEFAULT_CATEGORIES: Omit<Category, "id">[] = [
  // расходы
  { name: "Продукты", type: "expense", emoji: "🛒", color: "#F59E0B" },
  { name: "Транспорт", type: "expense", emoji: "🚌", color: "#3B82F6" },
  { name: "Кафе", type: "expense", emoji: "☕", color: "#8B5CF6" },
  { name: "Здоровье", type: "expense", emoji: "💊", color: "#EF4444" },
  { name: "Дом", type: "expense", emoji: "🏠", color: "#10B981" },
  { name: "Развлечения", type: "expense", emoji: "🎮", color: "#EC4899" },
  // доходы
  { name: "Зарплата", type: "income", emoji: "💼", color: "#22C55E" },
  { name: "Подарки", type: "income", emoji: "🎁", color: "#EAB308" },
  { name: "Прочее", type: "income", emoji: "✨", color: "#64748B" },
];

export async function getCategories(type: CategoryType) {
  const db = await getDb();
  return db.getAllAsync<Category>(
    "SELECT id, name, type, icon, color, emoji, is_default FROM categories WHERE type = ? ORDER BY is_default DESC, name",
    [type],
  );
}

export async function addCategory(
  name: string,
  type: CategoryType,
  emoji: string,
  color: string,
) {
  const db = await getDb();
  const result = await db.runAsync(
    "INSERT INTO categories (name, type, emoji, color, is_default) VALUES (?, ?, ?, ?, 0)",
    [name, type, emoji, color],
  );
  return result.lastInsertRowId;
}

export async function seedDefaultCategories(db: SQLiteDatabase) {
  const count = await db.getFirstAsync<{ n: number }>(
    "SELECT COUNT(*) as n FROM categories",
  );
  if ((count?.n ?? 0) > 0) return;

  for (const c of DEFAULT_CATEGORIES) {
    await db.runAsync(
      "INSERT INTO categories (name, type, emoji, color, is_default) VALUES (?, ?, ?, ?, 1)",
      [c.name, c.type, c.emoji ?? "", c.color ?? "#64748B"],
    );
  }
}
