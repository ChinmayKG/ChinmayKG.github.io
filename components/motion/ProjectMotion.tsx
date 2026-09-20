"use client";
import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { clamp, spring, useMotionSystem } from "./MotionSystem";
export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const { fine, reduced } = useMotionSystem();
  const px = useMotionValue(0),
    py = useMotionValue(0),
    hx = useMotionValue(0),
    hy = useMotionValue(0),
    show = useMotionValue(0);
  const rotateX = useSpring(
      useTransform(py, (v) => -v * 2),
      spring,
    ),
    rotateY = useSpring(
      useTransform(px, (v) => v * 3),
      spring,
    );
  const imageX = useTransform(px, (v) => `${v * 4}px`),
    imageY = useTransform(py, (v) => `${v * 4}px`),
    numberX = useTransform(px, (v) => `${v * 2}px`);
  const light = useMotionTemplate`radial-gradient(220px circle at ${hx}px ${hy}px, rgba(0,229,255,.045), transparent 100%)`;
  useEffect(() => {
    if (!fine) {
      px.set(0);
      py.set(0);
      show.set(0);
    }
  }, [fine, px, py, show]);
  return (
    <motion.article
      className={className}
      style={
        {
          rotateX: fine ? rotateX : 0,
          rotateY: fine ? rotateY : 0,
          transformPerspective: 900,
          "--image-x": imageX,
          "--image-y": imageY,
          "--number-x": numberX,
        } as MotionStyle
      }
      onPointerMove={(e) => {
        if (!fine || e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - r.left,
          y = e.clientY - r.top;
        px.set(clamp((x / r.width) * 2 - 1));
        py.set(clamp((y / r.height) * 2 - 1));
        hx.set(x);
        hy.set(y);
        show.set(1);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
        show.set(0);
      }}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .12 }}
      whileTap={reduced ? undefined : { scale: 0.995 }}
      transition={spring}
    >
      <motion.div
        className="card-pointer-light"
        style={{ background: light, opacity: show }}
        aria-hidden="true"
      />
      {children}
    </motion.article>
  );
}
export function ScanReveal({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced, compact, seen } = useMotionSystem();
  const visible = useInView(ref, { once: true, amount: 0.25 });
  const already = useRef(seen.has(`scan-${id}`));
  useEffect(() => {
    if (visible) seen.add(`scan-${id}`);
  }, [visible, seen, id]);
  const skip = reduced || already.current;
  const duration = skip ? 0 : compact ? 0.4 : 0.7;
  return (
    <div ref={ref} className="scan-overlay" aria-hidden="true">
      <motion.div
        className="scan-cover"
        initial={skip ? false : { scaleY: 1 }}
        animate={{ scaleY: visible || skip ? 0 : 1 }}
        transition={{ duration, ease: [0.22, 0.68, 0.35, 1] }}
      />
      <motion.div
        className="scan-tracer"
        initial={skip ? false : { y: "-100%", opacity: 0 }}
        animate={
          visible && !skip
            ? { y: ["-100%", "0%"], opacity: [0, 0.65, 0.65, 0] }
            : { opacity: 0 }
        }
        transition={{ duration, ease: "easeInOut" }}
      />
    </div>
  );
}
