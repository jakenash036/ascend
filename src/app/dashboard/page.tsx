import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";
import AdminPanel from "./AdminPanel";

interface UserRow {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  discord: string | null;
  discord_id: string | null;
  status: string;
  is_admin: boolean;
  created_at: string;
}

interface SubRow {
  plan: string;
  start_date: string;
  end_date: string;
  status: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isExpired(endDate: string): boolean {
  return new Date(endDate) < new Date();
}

const APP_URL = "https://members.ascendescapeaverage.com";
const SHOPIFY_URL = "https://ascendescapeaverage.com";
const DISCORD_SERVER_URL = "https://discord.com/channels/1509633791524868271";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sql = getDb();
  const users = await sql`
    SELECT id, email, first_name, last_name, discord, discord_id, status, is_admin, created_at
    FROM users
    WHERE id = ${session.user.id}
  `;
  const user = users[0] as UserRow | undefined;
  if (!user) redirect("/login");

  const subs = await sql`
    SELECT plan, start_date, end_date, status
    FROM subscriptions
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
    LIMIT 1
  `;
  const sub = (subs[0] as SubRow | undefined) ?? null;

  const firstName = user.first_name ?? "";

  // Derive membership state
  type MemberState = "active" | "expired" | "cancelled" | "none";
  let memberState: MemberState = "none";
  if (sub) {
    if (sub.status === "cancelled" || user.status === "cancelled") memberState = "cancelled";
    else if (sub.status === "expired" || isExpired(sub.end_date)) memberState = "expired";
    else memberState = "active";
  }

  const stateConfig: Record<MemberState, { label: string; colour: string; message: string | null }> = {
    active: { label: "ACTIVE", colour: "#4ade80", message: null },
    expired: { label: "EXPIRED", colour: "#ff4444", message: "Your subscription has expired. Renew to regain access." },
    cancelled: { label: "CANCELLED", colour: "#ff4444", message: "Your subscription has been cancelled." },
    none: { label: "NO SUBSCRIPTION", colour: "#808080", message: "You don't have an active subscription yet." },
  };

  const { label: statusText, colour: statusColour, message: statusMessage } = stateConfig[memberState];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e3] flex flex-col">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between px-6 py-3 border-b border-[#2a2a2a]">
        <a
          href={SHOPIFY_URL}
          target="_top"
          className="text-xs tracking-[0.4em] uppercase text-[#808080] font-medium hover:text-[#e8e8e3] transition-colors duration-200"
        >
          Ascend
        </a>
        <SignOutButton />
      </div>

      <main className="flex-1 w-full px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-2">Member Dashboard</p>
          <h1 className="text-2xl font-semibold text-[#e8e8e3] tracking-tight mb-8">
            Welcome back{firstName ? `, ${firstName}` : ""}.
          </h1>

          <div className="chrome-line mb-10" aria-hidden="true" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Membership card */}
          <div className="bg-[#141414] border border-[#2a2a2a] p-6 opacity-0 animate-fade-up">
            <p className="text-xs tracking-[0.3em] uppercase text-[#808080] mb-5">Membership</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#808080] tracking-wide">Status</span>
                <span className="text-xs font-semibold tracking-widest" style={{ color: statusColour }}>
                  {statusText}
                </span>
              </div>

              {sub && memberState === "active" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#808080] tracking-wide">Plan</span>
                    <span className="text-xs text-[#e8e8e3] capitalize tracking-wide">{sub.plan}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#808080] tracking-wide">Started</span>
                    <span className="text-xs text-[#e8e8e3] tracking-wide">{formatDate(sub.start_date)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#808080] tracking-wide">Renews</span>
                    <span
                      className="text-xs tracking-wide"
                      style={{
                        color: new Date(sub.end_date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
                          ? "#f59e0b"
                          : "#e8e8e3",
                      }}
                    >
                      {formatDate(sub.end_date)}
                      {new Date(sub.end_date).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
                        ? " · Renewing soon"
                        : ""}
                    </span>
                  </div>
                  <a
                    href={DISCORD_SERVER_URL}
                    target="_top"
                    className="group text-xs text-[#c0c0c0] hover:text-[#e8e8e3] tracking-wide transition-colors duration-200 mt-1 inline-block"
                  >
                    Access the Framework <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </a>
                  <a
                    href="https://account.ascendescapeaverage.com/pages/6971b1a1-27f6-4c27-b8b0-3009fd3b921d"
                    target="_top"
                    className="mt-2 w-full px-4 py-3 border border-[#2a2a2a] hover:border-[#c0c0c0] text-[#808080] hover:text-[#e8e8e3] text-xs font-semibold tracking-widest uppercase text-center transition-colors duration-200"
                  >
                    Manage Subscription
                  </a>
                </>
              )}

              {sub && memberState === "expired" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#808080] tracking-wide">Plan</span>
                    <span className="text-xs text-[#e8e8e3] capitalize tracking-wide">{sub.plan}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#808080] tracking-wide">Expired</span>
                    <span className="text-xs text-[#ff4444] tracking-wide">{formatDate(sub.end_date)}</span>
                  </div>
                  {statusMessage && (
                    <p className="text-xs text-[#808080] tracking-wide pt-1">{statusMessage}</p>
                  )}
                  <a
                    href={`${SHOPIFY_URL}/#join`}
                    target="_top"
                    className="mt-2 w-full px-4 py-3 bg-[#e8e8e3] text-[#0a0a0a] text-xs font-semibold tracking-widest uppercase text-center hover:bg-white transition-colors duration-200"
                  >
                    Renew Membership
                  </a>
                </>
              )}

              {(memberState === "cancelled" || memberState === "none") && (
                <>
                  {statusMessage && (
                    <p className="text-xs text-[#808080] tracking-wide pt-1">{statusMessage}</p>
                  )}
                  <a
                    href={`${SHOPIFY_URL}/#join`}
                    target="_top"
                    className="mt-2 w-full px-4 py-3 bg-[#e8e8e3] text-[#0a0a0a] text-xs font-semibold tracking-widest uppercase text-center hover:bg-white transition-colors duration-200"
                  >
                    {memberState === "cancelled" ? "Resubscribe" : "Join Ascend"}
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Discord card */}
          <div className="bg-[#141414] border border-[#2a2a2a] p-6 opacity-0 animate-fade-up delay-100">
            <p className="text-xs tracking-[0.3em] uppercase text-[#808080] mb-5">Discord</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#808080] tracking-wide">Status</span>
                {user.discord_id ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold tracking-widest text-[#4ade80]">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.212.375-.447.864-.613 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.621-1.249.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.369a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                    </svg>
                    LINKED
                  </span>
                ) : (
                  <span className="text-xs font-semibold tracking-widest text-[#808080]">NOT LINKED</span>
                )}
              </div>
              {user.discord_id && user.discord && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#808080] tracking-wide">Username</span>
                  <span className="text-xs text-[#e8e8e3] tracking-wide">{user.discord}</span>
                </div>
              )}
              {user.discord_id && (
                <a
                  href={DISCORD_SERVER_URL}
                  target="_top"
                  className="border border-[#2a2a2a] hover:border-[#c0c0c0] text-[#808080] hover:text-[#e8e8e3] text-xs font-semibold tracking-widest uppercase text-center py-3 px-4 w-full mt-2 transition-colors duration-200"
                >
                  Enter the Server
                </a>
              )}
              {!user.discord_id && memberState === "active" && (
                <>
                  <p className="text-xs text-[#808080] tracking-wide pt-1">
                    Link your Discord to get access to the member server.
                  </p>
                  <a
                    href={`${APP_URL}/api/discord/link`}
                    target="_top"
                    className="mt-2 w-full px-4 py-3 border border-[#2a2a2a] hover:border-[#c0c0c0] text-[#c0c0c0] hover:text-[#e8e8e3] text-xs font-semibold tracking-widest uppercase text-center transition-colors duration-200"
                  >
                    Link Discord
                  </a>
                </>
              )}
              {!user.discord_id && memberState !== "active" && (
                <p className="text-xs text-[#404040] tracking-wide pt-1">
                  Available to active members only.
                </p>
              )}
            </div>
          </div>

          {/* Account card */}
          <div className="bg-[#141414] border border-[#2a2a2a] p-6 sm:col-span-2 opacity-0 animate-fade-up delay-200">
            <p className="text-xs tracking-[0.3em] uppercase text-[#808080] mb-5">Account</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#808080] tracking-wide">Email</span>
                <span className="text-xs text-[#e8e8e3] tracking-wide">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#808080] tracking-wide">Member since</span>
                <span className="text-xs text-[#e8e8e3] tracking-wide">{formatDate(user.created_at)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#808080] tracking-wide">Password</span>
                <a
                  href={`${APP_URL}/forgot-password`}
                  target="_top"
                  className="group text-xs text-[#808080] hover:text-[#e8e8e3] transition-colors duration-200 tracking-wide inline-flex items-center"
                >
                  Reset password <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </div>
          </div>
        </div>

        {user.is_admin && (
          <div className="mt-12 w-full max-w-6xl mx-auto">
            <div className="chrome-line mb-10" aria-hidden="true" />
            <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-2">Admin</p>
            <h2 className="text-xl font-semibold text-[#e8e8e3] mb-8">Member Management</h2>
            <AdminPanel />
          </div>
        )}
      </main>
    </div>
  );
}
