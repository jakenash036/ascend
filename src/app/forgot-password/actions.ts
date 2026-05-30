"use server";

import { getDb } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function forgotPasswordAction(email: string): Promise<string | null> {
  const sql = getDb();

  // Ensure reset tokens table exists
  await sql`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  const users = await sql`
    SELECT id, email FROM users WHERE email = ${email.toLowerCase().trim()}
  `;

  // Always return success to avoid email enumeration
  if (!users[0]) return null;

  const user = users[0] as { id: number; email: string };
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Invalidate any existing tokens for this user
  await sql`DELETE FROM password_reset_tokens WHERE user_id = ${user.id}`;

  await sql`
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES (${user.id}, ${token}, ${expiresAt.toISOString()})
  `;

  const baseUrl = process.env.NEXTAUTH_URL ?? "https://members.ascendescapeaverage.com";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  await sendPasswordResetEmail(user.email, resetUrl);

  return null;
}
