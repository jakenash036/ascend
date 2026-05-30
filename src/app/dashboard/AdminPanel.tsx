"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Member {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  status: string;
  is_admin: boolean;
  discord: string | null;
  discord_id: string | null;
  shopify_customer_id: string | null;
  created_at: string;
  plan: string | null;
  start_date: string | null;
  end_date: string | null;
  sub_status: string | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const colour =
    status === "active"
      ? "#4ade80"
      : status === "pending"
      ? "#808080"
      : "#ff4444";
  return (
    <span
      className="text-xs font-semibold tracking-widest uppercase"
      style={{ color: colour }}
    >
      {status}
    </span>
  );
}

export default function AdminPanel() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchMembers = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const url = q
        ? `/api/admin/members?search=${encodeURIComponent(q)}`
        : "/api/admin/members";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers("");
  }, [fetchMembers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchMembers(val), 300);
  };

  const doAction = async (
    id: number,
    action: "activate" | "cancel" | "expire" | "delete"
  ) => {
    await fetch(`/api/admin/members/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setConfirmDelete(null);
    fetchMembers(search);
  };

  const total = members.length;
  const active = members.filter((m) => m.status === "active").length;
  const expired = members.filter((m) => m.status === "expired").length;
  const cancelled = members.filter((m) => m.status === "cancelled").length;

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total", value: total },
          { label: "Active", value: active, colour: "#4ade80" },
          { label: "Expired", value: expired, colour: "#ff4444" },
          { label: "Cancelled", value: cancelled, colour: "#ff4444" },
        ].map(({ label, value, colour }) => (
          <div key={label} className="bg-[#141414] border border-[#2a2a2a] p-4">
            <p className="text-xs tracking-[0.3em] uppercase text-[#808080] mb-1">
              {label}
            </p>
            <p
              className="text-xl font-semibold"
              style={{ color: colour ?? "#e8e8e3" }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name or email…"
          className="w-full bg-[#141414] border border-[#2a2a2a] px-4 py-2 text-xs text-[#e8e8e3] placeholder-[#404040] tracking-wide outline-none focus:border-[#808080] transition-colors duration-200"
        />
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-xs text-[#808080] tracking-wide py-6">
          Loading members…
        </p>
      ) : members.length === 0 ? (
        <p className="text-xs text-[#808080] tracking-wide py-6">
          No members found.
        </p>
      ) : (
        <div className="border border-[#2a2a2a]">
          {/* Header */}
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-[#2a2a2a]">
            {[
              "Member",
              "Status",
              "Plan",
              "Renews / Expired",
              "Discord",
              "Since",
              "Actions",
            ].map((h) => (
              <span
                key={h}
                className="text-xs tracking-[0.3em] uppercase text-[#808080]"
              >
                {h}
              </span>
            ))}
          </div>

          {members.map((m) => {
            const name = [m.first_name, m.last_name].filter(Boolean).join(" ") || "—";
            const renewLabel =
              m.end_date
                ? `${m.status === "expired" || (m.sub_status && m.sub_status !== "active") ? "Expired" : "Renews"} ${formatDate(m.end_date)}`
                : "—";

            return (
              <div
                key={m.id}
                className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-[#1e1e1e] hover:bg-[#1a1a1a] transition-colors duration-150 items-start sm:items-center"
              >
                {/* Name + email */}
                <div>
                  <p className="text-xs text-[#e8e8e3] tracking-wide">{name}</p>
                  <p className="text-xs text-[#808080] tracking-wide">{m.email}</p>
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={m.status} />
                </div>

                {/* Plan */}
                <div>
                  <span className="text-xs text-[#e8e8e3] capitalize tracking-wide">
                    {m.plan ?? "—"}
                  </span>
                </div>

                {/* Renews / Expired */}
                <div>
                  <span className="text-xs text-[#808080] tracking-wide">
                    {renewLabel}
                  </span>
                </div>

                {/* Discord */}
                <div>
                  <span
                    className="text-xs tracking-wide"
                    style={{ color: m.discord_id ? "#4ade80" : "#808080" }}
                  >
                    {m.discord_id ? "✓" : "—"}
                  </span>
                </div>

                {/* Member since */}
                <div>
                  <span className="text-xs text-[#808080] tracking-wide">
                    {formatDate(m.created_at)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => doAction(m.id, "activate")}
                    className="text-xs text-[#808080] hover:text-[#4ade80] tracking-wide transition-colors duration-150 uppercase"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => doAction(m.id, "cancel")}
                    className="text-xs text-[#808080] hover:text-[#ff4444] tracking-wide transition-colors duration-150 uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => doAction(m.id, "expire")}
                    className="text-xs text-[#808080] hover:text-[#ff4444] tracking-wide transition-colors duration-150 uppercase"
                  >
                    Expire
                  </button>
                  {confirmDelete === m.id ? (
                    <button
                      onClick={() => doAction(m.id, "delete")}
                      className="text-xs text-[#ff4444] tracking-wide transition-colors duration-150 uppercase"
                    >
                      Confirm delete?
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(m.id)}
                      className="text-xs text-[#808080] hover:text-[#ff4444] tracking-wide transition-colors duration-150 uppercase"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
