import { useEffect, useState } from "react";

// Side-by-side loop: the dense 27B and Flash-Next writing the same tool call
// over the same wall-clock time, both with speculative decoding off. Token
// rates only (7 vs 2 tokens = the 26 vs 7.4 t/s ratio, ~3.5x); no weight-read
// bars, because bytes per token alone don't account for the ratio.

const TOKENS = ["{", '"name"', ":", '"vault_read"', ",", '"args"', ":"];
const TICK_MS = 500;
const DENSE_EVERY = 7; // ticks per token
const MOE_EVERY = 2;
const RUN_TICKS = 14;
const HOLD_TICKS = 4;
const TOTAL_TICKS = RUN_TICKS + HOLD_TICKS;
const FINAL_TICK = TOTAL_TICKS - 1;

const Lane = ({ label, rate, count }: { label: string; rate: string; count: number }) => (
  <div>
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <div className="text-sm font-bold text-white">
        {label} <span className="font-normal text-slate-400">· {rate}</span>
      </div>
      <div className="whitespace-nowrap font-mono text-xs text-slate-400">
        {count} {count === 1 ? "token" : "tokens"}
      </div>
    </div>
    <div className="flex min-h-[3.75rem] sm:min-h-[2.5rem] flex-wrap content-start gap-1">
      {TOKENS.slice(0, count).map((t, i) => (
        <span
          key={i}
          className="rounded border border-cyan-500/40 bg-cyan-500/15 px-1 py-0.5 font-mono text-[11px] leading-none text-cyan-200"
        >
          {t}
        </span>
      ))}
    </div>
  </div>
);

const MoEDecodeDemo = () => {
  const [tick, setTick] = useState(() =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? FINAL_TICK : 0
  );
  const [animate] = useState(() => tick === 0);

  useEffect(() => {
    if (!animate) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % TOTAL_TICKS), TICK_MS);
    return () => window.clearInterval(id);
  }, [animate]);

  const elapsed = Math.min(tick + 1, RUN_TICKS);
  const dense = Math.floor(elapsed / DENSE_EVERY);
  const moe = Math.floor(elapsed / MOE_EVERY);

  return (
    <figure className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 sm:p-6">
      <div aria-hidden="true" className="space-y-6">
        <Lane label="Dense 27B, plain decode" rate="7.4 t/s" count={dense} />
        <Lane label="Flash-Next, MTP off" rate="~26 t/s" count={moe} />
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="whitespace-nowrap">same wall-clock time</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-slate-500 transition-[width] duration-500 ease-linear"
              style={{ width: `${(elapsed / RUN_TICKS) * 100}%` }}
            />
          </div>
        </div>
      </div>
      <figcaption className="mt-5 text-[13px] leading-relaxed text-slate-400">
        Both lanes write the same tool call in the same time, with speculative decoding off. The dense 27B reads
        every one of its weights for every token. Flash-Next's router sends each token through only the experts it
        needs, about 6B of its 125B parameters, so far fewer weights cross the memory bus per token. The 7.4 t/s is
        the 27B's measured plain-decode floor; the ~26 t/s is a single Flash-Next run at near-zero context, not a
        controlled benchmark. In the same single-run sweep, its Multi-Token Prediction head lifted that to 48 t/s on
        prose and 33 t/s on code. Token splits are illustrative.
      </figcaption>
    </figure>
  );
};

export default MoEDecodeDemo;
