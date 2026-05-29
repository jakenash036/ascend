import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, discord, plan } = await req.json();

    if (!firstName || !lastName || !email || !discord || !plan) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const sql = getDb();

    // Upsert — if they've tried before with same email, update their details
    await sql`
      INSERT INTO users (email, first_name, last_name, discord, status)
      VALUES (${email.toLowerCase().trim()}, ${firstName.trim()}, ${lastName.trim()}, ${discord.trim()}, 'pending')
      ON CONFLICT (email) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        discord = EXCLUDED.discord,
        status = CASE WHEN users.status = 'active' THEN 'active' ELSE 'pending' END
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
