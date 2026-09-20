const rad = Math.PI / 180;
const first = Math.hypot(-34, -145);
const second = Math.hypot(115, -119);
const tool = Math.hypot(89, 101);
const restA = Math.atan2(-145, -34);
const restB = Math.atan2(-119, 115);
const restTool = Math.atan2(101, 89);
const bound = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

// Planar inverse kinematics in the original SVG coordinate system.
// Clamp the reachable target, rather than scaling arbitrary joint rotations.
export function solveArm(x: number, y: number) {
  const px = bound(x, 45, 555) - 300;
  const py = bound(y, 50, 365) - 408;
  const direction = Math.atan2(py, px);
  const reach = bound(Math.hypot(px, py), 200, 360);
  const wristReach = reach - tool;
  const bx = Math.cos(direction) * wristReach;
  const by = Math.sin(direction) * wristReach;
  const bend = Math.acos(
    bound(
      (bx * bx + by * by - first * first - second * second) /
        (2 * first * second),
      -1,
      1,
    ),
  );
  const a =
    direction -
    Math.atan2(second * Math.sin(bend), first + second * Math.cos(bend));
  const b = a + bend;
  return {
    shoulder: (a - restA) / rad,
    elbow: (b - a - (restB - restA)) / rad,
    wrist: (direction - restTool - (b - restB)) / rad,
    targetX: 300 + Math.cos(direction) * reach,
    targetY: 408 + Math.sin(direction) * reach,
  };
}

export function armPoints(shoulder: number, elbow: number, wrist: number) {
  const a = restA + shoulder * rad;
  const b = restB + (shoulder + elbow) * rad;
  const c = restTool + (shoulder + elbow + wrist) * rad;
  const j2 = { x: 300 + first * Math.cos(a), y: 408 + first * Math.sin(a) };
  const j3 = { x: j2.x + second * Math.cos(b), y: j2.y + second * Math.sin(b) };
  const rounded = (p: {x:number; y:number}) => ({x: Math.round(p.x * 100000) / 100000, y: Math.round(p.y * 100000) / 100000});
  return {
    j2: rounded(j2),
    j3: rounded(j3),
    tip: rounded({ x: j3.x + tool * Math.cos(c), y: j3.y + tool * Math.sin(c) }),
  };
}

