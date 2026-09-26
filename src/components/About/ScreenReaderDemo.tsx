import { useEffect, useState } from "react";
import { XIcon, VolumeUpIcon } from "@heroicons/react/solid";

// The mock form is drawn with inert, aria-hidden divs in both modes. Shipping
// real broken markup here would break the page for actual screen reader users
// (and its own Lighthouse score). The announcements are the real content.

type Mode = "broken" | "fixed";

const CONTROLS = [
  {
    name: "Close icon",
    broken: { says: "“button”", why: "Icon-only, no accessible name." },
    fixed: { says: "“Close dialog, button”", why: 'aria-label="Close dialog"' },
  },
  {
    name: "Email field",
    broken: {
      says: "“edit, drew@”",
      why: "No <label>, and the red error text is never read.",
    },
    fixed: {
      says: "“Email address, edit, invalid entry, required, drew@. Enter a full email address.”",
      why: "<label>, aria-invalid, aria-describedby → error",
    },
  },
  {
    name: "Paperless switch",
    broken: { says: "Nothing. Tab skips it.", why: "A clickable <div> can't take keyboard focus." },
    fixed: { says: "“Paperless statements, switch, off”", why: 'role="switch" aria-checked="false"' },
  },
] as const;

const FOCUS_MS = 1800;

export const ScreenReaderDemo = () => {
  const [mode, setMode] = useState<Mode>("broken");
  const [focus, setFocus] = useState(0);
  const [animate] = useState(
    () => !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
  // Tab order: in broken mode keyboard focus never reaches the switch
  const reachable = mode === "broken" ? 2 : 3;

  useEffect(() => {
    if (!animate) return;
    setFocus(0);
    const id = window.setInterval(() => setFocus((f) => (f + 1) % reachable), FOCUS_MS);
    return () => window.clearInterval(id);
  }, [animate, reachable]);

  const ring = (i: number) =>
    animate && focus === i ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900" : "";

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-950/50 p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Hear the difference</h3>
          <p className="text-sm text-slate-400">Same pixels, different markup</p>
        </div>
        <div role="group" aria-label="Markup version" className="inline-flex self-start rounded-lg border border-white/10 bg-slate-900 p-1">
          {(["broken", "fixed"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={`focus-ring rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                mode === m
                  ? m === "broken"
                    ? "bg-rose-500/15 text-rose-200"
                    : "bg-cyan-500/15 text-cyan-200"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {m === "broken" ? "Broken" : "Accessible"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-8">
        {/* Visual mock: identical in both modes */}
        <div aria-hidden="true" className="select-none self-start rounded-xl border border-white/10 bg-slate-900 p-5">
          <div className="mb-5 flex items-center justify-between">
            <span className="font-bold text-white">Update email</span>
            <span className={`rounded-md p-1 text-slate-300 transition-shadow ${ring(0)}`}>
              <XIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="mb-1 text-sm text-slate-300">Email address</div>
          <div className={`mb-1 rounded-md border border-rose-400/60 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-200 transition-shadow ${ring(1)}`}>
            drew@
          </div>
          <div className="mb-5 text-xs text-rose-300">Enter a full email address</div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Paperless statements</span>
            <span className={`flex h-6 w-11 items-center rounded-full bg-slate-700 p-0.5 transition-shadow ${ring(2)}`}>
              <span className="h-5 w-5 rounded-full bg-slate-300" />
            </span>
          </div>
        </div>

        <ol aria-live="polite" className="space-y-3">
          {CONTROLS.map((control, i) => {
            const { says, why } = control[mode];
            const skipped = i >= reachable;
            const active = animate && focus === i;
            return (
              <li
                key={control.name}
                className={`rounded-xl border p-3 transition-colors duration-300 ${
                  active ? "border-cyan-400/50 bg-cyan-500/[0.06]" : "border-white/10"
                }`}
              >
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  <VolumeUpIcon className="h-4 w-4" aria-hidden="true" />
                  {control.name}
                </div>
                <p
                  className={`font-mono text-sm leading-relaxed ${
                    skipped ? "text-rose-300/80" : mode === "broken" ? "text-rose-200" : "text-cyan-200"
                  }`}
                >
                  {says}
                </p>
                <p className="mt-1 text-xs text-slate-500">{why}</p>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-slate-400">
        The same kinds of fixes went into the profile flows I made WCAG AA compliant at American
        Express. The ring shows keyboard focus moving through the form. Announcements approximate NVDA
        in Chrome, and exact wording varies by screen reader.
      </p>
    </article>
  );
};
