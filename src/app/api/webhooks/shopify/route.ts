import { createHmac, timingSafeEqual } from "crypto";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

interface ShopifyLineItem {
  title: string;
  price: string;
}

interface ShopifyCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface ShopifyOrder {
  id: number;
  email: string;
  created_at: string;
  customer: ShopifyCustomer;
  line_items: ShopifyLineItem[];
}

function verifyHmac(rawBody: string, signature: string, secret: string): boolean {
  const digest = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

async function ensureTables(): Promise<void> {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      shopify_customer_id TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      first_name TEXT,
      last_name TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      shopify_order_id TEXT UNIQUE NOT NULL,
      plan TEXT NOT NULL,
      start_date TIMESTAMPTZ NOT NULL,
      end_date TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Server misconfiguration", { status: 500 });
  }

  const signature = req.headers.get("x-shopify-hmac-sha256") ?? "";
  const topic = req.headers.get("x-shopify-topic") ?? "";

  const rawBody = await req.text();

  if (!verifyHmac(rawBody, signature, secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (topic !== "orders/create") {
    return Response.json({ received: true }, { status: 200 });
  }

  let order: ShopifyOrder;
  try {
    order = JSON.parse(rawBody) as ShopifyOrder;
  } catch {
    return Response.json({ received: true }, { status: 200 });
  }

  const startDate = new Date(order.created_at);
  let plan: string;
  let endDate: Date;

  const prices = order.line_items.map((item) => item.price);

  if (prices.includes("179.99")) {
    plan = "yearly";
    endDate = addDays(startDate, 365);
  } else if (prices.includes("19.99")) {
    plan = "monthly";
    endDate = addDays(startDate, 30);
  } else {
    console.warn(
      `Shopify orders/create: unrecognised prices [${prices.join(", ")}] for order ${order.id} — defaulting to monthly`
    );
    plan = "unknown";
    endDate = addDays(startDate, 30);
  }

  try {
    await ensureTables();

    const sql = getDb();

    const rows = await sql`
      INSERT INTO users (shopify_customer_id, email, first_name, last_name)
      VALUES (${String(order.customer.id)}, ${order.customer.email}, ${order.customer.first_name}, ${order.customer.last_name})
      ON CONFLICT (shopify_customer_id) DO UPDATE SET email = EXCLUDED.email
      RETURNING id
    `;

    const userId = (rows[0] as { id: number }).id;

    await sql`
      INSERT INTO subscriptions (user_id, shopify_order_id, plan, start_date, end_date)
      VALUES (${userId}, ${String(order.id)}, ${plan}, ${startDate.toISOString()}, ${endDate.toISOString()})
      ON CONFLICT (shopify_order_id) DO NOTHING
    `;
  } catch (err) {
    console.error("Shopify webhook DB error:", err);
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  return Response.json({ received: true }, { status: 200 });
}
