// ONE-TIME SETUP ROUTE — delete after webhooks are registered

export const dynamic = "force-dynamic";

const TOPICS = [
  "subscription_contracts/create",
  "subscription_contracts/update",
  "subscription_contracts/cancel",
  "subscription_billing_attempts/failure",
] as const;

export async function GET(): Promise<Response> {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const adminApiToken = process.env.SHOPIFY_ADMIN_API_TOKEN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!storeDomain) {
    return Response.json(
      { error: "Missing environment variable: SHOPIFY_STORE_DOMAIN" },
      { status: 500 }
    );
  }
  if (!adminApiToken) {
    return Response.json(
      { error: "Missing environment variable: SHOPIFY_ADMIN_API_TOKEN" },
      { status: 500 }
    );
  }
  if (!siteUrl) {
    return Response.json(
      { error: "Missing environment variable: NEXT_PUBLIC_SITE_URL" },
      { status: 500 }
    );
  }

  const webhookAddress = `${siteUrl}/api/webhooks/shopify`;
  const endpoint = `https://${storeDomain}/admin/api/2026-01/webhooks.json`;

  const succeeded: string[] = [];
  const failed: string[] = [];

  for (const topic of TOPICS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "X-Shopify-Access-Token": adminApiToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhook: {
            topic,
            address: webhookAddress,
            format: "json",
          },
        }),
      });

      if (res.ok) {
        succeeded.push(topic);
      } else {
        const text = await res.text();
        console.error(`Failed to register webhook for ${topic}: ${res.status} ${text}`);
        failed.push(topic);
      }
    } catch (err) {
      console.error(`Error registering webhook for ${topic}:`, err);
      failed.push(topic);
    }
  }

  return Response.json({ success: succeeded, failed }, { status: 200 });
}
