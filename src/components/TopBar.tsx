export default function TopBar() {
  return (
    <div className="w-full flex items-center justify-between px-6 py-3 bg-[#0a0a0a] border-b border-[#2a2a2a]">
      <span className="text-xs tracking-[0.4em] uppercase text-[#808080] font-medium">
        Ascend
      </span>
      <a
        href="#"
        className="text-xs tracking-[0.3em] uppercase text-[#808080] hover:text-[#e8e8e3] transition-colors duration-200"
      >
        Sign In
      </a>
    </div>
  );
}
