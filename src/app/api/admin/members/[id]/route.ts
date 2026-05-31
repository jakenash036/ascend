import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

async function assignDiscordRole(discordId: string): Promise<void> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  const roleId = process.env.DISCORD_ROLE_ID;
  if (!botToken || !guildId || !roleId || !discordId) return;

  const res = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/members/${discordId}/roles/${roleId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bot ${botToken}`,
        "Content-Length": "0",
      },
    }
  );

  if (!res.ok && res.status !== 204) {
    const body = await res.text();
    console.error("[Admin] Failed to assign Discord role:", res.status, body);
  } else {
    console.log(`[Admin] Assigned Discord role to ${discordId}`);
  }
}

async function removeDiscordRole(discordId: string): Promise<void> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  const roleId = process.env.DISCORD_ROLE_ID;
  if (!botToken || !guildId || !roleId || !discordId) return;

  const res = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/members/${discordId}/roles/${roleId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bot ${botToken}` },
    }
  );

  if (!res.ok && res.status !== 204) {
    const body = await res.text();
    console.error("[Admin] Failed to remove Discord role:", res.status, body);
  } else {
    console.log(`[Admin] Removed Discord role from ${discordId}`);
  }
}

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
    const userRow = await sql`SELECT discord_id FROM users WHERE id = ${userId}`;
    const discordId = userRow[0]?.discord_id as string | null;
    if (discordId) await assignDiscordRole(discordId);
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
    const userRow = await sql`SELECT discord_id FROM users WHERE id = ${userId}`;
    const discordId = userRow[0]?.discord_id as string | null;
    if (discordId) await removeDiscordRole(discordId);
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
    const userRow = await sql`SELECT discord_id FROM users WHERE id = ${userId}`;
    const discordId = userRow[0]?.discord_id as string | null;
    if (discordId) await removeDiscordRole(discordId);
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    await sql`DELETE FROM users WHERE id = ${userId}`;
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
