"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { CountMetric } from "@/components/motion/Interactions";
import { projectStories } from "@/data/projectStories";
import { projects, type Project, type Category } from "@/data/portfolio";
import {
  ProjectCard,
  ProjectVisual,
  SectionHeader,
  TechTag,
  StatusBadge,
} from "@/components/Primitives";
const filters: ("ALL" | Category)[] = [
  "ALL",
  "ROBOTICS",
  "MECHANICAL",
  "EMBEDDED",
  "AI / ML",
  "SIMULATION",
];
export default function Projects({
  availableImages,
}: {
  availableImages: string[];
}) {
  const [filter, setFilter] = useState<"ALL" | Category>("ALL");
  const [selected, setSelected] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const filtered = projects.filter(
    (p) => filter === "ALL" || p.filters.includes(filter),
  );
  useEffect(() => {
    if (!selected) return;
    restoreFocus.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      restoreFocus.current?.focus();
    };
  }, [selected]);
  return (
    <section id="projects" className="section projects-section">
      <div className="container">
        <SectionHeader
          number="04"
          label="DEPLOYED SYSTEMS"
          title="Ideas, engineered into systems."
          description="Across mechanics, embedded intelligence and the space where they meet."
        />
        <div className="filter-bar">
          <div role="group" aria-label="Filter projects">
            {filters.map((f) => (
              <button
                key={f}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={filter === f ? "active" : ""}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="mono muted" aria-live="polite">
            {String(filtered.length).padStart(2, "0")} SYSTEMS
          </span>
        </div>
        <motion.div layout={!reduced} className="project-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                layout={!reduced}
                key={p.id}
                className={p.featured ? "featured-wrapper" : ""}
                initial={reduced ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
                transition={{
                  duration: reduced ? 0 : 0.25,
                  layout: { type: "spring", stiffness: 200, damping: 28 },
                }}
              >
                <ProjectCard
                  project={p}
                  onOpen={setSelected}
                  imageAvailable={availableImages.includes(p.image)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      <dialog
        ref={dialog}
        className="project-dialog"
        aria-labelledby="project-dialog-title"
        onClose={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        {selected && (
          <>
            <div className="dialog-header">
              <span className="mono accent">
                SYSTEM DOSSIER / {selected.id}
              </span>
              <button
                className="icon-button"
                aria-label="Close project details"
                onClick={() => dialog.current?.close()}
                autoFocus
              >
                <X />
              </button>
            </div>
            <ProjectVisual
              project={selected}
              available={availableImages.includes(selected.image)}
            />
            <div className="dialog-body">
              <p className="mono accent">{selected.category}</p>
              <h2 id="project-dialog-title">{selected.title}</h2>
              <p className="muted">
                {[selected.context, selected.date].filter(Boolean).join(" · ")}
              </p>
              {selected.guide && (
                <p className="muted">Guide: {selected.guide}</p>
              )}
              <p>{selected.description}</p>
              {selected.metrics && (
                <div className="project-metrics">
                  {selected.metrics.map((m) => (
                    <CountMetric key={m} text={m} />
                  ))}
                </div>
              )}
              <div className="project-story">
                <section><span className="mono accent">01 / The Objective</span><p>{projectStories[selected.id].purpose}</p></section>
                <section><span className="mono accent">02 / The Approach</span><p>{projectStories[selected.id].approach}</p></section>
                <section><span className="mono accent">03 / Outcome & Learning</span><p>{projectStories[selected.id].learning}</p></section>
              </div>
              <h3>Engineering Details</h3>
              <ul>
                {selected.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <div className="tags">
                {selected.tags.map((t) => (
                  <TechTag key={t}>{t}</TechTag>
                ))}
              </div>
              <StatusBadge>{selected.status}</StatusBadge>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
