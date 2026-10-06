import { useEffect } from "react";
import confetti from "canvas-confetti";
import { PartyPopper, Sparkles } from "lucide-react";

const COLORS = ["#ef4444", "#3b82f6", "#facc15", "#22c55e", "#f97316", "#a855f7"];
const FLAG_COLORS = ["bg-red-500", "bg-blue-500", "bg-yellow-400", "bg-green-500", "bg-orange-500", "bg-sky-400"];

// Confetti from both sides for ~3 seconds, then one big burst from the middle.
function celebrate() {
  const end = Date.now() + 3000;
  const base = { colors: COLORS, disableForReducedMotion: true, zIndex: 60 };
  let frame;
  (function sideCannons() {
    confetti({ ...base, particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
    confetti({ ...base, particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
    if (Date.now() < end) frame = requestAnimationFrame(sideCannons);
  })();
  const burst = setTimeout(() => {
    confetti({ ...base, particleCount: 160, spread: 100, startVelocity: 45, origin: { y: 0.35 } });
  }, 3100);
  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(burst);
    confetti.reset();
  };
}

export function LaunchBanner() {
  useEffect(() => celebrate(), []);

  return (
    <div className="launch-pop relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700 px-5 pt-9 pb-5 text-center text-white shadow-lg mb-6">
      {/* Bunting flags */}
      <div className="absolute inset-x-0 top-0 flex justify-between px-1" aria-hidden="true">
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className={`flag-swing block w-5 h-6 ${FLAG_COLORS[i % FLAG_COLORS.length]}`}
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", animationDelay: `${(i % 4) * 0.15}s` }}
          />
        ))}
      </div>

      <Sparkles className="twinkle absolute left-4 top-10 w-4 h-4 text-yellow-300" aria-hidden="true" />
      <Sparkles className="twinkle absolute right-5 bottom-6 w-5 h-5 text-sky-300" style={{ animationDelay: "0.6s" }} aria-hidden="true" />

      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold uppercase tracking-wider shadow">
        <PartyPopper className="w-3.5 h-3.5" /> We&apos;re Live!
      </span>
      <h2 className="launch-shimmer mt-3 text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
        URG Transparency App
      </h2>
      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-300">Officially Launched</p>
      <p className="mt-3 text-sm text-blue-100">
        One place for our community&apos;s security, payments and updates. Register now to join!
      </p>
    </div>
  );
}
