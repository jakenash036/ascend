import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";

interface UserRow {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  discord: string | null;
  discord_id: string | null;
  status: string;
  created_at: string;
}

interface SubRow {
  plan: string;
  start_date: string;
  end_date: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusLabel(status: string): { label: string; colour: string } {
  if (status === "active") return { label: "ACTIVE", colour: "#4ade80" };
  if (status === "cancelled") return { label: "CANCELLED", colour: "#ff4444" };
  return { label: "PENDING", colour: "#c0c0c0" };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const sql = getDb();
  const users = await sql`
    SELECT id, email, first_name, last_name, discord, discord_id, status, created_at
    FROM users
    WHERE id = ${session.user.id}
  `;
  const user = users[0] as UserRow | undefined;
  if (!user) redirect("/login");

  const subs = await sql`
    SELECT plan, start_date, end_date
    FROM subscriptions
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
    LIMIT 1
  `;
  const sub = (subs[0] as SubRow | undefined) ?? null;

  const { label: statusText, colour: statusColour } = statusLabel(user.status);
  const firstName = user.first_name ?? "";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e3] flex flex-col">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between px-6 py-3 border-b border-[#2a2a2a]">
        <a
          href="/"
          className="text-xs tracking-[0.4em] uppercase text-[#808080] font-medium hover:text-[#e8e8e3] transition-colors duration-200"
        >
          Ascend
        </a>
        <SignOutButton />
      </div>

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-14">
        <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-2">
          Member Dashboard
        </p>
        <h1 className="text-2xl font-semibold text-[#e8e8e3] tracking-tight mb-8">
          Welcome back{firstName ? `, ${firstName}` : ""}.
        </h1>

        <div className="chrome-line mb-10" aria-hidden="true" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Subscription card */}
          <div className="bg-[#141414] border border-[#2a2a2a] p-6">
            <p className="text-xs tracking-[0.3em] uppercase text-[#808080] mb-5">
              Membership
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#808080] tracking-wide">Status</span>
                <span
                  className="text-xs font-semibold tracking-widest"
                  style={{ color: statusColour }}
                >
                  {statusText}
                </span>
              </div>
              {sub && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#808080] tracking-wide">Plan</span>
                    <span className="text-xs text-[#e8e8e3] capitalize tracking-wide">
                      {sub.plan}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#808080] tracking-wide">Started</span>
                    <span className="text-xs text-[#e8e8e3] tracking-wide">
                      {formatDate(sub.start_date)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#808080] tracking-wide">Renews</span>
                    <span className="text-xs text-[#e8e8e3] tracking-wide">
                      {formatDate(sub.end_date)}
                    </span>
                  </div>
                </>
              )}
              {!sub && (
                <p className="text-xs text-[#404040] tracking-wide">
                  No active subscription found.
                </p>
              )}
            </div>
          </div>

          {/* Discord card */}
          <div className="bg-[#141414] border border-[#2a2a2a] p-6">
            <p className="text-xs tracking-[0.3em] uppercase text-[#808080] mb-5">
              Discord
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#808080] tracking-wide">Status</span>
                {user.discord_id ? (
                  <span className="text-xs font-semibold tracking-widest text-[#4ade80]">
                    LINKED
                  </span>
                ) : (
                  <span className="text-xs font-semibold tracking-widest text-[#c0c0c0]">
                    NOT LINKED
                  </span>
                )}
              </div>
              {user.discord && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#808080] tracking-wide">Username</span>
                  <span className="text-xs text-[#e8e8e3] tracking-wide">
                    {user.discord}
                  </span>
                </div>
              )}
              {!user.discord_id && (
                <a
                  href="/api/discord/link"
                  className="mt-2 w-full px-4 py-3 border border-[#2a2a2a] hover:border-[#c0c0c0] text-[#c0c0c0] hover:text-[#e8e8e3] text-xs font-semibold tracking-widest uppercase text-center transition-colors duration-200 block"
                >
                  Link Discord
                </a>
              )}
            </div>
          </div>

          {/* Account card */}
          <div className="bg-[#141414] border border-[#2a2a2a] p-6 sm:col-span-2">
            <p className="text-xs tracking-[0.3em] uppercase text-[#808080] mb-5">
              Account
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#808080] tracking-wide">Email</span>
                <span className="text-xs text-[#e8e8e3] tracking-wide">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#808080] tracking-wide">Member since</span>
                <span className="text-xs text-[#e8e8e3] tracking-wide">
                  {formatDate(user.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
