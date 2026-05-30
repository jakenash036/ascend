import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieValue = req.cookies.get("discord_link")?.value;

  // Validate state / CSRF
  if (!code || !state || !cookieValue) {
    return NextResponse.redirect(new URL("/dashboard?error=discord_link_failed", req.url));
  }

  const [userId, nonce] = cookieValue.split("|");
  if (!userId || !nonce || nonce !== state) {
    return NextResponse.redirect(new URL("/dashboard?error=discord_link_failed", req.url));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/dashboard?error=discord_not_configured", req.url));
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const redirectUri = `${baseUrl}/api/discord/callback`;

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }).toString(),
    });

    if (!tokenRes.ok) throw new Error("Token exchange failed");
    const tokenData = (await tokenRes.json()) as { access_token: string };

    // Fetch Discord user info
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: "Bearer " + tokenData.access_token },
    });

    if (!userRes.ok) throw new Error("Failed to fetch Discord user");
    const discordUser = (await userRes.json()) as {
      id: string;
      username: string;
      discriminator?: string;
    };

    const discordUsername =
      discordUser.discriminator && discordUser.discriminator !== "0"
        ? `${discordUser.username}#${discordUser.discriminator}`
        : discordUser.username;

    // Save discord_id and discord username to the user record
    const sql = getDb();
    await sql`
      UPDATE users
      SET discord_id = ${discordUser.id},
          discord = ${discordUsername}
      WHERE id = ${userId}
    `;
  } catch (err) {
    console.error("Discord OAuth callback error:", err);
    const response = NextResponse.redirect(
      new URL("/dashboard?error=discord_link_failed", req.url)
    );
    response.cookies.delete("discord_link");
    return response;
  }

  const response = NextResponse.redirect(new URL("/dashboard", req.url));
  response.cookies.delete("discord_link");
  return response;
}
