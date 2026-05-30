import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

async function assignDiscordRole(discordUserId: string): Promise<void> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  const roleId = process.env.DISCORD_ROLE_ID;

  if (!botToken || !guildId || !roleId) {
    console.warn("Discord bot env vars not set — skipping role assignment");
    return;
  }

  const res = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}/roles/${roleId}`,
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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieValue = req.cookies.get("discord_link")?.value;

  if (!code || !state || !cookieValue) {
    return NextResponse.redirect("https://ascendescapeaverage.com/pages/dashboard?error=discord_link_failed");
  }

  const [userId, nonce] = cookieValue.split("|");
  if (!userId || !nonce || nonce !== state) {
    return NextResponse.redirect("https://ascendescapeaverage.com/pages/dashboard?error=discord_link_failed");
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect("https://ascendescapeaverage.com/pages/dashboard?error=discord_not_configured");
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const redirectUri = `${baseUrl}/api/discord/callback`;

  try {
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

    const sql = getDb();
    await sql`
      UPDATE users
      SET discord_id = ${discordUser.id},
          discord = ${discordUsername}
      WHERE id = ${userId}
    `;

    // Assign member role in Discord server
    await assignDiscordRole(discordUser.id);
  } catch (err) {
    console.error("Discord OAuth callback error:", err);
    const response = NextResponse.redirect(
      "https://ascendescapeaverage.com/pages/dashboard?error=discord_link_failed"
    );
    response.cookies.delete("discord_link");
    return response;
  }

  const response = NextResponse.redirect("https://ascendescapeaverage.com/pages/dashboard");
  response.cookies.delete("discord_link");
  return response;
}
