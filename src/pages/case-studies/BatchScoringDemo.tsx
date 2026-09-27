import { useEffect, useState } from "react";

// jobfit V4: per-requirement fan-out vs one batched scoring call per posting,
// both against the same local inference server with two slots. Totals are the
// measured three-posting run; the per-posting split and clock are illustrative.

interface LaneSpec {
  name: string;
  detail: string;
  callsPerPosting: number[];
  tokensK: number;
  minutes: number;
}

const FAN_OUT: LaneSpec = {
  name: "Per-requirement fan-out",
  detail: "every call re-sends the evidence document",
  callsPerPosting: [8, 8, 9],
  tokensK: 117.6,
  minutes: 53.2,
};
const BATCHED: LaneSpec = {
  name: "Batched (V4)",
  detail: "one scoring call per posting",
  callsPerPosting: [2, 2, 2],
  tokensK: 33.8,
  minutes: 18.5,
};

const SLOTS = 2;
const TICK_MS = 100;
const SLOW_TICKS = 90; // fan-out's 53.2 minutes, compressed to 9s
const HOLD_TICKS = 35;
const TOTAL_TICKS = SLOW_TICKS + HOLD_TICKS;

// Each posting's calls are queued together and served two at a time
const rounds = (spec: LaneSpec) =>
  spec.callsPerPosting.flatMap((n, posting) =>
    Array.from({ length: Math.ceil(n / SLOTS) }, (_, r) => ({
      posting,
      calls: Math.min(SLOTS, n - r * SLOTS),
      queuedAfter: Math.max(0, n - (r + 1) * SLOTS),
    }))
  );

const laneState = (spec: LaneSpec, tick: number) => {
  const plan = rounds(spec);
  const doneTick = (SLOW_TICKS * spec.minutes) / FAN_OUT.minutes;
  const perRound = doneTick / plan.length;
  const idx = Math.floor(tick / perRound);
  const total = plan.reduce((n, r) => n + r.calls, 0);
  if (idx >= plan.length) {
    return { done: true, posting: plan.length ? plan[plan.length - 1].posting : 0, active: 0, queued: 0, completed: total, total, minutes: spec.minutes, tokensK: spec.tokensK };
  }
  const completed = plan.slice(0, idx).reduce((n, r) => n + r.calls, 0);
  return {
    done: false,
    posting: plan[idx].posting,
    active: plan[idx].calls,
    queued: plan[idx].queuedAfter,
    completed,
    total,
    minutes: (tick / doneTick) * spec.minutes,
    tokensK: (completed / total) * spec.tokensK,
  };
};

const Doc = ({ className = "" }: { className?: string }) => (
  <span className={`inline-flex h-5 w-4 flex-col justify-center gap-[3px] rounded-sm px-[3px] ${className}`}>
    <span className="h-px bg-current opacity-70" />
    <span className="h-px bg-current opacity-70" />
    <span className="h-px w-2/3 bg-current opacity-70" />
  </span>
);

const Lane = ({ spec, tick }: { spec: LaneSpec; tick: number }) => {
  const s = laneState(spec, tick);
  return (
    <div className="rounded-lg border border-white/10 p-4">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div className="text-sm font-bold text-white">
          {spec.name} <span className="font-normal text-slate-400">· {spec.detail}</span>
        </div>
        <div className="font-mono text-xs text-slate-400">
          {s.done ? "done" : `posting ${s.posting + 1} of ${spec.callsPerPosting.length}`}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3">
        <div>
          <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">Queued</div>
          <div className="flex min-h-[1.25rem] flex-wrap gap-1">
            {Array.from({ length: s.queued }, (_, i) => (
              <Doc key={i} className="bg-slate-700 text-slate-300" />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">2 slots</div>
          <div className="flex gap-1 rounded-md border border-slate-600 bg-slate-950 p-1">
            {Array.from({ length: SLOTS }, (_, i) =>
              i < s.active ? (
                <Doc key={i} className="animate-pulse bg-cyan-500/30 text-cyan-200" />
              ) : (
                <span key={i} className="h-5 w-4 rounded-sm border border-dashed border-slate-700" />
              )
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">Done</div>
          <div className="font-mono text-sm text-white">
            {s.completed}/{s.total}
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 whitespace-nowrap font-mono text-xs">
        <div className="text-slate-400">
          <span className="text-white">{s.completed}</span> calls
        </div>
        <div className="text-slate-400">
          <span className="text-white">{s.tokensK.toFixed(1)}K</span> tokens
        </div>
        <div className="text-right text-slate-400">
          <span className={s.done ? "text-cyan-300" : "text-white"}>{s.minutes.toFixed(1)}</span> min
        </div>
      </div>
    </div>
  );
};

const BatchScoringDemo = () => {
  const [animate] = useState(
    () => !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
  const [tick, setTick] = useState(animate ? 0 : SLOW_TICKS);

  useEffect(() => {
    if (!animate) return;
    const id = window.setInterval(() => setTick((t) => (t + 1) % TOTAL_TICKS), TICK_MS);
    return () => window.clearInterval(id);
  }, [animate]);

  return (
    <figure className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 sm:p-6">
      <div aria-hidden="true" className="space-y-3">
        <Lane spec={FAN_OUT} tick={tick} />
        <Lane spec={BATCHED} tick={tick} />
      </div>
      <figcaption className="mt-4 text-[13px] leading-relaxed text-slate-400">
        Three postings, the same local server with two slots. Fan-out queues each posting's
        requirement calls together, and every one carries the full evidence document. Batching sends one
        scoring call per posting. Measured: 25 calls, 117.6K tokens, 53.2 minutes, down to 6 calls, 33.8K
        tokens, 18.5 minutes. The clock is compressed and the per-posting split is illustrative.
      </figcaption>
    </figure>
  );
};

export default BatchScoringDemo;
