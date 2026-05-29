import { createHmac, timingSafeEqual } from "crypto";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

interface ShopifySubscriptionPayload {
  id: string;
  status?: string;
  customer_id?: string;
  billing_policy?: {
    interval: string;
    interval_count: number;
  };
}

interface ShopifyBillingAttemptPayload {
  id: string;
  subscription_contract_id?: string;
  error_message?: string;
  ready?: boolean;
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
  const activeTopics = new Set([
    "subscription_contracts/create",
    "subscription_contracts/update",
    "subscription_billing_attempts/failure",
    "subscription_billing_attempts/success",
    "subscription_contracts/cancel",
  ]);

  const rawBody = await req.text();

  if (!rawBody) {
    return new Response("Missing request body", { status: 400 });
  }

  if (!verifyHmac(rawBody, signature, secret)) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!activeTopics.has(topic)) {
    return new Response("OK", { status: 200 });
  }

  let payload: ShopifySubscriptionPayload | ShopifyBillingAttemptPayload;
  try {
    payload = JSON.parse(rawBody) as ShopifySubscriptionPayload | ShopifyBillingAttemptPayload;
  } catch {
    return new Response("Malformed JSON payload", { status: 400 });
  }

  let subscriptionId: string | undefined;
  let customerId: string | null = null;

  let subscriptionActive: boolean;

  if (topic === "subscription_contracts/create") {
    subscriptionId = "id" in payload ? payload.id : undefined;
    customerId = "customer_id" in payload ? (payload.customer_id ?? null) : null;
    subscriptionActive = true;
  } else if (topic === "subscription_contracts/update") {
    subscriptionId = "id" in payload ? payload.id : undefined;
    customerId = "customer_id" in payload ? (payload.customer_id ?? null) : null;

    if (!("status" in payload) || !payload.status) {
      return new Response("Missing subscription status in payload", { status: 400 });
    }

    const normalizedStatus = payload.status.toUpperCase();
    if (normalizedStatus === "ACTIVE") {
      subscriptionActive = true;
    } else if (["PAUSED", "CANCELLED", "FAILED", "EXPIRED"].includes(normalizedStatus)) {
      subscriptionActive = false;
    } else {
      return new Response("Unsupported subscription status in payload", { status: 400 });
    }
  } else if (topic === "subscription_contracts/cancel") {
    subscriptionId = "id" in payload ? payload.id : undefined;
    customerId = "customer_id" in payload ? (payload.customer_id ?? null) : null;
    subscriptionActive = false;
  } else if (topic === "subscription_billing_attempts/failure") {
    subscriptionId = "subscription_contract_id" in payload ? payload.subscription_contract_id : undefined;
    subscriptionActive = false;
  } else if (topic === "subscription_billing_attempts/success") {
    subscriptionId = "subscription_contract_id" in payload ? payload.subscription_contract_id : undefined;
    subscriptionActive = true;
  } else {
    return new Response("OK", { status: 200 });
  }

  if (!subscriptionId) {
    return new Response("Missing subscription id in payload", { status: 400 });
  }

  try {
    const sql = getDb();

    await sql`
      UPDATE members
      SET shopify_customer_id = COALESCE(${customerId}, shopify_customer_id),
          subscription_active = ${subscriptionActive},
          updated_at          = now()
      WHERE shopify_subscription_id = ${subscriptionId}
    `;
  } catch (err) {
    console.error("Shopify webhook DB error:", err);
    return new Response("Database error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
