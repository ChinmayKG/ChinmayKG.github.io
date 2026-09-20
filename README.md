# Chinmay KG — Robotics Lab Portfolio

A responsive, statically exported Next.js / React / TypeScript portfolio with Tailwind CSS, Framer Motion and Lucide icons.

## Development

Use Node.js 20.9+ and pnpm. Run `pnpm install --ignore-scripts`, then `pnpm dev`. Open the local address printed in the terminal.

- `pnpm lint` — ESLint checks
- `pnpm typecheck` — TypeScript checks (run after `pnpm build` on a fresh checkout to generate Next.js route types)
- `pnpm build` — production build and static export to `out/`

Deploy `out/` to a static host, or use the included Sites manifest. No server, API keys or environment variables are needed.

## Content and assets

Edit `data/portfolio.ts` for projects, experience, education, skills and social profiles. All project cards and detail panels use the same typed data.

Add these optional files and rebuild:

- `public/resume.pdf` — enables résumé links that open in a new tab
- `public/profile.webp` — replaces the portrait placeholder
- `public/projects/robotic-arm.webp`
- `public/projects/turbocharger.webp`
- `public/projects/imu-vehicle.webp`
- `public/projects/watts-linkage.webp`
- `public/projects/drone-controller.webp`
- `public/projects/epidemic-ai.webp`
- `public/projects/solarsense.webp`
- `public/projects/inconel.webp`

Missing files render intentional placeholders without broken image requests. The chart is labelled as illustrative; it does not claim measured model performance. Project status labels describe the supplied work, not live hardware telemetry.

## Architecture

- `app/` — server-rendered homepage, metadata, global theme and responsive styles
- `components/sections/` — hero and interactive project catalogue
- `components/Primitives.tsx` — reusable cards, section headings, badges, timelines and skill nodes
- `components/RobotArm.tsx` — lightweight animated SVG mechanism
- `components/Navigation.tsx` — active section tracking and mobile navigation
- `components/Crosshair.tsx` — decorative desktop pointer overlay
- `data/portfolio.ts` — typed portfolio content

The interface supports keyboard navigation, native modal focus handling, reduced motion, visible focus states and a skip link. External social links open in a new tab. Contact uses an email link; there is no backend contact form.

## Interaction system

`components/motion/MotionSystem.tsx` shares pointer MotionValues through one animation-frame-batched listener. `Interactions.tsx` contains magnetic links, registration/count-up text, signal reveals, timeline and progress controls. `ProjectMotion.tsx` handles bounded tilt and one-time scanning reveals. Additive styles live in `app/interactions.css`; the original global theme and portfolio data remain unchanged.

Desktop tracking uses small spring-damped offsets. Mobile retains shorter scroll and signal sequences. Reduced-motion preferences disable tracking, tilt, parallax and continuous motion. Signal loops pause offscreen and when the page is hidden. Robot joint highlights are decorative, not hardware telemetry.

Run `pnpm test` for the component integration test covering pointer bounds, render stability, scan registration, reduced motion, mobile/coarse pointers and listener cleanup. Browser QA also covers responsive navigation, project filters and native detail dialogs.


## Education sources and images

The institution dialogs use IIT Bombay's official overview (https://www.iitb.ac.in/about-iit-bombay), Dakshana's programme overview (https://www.dakshana.org/coe-jnv-bu-classroom/), and the CBSE Gajanur school record (https://saras.cbse.gov.in/SARAS/AffiliatedList/AfflicationDetails/840006). The two-year training is Chinmay's supplied biographical detail.

IIT Bombay emblem: https://www.iitb.ac.in/sites/default/files/IITBLogo.png. Shared JNV emblem: https://en.wikipedia.org/wiki/File:Jawahar_Navodaya_Vidyalaya_logo.png (used to identify the two Navodaya institutions; no school-specific emblem implied). Project illustrations were supplied by Chinmay. They are visual representations, not independently verified photographs or performance results.

The hero gripper uses a planar inverse-kinematics solver with a bounded reachable workspace and spring damping. Its joint markers follow the solved geometry. Mobile and reduced-motion preferences disable cursor tracking.
