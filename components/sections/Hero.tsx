"use client";
import {
  ArrowUpRight,
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  FileText,
} from "lucide-react";
import RobotArm from "@/components/RobotArm";
import { useRef } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import {
  MagneticLink,
  RegisterText,
  useHeroMotion,
} from "@/components/motion/Interactions";
import { spring } from "@/components/motion/MotionSystem";
export default function Hero({
  resumeAvailable = false,
}: {
  resumeAvailable?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const s = useHeroMotion(ref);
  const gx = useSpring(
    useTransform(s.heroX, (v) => v * 2),
    spring,
  );
  const gy = useSpring(
    useTransform(() => s.heroY.get() * 2 + s.gridY.get()),
    spring,
  );
  const illumination = useMotionTemplate`radial-gradient(250px circle at ${s.heroPointerX}px ${s.heroPointerY}px, rgba(0,229,255,.035), transparent 100%)`;
  const boot = (delay: number) => ({
    initial: s.reduced ? (false as const) : { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: s.reduced ? 0 : s.compact ? 0.25 : 0.35,
      delay: s.reduced ? 0 : s.compact ? delay * 0.5 : delay,
    },
  });
  return (
    <section ref={ref} id="home" className="hero container">
      <motion.div
        className="hero-blueprint"
        aria-hidden="true"
        style={{ x: s.fine ? gx : 0, y: !s.reduced && !s.compact ? gy : 0 }}
      />
      <motion.div
        className="blueprint-inspection"
        aria-hidden="true"
        style={{
          background: illumination,
          opacity: s.fine ? s.heroPresence : 0,
        }}
      />
      <motion.div
        className="hero-copy"
        style={{
          y: !s.reduced && !s.compact ? s.textY : 0,
          opacity: s.reduced ? 1 : s.opacity,
        }}
      >
        <motion.div className="eyebrow mono" {...boot(0.1)}>
          <i className="led" /> <RegisterText text="SYSTEM ONLINE" />{" "}
          <span className="muted">/ PORTFOLIO 2026</span>
        </motion.div>
        <h1>
          <motion.span {...boot(0.4)}>Chinmay</motion.span>
          <motion.span {...boot(0.5)}>
            K G<span className="name-dot">.</span>
          </motion.span>
        </h1>
        <motion.p className="identity" {...boot(0.65)}>
          Mechanical Engineering <span>×</span> Robotics
          <br />
          <span>×</span> Intelligent Systems
        </motion.p>
        <motion.p className="hero-description" {...boot(0.8)}>
          Building intelligent machines that connect
          <br className="desktop-break" /> mechanics, electronics and
          computation.
        </motion.p>
        <motion.div className="hero-actions" {...boot(0.95)}>
          <MagneticLink className="button primary" href="#projects">
            EXPLORE SYSTEMS <ArrowUpRight size={17} />
          </MagneticLink>
          {resumeAvailable ? (
            <MagneticLink
              className="button"
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              <FileText size={16} /> VIEW RESUME
            </MagneticLink>
          ) : (
            <span
              className="button unavailable"
              title="Résumé PDF has not been supplied"
            >
              <FileText size={16} /> RESUME COMING SOON
            </span>
          )}
        </motion.div>
        <div className="socials">
          <a
            href="https://github.com/ChinmayKG"
            target="_blank"
            rel="noreferrer"
            aria-label="Chinmay on GitHub"
          >
            <Github size={19} />
          </a>
          <a
            href="https://www.linkedin.com/in/chinmay-kg-6114b8314/"
            target="_blank"
            rel="noreferrer"
            aria-label="Chinmay on LinkedIn"
          >
            <Linkedin size={19} />
          </a>
          <a href="mailto:kgchinmay2006@gmail.com" aria-label="Email Chinmay">
            <Mail size={19} />
          </a>
          <span className="social-divider" />
          <span className="mono muted">IIT BOMBAY · CLASS OF 2028</span>
        </div>
      </motion.div>
      <RobotArm />
      <div className="heritage-note"><span className="heritage-seal" aria-hidden="true">CKG</span><span>Rooted in Curiosity <i>·</i> Refined Through Practice</span></div>
      <div className="hero-foot mono">
        <a href="#about">
          <ArrowDown size={15} /> SCROLL TO DISCOVER
        </a>
        <span>MECHANICS. CODE. INTELLIGENCE.</span>
        <span>IIT BOMBAY / INDIA</span>
      </div>
    </section>
  );
}
