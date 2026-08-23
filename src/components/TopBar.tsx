"use client";

export default function TopBar() {
  const handleAutomotiveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("scrm:glitch-start"));
  };

  return (
    <div
      className="fixed top-0 inset-x-0 z-50 h-[var(--topbar-h)] bg-re-ink text-white/80 text-[11px] tracking-[0.18em] uppercase"
      role="region"
      aria-label="Cross-brand bar"
    >
      <div className="mx-auto h-full max-w-7xl px-4 md:px-8 flex items-center justify-end gap-3">
        <span className="hidden sm:inline text-white/55">Also visit:</span>
        <button
          onClick={handleAutomotiveClick}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/20 hover:border-white/60 transition-colors duration-200 text-white"
          aria-label="Visit SCRM Media Automotive"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-re-blue-accent" aria-hidden />
          Automotive
        </button>
      </div>
    </div>
  );
}
