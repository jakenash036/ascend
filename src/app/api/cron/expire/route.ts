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
    const expired = await sql`
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

    if (expired.length === 0) {
      return NextResponse.json({ ok: true, expired: 0 });
    }

    const userIds = (expired as { user_id: number; discord_id: string | null; sub_id: number }[]).map((r) => r.user_id);
    const subIds = (expired as { user_id: number; discord_id: string | null; sub_id: number }[]).map((r) => r.sub_id);

    await sql`
      UPDATE users
      SET status = 'expired'
      WHERE id = ANY({dl}{ob}userIds{cb}::int[])
    `;

    await sql`
      UPDATE subscriptions
      SET status = 'expired'
      WHERE id = ANY({dl}{ob}subIds{cb}::int[])
    `;

    // Optionally strip Discord roles
    const botToken = process.env.DISCORD_BOT_TOKEN;
    const guildId = process.env.DISCORD_GUILD_ID;
    const roleId = process.env.DISCORD_ROLE_ID;

    if (botToken && guildId && roleId) {
      await Promise.allSettled(
        (expired as { user_id: number; discord_id: string | null; sub_id: number }[])
          .filter((r) => r.discord_id)
          .map((r) =>
            fetch(
              `https://discord.com/api/v10/guilds/${guildId}/members/${r.discord_id}/roles/${roleId}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bot ${botToken}` },
              }
            )
          )
      );
    }

    return NextResponse.json({ ok: true, expired: expired.length });
  } catch (err) {
    console.error("Cron expire error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
