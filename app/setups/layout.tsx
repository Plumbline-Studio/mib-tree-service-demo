import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "6 ways to set up Home Base · MIB",
  description: "Six sample setups by Plumbline Studio. All data is made up.",
  robots: { index: false, follow: false },
};

export default function SetupsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
