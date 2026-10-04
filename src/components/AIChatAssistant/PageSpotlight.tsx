/**
 * Dims the page around one element the chat pointed at. The highlight flies
 * out from the chat button, tracks the element while the page scrolls to it,
 * and clears on the visitor's next click, wheel, touch, or key press.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SHOW_TARGETS } from "./types";
import { SPOTLIGHT_EVENT } from "./utils";

const PAD = 12;
const FLY_MS = 550;
const HOLD_MS = 8000;
const WAIT_MS = 3000;

type Request = { target: string; focus: boolean };
type Box = { x: number; y: number; w: number; h: number };

const ease = (k: number) => 1 - Math.pow(1 - k, 3);

export const PageSpotlight = () => {
  const [request, setRequest] = useState<Request | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onShow = (e: Event) => setRequest({ ...(e as CustomEvent<Request>).detail });
    window.addEventListener(SPOTLIGHT_EVENT, onShow);

    // Cross-page requests arrive as /?show=<target>
    const params = new URLSearchParams(window.location.search);
    const queued = params.get("show");
    if (queued) {
      params.delete("show");
      const query = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`);
      if (queued in SHOW_TARGETS) setRequest({ target: queued, focus: true });
    }
    return () => window.removeEventListener(SPOTLIGHT_EVENT, onShow);
  }, []);

  useEffect(() => {
    if (!request) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const button = document.querySelector<HTMLElement>('[aria-label="Close chat"], [aria-label="Open AI chat assistant"]');
    const b = button?.getBoundingClientRect();
    const origin: Box = b
      ? { x: b.left, y: b.top, w: b.width, h: b.height }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2, w: 0, h: 0 };

    let el: HTMLElement | null = null;
    let raf = 0;
    let t0 = 0;
    const started = performance.now();
    const end = () => setRequest(null);

    const frame = (t: number) => {
      el ??= document.querySelector<HTMLElement>(`[data-chat-target="${request.target}"]`);
      if (!el) {
        // A cross-page request can land before lazy sections mount
        if (t - started > WAIT_MS) return end();
        raf = requestAnimationFrame(frame);
        return;
      }
      if (!t0) {
        t0 = t;
        el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
        if (request.focus) {
          if (!el.matches("a, button, input, select, textarea, [tabindex]")) el.tabIndex = -1;
          el.focus({ preventScroll: true });
        }
        document.body.classList.add("spotlight-active");
      }
      if (t - t0 > HOLD_MS) return end();

      const r = el.getBoundingClientRect();
      const live: Box = { x: r.left - PAD, y: r.top - PAD, w: r.width + PAD * 2, h: r.height + PAD * 2 };
      const k = reduce ? 1 : ease(Math.min(1, (t - t0) / FLY_MS));
      const x = origin.x + (live.x - origin.x) * k;
      const y = origin.y + (live.y - origin.y) * k;
      const w = origin.w + (live.w - origin.w) * k;
      const h = origin.h + (live.h - origin.h) * k;

      const box = boxRef.current;
      if (box) {
        box.style.transform = `translate(${x}px, ${y}px)`;
        box.style.width = `${w}px`;
        box.style.height = `${h}px`;
        box.style.opacity = "1";
      }
      const caption = captionRef.current;
      if (caption) {
        const top = y > 48 ? y - 38 : y + h + 10;
        caption.style.transform = `translate(${Math.max(8, x)}px, ${top}px)`;
        caption.style.opacity = k === 1 ? "1" : "0";
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Real input only: the smooth scroll above fires scroll events, not these
    const events = ["wheel", "touchstart", "keydown"] as const;
    // preventDefault on pointerdown suppresses the compatibility mousedown, so the
    // click that clears the spotlight doesn't also close the chat; click still fires
    const onPointer = (e: PointerEvent) => {
      e.preventDefault();
      end();
    };
    const armed = setTimeout(() => {
      events.forEach((ev) => window.addEventListener(ev, end, { passive: true }));
      window.addEventListener("pointerdown", onPointer);
    }, 150);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(armed);
      events.forEach((ev) => window.removeEventListener(ev, end));
      window.removeEventListener("pointerdown", onPointer);
      document.body.classList.remove("spotlight-active");
    };
  }, [request]);

  if (!request) return null;
  return createPortal(
    <div aria-hidden="true" className="page-spotlight pointer-events-none fixed inset-0 z-[45]">
      <div ref={boxRef} className="page-spotlight-box" />
      <div ref={captionRef} className="page-spotlight-caption">
        <span className="page-spotlight-dot" />
        From the chat · {SHOW_TARGETS[request.target]}
      </div>
    </div>,
    document.body
  );
};
