"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { MotionConfig, useMotionValue, type MotionValue } from "framer-motion";

type MotionSystem = {
  seen: Set<string>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  reticleX: MotionValue<number>;
  reticleY: MotionValue<number>;
  cursorVisible: MotionValue<number>;
  hover: MotionValue<number>;
  heroX: MotionValue<number>;
  heroY: MotionValue<number>;
  heroPointerX: MotionValue<number>;
  heroPointerY: MotionValue<number>;
  heroPresence: MotionValue<number>;
  heroScroll: MotionValue<number>;
  fine: boolean;
  reduced: boolean;
  compact: boolean;
  active: string;
  setActive: (id: string) => void;
};
const Context = createContext<MotionSystem | null>(null);
export const spring = { stiffness: 105, damping: 24, mass: 0.7 };
export const clamp = (value: number, min = -1, max = 1) =>
  Math.min(max, Math.max(min, value));
export function useMotionSystem() {
  const context = useContext(Context);
  if (!context) throw new Error("MotionSystemProvider is required");
  return context;
}
export function MotionSystemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const seen = useMemo(() => new Set<string>(), []);
  const x = useMotionValue(-100),
    y = useMotionValue(-100),
    reticleX = useMotionValue(-100),
    reticleY = useMotionValue(-100),
    cursorVisible = useMotionValue(0),
    hover = useMotionValue(0);
  const heroX = useMotionValue(0),
    heroY = useMotionValue(0),
    heroPointerX = useMotionValue(0),
    heroPointerY = useMotionValue(0),
    heroPresence = useMotionValue(0),
    heroScroll = useMotionValue(0);
  const [fine, setFine] = useState(false),
    [reduced, setReduced] = useState(false),
    [compact, setCompact] = useState(false),
    [active, setActive] = useState("home");
  useEffect(() => {
    const pointer = matchMedia(
        "(hover: hover) and (pointer: fine) and (min-width: 761px)",
      ),
      reduce = matchMedia("(prefers-reduced-motion: reduce)"),
      small = matchMedia("(max-width: 760px)");
    const sync = () => {
      setFine(pointer.matches && !reduce.matches);
      setReduced(reduce.matches);
      setCompact(small.matches);
    };
    sync();
    [pointer, reduce, small].forEach((q) => q.addEventListener("change", sync));
    return () =>
      [pointer, reduce, small].forEach((q) =>
        q.removeEventListener("change", sync),
      );
  }, []);
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reduced);
    return () => {
      delete document.documentElement.dataset.reducedMotion;
    };
  }, [reduced]);
  useEffect(() => {
    const sections = document.querySelectorAll("section,footer");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          (entry.target as HTMLElement).dataset.motionVisible = String(
            entry.isIntersecting,
          );
        }),
      { rootMargin: "40px" },
    );
    sections.forEach((el) => observer.observe(el));
    const visibility = () => {
      document.documentElement.dataset.pageHidden = String(document.hidden);
      if (document.hidden) cursorVisible.set(0);
    };
    document.addEventListener("visibilitychange", visibility);
    visibility();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      delete document.documentElement.dataset.pageHidden;
    };
  }, [cursorVisible]);
  useEffect(() => {
    const reset = () => {
      cursorVisible.set(0);
      heroX.set(0);
      heroY.set(0);
      heroPresence.set(0);
    };
    if (!fine) {
      reset();
      return;
    }
    let frame = 0;
    let last: PointerEvent | null = null;
    const hero = document.getElementById("home");
    const update = () => {
      frame = 0;
      const e = last;
      if (!e || e.pointerType === "touch") return;
      x.set(e.clientX);
      y.set(e.clientY);
      cursorVisible.set(1);
      const target = e.target instanceof Element ? e.target : null;
      const interactive = target?.closest(
        "a,button,summary,.project-card,[data-joint]",
      );
      hover.set(interactive ? 1 : 0);
      const button = target?.closest("button,a.button");
      let rx = e.clientX,
        ry = e.clientY;
      if (button) {
        const b = button.getBoundingClientRect();
        rx += clamp((b.left + b.width / 2 - e.clientX) * 0.1, -5, 5);
        ry += clamp((b.top + b.height / 2 - e.clientY) * 0.1, -5, 5);
      }
      reticleX.set(rx);
      reticleY.set(ry);
      if (hero && target && hero.contains(target)) {
        const b = hero.getBoundingClientRect();
        heroX.set(clamp(((e.clientX - b.left) / b.width - 0.5) * 2));
        heroY.set(clamp(((e.clientY - b.top) / b.height - 0.5) * 2));
        heroPointerX.set(e.clientX - b.left);
        heroPointerY.set(e.clientY - b.top);
        heroPresence.set(1);
      } else {
        heroX.set(0);
        heroY.set(0);
        heroPresence.set(0);
      }
    };
    const move = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const scroll = () => {
      heroX.set(0);
      heroY.set(0);
      heroPresence.set(0);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("blur", reset);
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("blur", reset);
      document.documentElement.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [
    fine,
    x,
    y,
    reticleX,
    reticleY,
    cursorVisible,
    hover,
    heroX,
    heroY,
    heroPointerX,
    heroPointerY,
    heroPresence,
  ]);
  const value = useMemo(
    () => ({
      seen,
      x,
      y,
      reticleX,
      reticleY,
      cursorVisible,
      hover,
      heroX,
      heroY,
      heroPointerX,
      heroPointerY,
      heroPresence,
      heroScroll,
      fine,
      reduced,
      compact,
      active,
      setActive,
    }),
    [
      seen,
      x,
      y,
      reticleX,
      reticleY,
      cursorVisible,
      hover,
      heroX,
      heroY,
      heroPointerX,
      heroPointerY,
      heroPresence,
      heroScroll,
      fine,
      reduced,
      compact,
      active,
    ],
  );
  return (
    <Context.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </Context.Provider>
  );
}
