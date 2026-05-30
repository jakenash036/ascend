import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function verifyShopifyWebhook(body: string, hmacHeader: string): boolean {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return false;
  const digest = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader));
  } catch {
    return false;
  }
}

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
    console.error("Failed to assign Discord role:", res.status, body);
  }
}

async function removeDiscordRole(discordId: string): Promise<void> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  const roleId = process.env.DISCORD_ROLE_ID;
  if (!botToken || !guildId || !roleId || !discordId) return;

  await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/members/${discordId}/roles/${roleId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bot ${botToken}` },
    }
  );
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const hmac = req.headers.get("x-shopify-hmac-sha256") ?? "";

  if (!verifyShopifyWebhook(rawBody, hmac)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const topic = req.headers.get("x-shopify-topic");

  if (topic === "orders/paid") {
    try {
      const order = JSON.parse(rawBody);
      const email = order.email?.toLowerCase().trim();
      const shopifyOrderId = String(order.id);
      const shopifyCustomerId = order.customer?.id ? String(order.customer.id) : null;

      // Get plan from line item properties
      const lineItemProps: { name: string; value: string }[] =
        order.line_items?.[0]?.properties ?? [];
      const plan = lineItemProps.find((p) => p.name === "plan")?.value ?? "monthly";

      const now = new Date();
      const endDate = new Date(now);
      if (plan === "yearly") {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      const sql = getDb();

      const result = await sql`
        UPDATE users
        SET status = 'active',
            shopify_customer_id = COALESCE(${shopifyCustomerId}, shopify_customer_id)
        WHERE email = ${email}
        RETURNING id, discord_id
      `;

      if (result.length === 0) {
        const firstName = order.customer?.first_name ?? "";
        const lastName = order.customer?.last_name ?? "";
        await sql`
          INSERT INTO users (email, first_name, last_name, shopify_customer_id, status)
          VALUES (${email}, ${firstName}, ${lastName}, ${shopifyCustomerId}, 'active')
          ON CONFLICT (email) DO UPDATE SET status = 'active'
        `;
      }

      const user = result[0] ?? (await sql`SELECT id, discord_id FROM users WHERE email = ${email}`)[0];

      await sql`
        INSERT INTO subscriptions (user_id, shopify_order_id, plan, start_date, end_date, status)
        VALUES (${user.id}, ${shopifyOrderId}, ${plan}, ${now.toISOString()}, ${endDate.toISOString()}, 'active')
        ON CONFLICT (shopify_order_id) DO NOTHING
      `;

      // Re-assign Discord role if already linked (covers renewals after expiry)
      if (user.discord_id) {
        await assignDiscordRole(user.discord_id);
      }

      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("Webhook error (orders/paid):", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  if (topic === "orders/cancelled") {
    try {
      const order = JSON.parse(rawBody);
      const email = order.email?.toLowerCase().trim();
      const shopifyOrderId = String(order.id);

      const sql = getDb();

      await sql`
        UPDATE subscriptions
        SET status = 'cancelled'
        WHERE shopify_order_id = ${shopifyOrderId}
      `;

      const updated = await sql`
        UPDATE users
        SET status = 'cancelled'
        WHERE email = ${email}
        RETURNING discord_id
      `;

      const discordId = (updated[0] as { discord_id: string | null } | undefined)?.discord_id;
      if (discordId) await removeDiscordRole(discordId);

      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("Webhook error (orders/cancelled):", err);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
