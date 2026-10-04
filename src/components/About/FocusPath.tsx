import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';
const STEP_MS = 90;
const ROLE: Record<string, string> = {
  A: "link",
  BUTTON: "button",
  INPUT: "textbox",
  SELECT: "combobox",
  TEXTAREA: "textbox",
  SUMMARY: "button",
};

type Stop = { el: HTMLElement; label: string };

// ponytail: approximates the accessible name (aria-label, labelledby, img alt, text, title); the full accname spec isn't worth it for a visual
const nameOf = (el: HTMLElement) => {
  const by = el.getAttribute("aria-labelledby");
  const name =
    el.getAttribute("aria-label") ||
    (by && document.getElementById(by)?.textContent) ||
    el.querySelector("img")?.getAttribute("alt") ||
    el.textContent ||
    el.getAttribute("title") ||
    "unnamed";
  const clean = name.replace(/\s+/g, " ").trim();
  return clean.length > 40 ? `${clean.slice(0, 39)}…` : clean;
};

// ponytail: DOM order only; positive tabindex would reorder real focus, and the site uses none
const collectStops = (): Stop[] =>
  Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE))
    .filter(
      (el) =>
        !el.closest("[inert]") &&
        el.getClientRects().length > 0 &&
        getComputedStyle(el).visibility !== "hidden"
    )
    .map((el) => ({
      el,
      label: `${el.getAttribute("role") || ROLE[el.tagName] || "control"} · ${nameOf(el)}`,
    }));

export const FocusPath = () => {
  const [on, setOn] = useState(false);
  const [stops, setStops] = useState<Stop[]>([]);
  const focusedRef = useRef<number | null>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const shadowRef = useRef<SVGPathElement>(null);
  const markerRefs = useRef<(SVGGElement | null)[]>([]);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!on) return;
    const collect = () => setStops(collectStops());
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOn(false);
    collect();
    window.addEventListener("resize", collect);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", collect);
      window.removeEventListener("keydown", onKey);
      focusedRef.current = null;
    };
  }, [on]);

  useEffect(() => {
    if (!on || !stops.length) return;
    const onFocus = (e: FocusEvent) => {
      const i = stops.findIndex(({ el }) => el === e.target);
      focusedRef.current = i < 0 ? null : i;
    };
    document.addEventListener("focusin", onFocus);

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const last = stops.length - 1;
    const start = performance.now();
    let raf = 0;

    // ponytail: re-reads every rect each frame while open so scroll and fixed elements stay exact; fine for ~100 stops, throttle to scroll events if it ever isn't
    const frame = (t: number) => {
      const pts = stops.map(({ el }) => {
        const r = el.getBoundingClientRect();
        // badge sits on the top-left corner so it never covers the control's label
        return [r.left, r.top];
      });
      // rAF's timestamp can predate `start` by a frame, so clamp at 0
      const p = reduce ? last : Math.max(0, Math.min(last, (t - start) / STEP_MS));
      const i = Math.floor(p);
      let d = pts
        .slice(0, i + 1)
        .map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
        .join("");
      if (i < last) {
        const f = p - i;
        const [[x0, y0], [x1, y1]] = [pts[i], pts[i + 1]];
        d += `L${(x0 + (x1 - x0) * f).toFixed(1)} ${(y0 + (y1 - y0) * f).toFixed(1)}`;
      }
      pathRef.current?.setAttribute("d", d);
      shadowRef.current?.setAttribute("d", d);

      const active = focusedRef.current ?? (i < last ? i : null);
      pts.forEach(([x, y], k) => {
        const g = markerRefs.current[k];
        if (!g) return;
        g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        g.style.opacity = k <= i ? "1" : "0";
        g.classList.toggle("is-active", k === active);
      });

      const pill = pillRef.current;
      if (pill) {
        if (active === null) {
          pill.style.opacity = "0";
        } else {
          const [x, y] = pts[active];
          pill.textContent = `${active + 1} / ${stops.length} · ${stops[active].label}`;
          const w = pill.offsetWidth;
          const left = Math.max(8, Math.min(window.innerWidth - w - 8, x - w / 2));
          const top = y > 60 ? y - 44 : y + 20;
          pill.style.transform = `translate(${left}px, ${top}px)`;
          pill.style.opacity = "1";
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("focusin", onFocus);
    };
  }, [on, stops]);

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          aria-pressed={on}
          onClick={() => setOn((v) => !v)}
          className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          {on ? "Hide the keyboard path" : "Trace this page's keyboard path"}
        </button>
        <p aria-live="polite" className="text-sm text-slate-400">
          {on && stops.length
            ? `${stops.length} tab stops, in the order a keyboard reaches them. Press Tab to follow along, Esc to close.`
            : ""}
        </p>
      </div>
      {on &&
        createPortal(
          <div
            aria-hidden="true"
            className="focus-path pointer-events-none fixed inset-0 z-[60]"
          >
            <svg className="h-full w-full overflow-visible">
              <path
                ref={shadowRef}
                fill="none"
                stroke="rgb(2 6 23 / 0.5)"
                strokeWidth={6}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                ref={pathRef}
                fill="none"
                stroke="rgb(103 232 249 / 0.6)"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {stops.map((_, k) => (
                <g
                  key={k}
                  ref={(g) => {
                    markerRefs.current[k] = g;
                  }}
                  style={{ opacity: 0 }}
                >
                  <circle r={10} />
                  <text textAnchor="middle" dominantBaseline="central">
                    {k + 1}
                  </text>
                </g>
              ))}
            </svg>
            <div
              ref={pillRef}
              className="absolute left-0 top-0 whitespace-nowrap rounded-full border border-cyan-300/40 bg-slate-950/95 px-3 py-1 text-xs font-medium text-cyan-100 shadow-lg"
              style={{ opacity: 0 }}
            />
          </div>,
          document.body
        )}
    </>
  );
};
