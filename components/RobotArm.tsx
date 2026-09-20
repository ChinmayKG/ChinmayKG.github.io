"use client";

import { useRef, useState } from "react";

import {

  motion,

  useMotionTemplate,

  useSpring,

  useTransform,

} from "framer-motion";

import { spring, useMotionSystem } from "./motion/MotionSystem";

import { solveArm, armPoints } from "./motion/armKinematics";

import { CountMetric } from "./motion/Interactions";

export default function RobotArm() {

  const s = useMotionSystem();

  const [joint, setJoint] = useState<string | null>(null);

  const dx = useSpring(s.heroX, spring),

    dy = useSpring(s.heroY, spring);

  const standby = useTransform(s.heroScroll, [0, 0.12, 0.5, 1], [0, 0, 1, 1]);

  const svg = useRef<SVGSVGElement>(null);

  const pose = useTransform(() => {

    const x = s.x.get(),

      y = s.y.get();

    if (!s.fine || !s.heroPresence.get())

      return { shoulder: 0, elbow: 0, wrist: 0 };

    const box = svg.current?.getBoundingClientRect();

    if (!box?.width || !box.height) return { shoulder: 0, elbow: 0, wrist: 0 };

    const scale = Math.min(box.width / 600, box.height / 560);

    return solveArm(

      (x - box.left - (box.width - scale * 600) / 2) / scale,

      (y - box.top - (box.height - scale * 560) / 2) / scale,

    );

  });

  const baseYaw = useSpring(useTransform(() => s.fine ? s.heroX.get() * 55 : 0), { stiffness: 70, damping: 24 });

  const baseMarkX = useTransform(baseYaw, v => 300 + Math.sin(v * Math.PI / 180) * 49);

  const baseMarkY = useTransform(baseYaw, v => 421 + Math.cos(v * Math.PI / 180) * 16);

  const trackingSpring = { stiffness: 85, damping: 23, mass: 0.8 };

  const shoulder = useSpring(

    useTransform(() => pose.get().shoulder + standby.get() * 3),

    trackingSpring,

  );

  const elbow = useSpring(

    useTransform(() => pose.get().elbow - standby.get() * 5),

    trackingSpring,

  );

  const wrist = useSpring(

    useTransform(() => pose.get().wrist + standby.get() * 3),

    trackingSpring,

  );

  const points = useTransform(() =>

    armPoints(

      s.reduced || s.compact ? 0 : shoulder.get(),

      s.reduced || s.compact ? 0 : elbow.get(),

      s.reduced || s.compact ? 0 : wrist.get(),

    ),

  );

  const j2x = useTransform(points, (p) => p.j2.x),

    j2y = useTransform(points, (p) => p.j2.y);

  const j3x = useTransform(points, (p) => p.j3.x),

    j3y = useTransform(points, (p) => p.j3.y);

  const tipX = useTransform(points, (p) => p.tip.x),

    tipY = useTransform(points, (p) => p.tip.y);

  const toolPose = useTransform(points, p => `translate(${p.j3.x}px, ${p.j3.y}px) rotate(${Math.round(Math.atan2(p.tip.y-p.j3.y,p.tip.x-p.j3.x)*180/Math.PI*100000)/100000}deg)`);

  const j2path = useMotionTemplate`M${j2x} ${j2y}L149 265l-25-29H72`;

  const j3path = useMotionTemplate`M${j3x} ${j3y}L381 86h84`;

  const tipPath = useMotionTemplate`M${tipX} ${tipY}L529 218v62`;

  const robotX = useTransform(dx, (v) => v * 8);

  const robotY = useTransform(() => dy.get() * 8 - s.heroScroll.get() * 32);

  const labelX = useTransform(dx, (v) => v * 4),

    labelY = useTransform(dy, (v) => v * 4);



  const opacity = useTransform(s.heroScroll, [0, 0.7, 1], [1, 1, 0.65]);

  const enabled = !s.reduced && !s.compact;

  const assembly = (delay: number) => ({

    initial: s.reduced ? (false as const) : { opacity: 0, y: 4 },

    animate: { opacity: 1, y: 0 },

    transition: {

      duration: s.reduced ? 0 : s.compact ? 0.2 : 0.25,

      delay: s.reduced ? 0 : s.compact ? delay * 0.45 : delay,

    },

  });

  return (

    <motion.div

      style={{

        x: enabled ? robotX : 0,

        y: enabled ? robotY : 0,

        opacity: s.reduced ? 1 : opacity,

      }}

      className="robot-stage"

      aria-label="Animated conceptual six-axis robotic manipulator schematic"

      role="group"

    >

      <motion.div

        className="stage-top mono"

        style={{ x: enabled ? labelX : 0, y: enabled ? labelY : 0 }}

        {...assembly(0.25)}

      >

        <span>MANIPULATOR / MK.01</span>

        <span className="accent">

          <CountMetric text="6 AXES" />

        </span>

      </motion.div>

      <svg

        ref={svg}

        viewBox="0 0 600 560"

        fill="none"

        aria-label="Decorative manipulator simulation"

      >

        <defs>

          <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">

            <stop stopColor="#718084" />

            <stop offset=".38" stopColor="#29363c" />

            <stop offset=".7" stopColor="#152127" />

            <stop offset="1" stopColor="#45575f" />

          </linearGradient>

          <linearGradient id="edge">

            <stop stopColor="#00e5ff" stopOpacity=".7" />

            <stop offset="1" stopColor="#00e5ff" stopOpacity=".07" />

          </linearGradient>

          <pattern

            id="grid"

            width="35"

            height="35"

            patternUnits="userSpaceOnUse"

          >

            <path d="M35 0H0V35" stroke="#6e9ba5" strokeOpacity=".08" />

          </pattern>

        </defs>

        <rect width="600" height="560" fill="url(#grid)" />

        <ellipse

          cx="302"

          cy="461"

          rx="211"

          ry="65"

          stroke="#254047"

          strokeDasharray="4 7"

        />

        <ellipse cx="302" cy="461" rx="154" ry="43" stroke="#20363d" />

        <path d="M47 462h510M301 380v163M93 511l395-99" stroke="#20363d" />

        <path

          d="M57 101V68h33M513 68h33v33M57 470v33h33M513 503h33v-33"

          stroke="#43616b"

        />

        <motion.g {...assembly(0.35)}>

          <path

            d="M228 435l69-27 76 26v39l-75 28-70-29z"

            fill="#111e24"

            stroke="#3e555f"

          />

          <path d="M228 435l70 28 75-29M298 463v38" stroke="#587079" />

          <ellipse

            cx="300"

            cy="428"

            rx="55"

            ry="22"

            fill="url(#metal)"

            stroke="#7b929a"

          />

          <path

            d="M253 410v22c0 21 94 21 94 0v-22"

            fill="url(#metal)"

            stroke="#47616a"

          />

        </motion.g>

        <g data-robot-part="base">

          <ellipse cx="300" cy="418" rx="49" ry="17" fill="url(#metal)" stroke="#a1bcc4"/>

          <motion.line x1={enabled ? baseMarkX : 300} x2={enabled ? baseMarkX : 300} y1={enabled ? baseMarkY : 437} y2="444" stroke="#e8aa71" strokeWidth="5"/>

          <path d="M278 418v-18q22-18 44 0v18" fill="url(#metal)" stroke="#819da7"/>

        </g>

        <g data-robot-part="shoulder" strokeLinecap="round">

          <motion.line x1="300" y1="408" x2={j2x} y2={j2y} stroke="#78939d" strokeWidth="49"/>

          <motion.line x1="300" y1="408" x2={j2x} y2={j2y} stroke="url(#metal)" strokeWidth="45"/>

          <motion.line x1="300" y1="408" x2={j2x} y2={j2y} stroke="#102129" strokeWidth="12"/>

          <motion.line x1="300" y1="408" x2={j2x} y2={j2y} stroke="#00bfd0" strokeWidth="2"/>

        </g>

        <g data-robot-part="elbow" strokeLinecap="round">

          <motion.line x1={j2x} y1={j2y} x2={j3x} y2={j3y} stroke="#819ba5" strokeWidth="41"/>

          <motion.line x1={j2x} y1={j2y} x2={j3x} y2={j3y} stroke="url(#metal)" strokeWidth="37"/>

          <motion.line x1={j2x} y1={j2y} x2={j3x} y2={j3y} stroke="#14232c" strokeWidth="10"/>

          <motion.line x1={j2x} y1={j2y} x2={j3x} y2={j3y} stroke="#00bfd0" strokeWidth="1.5"/>

        </g>

        <motion.g data-robot-part="wrist" style={{ transform: toolPose, originX: "0px", originY: "0px", transformBox: "view-box" }}>

          <path d="M0-15H68L86-10V10L68 15H0Z" fill="url(#metal)" stroke="#9bb1b8"/>

          <path d="M15-5H66" stroke="#07141b" strokeWidth="5"/>

          <rect x="73" y="-19" width="16" height="38" rx="3" fill="#17323b" stroke="#00bfd0"/>

          <path d="M89-13H114L131-7V-2M89 13H114L131 7V2" stroke="#bdd0d4" strokeWidth="6" strokeLinejoin="round"/>

          <path d="M131-8V-2M131 8V2" stroke="#00e5ff" strokeWidth="4"/>

        </motion.g>

        <g className="robot-hubs">

          <circle cx="300" cy="408" r="27" fill="url(#metal)" stroke="#98acb4"/>

          <circle cx="300" cy="408" r="16" fill="#0e2028" stroke="#e8aa71" strokeWidth="2"/>

          <circle cx="300" cy="408" r="6" fill="#e8aa71"/>

          <motion.circle cx={j2x} cy={j2y} r="29" fill="#13262e" stroke="#8ca5ad" strokeWidth="2"/>

          <motion.circle cx={j2x} cy={j2y} r="20" fill="url(#metal)" stroke="#577782"/>

          <motion.circle cx={j2x} cy={j2y} r="9" fill="#10232d" stroke="#00d5e8" strokeWidth="2"/>

          <motion.circle cx={j3x} cy={j3y} r="23" fill="#12252e" stroke="#8ca5ad" strokeWidth="2"/>

          <motion.circle cx={j3x} cy={j3y} r="15" fill="url(#metal)" stroke="#577782"/>

          <motion.circle cx={j3x} cy={j3y} r="5" fill="#00d5e8"/>

        </g>

        <motion.g

          {...assembly(0.9)}

          style={{ opacity: 0.8 }}

        >

          {[

            {

              id: "J1",

              label: "J1 / BASE",

              x: 346,

              y: 410,

              lx: 440,

              ly: 368,

              path: "M346 410h82l28-30h63",

            },

            {

              id: "J2",

              label: "J2 / SHOULDER",

              x: 249,

              y: 265,

              lx: 69,

              ly: 224,

              path: j2path,

              px: j2x,

              py: j2y,

            },

            {

              id: "J3",

              label: "J3 / ELBOW",

              x: 381,

              y: 114,

              lx: 425,

              ly: 74,

              path: j3path,

              px: j3x,

              py: j3y,

            },

            {

              id: "EE",

              label: "END EFFECTOR",

              x: 468,

              y: 218,

              lx: 472,

              ly: 299,

              path: tipPath,

              px: tipX,

              py: tipY,

            },

          ].map((j) => (

            <g

              key={j.id}

              data-joint={j.id}

              className="robot-joint"

              tabIndex={0}

              role="button"

              aria-label={`${j.label}: decorative simulation, not live telemetry`}

              onPointerEnter={() => s.fine && setJoint(j.id)}

              onPointerLeave={() => setJoint(null)}

              onFocus={() => setJoint(j.id)}

              onBlur={() => setJoint(null)}

              onClick={() => setJoint(j.id)}

              onKeyDown={(e) => {

                if (e.key === "Enter" || e.key === " ") {

                  e.preventDefault();

                  setJoint(j.id);

                }

              }}

            >

              <motion.path

                d={j.path}

                stroke={joint === j.id ? "#00e5ff" : "#53828d"}

                strokeWidth=".8"

                className="joint-leader"

              />

              <text

                x={j.lx}

                y={j.ly}

                fill={joint === j.id ? "#00e5ff" : "#99b4bc"}

                fontFamily="monospace"

                fontSize="11"

              >

                {j.label}

              </text>

              <motion.circle

                cx={j.px ?? j.x}

                cy={j.py ?? j.y}

                r="3"

                fill="#00e5ff"

                animate={{ r: joint === j.id && !s.reduced ? 5 : 3 }}

                transition={{ duration: 0.2 }}

              />

              <motion.circle

                cx={j.px ?? j.x}

                cy={j.py ?? j.y}

                r="10"

                initial={{ opacity: 0 }}

                fill="none"

                stroke="#00e5ff"

                strokeWidth=".8"

                animate={

                  joint === j.id && !s.reduced

                    ? { r: [8, 19], opacity: [0.55, 0] }

                    : { opacity: 0, r: 8 }

                }

                transition={{ duration: 0.65 }}

              />

              <motion.circle

                cx={j.px ?? j.x}

                cy={j.py ?? j.y}

                r="28"

                fill="transparent"

                stroke="none"

              />

            </g>

          ))}

          <path

            d="M186 161v192m-5-192h10m-10 192h10"

            stroke="#53828d"

            strokeWidth=".8"

            strokeDasharray="3 5"

          />

          <g fill="#99b4bc" fontFamily="monospace" fontSize="11">

            <text x="78" y="491">

              X

            </text>

            <text x="310" y="532">

              Y

            </text>

            <text x="178" y="149">

              Z

            </text>

          </g>

        </motion.g>

      </svg>

      <div className="stage-bottom mono">

        <span>

          <i className="led" /> Cursor-Guided Motion

        </span>

        <span>Concept Schematic</span>

      </div>

    </motion.div>

  );

}


