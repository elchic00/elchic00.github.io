import { useState } from "react";
import { GlowFilter, Group, Node, Pulse } from "./DiagramParts";

// The Pi-Cloud "LAN gap": Docker publishes ports with its own iptables rules,
// which run before ufw's, so ufw reported "deny" while an off-network probe got
// through. The fix puts the allowlist in DOCKER-USER, the hook Docker checks first.

type Mode = "before" | "after";

const PROBE_THROUGH = "M110 56 V70 H56 V200 H280";
const PROBE_DROPPED = "M110 56 V70 H56 V138";
const ALLOWED = "M310 56 V78 H80 V212 H280";

const FirewallGapDemo = () => {
  const [mode, setMode] = useState<Mode>("before");
  const before = mode === "before";
  const probePath = before ? PROBE_THROUGH : PROBE_DROPPED;

  return (
    <figure className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-white">How the probe got past the firewall</p>
        <div role="group" aria-label="Firewall state" className="inline-flex self-start rounded-lg border border-white/10 bg-slate-900 p-1">
          {(["before", "after"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`focus-ring rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                mode === m
                  ? m === "before"
                    ? "bg-rose-500/15 text-rose-200"
                    : "bg-cyan-500/15 text-cyan-200"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {m === "before" ? "Before the fix" : "After the fix"}
            </button>
          ))}
        </div>
      </div>

      <svg
        viewBox="0 0 420 330"
        role="img"
        aria-labelledby="fw-diagram-title fw-diagram-desc"
        className="mx-auto block w-full max-w-lg font-sans"
      >
        <title id="fw-diagram-title">Packet path for Docker-published ports on the Pi</title>
        <desc id="fw-diagram-desc">
          {before
            ? "Before the fix: DOCKER-USER is empty, Docker's own rules accept the probe's packets, and they reach the containers. ufw, which says deny incoming, comes later in the path and never sees them."
            : "After the fix: DOCKER-USER, which runs before Docker's own rules, drops the off-network probe and lets LAN and Tailscale traffic through to the containers."}
        </desc>
        <defs>
          <marker id="fw-arrow" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={7} markerHeight={7} orient="auto">
            <path d="M0 0 L8 4 L0 8 Z" className="fill-slate-500" />
          </marker>
          <GlowFilter id="fw-glow" width={420} height={330} />
        </defs>

        <Group x={20} y={88} w={380} h={228} label="RASPBERRY PI · DOCKER PORTS" />

        <g fill="none" className="stroke-slate-600" strokeWidth={1.5}>
          <path d={probePath} markerEnd={before ? "url(#fw-arrow)" : undefined} />
          <path d={ALLOWED} markerEnd="url(#fw-arrow)" />
        </g>

        <Pulse key={`probe-${mode}`} filterId="fw-glow" d={probePath} color="stroke-rose-400" dash={before ? 6 : 12} duration={3} />
        <Pulse key={`lan-${mode}`} filterId="fw-glow" d={ALLOWED} color="stroke-cyan-400" dash={6} duration={3} delay={1.5} />

        <Node x={20} y={12} w={180} title="Probe from off-network" sub="wifi off, cellular only" />
        <Node x={220} y={12} w={180} title="Home LAN / Tailscale" sub="allowed by policy" />
        <Node
          x={36}
          y={116}
          w={228}
          textX={100}
          title="DOCKER-USER hook"
          sub={before ? "empty: passes everything" : "allow LAN + tailnet only"}
        />
        <Node x={36} y={184} w={228} textX={100} title="Docker's own rules" sub="published port: accept" />
        <Node x={36} y={252} w={228} textX={100} dashed title="ufw · deny incoming" sub="never sees these packets" />
        <Node x={280} y={176} w={104} h={60} title="Containers" sub={before ? "15 of 23 open" : "LAN + tailnet"} />

        {!before && (
          <g>
            <circle cx={56} cy={138} r={9} className="fill-rose-950 stroke-rose-400" strokeWidth={1.5} />
            <path d="M52 134 L60 142 M60 134 L52 142" className="stroke-rose-300" strokeWidth={1.8} strokeLinecap="round" />
          </g>
        )}
      </svg>

      <dl aria-live="polite" className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/10 p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">ufw status</dt>
          <dd className="mt-1 font-mono text-sm text-emerald-300">✓ 0 of 23 exposed</dd>
        </div>
        <div className="rounded-lg border border-white/10 p-3">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Probe reached</dt>
          <dd className={`mt-1 font-mono text-sm ${before ? "text-rose-300" : "text-cyan-300"}`}>
            {before ? "15 of 23" : "0 of 23"}
          </dd>
        </div>
      </dl>

      <figcaption className="mt-4 text-[13px] leading-relaxed text-slate-400">
        The firewall's own status reads the same in both states, which is the point. Docker's rules run
        before ufw's, so packets for published ports are accepted before ufw is ever consulted. The fix puts
        the allowlist in <code className="text-cyan-300">DOCKER-USER</code>, the one hook Docker checks first.
      </figcaption>
    </figure>
  );
};

export default FirewallGapDemo;
