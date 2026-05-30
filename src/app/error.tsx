"use client";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
        <p className="font-mono text-[#2a2a2a] text-8xl font-bold mb-6">500</p>
        <div className="chrome-line w-16 mx-auto mb-6" />
        <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-4">
          Something Went Wrong
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#e8e8e3] tracking-tight mb-4">
          An unexpected error occurred.
        </h1>
        <p className="text-[#7a7a7a] text-sm leading-relaxed max-w-sm mx-auto mb-10">
          Something broke on our end. Try again or head back home.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#e8e8e3] text-[#0a0a0a] text-xs font-semibold tracking-widest uppercase hover:bg-white transition-colors duration-200"
          >
            Try Again
          </button>
          <a
            href="https://ascendescapeaverage.com"
            target="_top"
            className="px-6 py-3 border border-[#2a2a2a] hover:border-[#c0c0c0] text-[#808080] hover:text-[#e8e8e3] text-xs font-semibold tracking-widest uppercase transition-colors duration-200"
          >
            Go Home
          </a>
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
