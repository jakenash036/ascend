import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export const GET = auth(async function GET(req) {
  const session = req.auth;
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Discord not configured" }, { status: 500 });
  }

  const nonce = crypto.randomBytes(16).toString("hex");
  const cookieValue = `${session.user.id}|${nonce}`;

  const baseUrl = process.env.NEXTAUTH_URL ?? `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const redirectUri = `${baseUrl}/api/discord/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify guilds.join",
    state: nonce,
  });

  const response = NextResponse.redirect(
    `https://discord.com/api/oauth2/authorize?${params.toString()}`
  );

  response.cookies.set("discord_link", cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 300,
    path: "/",
  });

  return response;
});
