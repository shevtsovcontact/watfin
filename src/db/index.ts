import * as SQLite from "expo-sqlite";
import { seedDefaultCategories } from "./categories";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = initDb();
  }
  return dbPromise;
}

async function initDb() {
  const db = await SQLite.openDatabaseAsync("finance.db");

  // при смене схемы поднимай DB_VERSION — база пересоздастся
  const DB_VERSION = 2;
  const { user_version } = (await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  )) ?? { user_version: 0 };

  if (user_version < DB_VERSION) {
    await db.execAsync(
      "DROP TABLE IF EXISTS transactions; DROP TABLE IF EXISTS categories;",
    );
    await db.execAsync(`PRAGMA user_version = ${DB_VERSION}`);
  }

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      icon TEXT,
      color TEXT,
      emoji TEXT,
      is_default INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      category_id INTEGER REFERENCES categories(id),
      note TEXT,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  await seedDefaultCategories(db); // передаём уже открытую базу
  return db;
}
