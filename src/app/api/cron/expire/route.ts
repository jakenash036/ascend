import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();

    // Find users whose most recent subscription has expired but are still marked active
    const expired = await sql<{ user_id: number; discord_id: string | null; sub_id: number }[]>`
      SELECT u.id AS user_id, u.discord_id, s.id AS sub_id
      FROM users u
      JOIN subscriptions s ON s.user_id = u.id
      WHERE u.status = 'active'
        AND s.status = 'active'
        AND s.end_date < NOW()
        AND s.id = (
          SELECT id FROM subscriptions
          WHERE user_id = u.id
          ORDER BY created_at DESC
          LIMIT 1
        )
    `;

    console.log(`[Cron] Found ${expired.length} expired subscription(s)`);

    if (expired.length === 0) {
      return NextResponse.json({ ok: true, expired: 0 });
    }

    // Update each user and subscription individually to avoid array syntax issues
    for (const row of expired) {
      await sql`UPDATE users SET status = 'expired' WHERE id = ${row.user_id}`;
      await sql`UPDATE subscriptions SET status = 'expired' WHERE id = ${row.sub_id}`;
    }

    // Strip Discord roles
    const botToken = process.env.DISCORD_BOT_TOKEN;
    const guildId = process.env.DISCORD_GUILD_ID;
    const roleId = process.env.DISCORD_ROLE_ID;

    if (botToken && guildId && roleId) {
      await Promise.allSettled(
        expired
          .filter((r) => r.discord_id)
          .map(async (r) => {
            const res = await fetch(
              `https://discord.com/api/v10/guilds/${guildId}/members/${r.discord_id}/roles/${roleId}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bot ${botToken}` },
              }
            );
            if (!res.ok && res.status !== 204) {
              const body = await res.text();
              console.error(`[Cron] Failed to remove Discord role for ${r.discord_id}: ${res.status}`, body);
            } else {
              console.log(`[Cron] Removed Discord role for user ${r.user_id} (${r.discord_id})`);
            }
          })
      );
    }

    return NextResponse.json({ ok: true, expired: expired.length });
  } catch (err) {
    console.error("Cron expire error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
