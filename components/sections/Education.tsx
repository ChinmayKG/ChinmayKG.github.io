"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { education, courses } from "@/data/portfolio";
import { Timeline } from "@/components/Primitives";

const details = [
  {
    logo: "/education/iit-bombay.png",
    logoAlt: "IIT Bombay emblem",
    location: "Powai, Mumbai · Maharashtra",
    description:
      "The Indian Institute of Technology Bombay is a public institute for higher education and research in engineering, science and technology. Established in 1958, its Powai campus brings together teaching, research and interdisciplinary collaboration.",
    url: "https://www.iitb.ac.in/about-iit-bombay",
    source: "About IIT Bombay",
  },
  {
    logo: "/education/navodaya.png",
    logoAlt: "Navodaya Vidyalaya Samiti emblem",
    location: "Bagalur, Bengaluru Urban · Karnataka",
    description:
      "Jawahar Navodaya Vidyalaya, Bengaluru Urban, is a residential school in Bagalur, Karnataka, within the Navodaya Vidyalaya Samiti network. The campus also hosts a Dakshana–Navodaya Centre of Excellence for entrance-examination preparation.",
    url: "https://www.dakshana.org/coe-jnv-bu-classroom/",
    source: "Dakshana–Navodaya Centre of Excellence",
  },
  {
    logo: "/education/navodaya.png",
    logoAlt: "Navodaya Vidyalaya Samiti emblem",
    location: "Gajnur (Gajanur), Shivamogga · Karnataka",
    description:
      "Jawahar Navodaya Vidyalaya, Gajnur, is a CBSE-affiliated residential school in Shivamogga district, Karnataka. It belongs to the JNV network, which provides residential education with a focus on talented students from rural areas.",
    url: "https://saras.cbse.gov.in/SARAS/AffiliatedList/AfflicationDetails/840006",
    source: "CBSE school record",
  },
];

export default function Education() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected === null) return;
    const focused = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      focused?.focus();
    };
  }, [selected]);
  const entry = selected === null ? null : education[selected];
  const info = selected === null ? null : details[selected];
  return (
    <>
      <Timeline className="education-timeline">
        {education.map((e, i) => (
          <article key={e.institution}>
            <span className="timeline-dot" />
            <button
              className="education-logo"
              onClick={() => setSelected(i)}
              aria-label={`Explore ${e.institution}`}
              aria-haspopup="dialog"
            >
              <Image
                src={details[i].logo}
                alt={details[i].logoAlt}
                width={76}
                height={76}
              />
              <ArrowUpRight size={14} aria-hidden="true" />
            </button>
            <p className="mono accent">{e.date}</p>
            <h3>
              <button
                className="education-title"
                onClick={() => setSelected(i)}
              >
                {e.institution}
              </button>
            </h3>
            <p className="muted">{e.qualification}</p>
            <span className="education-result">{e.result}</span>
            {i === 0 && (
              <span className="mono education-current">IN PROGRESS</span>
            )}
            <button
              className="details-link education-more"
              onClick={() => setSelected(i)}
            >
              EXPLORE INSTITUTE <ArrowUpRight size={13} />
            </button>
          </article>
        ))}
      </Timeline>
      <dialog
        ref={dialog}
        className="project-dialog education-dialog"
        aria-labelledby="education-dialog-title"
        onClose={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        {entry && info && (
          <>
            <div className="dialog-header">
              <span className="mono accent">EDUCATION / INSTITUTE PROFILE</span>
              <button
                className="icon-button"
                aria-label="Close institute details"
                autoFocus
                onClick={() => dialog.current?.close()}
              >
                <X />
              </button>
            </div>
            <div className="dialog-body">
              <div className="institute-heading">
                <Image
                  src={info.logo}
                  alt={info.logoAlt}
                  width={90}
                  height={90}
                />
                <div>
                  <h2 id="education-dialog-title">{entry.institution}</h2>
                  <p className="mono muted">{info.location}</p>
                </div>
              </div>
              <p className="institute-description muted">{info.description}</p>
              <a
                className="details-link"
                href={info.url}
                target="_blank"
                rel="noreferrer"
              >
                {info.source} <ArrowUpRight size={14} />
              </a>
              {selected === 0 && (
                <div className="institute-learning">
                  <p className="mono accent">MY LEARNING AT IIT BOMBAY</p>
                  <h3>Relevant coursework</h3>
                  <div className="course-grid">
                    {courses.map((c) => (
                      <div key={c.title}>
                        <h4>{c.title}</h4>
                        <ul>
                          {c.items.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selected === 1 && (
                <div className="institute-learning">
                  <p className="mono accent">TWO YEARS OF PREPARATION</p>
                  <h3>Dakshana training</h3>
                  <p>
                    I completed two years of Dakshana training at JNV Bagalur
                    alongside my higher secondary education.
                  </p>
                  <h4>About Dakshana Foundation</h4>
                  <p className="muted">
                    Dakshana is a philanthropic organisation that supports
                    academically talented students from financially
                    disadvantaged backgrounds through intensive preparation for
                    engineering and medical entrance examinations. Its two-year
                    JNV programme combines school education with focused
                    entrance-exam coaching.
                  </p>
                  <a
                    className="details-link"
                    href="https://www.dakshana.org/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Explore Dakshana Foundation <ArrowUpRight size={14} />
                  </a>
                </div>
              )}
              {selected === 2 && (
                <div className="institute-learning">
                  <p className="mono accent">ENTRY INTO NAVODAYA</p>
                  <h3>Jawahar Navodaya Vidyalaya Selection Test</h3>
                  <p className="muted">
                    JNVST is the selection examination for admission to Class VI
                    in Jawahar Navodaya Vidyalayas. It is designed to identify
                    students for the Navodaya residential-school system,
                    including children from rural communities.
                  </p>
                  <p>
                    I was selected through JNVST and completed my secondary
                    education at JNV Gajnur.
                  </p>
                  <a
                    className="details-link"
                    href="https://www.cbseitms.nic.in/2024/nvsxi_11/assets/pdf/FINAL_CLASS_XI_PROSPECTUS_2025.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Navodaya admissions overview <ArrowUpRight size={14} />
                  </a>
                </div>
              )}
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
