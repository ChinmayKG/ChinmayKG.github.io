import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  ScanFace,
  ArrowUp,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Crosshair from "@/components/Crosshair";
import {
  MagneticLink,
  ScrollProgress,
  TerminalSequence,
  CircuitHub,
  SignalLabel,
} from "@/components/motion/Interactions";
import Hero from "@/components/sections/Hero";
import Education from "@/components/sections/Education";
import Projects from "@/components/sections/Projects";
import {
  Reveal,
  SectionHeader,
  TechTag,
  ExperienceItem,
  Timeline,
  SkillNode,
} from "@/components/Primitives";
import {
  profile,
  projects,
  experiences,
  skills,
  extracurricular,
} from "@/data/portfolio";
export default function Page() {
  const available = (file: string) =>
    existsSync(path.join(process.cwd(), "public", file));
  const resumeAvailable = available("resume.pdf");
  return (
    <>
      <Navigation resumeAvailable={resumeAvailable} />
      <Crosshair />
      <ScrollProgress />
      <main id="main">
        <Hero resumeAvailable={resumeAvailable} />
        <section id="about" className="section container">
          <Reveal>
            <SectionHeader
              number="02"
              label="OPERATOR PROFILE"
              title="Curiosity is the starting point."
            />
            <div className="about-grid">
              <div className="profile-panel">
                {available("profile.webp") ? (
                  <Image
                    src="/profile.webp"
                    alt="Chinmay KG"
                    fill
                    sizes="(max-width:760px) 100vw, 30vw"
                  />
                ) : (
                  <>
                    <div className="profile-reticle">
                      <ScanFace size={72} strokeWidth={0.7} />
                    </div>
                    <p className="profile-initials">CKG</p>
                    <span className="mono muted">PORTRAIT / COMING SOON</span>
                  </>
                )}
                <div className="profile-caption mono">
                  OPERATOR_01 <span>IIT BOMBAY</span>
                </div>
              </div>
              <div className="about-copy">
                <p className="about-lead">
                  Mechanical by discipline.
                  <br />
                  <span>Interdisciplinary by instinct.</span>
                </p>
                <p className="muted">{profile.description}</p>
                <div className="profile-facts">
                  {[
                    ["ROLE", "Mechanical Engineering Student"],
                    ["INSTITUTE", "IIT Bombay"],
                    ["GRADUATION", "2028"],
                    ["FOCUS", "Robotics & Automation"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <span className="mono muted">{k}</span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>
                <p className="mono muted interests-label">SYSTEM INTERESTS</p>
                <div className="tags">
                  {[
                    "Mechanical Design",
                    "Embedded Systems",
                    "Machine Learning",
                    "Control Systems",
                  ].map((t) => (
                    <TechTag key={t}>{t}</TechTag>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
        <section id="experience" className="section experience-section">
          <div className="container">
            <Reveal>
              <SectionHeader
                number="03"
                label="FIELD EXPERIENCE"
                title="Engineering beyond the classroom."
              />
              <Timeline>
                {experiences.map((item, index) => (
                  <ExperienceItem
                    key={item.company}
                    item={item}
                    index={index}
                  />
                ))}
              </Timeline>
            </Reveal>
          </div>
        </section>
        <Projects
          availableImages={projects
            .filter((p) => available(`projects/${p.image}`))
            .map((p) => p.image)}
        />
        <section id="skills" className="section container">
          <Reveal>
            <SectionHeader
              number="05"
              label="SYSTEM ARCHITECTURE"
              title="One interconnected toolkit."
              description="Design the structure. Build the control. Add intelligence. Iterate."
            />
            <CircuitHub />
            <div className="skill-grid">
              {skills.map((s, i) => (
                <SkillNode {...s} index={i} key={s.id} />
              ))}
            </div>
          </Reveal>
        </section>
        <section id="education" className="section container">
          <Reveal>
            <SectionHeader
              number="06"
              label="EDUCATION LOG"
              title="The foundations."
            />
            <Education />
            <div className="beyond-section">
              <div className="compact-heading">
                <span className="mono muted">OUTSIDE THE LAB</span>
                <h3>A little more human.</h3>
              </div>
              <ul>
                {extracurricular.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>
        <section id="contact" className="section contact-section">
          <div className="container">
            <Reveal>
              <SignalLabel number="07" label="ESTABLISH CONNECTION" />
              <div className="contact-grid">
                <div>
                  <h2>
                    Let’s build
                    <br />
                    something <span>intelligent.</span>
                  </h2>
                  <p className="muted">
                    Interested in robotics, automation, intelligent systems or
                    engineering collaborations? Let’s build something.
                  </p>
                  <MagneticLink
                    className="button primary"
                    href={`mailto:${profile.email}`}
                  >
                    INITIATE CONTACT <ArrowUpRight size={18} />
                  </MagneticLink>
                </div>
                <div className="terminal">
                  <div className="terminal-bar">
                    <span className="mono">COMMUNICATION_CHANNEL</span>
                    <span className="terminal-lights">
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>
                  <TerminalSequence />
                  <div className="contact-links">
                    <a href={`mailto:${profile.email}`}>
                      <Mail size={18} />
                      <span>{profile.email}</span>
                      <ArrowUpRight size={16} />
                    </a>
                    <a href={profile.github} target="_blank" rel="noreferrer">
                      <Github size={18} />
                      <span>GitHub / ChinmayKG</span>
                      <ArrowUpRight size={16} />
                    </a>
                    <a href={profile.linkedin} target="_blank" rel="noreferrer">
                      <Linkedin size={18} />
                      <span>LinkedIn / Chinmay KG</span>
                      <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="container footer">
        <div>
          <a className="logo" href="#home">
            CKG <span>{"// LAB"}</span>
          </a>
          <p className="mono muted">CHINMAY KG © 2026</p>
        </div>
        <span className="mono muted">MECHANICAL × ROBOTICS × AI</span>
        <div className="footer-right">
          <span className="mono">
            <i className="led" /> SYSTEM ONLINE
          </span>
          <a href="#home" className="icon-button" aria-label="Back to top">
            <ArrowUp size={18} />
          </a>
        </div>
      </footer>
    </>
  );
}
