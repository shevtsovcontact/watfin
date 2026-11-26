import { getDb } from "./index";

export type TxType = "income" | "expense";

export interface Transaction {
  id: number;
  amount: number;
  type: TxType;
  categoryId: number | null;
  note: string | null;
  date: string;
}

export async function addTransaction(tx: Omit<Transaction, "id">) {
  const db = await getDb();
  const result = await db.runAsync(
    "INSERT INTO transactions (amount, type, category_id, note, date) VALUES (?, ?, ?, ?, ?)",
    tx.amount,
    tx.type,
    tx.categoryId,
    tx.note,
    tx.date,
  );
  return result.lastInsertRowId;
}

export async function getMonthlyTotals(month: string) {
  // month = '2026-11'
  const db = await getDb();
  const rows = await db.getAllAsync<{ type: TxType; total: number }>(
    `SELECT type, SUM(amount) as total FROM transactions
     WHERE date LIKE ? || '%' GROUP BY type`,
    [month],
  );
  const expense = rows.find((r) => r.type === "expense")?.total ?? 0;
  const income = rows.find((r) => r.type === "income")?.total ?? 0;
  return { income, expense, balance: income - expense };
}

export async function getRecentTransactions(limit = 10) {
  const db = await getDb();
  return db.getAllAsync<Transaction>(
    `SELECT id, amount, type, category_id AS categoryId, note, date
     FROM transactions
     ORDER BY date DESC, id DESC
     LIMIT ?`,
    [limit],
  );
}
