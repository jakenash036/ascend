"use server";

import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function resetPasswordAction(
  token: string,
  password: string
): Promise<string | null> {
  if (!token || password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  const sql = getDb();

  const tokens = await sql`
    SELECT id, user_id, expires_at, used
    FROM password_reset_tokens
    WHERE token = ${token}
  `;

  const row = tokens[0] as
    | { id: number; user_id: number; expires_at: string; used: boolean }
    | undefined;

  if (!row) return "Invalid or expired reset link.";
  if (row.used) return "This reset link has already been used.";
  if (new Date(row.expires_at) < new Date()) return "This reset link has expired.";

  const hash = await bcrypt.hash(password, 12);

  await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${row.user_id}`;
  await sql`UPDATE password_reset_tokens SET used = TRUE WHERE id = ${row.id}`;

  return null;
}
