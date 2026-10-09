import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import nightShiftData from "../../data/structured/nightShift.json";
import { useScrollReveal } from "../../hooks";

// A 24-hour dial of the jobs the homelab runs on its own. The hand sweeps one
// day per loop, starting at sunset to pick up from the hero photo, and runs
// faster while I'm awake so the loop lingers on the night, where the work is. The list
// beside it is the real content (always in the DOM, full contrast); the dial
// is decorative and aria-hidden.

type ShiftEvent = {
  id: string;
  time: string; // "HH:MM", 24h, home time
  verified: boolean;
  cadence: string;
  system: string;
  short: string; // label in the middle of the dial
  projectId: string | null;
  title: string;
  detail: string;
  machines: string[]; // ids from `machines`, in the order the job uses them
  gpu: boolean; // takes the Framework's single-slot GPU lock
};

type Machine = { id: string; name: string; role: string };

type NightShiftData = {
  loopStart: string;
  asleep: { from: string; to: string; verified: boolean };
  machines: Machine[];
  events: ShiftEvent[];
};

const data = nightShiftData as NightShiftData;
const machineName = (id: string) => data.machines.find((m) => m.id === id)?.name ?? id;

const DAY = 1440;
const NIGHT_HOUR_MS = 1600; // real time per dial hour while I'm asleep
const DAY_SPEEDUP = 3;
const ACTIVE_MINUTES = 120; // how long a night event stays highlighted, in dial time
const MAX_FRAME_MS = 100; // don't jump ahead after a backgrounded tab resumes
const CX = 160;
const R = 128;

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const formatClock = (minute: number) => {
  const m = Math.floor(minute) % DAY;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

const START = toMinutes(data.loopStart);
const SLEEP_FROM = toMinutes(data.asleep.from);
const SLEEP_TO = toMinutes(data.asleep.to);
const sinceStart = (minute: number) => (minute - START + DAY) % DAY;
const isAsleep = (minute: number) =>
  (minute - SLEEP_FROM + DAY) % DAY < (SLEEP_TO - SLEEP_FROM + DAY) % DAY;

// Daytime events get a longer dial window so they stay lit as long in real time
const events = data.events
  .map((e) => ({
    ...e,
    offset: sinceStart(toMinutes(e.time)),
    window: ACTIVE_MINUTES * (isAsleep(toMinutes(e.time)) ? 1 : DAY_SPEEDUP),
  }))
  .sort((a, b) => a.offset - b.offset);

// Times are public claims: an unverified one may show in dev, never in a build.
const allVerified = data.asleep.verified && data.events.every((e) => e.verified);

// Reduced motion parks the hand just after the last event so the whole night reads at once
const STATIC_ELAPSED = events[events.length - 1].offset + 30;

// Midnight at the top, clockwise
const point = (minute: number, r = R) => {
  const a = (minute / DAY) * 2 * Math.PI - Math.PI / 2;
  return [CX + r * Math.cos(a), CX + r * Math.sin(a)];
};
const arc = (from: number, to: number, r = R) => {
  const span = (to - from + DAY) % DAY;
  const [x1, y1] = point(from, r);
  const [x2, y2] = point(to, r);
  return `M${x1} ${y1} A${r} ${r} 0 ${span > DAY / 2 ? 1 : 0} 1 ${x2} ${y2}`;
};

const HOUR_LABELS = [
  { minute: 0, label: "12a" },
  { minute: 360, label: "6a" },
  { minute: 720, label: "12p" },
  { minute: 1080, label: "6p" },
];

type Status = "upcoming" | "active" | "done";
const statusOf = (e: { offset: number; window: number }, elapsed: number): Status =>
  e.offset > elapsed ? "upcoming" : elapsed - e.offset < e.window ? "active" : "done";

// `code` spans in the data render as <code>
const renderDetail = (text: string) =>
  text.split("`").map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part));

export const NightShift = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const sectionRef = useRef<HTMLElement>(null);
  const [reduceMotion] = useState(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
  const [playing, setPlaying] = useState(!reduceMotion);
  const [inView, setInView] = useState(false);
  const [elapsed, setElapsed] = useState(reduceMotion ? STATIC_ELAPSED : 0);

  // Only run the clock while the section is on screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - last, MAX_FRAME_MS);
      last = now;
      setElapsed((e) => {
        const rate = isAsleep((START + e) % DAY) ? 1 : DAY_SPEEDUP;
        return (e + (dt / NIGHT_HOUR_MS) * 60 * rate) % DAY;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, inView]);

  if (!allVerified && import.meta.env.PROD) return null;

  const minute = (START + elapsed) % DAY;
  const asleep = isAsleep(minute);
  // The hand is a short pointer near the rim so the center readout stays clear
  const [handX1, handY1] = point(minute, R - 52);
  const [handX2, handY2] = point(minute, R - 12);
  const [tipX, tipY] = point(minute);
  const current = [...events].reverse().find((e) => statusOf(e, elapsed) === "active");

  return (
    <section
      ref={sectionRef}
      id="night-shift"
      aria-labelledby="night-shift-title"
      className="relative overflow-hidden bg-slate-950 py-20 sm:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.10),transparent_45%)]" />
      <div className="container relative z-10 mx-auto px-5 sm:px-8 md:px-10">
        <div
          ref={headerRef}
          className={`mb-12 scroll-reveal ${headerVisible ? "visible" : ""}`}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-amber-300">
            The night shift
          </p>
          <h2
            id="night-shift-title"
            className="mb-5 text-3xl font-black tracking-tight text-white sm:text-5xl"
          >
            What my homelab does after I log off.
          </h2>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-300">
            These jobs run on a schedule across three machines at home. The Mac
            Mini schedules them, the Framework's GPU does the model work one
            heavy job at a time, and the Pi holds the data and the search
            engine. The one thing the system can't do on its own is change its
            own prompt: that waits in Telegram until I approve it.
          </p>
          {!allVerified && (
            <p className="mt-4 inline-block rounded-md border border-dashed border-amber-400/60 px-3 py-1.5 font-mono text-xs text-amber-200">
              Dev only: placeholder times. Verify them in nightShift.json; this
              section doesn't render in a production build until every time is
              verified.
            </p>
          )}
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-16">
          <div className="mx-auto w-full max-w-[22rem] lg:sticky lg:max-w-[26rem] lg:top-24">
            <svg viewBox="0 0 320 320" aria-hidden="true" className="block w-full font-sans">
              <defs>
                <mask id="night-shift-moon">
                  <rect x="-10" y="-10" width="20" height="20" fill="white" />
                  <circle cx="3.5" cy="-3" r="6" fill="black" />
                </mask>
              </defs>

              <circle
                cx={CX}
                cy={CX}
                r={R - 8}
                className={`transition-colors duration-1000 ${
                  asleep ? "fill-indigo-950/70" : "fill-slate-900"
                }`}
              />
              <circle cx={CX} cy={CX} r={R} fill="none" strokeWidth={10} className="stroke-slate-800" />
              <path d={arc(SLEEP_TO, SLEEP_FROM)} fill="none" strokeWidth={3} className="stroke-amber-300/80" />
              <path d={arc(SLEEP_FROM, SLEEP_TO)} fill="none" strokeWidth={10} className="stroke-indigo-500/50" />
              {elapsed > 1 && (
                <path
                  d={arc(START, minute, R - 14)}
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  className="stroke-cyan-400/40"
                />
              )}

              {Array.from({ length: 24 }, (_, h) => {
                const [x1, y1] = point(h * 60, R + 9);
                const [x2, y2] = point(h * 60, R + (h % 6 ? 12 : 16));
                return <line key={h} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={1} className="stroke-slate-600" />;
              })}
              {HOUR_LABELS.map(({ minute: m, label }) => {
                const [x, y] = point(m, R - 30);
                return (
                  <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-slate-500 text-[10px]">
                    {label}
                  </text>
                );
              })}

              {events.map((e) => {
                const [x, y] = point(toMinutes(e.time));
                const status = statusOf(e, elapsed);
                return (
                  <g key={e.id}>
                    {status === "active" && !reduceMotion && (
                      <circle
                        cx={x}
                        cy={y}
                        r={6}
                        className="animate-ping fill-cyan-300/60"
                        style={{ transformBox: "fill-box", transformOrigin: "center" }}
                      />
                    )}
                    <circle
                      cx={x}
                      cy={y}
                      r={5}
                      strokeWidth={2}
                      className={`transition-colors duration-500 ${
                        status === "upcoming" ? "fill-slate-900 stroke-slate-500" : "fill-cyan-300 stroke-cyan-300"
                      }`}
                    />
                  </g>
                );
              })}

              <line x1={handX1} y1={handY1} x2={handX2} y2={handY2} strokeWidth={2} strokeLinecap="round" className="stroke-slate-300" />
              <g transform={`translate(${tipX} ${tipY})`}>
                {asleep ? (
                  <circle r={7} mask="url(#night-shift-moon)" className="fill-slate-100" />
                ) : (
                  <circle r={7} className="fill-amber-300" />
                )}
              </g>

              <text x={CX} y={CX - 14} textAnchor="middle" className="fill-white font-mono text-[28px] font-bold">
                {formatClock(minute)}
              </text>
              {current && (
                <text x={CX} y={CX + 16} textAnchor="middle" className="fill-cyan-300 text-[13px] font-semibold">
                  {current.short}
                </text>
              )}
              <text x={CX} y={CX + 42} textAnchor="middle" className="fill-slate-400 text-[11px] uppercase tracking-[0.2em]">
                {asleep ? "Drew: asleep" : "Drew: awake"}
              </text>
            </svg>

            <div aria-hidden="true" className="mt-4 grid grid-cols-3 gap-2">
              {data.machines.map((m) => {
                const busy = !!current?.machines.includes(m.id);
                const locked = busy && m.id === "framework" && current?.gpu;
                return (
                  <div
                    key={m.id}
                    className={`rounded-xl border px-2 py-2 text-center transition-colors duration-500 ${
                      busy ? "border-cyan-300/80 bg-cyan-400/[0.14] shadow-[0_0_18px_rgba(34,211,238,0.18)]" : "border-white/10 bg-slate-900/70"
                    }`}
                  >
                    <div className={`text-xs font-semibold ${busy ? "text-white" : "text-slate-400"}`}>{m.name}</div>
                    <div
                      className={`mt-0.5 text-[10px] uppercase tracking-[0.15em] ${
                        locked ? "text-amber-300" : busy ? "text-cyan-300" : "text-slate-500"
                      }`}
                    >
                      {locked ? "GPU locked" : m.role}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="focus-ring rounded-lg border border-white/10 bg-slate-900 px-4 py-1.5 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-400/40"
              >
                {playing ? "Pause the clock" : "Play the clock"}
              </button>
            </div>
          </div>

          <ol className="space-y-4">
            {events.map((e) => {
              const status = statusOf(e, elapsed);
              return (
                <li
                  key={e.id}
                  className={`relative rounded-2xl border p-5 pl-12 transition-colors duration-500 ${
                    status === "active" ? "border-cyan-400/50 bg-cyan-400/[0.06]" : "border-white/10 bg-slate-900/70"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-5 top-[1.6rem] h-2.5 w-2.5 rounded-full border-2 transition-colors duration-500 ${
                      status === "upcoming" ? "border-slate-500" : "border-cyan-300 bg-cyan-300"
                    }`}
                  />
                  <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <time dateTime={e.time} className="font-mono text-sm font-semibold text-cyan-300">
                      {e.time}
                    </time>
                    {!e.verified && (
                      <span className="rounded border border-dashed border-amber-400/60 px-1.5 font-mono text-[10px] uppercase text-amber-200">
                        placeholder
                      </span>
                    )}
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      {e.cadence}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    {e.projectId ? (
                      <Link
                        to={`/projects/${e.projectId}`}
                        className="focus-ring rounded text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 underline-offset-4 hover:text-cyan-200 hover:underline"
                      >
                        {e.system}
                      </Link>
                    ) : (
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                        {e.system}
                      </span>
                    )}
                  </div>
                  <h3 className="mb-1.5 text-lg font-bold text-white">{e.title}</h3>
                  <p className="leading-relaxed text-slate-300">{renderDetail(e.detail)}</p>
                  <p className="mt-3 font-mono text-xs text-slate-400">
                    Runs on {e.machines.map(machineName).join(" · ")}
                    {e.gpu && " · holds the GPU lock"}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};
