import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const search = req.nextUrl.searchParams.get("search") ?? "";
  const sql = getDb();

  let members;
  if (search) {
    const like = `%${search}%`;
    members = await sql`
      SELECT u.id, u.email, u.first_name, u.last_name, u.status, u.is_admin,
             u.discord, u.discord_id, u.shopify_customer_id, u.created_at,
             s.plan, s.start_date, s.end_date, s.status as sub_status
      FROM users u
      LEFT JOIN LATERAL (
        SELECT plan, start_date, end_date, status
        FROM subscriptions
        WHERE user_id = u.id
        ORDER BY created_at DESC LIMIT 1
      ) s ON true
      WHERE u.email ILIKE ${like}
         OR u.first_name ILIKE ${like}
         OR u.last_name ILIKE ${like}
      ORDER BY u.created_at DESC
    `;
  } else {
    members = await sql`
      SELECT u.id, u.email, u.first_name, u.last_name, u.status, u.is_admin,
             u.discord, u.discord_id, u.shopify_customer_id, u.created_at,
             s.plan, s.start_date, s.end_date, s.status as sub_status
      FROM users u
      LEFT JOIN LATERAL (
        SELECT plan, start_date, end_date, status
        FROM subscriptions
        WHERE user_id = u.id
        ORDER BY created_at DESC LIMIT 1
      ) s ON true
      ORDER BY u.created_at DESC
    `;
  }

  return NextResponse.json(members);
}
