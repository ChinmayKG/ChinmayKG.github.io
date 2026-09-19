"use client";
import { motion, useSpring, useTransform } from "framer-motion";
import { useMotionSystem } from "./motion/MotionSystem";
export default function Crosshair() {
  const s = useMotionSystem();
  const x = useSpring(s.reticleX, { stiffness: 260, damping: 28, mass: 0.35 }),
    y = useSpring(s.reticleY, { stiffness: 260, damping: 28, mass: 0.35 });
  const scale = useSpring(useTransform(s.hover, [0, 1], [1, 1.45]), {
    stiffness: 220,
    damping: 24,
  });
  if (!s.fine) return null;
  return (
    <>
      <motion.div
        className="robot-cursor-dot"
        style={{ x: s.x, y: s.y, opacity: s.cursorVisible }}
        aria-hidden="true"
      />
      <motion.div
        className="robot-cursor-ring"
        style={{ x, y, opacity: s.cursorVisible }}
        aria-hidden="true"
      >
        <motion.span style={{ scale }}>
          <i />
          <i />
          <i />
          <i />
        </motion.span>
      </motion.div>
    </>
  );
}
