import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json();
  const action = body?.action as string;

  const sql = getDb();

  if (action === "activate") {
    await sql`UPDATE users SET status = 'active' WHERE id = ${userId}`;
    const now = new Date();
    const subs = await sql`
      SELECT id, end_date FROM subscriptions
      WHERE user_id = ${userId}
      ORDER BY created_at DESC LIMIT 1
    `;
    if (subs.length > 0) {
      const sub = subs[0];
      const currentEnd = new Date(sub.end_date);
      const newEnd = currentEnd < now
        ? new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
        : currentEnd;
      await sql`
        UPDATE subscriptions
        SET status = 'active', end_date = ${newEnd.toISOString()}
        WHERE id = ${sub.id}
      `;
    }
    return NextResponse.json({ ok: true });
  }

  if (action === "cancel") {
    await sql`UPDATE users SET status = 'cancelled' WHERE id = ${userId}`;
    await sql`
      UPDATE subscriptions SET status = 'cancelled'
      WHERE id = (
        SELECT id FROM subscriptions WHERE user_id = ${userId}
        ORDER BY created_at DESC LIMIT 1
      )
    `;
    return NextResponse.json({ ok: true });
  }

  if (action === "expire") {
    await sql`UPDATE users SET status = 'expired' WHERE id = ${userId}`;
    await sql`
      UPDATE subscriptions SET status = 'expired'
      WHERE id = (
        SELECT id FROM subscriptions WHERE user_id = ${userId}
        ORDER BY created_at DESC LIMIT 1
      )
    `;
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    await sql`DELETE FROM users WHERE id = ${userId}`;
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
