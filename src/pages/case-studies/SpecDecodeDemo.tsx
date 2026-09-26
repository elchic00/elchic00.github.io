import { useEffect, useState } from "react";

// Side-by-side loop: plain decode vs DFlash2 speculative decoding writing the
// same tool call. Both lanes pay one full weight read per pass (the bandwidth
// wall); plain decode lands 1 token per read, DFlash2 lands the accepted prefix
// of an 8-token draft. Over 4 passes that's 4 vs 18 tokens, the measured
// 7.4 -> 33 t/s ratio (~4.5x). Token boundaries are illustrative.

const PASSES = [
  { accept: ["{", '"name"', ":", '"vault', '_read"'], reject: ["}", "\\n", "}"] },
  { accept: [",", '"args"', ":", "{"], reject: ['"file"', ":", '"', "Home"] },
  { accept: ['"path"', ":", '"Home', '.md"', ","], reject: ["}}", "\\n", "\\n"] },
  { accept: ['"full"', ":", "true", "}}"], reject: ["\\n", "}", "\\n", "}"] },
];
const ALL_TOKENS = PASSES.flatMap((p) => p.accept);
const TICK_MS = 700; // 3 ticks per pass = 2.1s, matching the fill-x bar animation
const TICKS_PER_PASS = 3;
const HOLD_TICKS = 4;
const TOTAL_TICKS = PASSES.length * TICKS_PER_PASS + HOLD_TICKS;
const FINAL_TICK = TOTAL_TICKS - 1;

const chip = "rounded border px-1 py-0.5 font-mono text-[11px] leading-none transition-colors duration-300";

const Token = ({ text, state }: { text: string; state: "plain" | "kept" | "draft" | "rejected" }) => {
  const styles = {
    plain: "border-slate-600 bg-slate-800 text-slate-200",
    kept: "border-cyan-500/40 bg-cyan-500/15 text-cyan-200",
    draft: "border-dashed border-slate-500 text-slate-400",
    rejected: "border-rose-500/40 text-rose-300/70 line-through",
  };
  return <span className={`${chip} ${styles[state]}`}>{text}</span>;
};

const Lane = ({
  label,
  rate,
  count,
  pass,
  done,
  children,
}: {
  label: string;
  rate: string;
  count: number;
  pass: number;
  done: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <div className="text-sm font-bold text-white">
        {label} <span className="font-normal text-slate-400">· {rate}</span>
      </div>
      <div className="whitespace-nowrap font-mono text-xs text-slate-400">{count} {count === 1 ? "token" : "tokens"}</div>
    </div>
    <div className="mb-3 flex min-h-[3.75rem] sm:min-h-[2.5rem] flex-wrap content-start gap-1">{children}</div>
    <div className="flex items-center gap-2 text-[11px] text-slate-500">
      <span className="whitespace-nowrap">weight read {Math.min(pass + 1, PASSES.length)}/{PASSES.length}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
        {/* key restarts the bar each pass; one full ~28GB read per pass in both lanes */}
        <div
          key={done ? "done" : pass}
          className={`h-full origin-left rounded-full bg-slate-500 ${done ? "" : "animate-fill-x"}`}
        />
      </div>
    </div>
  </div>
);

const SpecDecodeDemo = () => {
  const [tick, setTick] = useState(() =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? FINAL_TICK : 0
  );
  const [animate] = useState(() => tick === 0);

  useEffect(() => {
    if (!animate) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % TOTAL_TICKS), TICK_MS);
    return () => window.clearInterval(id);
  }, [animate]);

  const done = tick >= PASSES.length * TICKS_PER_PASS;
  const pass = done ? PASSES.length - 1 : Math.floor(tick / TICKS_PER_PASS);
  const phase = done ? TICKS_PER_PASS - 1 : tick % TICKS_PER_PASS; // 0 draft, 1 verify, 2 commit

  const plainCount = done ? PASSES.length : pass + (phase === 2 ? 1 : 0);
  const keptBefore = PASSES.slice(0, pass).reduce((n, p) => n + p.accept.length, 0);
  const current = PASSES[pass];
  const specCount = keptBefore + (phase === 2 ? current.accept.length : 0);

  return (
    <figure className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 sm:p-6">
      <div aria-hidden="true" className="space-y-6">
        <Lane label="Plain decode" rate="7.4 t/s" count={plainCount} pass={pass} done={done}>
          {ALL_TOKENS.slice(0, plainCount).map((t, i) => (
            <Token key={i} text={t} state="plain" />
          ))}
        </Lane>
        <Lane label="DFlash2 speculative" rate="33 t/s" count={specCount} pass={pass} done={done}>
          {ALL_TOKENS.slice(0, keptBefore).map((t, i) => (
            <Token key={i} text={t} state="kept" />
          ))}
          {!done &&
            current.accept.map((t, i) => (
              <Token key={`a${pass}-${i}`} text={t} state={phase === 0 ? "draft" : "kept"} />
            ))}
          {!done &&
            phase < 2 &&
            current.reject.map((t, i) => (
              <Token key={`r${pass}-${i}`} text={t} state={phase === 0 ? "draft" : "rejected"} />
            ))}
        </Lane>
      </div>
      <figcaption className="mt-5 text-[13px] leading-relaxed text-slate-400">
        Both lanes write the same tool call, and both read all ~28GB of weights once per pass. That read is the
        bandwidth wall. Plain decode gets one token out of each read. DFlash2 drafts an 8-token block (
        <span className="text-slate-300">dashed</span>), and a single verify pass keeps the prefix the full model
        agrees with (<span className="text-cyan-300">cyan</span>) and drops the rest (
        <span className="text-rose-300">struck</span>). After four reads, that's 4 tokens vs 18, the measured 4.5×
        speedup on structured output. Token splits are illustrative.
      </figcaption>
    </figure>
  );
};

export default SpecDecodeDemo;
