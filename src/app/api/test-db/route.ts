import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const sql = getDb();
  const members = await sql`SELECT * FROM members LIMIT 10`;
  return NextResponse.json(members);
}
