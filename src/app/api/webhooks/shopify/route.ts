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

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const hmac = req.headers.get("x-shopify-hmac-sha256") ?? "";

  if (!verifyShopifyWebhook(rawBody, hmac)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const topic = req.headers.get("x-shopify-topic");
  if (topic !== "orders/paid") {
    return NextResponse.json({ ok: true });
  }

  try {
    const order = JSON.parse(rawBody);
    const email = order.email?.toLowerCase().trim();
    const shopifyOrderId = String(order.id);
    const shopifyCustomerId = order.customer?.id ? String(order.customer.id) : null;

    // Get plan from order attributes
    const attrs: { name: string; value: string }[] = order.note_attributes ?? [];
    const plan = attrs.find((a) => a.name === "plan")?.value ?? "monthly";

    const now = new Date();
    const endDate = new Date(now);
    if (plan === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const sql = getDb();

    // Update user to active
    const result = await sql`
      UPDATE users
      SET status = 'active',
          shopify_customer_id = COALESCE(${shopifyCustomerId}, shopify_customer_id)
      WHERE email = ${email}
      RETURNING id
    `;

    if (result.length === 0) {
      // User not found — create them from order data (edge case: checkout without form)
      const firstName = order.customer?.first_name ?? "";
      const lastName = order.customer?.last_name ?? "";
      await sql`
        INSERT INTO users (email, first_name, last_name, shopify_customer_id, status)
        VALUES (${email}, ${firstName}, ${lastName}, ${shopifyCustomerId}, 'active')
        ON CONFLICT (email) DO UPDATE SET status = 'active'
      `;
    }

    const user = result[0] ?? (await sql`SELECT id FROM users WHERE email = ${email}`)[0];

    // Create subscription record
    await sql`
      INSERT INTO subscriptions (user_id, shopify_order_id, plan, start_date, end_date)
      VALUES (${user.id}, ${shopifyOrderId}, ${plan}, ${now.toISOString()}, ${endDate.toISOString()})
      ON CONFLICT (shopify_order_id) DO NOTHING
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
