"use client";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { LayoutGroup, motion } from "framer-motion";
import { useMotionSystem } from "./motion/MotionSystem";
const links = [
  ["about", "01", "About"],
  ["experience", "02", "Experience"],
  ["projects", "03", "Projects"],
  ["skills", "04", "Skills"],
  ["achievements", "05", "Achievements"],
  ["contact", "06", "Contact"],
];
export default function Navigation({
  resumeAvailable,
}: {
  resumeAvailable: boolean;
}) {
  const { active, setActive, reduced } = useMotionSystem();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: 0 },
    );
    ["home", "education", ...links.map(([id]) => id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [setActive]);
  useEffect(() => {
    function close(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="navbar">
        <a href="#home" className="logo" aria-label="Chinmay KG home">
          CKG <span>{"// LAB"}</span>
        </a>
        <button
          ref={menuButton}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={open ? "open" : ""}
        >
          <LayoutGroup id="navigation">
            {links.map(([id, n, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "location" : undefined}
                onClick={() => setOpen(false)}
              >
                <span className="nav-number">{n}</span> {label}
                {active === id && (
                  <motion.i
                    className="nav-active-signal"
                    layoutId="active-section"
                    transition={
                      reduced
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 320, damping: 32 }
                    }
                    aria-hidden="true"
                  />
                )}
              </a>
            ))}
          </LayoutGroup>
          {resumeAvailable ? (
            <a
              className="nav-resume"
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Resume <ArrowUpRight size={14} />
            </a>
          ) : (
            <span
              className="nav-resume muted"
              title="Add resume.pdf to enable download"
            >
              Resume soon
            </span>
          )}
        </nav>
      </header>
    </>
  );
}
