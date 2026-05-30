import Link from "next/link";

export default function NotFound() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e3] flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
        <a
          href="https://ascendescapeaverage.com"
          target="_top"
          className="text-sm font-semibold tracking-widest uppercase text-[#e8e8e3]"
        >
          Ascend
        </a>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-[#2a2a2a] text-8xl font-bold mb-6">404</p>
        <div className="chrome-line w-16 mx-auto mb-6" />
        <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-4">
          Page Not Found
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#e8e8e3] tracking-tight mb-4">
          This page doesn&apos;t exist.
        </h1>
        <p className="text-[#7a7a7a] text-sm leading-relaxed max-w-sm mx-auto mb-10">
          The page you&apos;re looking for has either moved or never existed. Head back and keep moving.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="https://ascendescapeaverage.com"
            target="_top"
            className="px-6 py-3 bg-[#e8e8e3] text-[#0a0a0a] text-xs font-semibold tracking-widest uppercase hover:bg-white transition-colors duration-200"
          >
            Go Home
          </a>
          <Link
            href="/dashboard"
            className="px-6 py-3 border border-[#2a2a2a] hover:border-[#c0c0c0] text-[#808080] hover:text-[#e8e8e3] text-xs font-semibold tracking-widest uppercase transition-colors duration-200"
          >
            Dashboard
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-[#1e1e1e] text-center">
        <p className="text-[#404040] text-xs tracking-widest uppercase">
          &copy; {year} Ascend — Escape Average
        </p>
      </footer>
    </div>
  );
}
