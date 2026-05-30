import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password, plan } = await req.json();

    if (!firstName || !lastName || !email || !password || !plan) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (String(password).length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const sql = getDb();
    const passwordHash = await bcrypt.hash(String(password), 12);

    await sql`
      INSERT INTO users (email, first_name, last_name, password_hash, status)
      VALUES (${email.toLowerCase().trim()}, ${firstName.trim()}, ${lastName.trim()}, ${passwordHash}, 'pending')
      ON CONFLICT (email) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        password_hash = COALESCE(users.password_hash, EXCLUDED.password_hash),
        status = CASE WHEN users.status = 'active' THEN 'active' ELSE 'pending' END
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
