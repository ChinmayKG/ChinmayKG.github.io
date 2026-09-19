"use client";
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { clamp, spring, useMotionSystem } from "./MotionSystem";

export function MagneticLink({ children, ...props }: HTMLMotionProps<"a">) {
  const { fine, reduced } = useMotionSystem();
  const px = useMotionValue(0),
    py = useMotionValue(0);
  const x = useSpring(px, spring),
    y = useSpring(py, spring),
    innerX = useTransform(x, (v) => v * 0.3),
    innerY = useTransform(y, (v) => v * 0.3);
  useEffect(() => {
    if (!fine) {
      px.set(0);
      py.set(0);
    }
  }, [fine, px, py]);
  return (
    <motion.a
      {...props}
      data-magnetic
      style={{ x: fine ? x : 0, y: fine ? y : 0 }}
      onPointerMove={(e) => {
        if (!fine || e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set(clamp((e.clientX - r.left - r.width / 2) * 0.06, -4, 4));
        py.set(clamp((e.clientY - r.top - r.height / 2) * 0.12, -4, 4));
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={spring}
    >
      <motion.span
        className="magnetic-content"
        style={{ x: fine ? innerX : 0, y: fine ? innerY : 0 }}
      >
        {children}
      </motion.span>
    </motion.a>
  );
}

export function RegisterText({
  text,
  kind = "label",
}: {
  text: string;
  kind?: "label" | "number";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const { reduced, compact, seen } = useMotionSystem();
  const already = useRef(seen.has(`register-${text}`));
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!inView || reduced || already.current) {
      setDisplay(text);
      return;
    }
    seen.add(`register-${text}`);
    const frames =
      kind === "number"
        ? ["SYS-00", "SYS-04", "SYS-08", text]
        : ["SYS#% ONLINE", "SYSTEM ONL#NE", text];
    let index = 0;
    setDisplay(frames[0]);
    const timer = setInterval(
      () => {
        index++;
        setDisplay(frames[Math.min(index, frames.length - 1)]);
        if (index === frames.length - 1) clearInterval(timer);
      },
      compact ? 65 : 100,
    );
    return () => clearInterval(timer);
  }, [inView, reduced, compact, text, kind, seen]);
  return (
    <span ref={ref} className="registered-text" aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}

export function CountMetric({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true });
  const { reduced, compact } = useMotionSystem();
  useEffect(() => {
    const el = ref.current;
    if (!el || !visible || reduced) {
      if (el) el.textContent = text;
      return;
    }
    const match = text.match(/^(\d+)(.*)$/);
    if (!match) return;
    const value = Number(match[1]);
    const pad = match[1].length > 1 && match[1].startsWith("0");
    const animation = animate(0, value, {
      duration: compact ? 0.65 : 1,
      ease: "easeOut",
      onUpdate: (n) => {
        el.textContent =
          (pad
            ? String(Math.round(n)).padStart(match[1].length, "0")
            : String(Math.round(n))) + match[2];
      },
    });
    return () => {
      animation.stop();
      el.textContent = text;
    };
  }, [text, visible, reduced, compact]);
  return (
    <span aria-label={text} className="count-metric">
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}

export function SignalLabel({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  const { reduced, compact } = useMotionSystem();
  const step = compact ? 0.065 : 0.1;
  return (
    <motion.p
      className="section-label mono signal-label"
      initial="rest"
      whileInView="ready"
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.span
        variants={{ rest: { opacity: reduced ? 1 : 0 }, ready: { opacity: 1 } }}
      >
        {number}
      </motion.span>
      <motion.i
        aria-hidden="true"
        className="signal-rule"
        variants={{
          rest: { scaleX: reduced ? 1 : 0 },
          ready: { scaleX: 1, transition: { delay: step, duration: 0.22 } },
        }}
      />
      {" // "}
      <motion.b
        variants={{
          rest: { opacity: reduced ? 1 : 0 },
          ready: { opacity: 1, transition: { delay: 2 * step, duration: 0.2 } },
        }}
      >
        {label}
      </motion.b>
    </motion.p>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const { active, reduced } = useMotionSystem();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const labels: Record<string, string> = {
    home: "00 / HOME",
    about: "01 / ABOUT",
    experience: "02 / EXPERIENCE",
    projects: "03 / PROJECTS",
    skills: "04 / SKILLS",
    achievements: "05 / ACHIEVEMENTS",
    education: "07 / EDUCATION",
    contact: "06 / CONTACT",
  };
  return (
    <aside className="system-progress" aria-hidden="true">
      <span className="mono">{labels[active] || labels.home}</span>
      <div>
        <motion.i style={{ scaleY: reduced ? scrollYProgress : smooth }} />
      </div>
    </aside>
  );
}

export function TerminalSequence() {
  const { reduced, compact } = useMotionSystem();
  return (
    <motion.div
      className="terminal-output mono"
      initial="idle"
      whileInView="ready"
      viewport={{ once: true, amount: 0.7 }}
      variants={{
        idle: {},
        ready: {
          transition: { staggerChildren: reduced ? 0 : compact ? 0.12 : 0.2 },
        },
      }}
    >
      {[
        "INITIALIZING COMMUNICATION CHANNEL",
        "LINK ESTABLISHED",
        "READY FOR MESSAGE",
      ].map((line, i) => (
        <motion.p
          key={line}
          variants={{
            idle: { opacity: reduced ? 1 : 0, x: reduced ? 0 : -4 },
            ready: {
              opacity: 1,
              x: 0,
              transition: { duration: reduced ? 0 : 0.22 },
            },
          }}
        >
          <span>&gt;</span> {line}
          {i === 2 && <span className="caret">_</span>}
        </motion.p>
      ))}
    </motion.div>
  );
}

export function CircuitHub() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.3 });
  const { reduced } = useMotionSystem();
  return (
    <motion.div
      ref={ref}
      className="architecture-hub mono"
      data-signal-running={visible && !reduced}
      initial="idle"
      whileInView="ready"
      viewport={{ once: true }}
    >
      <motion.span
        variants={{
          idle: { scaleX: reduced ? 1 : 0 },
          ready: { scaleX: 1, transition: { duration: 0.65 } },
        }}
      />
      <span className="hub-label">MECHANICS × COMPUTATION</span>
      <motion.span
        variants={{
          idle: { scaleX: reduced ? 1 : 0 },
          ready: { scaleX: 1, transition: { duration: 0.65, delay: 0.15 } },
        }}
      />
    </motion.div>
  );
}

export function ExperienceSignal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionSystem();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  return (
    <div ref={ref} className={`timeline signal-timeline ${className}`}>
      <div className="timeline-track" aria-hidden="true">
        <motion.i style={{ scaleY: reduced ? 1 : scrollYProgress }} />
      </div>
      {children}
    </div>
  );
}

export function useHeroMotion(ref: React.RefObject<HTMLElement | null>) {
  const system = useMotionSystem();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) =>
    system.heroScroll.set(v),
  );
  const textY = useTransform(scrollYProgress, [0, 1], [0, -65]);
  const robotY = useTransform(scrollYProgress, [0, 1], [0, -32]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, -13]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.65]);
  return { ...system, textY, robotY, gridY, opacity };
}
