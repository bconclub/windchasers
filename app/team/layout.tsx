import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <div className={manrope.variable}>{children}</div>;
}
