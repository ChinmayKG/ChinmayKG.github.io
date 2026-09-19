"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useInView } from "framer-motion";
import {
  SignalLabel,
  RegisterText,
  ExperienceSignal,
} from "./motion/Interactions";
import { TiltCard, ScanReveal } from "./motion/ProjectMotion";
import { useMotionSystem } from "./motion/MotionSystem";
import {
  ArrowUpRight,
  Cpu,
  Activity,
  Cog,
  Radio,
  Orbit,
  Wind,
  Layers,
  Sun,
} from "lucide-react";
import type { Project, Experience } from "@/data/portfolio";
export function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, x: -5 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.55 }}
    >
      {children}
    </motion.div>
  );
}
export function SectionHeader({
  number,
  label,
  title,
  description,
}: {
  number: string;
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <SignalLabel number={number} label={label} />
        <h2>{title}</h2>
      </div>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
export function StatusBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="status mono">
      <span /> {children}
    </span>
  );
}
export function TechTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="tech-tag">
      <i className="tag-indicator" aria-hidden="true" />
      {children}
    </span>
  );
}
const icons = [Cog, Wind, Cpu, Orbit, Radio, Activity, Sun, Layers];
export function ProjectVisual({
  project,
  available,
}: {
  project: Project;
  available: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const Icon = icons[Number(project.id) - 1];
  return (
    <div className={`project-visual visual-${project.id}`}>
      <ScanReveal id={project.id} />
      {available && !failed ? (
        <Image
          src={`/projects/${project.image}`}
          alt={project.title}
          fill
          sizes="(max-width: 760px) 100vw, 40vw"
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          <span className="visual-corner mono">
            SYS-{project.id} /{" "}
            {project.id === "06" ? "DATA MODEL" : "DESIGN STUDY"}
          </span>
          {project.id === "06" ? (
            <svg
              viewBox="0 0 360 130"
              className="chart"
              role="img"
              aria-label="Illustrative forecast curve, not measured results"
            >
              <path
                d="M0 110H360M0 75H360M0 40H360"
                stroke="#2a3e47"
                strokeDasharray="3 6"
              />
              <path
                d="M0 110L30 100 60 107 90 78 120 83 150 64 180 70 210 42 240 52 270 27 300 39 330 15 360 20"
                stroke="#00e5ff"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M0 116L30 105 60 101 90 92 120 79 150 72 180 61 210 56 240 43 270 39 300 26 330 28 360 14"
                stroke="#76929c"
                strokeDasharray="5 5"
                fill="none"
              />
            </svg>
          ) : (
            <div className="schematic-mark">
              <span />
              <Icon size={project.featured ? 86 : 58} strokeWidth={0.85} />
              <span />
            </div>
          )}
          <span className="visual-caption mono">
            {project.id === "06"
              ? "ILLUSTRATIVE FORECAST"
              : "PROJECT IMAGE PENDING"}
          </span>
        </>
      )}
    </div>
  );
}
export function ProjectCard({
  project,
  onOpen,
  imageAvailable,
}: {
  project: Project;
  onOpen: (p: Project) => void;
  imageAvailable: boolean;
}) {
  return (
    <TiltCard className={`project-card ${project.featured ? "featured" : ""}`}>
      <ProjectVisual project={project} available={imageAvailable} />
      <div className="project-content">
        <p className="project-category mono">
          <RegisterText text={`SYS-${project.id}`} kind="number" />{" "}
          {project.featured ? "FEATURED SYSTEM" : project.category}
        </p>
        <h3>
          <button onClick={() => onOpen(project)}>
            {project.title}
            <ArrowUpRight size={20} />
          </button>
        </h3>
        <p className="project-description">{project.description}</p>
        <div className="tags">
          {project.tags.slice(0, 4).map((t) => (
            <TechTag key={t}>{t}</TechTag>
          ))}
          {project.tags.length > 4 && (
            <TechTag>+{project.tags.length - 4}</TechTag>
          )}
        </div>
        <div className="project-footer">
          <StatusBadge>{project.status}</StatusBadge>
          <button
            className="details-link"
            onClick={() => onOpen(project)}
            aria-label={`View details for ${project.title}`}
          >
            DETAILS <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </TiltCard>
  );
}
export function ExperienceItem({
  item,
  index,
}: {
  item: Experience;
  index: number;
}) {
  const { reduced, compact } = useMotionSystem();
  const itemVariants = {
    rest: { opacity: reduced ? 1 : 0, x: reduced ? 0 : -4 },
    ready: {
      opacity: 1,
      x: 0,
      transition: { duration: reduced ? 0 : compact ? 0.2 : 0.35 },
    },
  };
  return (
    <motion.article
      initial="rest"
      whileInView="ready"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        rest: {},
        ready: {
          transition: { staggerChildren: reduced ? 0 : compact ? 0.07 : 0.12 },
        },
      }}
      className={`experience-item ${index === 0 ? "primary-experience" : ""}`}
    >
      <motion.span
        className="experience-signal-node"
        aria-hidden="true"
        variants={{
          rest: {
            backgroundColor: "var(--bg)",
            boxShadow: "0 0 0 0 transparent",
          },
          ready: {
            backgroundColor: "var(--cyan)",
            boxShadow: "0 0 0 4px #00e5ff0a",
          },
        }}
      />
      <motion.div className="experience-meta" variants={itemVariants}>
        <span className="mono accent">EXP / 0{index + 1}</span>
        <p className="mono">{item.date}</p>
        <h3>{item.company}</h3>
        {index === 0 && (
          <span className="experience-note mono">ROBOTICS & AUTOMATION</span>
        )}
      </motion.div>
      <div className="experience-main">
        <motion.h4 variants={itemVariants}>{item.role}</motion.h4>
        {item.association && <p className="association">{item.association}</p>}
        <motion.p className="experience-project" variants={itemVariants}>
          {item.project}
        </motion.p>
        <motion.ul variants={itemVariants}>
          {item.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </motion.ul>
        <motion.div className="tags" variants={itemVariants}>
          {item.tags.map((t) => (
            <TechTag key={t}>{t}</TechTag>
          ))}
        </motion.div>
      </div>
    </motion.article>
  );
}
export function Timeline({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return className.includes("education") ? (
    <div className={`timeline ${className}`}>{children}</div>
  ) : (
    <ExperienceSignal>{children}</ExperienceSignal>
  );
}
export function SkillNode({
  id,
  title,
  subtitle,
  items,
  index,
}: {
  id: string;
  title: string;
  subtitle: string;
  items: string[];
  index: number;
}) {
  const Icon = [Cog, Cpu, Activity, Layers][index];
  const { reduced, compact, fine } = useMotionSystem();
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <motion.article
      ref={ref}
      className="skill-node"
      data-signal-running={visible && !reduced}
      initial={reduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: compact ? 0 : index * 0.1 }}
    >
      <motion.span
        className="skill-connector"
        aria-hidden="true"
        initial={reduced ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: compact ? 0.3 : 0.6,
          delay: compact ? 0 : index * 0.1,
        }}
      >
        <i />
      </motion.span>
      <div className="skill-top">
        <Icon size={24} strokeWidth={1.4} />
        <span className="mono">{id}</span>
      </div>
      <p className="mono muted skill-descriptor">
        {hovered ? `${hovered.toUpperCase()} / ${subtitle}` : subtitle}
      </p>
      <h3>{title}</h3>
      <div className="tags skill-tags" data-node-active={Boolean(hovered)}>
        {items.map((t) => (
          <span
            key={t}
            className="tech-tag skill-technology"
            tabIndex={0}
            aria-label={`${t}, ${title} module`}
            data-active={hovered === t}
            onPointerEnter={() => fine && setHovered(t)}
            onPointerLeave={() => setHovered(null)}
            onFocus={() => setHovered(t)}
            onBlur={() => setHovered(null)}
          >
            <i className="tag-indicator" aria-hidden="true" />
            {t}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
