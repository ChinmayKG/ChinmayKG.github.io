"use client";
import { useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { spring, useMotionSystem } from "./motion/MotionSystem";
import { CountMetric } from "./motion/Interactions";
export default function RobotArm() {
  const s = useMotionSystem();
  const [joint, setJoint] = useState<string | null>(null);
  const dx = useSpring(s.heroX, spring),
    dy = useSpring(s.heroY, spring);
  const standby = useTransform(s.heroScroll, [0, 0.12, 0.5, 1], [0, 0, 1, 1]);
  const base = useTransform(dx, (v) => v * 3);
  const shoulder = useTransform(() => dx.get() * 2 + standby.get() * 3);
  const elbow = useTransform(() => dy.get() * 3 - standby.get() * 5);
  const wrist = useTransform(() => dy.get() * 4 + standby.get() * 3);
  const robotX = useTransform(dx, (v) => v * 8);
  const robotY = useTransform(() => dy.get() * 8 - s.heroScroll.get() * 32);
  const labelX = useTransform(dx, (v) => v * 4),
    labelY = useTransform(dy, (v) => v * 4);
  const annotationX = useTransform(dx, (v) => v * 6),
    annotationY = useTransform(dy, (v) => v * 6);
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
        <motion.g
          style={{
            rotate: enabled ? base : 0,
            originX: "300px",
            originY: "428px",
            transformBox: "view-box",
          }}
        >
          <motion.g
            data-robot-part="shoulder"
            style={{
              rotate: enabled ? shoulder : 0,
              originX: "300px",
              originY: "408px",
              transformBox: "view-box",
            }}
          >
            <motion.g {...assembly(0.45)}>
              <path
                d="M268 409l-27-142 51-12 39 151"
                fill="url(#metal)"
                stroke="#7b9198"
              />
              <path
                d="M281 393l-20-115M294 390l-21-112"
                stroke="#0d171c"
                strokeWidth="8"
              />
              <path d="M273 395l-22-116" stroke="url(#edge)" strokeWidth="2" />
              <circle
                cx="266"
                cy="263"
                r="37"
                fill="#142229"
                stroke="#637f88"
              />
              <circle
                cx="266"
                cy="263"
                r="24"
                fill="url(#metal)"
                stroke="#7e959d"
              />
              <circle
                cx="266"
                cy="263"
                r="9"
                stroke="#00e5ff"
                strokeWidth="2"
              />
            </motion.g>
            <motion.g
              data-robot-part="elbow"
              style={{
                rotate: enabled ? elbow : 0,
                originX: "266px",
                originY: "263px",
                transformBox: "view-box",
              }}
            >
              <motion.g {...assembly(0.55)}>
                <path
                  d="M251 236l113-111 31 35-104 122"
                  fill="url(#metal)"
                  stroke="#849ba3"
                />
                <path d="M278 245l91-97" stroke="#0b171d" strokeWidth="12" />
                <path
                  d="M280 233l82-85"
                  stroke="#00e5ff"
                  strokeOpacity=".55"
                  strokeWidth="2"
                />
                <circle
                  cx="381"
                  cy="144"
                  r="29"
                  fill="#14232a"
                  stroke="#8199a1"
                />
                <circle
                  cx="381"
                  cy="144"
                  r="17"
                  fill="url(#metal)"
                  stroke="#75949c"
                />
                <circle cx="381" cy="144" r="5" fill="#00e5ff" />
              </motion.g>
              <motion.g
                data-robot-part="wrist"
                style={{
                  rotate: enabled ? wrist : 0,
                  originX: "381px",
                  originY: "144px",
                  transformBox: "view-box",
                }}
              >
                <motion.g {...assembly(0.65)}>
                  <path
                    d="M403 135l55 41-17 28-62-36"
                    fill="url(#metal)"
                    stroke="#77929d"
                  />
                  <path
                    d="M451 174l18 11-20 33-18-11z"
                    fill="#12252d"
                    stroke="#00b2c7"
                  />
                </motion.g>
                <motion.g {...assembly(0.75)}>
                  <path
                    d="M467 192l26 11-3 29-12 8M451 215l17 15-7 24-12 4"
                    stroke="#8ba1a9"
                    strokeWidth="7"
                  />
                  <path
                    d="M477 239l-4 13M449 258l12-1"
                    stroke="#00e5ff"
                    strokeWidth="3"
                  />
                </motion.g>
              </motion.g>
            </motion.g>
          </motion.g>
        </motion.g>
        <motion.g
          {...assembly(0.9)}
          style={{ x: enabled ? annotationX : 0, y: enabled ? annotationY : 0 }}
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
              path: "M249 265H149l-25-29H72",
            },
            {
              id: "J3",
              label: "J3 / ELBOW",
              x: 381,
              y: 114,
              lx: 425,
              ly: 74,
              path: "M381 114V86h84",
            },
            {
              id: "EE",
              label: "END EFFECTOR",
              x: 468,
              y: 218,
              lx: 472,
              ly: 299,
              path: "M468 218h61v62",
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
              <path
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
                cx={j.x}
                cy={j.y}
                r="3"
                fill="#00e5ff"
                animate={{ r: joint === j.id && !s.reduced ? 5 : 3 }}
                transition={{ duration: 0.2 }}
              />
              <motion.circle
                cx={j.x}
                cy={j.y}
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
              <circle
                cx={j.x}
                cy={j.y}
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
          <i className="led" /> JOINT CONTROL
        </span>
        <span>CONCEPT SCHEMATIC</span>
      </div>
    </motion.div>
  );
}
