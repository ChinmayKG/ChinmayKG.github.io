import type { Metadata } from "next";
import "./globals.css";
import "./interactions.css";
import { MotionSystemProvider } from "@/components/motion/MotionSystem";
export const metadata: Metadata = {
  title: "Chinmay KG | Robotics & Mechanical Engineering",
  description:
    "Mechanical Engineering student at IIT Bombay working on robotics, automation, embedded systems and intelligent engineering systems.",
  openGraph: {
    title: "Chinmay KG | Robotics & Mechanical Engineering",
    description:
      "Mechanical Engineering × Robotics × Intelligent Systems. Explore projects and experience from IIT Bombay.",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <MotionSystemProvider>{children}</MotionSystemProvider>
      </body>
    </html>
  );
}
