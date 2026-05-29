import { createHmac, timingSafeEqual } from "crypto";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

interface ShopifySubscriptionPayload {
  id: string;
  customer?: {
    id: string;
    email: string;
  };
  email?: string;
  status?: string;
}

function verifyHmac(rawBody: string, signature: string, secret: string): boolean {
  const digest = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  try {
    return timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Server misconfiguration", { status: 500 });
  }

  const signature = req.headers.get("x-shopify-hmac-sha256") ?? "";
  const topic = req.headers.get("x-shopify-topic") ?? "";

  const rawBody = await req.text();

  if (!rawBody) {
    return new Response("Missing request body", { status: 400 });
  }

  if (!verifyHmac(rawBody, signature, secret)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: ShopifySubscriptionPayload;
  try {
    payload = JSON.parse(rawBody) as ShopifySubscriptionPayload;
  } catch {
    return new Response("Malformed JSON payload", { status: 400 });
  }

  const subscriptionId = payload.id;
  const customerId = payload.customer?.id ?? null;
  const email = payload.customer?.email ?? payload.email ?? null;

  if (!subscriptionId) {
    return new Response("Missing subscription id in payload", { status: 400 });
  }

  let subscriptionActive: boolean;

  if (topic === "subscriptions/create") {
    subscriptionActive = true;
  } else if (topic === "subscriptions/update") {
    // Shopify subscription statuses that indicate an active subscription
    const activeStatuses = new Set(["active", "pending"]);
    subscriptionActive = activeStatuses.has((payload.status ?? "").toLowerCase());
  } else if (topic === "subscriptions/cancel" || topic === "subscription_billing_attempts/failure") {
    subscriptionActive = false;
  } else {
    // Unrecognised topic — acknowledge without acting
    return new Response("OK", { status: 200 });
  }

  try {
    const sql = getDb();

    if (email) {
      // Upsert by email when we have it
      await sql`
        INSERT INTO members (email, shopify_customer_id, shopify_subscription_id, subscription_active, updated_at)
        VALUES (${email}, ${customerId}, ${subscriptionId}, ${subscriptionActive}, now())
        ON CONFLICT (email) DO UPDATE SET
          shopify_customer_id    = EXCLUDED.shopify_customer_id,
          shopify_subscription_id = EXCLUDED.shopify_subscription_id,
          subscription_active    = EXCLUDED.subscription_active,
          updated_at             = now()
      `;
    } else {
      // No email — update by subscription id if the row already exists
      await sql`
        UPDATE members
        SET shopify_customer_id    = ${customerId},
            subscription_active    = ${subscriptionActive},
            updated_at             = now()
        WHERE shopify_subscription_id = ${subscriptionId}
      `;
    }
  } catch (err) {
    console.error("Shopify webhook DB error:", err);
    return new Response("Database error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
