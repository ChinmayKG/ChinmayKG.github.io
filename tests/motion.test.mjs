import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { JSDOM } from "jsdom";
import ts from "typescript";

// Component tests run in an isolated DOM, never against a user's browser.
const dom = new JSDOM(
  '<!doctype html><html><body><section id="home"><button id="target">Target</button></section><div id="root"></div></body></html>',
  { pretendToBeVisual: true, url: "http://localhost" },
);
for (const key of [
  "window",
  "document",
  "Element",
  "HTMLElement",
  "SVGElement",
  "Node",
  "EventTarget",
  "AbortController",
  "AbortSignal",
  "MutationObserver",
])
  globalThis[key] = key === "window" ? dom.window : dom.window[key];
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(
  dom.window,
);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(
  dom.window,
);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let reduced = false,
  compact = false,
  precise = true;
const media = new Map();
function matches(query) {
  if (query.includes("prefers-reduced-motion")) return reduced;
  if (query.includes("max-width")) return compact;
  return precise && !compact;
}
globalThis.matchMedia = dom.window.matchMedia = (query) => {
  if (!media.has(query)) {
    const listeners = new Set();
    media.set(query, {
      get matches() {
        return matches(query);
      },
      media: query,
      addEventListener: (_type, fn) => listeners.add(fn),
      removeEventListener: (_type, fn) => listeners.delete(fn),
      addListener: (fn) => listeners.add(fn),
      removeListener: (fn) => listeners.delete(fn),
      listeners,
    });
  }
  return media.get(query);
};
const observers = new Set();
globalThis.IntersectionObserver = dom.window.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
    this.targets = new Set();
    observers.add(this);
  }
  observe(target) {
    this.targets.add(target);
  }
  unobserve(target) {
    this.targets.delete(target);
  }
  disconnect() {
    this.targets.clear();
    observers.delete(this);
  }
};
const require = createRequire(import.meta.url);
require.extensions[".tsx"] = (module, filename) => {
  const output = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2020,
    },
  });
  module._compile(output.outputText, filename);
};
require.extensions[".ts"] = require.extensions[".tsx"];
const React = require("react");
const { act } = React;
const { createRoot } = require("react-dom/client");
const {
  MotionSystemProvider,
  useMotionSystem,
} = require("../components/motion/MotionSystem.tsx");
const Crosshair = require("../components/Crosshair.tsx").default;
const RobotArm = require("../components/RobotArm.tsx").default;
const {
  MagneticLink,
  RegisterText,
  CountMetric,
} = require("../components/motion/Interactions.tsx");
const {
  TiltCard,
  ScanReveal,
} = require("../components/motion/ProjectMotion.tsx");
const root = createRoot(document.getElementById("root"));
let state,
  renders = 0;
function Probe() {
  state = useMotionSystem();
  renders++;
  return null;
}
const h = React.createElement;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function changeMedia(next) {
  ({ reduced = reduced, compact = compact, precise = precise } = next);
  await act(async () => {
    for (const item of media.values())
      for (const listener of item.listeners)
        listener({ matches: item.matches, media: item.media });
    await sleep(25);
  });
}
async function pointer(x, y, type = "mouse") {
  await act(async () => {
    const event = new dom.window.MouseEvent("pointermove", {
      bubbles: true,
      clientX: x,
      clientY: y,
    });
    Object.defineProperty(event, "pointerType", { value: type });
    document.getElementById("target").dispatchEvent(event);
    await sleep(60);
  });
}
function enterAll() {
  for (const observer of [...observers])
    observer.callback(
      [...observer.targets].map((target) => ({
        target,
        isIntersecting: true,
        intersectionRatio: 1,
      })),
    );
}

test("motion system: pointer bounds, reduced motion, mobile, one-shot registration, and cleanup", async () => {
  document.getElementById("home").getBoundingClientRect = () => ({
    left: 0,
    top: 0,
    width: 1000,
    height: 800,
  });
  document.getElementById("target").getBoundingClientRect = () => ({
    left: 700,
    top: 150,
    width: 100,
    height: 50,
  });
  await act(async () => {
    root.render(
      h(
        MotionSystemProvider,
        null,
        h(Probe),
        h(Crosshair),
        h(RobotArm),
        h(MagneticLink, { href: "#home", className: "button" }, "Explore"),
        h(TiltCard, { className: "project-card" }, "Card"),
        h(RegisterText, { text: "SYS-06", kind: "number" }),
        h(CountMetric, { text: "285K+ records" }),
        h(ScanReveal, { id: "06" }),
      ),
    );
    await sleep(30);
  });
  assert.equal(state.fine, true);
  assert.ok(document.querySelector(".robot-cursor-ring"));
  const renderCount = renders;
  await pointer(900, 200);
  assert.equal(state.heroX.get(), 0.8);
  assert.equal(state.heroY.get(), -0.5);
  assert.equal(
    renders,
    renderCount,
    "pointer input must not rerender the context",
  );
  assert.ok(
    Math.abs(state.reticleX.get() - state.x.get()) <= 5,
    "cursor attraction stays within 5px",
  );
  await pointer(100000, -100000);
  assert.equal(state.heroX.get(), 1);
  assert.equal(state.heroY.get(), -1);
  const previousX = state.x.get();
  await pointer(10, 10, "touch");
  assert.equal(
    state.x.get(),
    previousX,
    "touch is ignored even on hybrid desktops",
  );
  await act(async () => {
    enterAll();
  });
  await act(async () => {
    await sleep(1250);
  });
  assert.ok(document.body.textContent.includes("285K+ records"));
  assert.equal(
    document.querySelector('[aria-label="SYS-06"]').textContent,
    "SYS-06",
  );
  assert.ok(state.seen.has("scan-06"));
  await changeMedia({ reduced: true });
  assert.equal(state.fine, false);
  assert.equal(state.reduced, true);
  assert.equal(state.heroX.get(), 0);
  assert.equal(state.heroY.get(), 0);
  assert.equal(document.querySelector(".robot-cursor-ring"), null);
  const neutralLink = document.querySelector('[data-robot-part="shoulder"] line');
  assert.equal(Number(neutralLink.getAttribute('x2')), 266, 'reduced-motion shoulder returns to rest');
  assert.equal(Number(neutralLink.getAttribute('y2')), 263);
  const elbowLink = document.querySelector('[data-robot-part="elbow"] line');
  assert.equal(elbowLink.getAttribute('x1'), neutralLink.getAttribute('x2'), 'links share the same joint centre');
  assert.equal(elbowLink.getAttribute('y1'), neutralLink.getAttribute('y2'));
  const reducedX = state.x.get();
  await pointer(500, 500);
  assert.equal(
    state.x.get(),
    reducedX,
    "reduced mode removes global pointer tracking",
  );
  await changeMedia({ reduced: false, compact: true });
  assert.equal(state.compact, true);
  assert.equal(state.fine, false);
  assert.equal(document.querySelector(".robot-cursor-ring"), null);
  await pointer(200, 200);
  assert.equal(state.x.get(), reducedX);
  await changeMedia({ compact: false, precise: false });
  assert.equal(state.fine, false, "coarse tablet pointer disables tracking");
  await changeMedia({ precise: true });
  assert.equal(state.fine, true);
  await pointer(700, 400);
  assert.notEqual(state.x.get(), reducedX);
  const finalX = state.x.get();
  await act(async () => root.unmount());
  await pointer(100, 100);
  assert.equal(state.x.get(), finalX, "unmount removes pointer listeners");
  assert.equal([...observers].reduce((n, o) => n + o.targets.size, 0), 0, "all observed elements are released on unmount");
  dom.window.close();
});

const {
  solveArm,
  armPoints,
} = require("../components/motion/armKinematics.ts");
test("arm inverse kinematics reaches the pointer direction throughout its workspace", () => {
  for (const [x, y] of [
    [50, 100],
    [300, 55],
    [550, 100],
    [80, 350],
    [550, 360],
    [300, 408],
    [-2000, 100],
    [2000, -900],
  ]) {
    const pose = solveArm(x, y);
    const p = armPoints(pose.shoulder, pose.elbow, pose.wrist);
    assert.ok(Object.values(pose).every(Number.isFinite));
    assert.ok(
      Math.hypot(p.tip.x - pose.targetX, p.tip.y - pose.targetY) < 0.001,
    );
    assert.ok(Math.hypot(p.tip.x - 300, p.tip.y - 408) <= 360.001);
  }
  assert.ok(
    armPoints(
      ...["shoulder", "elbow", "wrist"].map((k) => solveArm(50, 180)[k]),
    ).tip.x < 300,
  );
  assert.ok(
    armPoints(
      ...["shoulder", "elbow", "wrist"].map((k) => solveArm(550, 180)[k]),
    ).tip.x > 300,
  );
});

