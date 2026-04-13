import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Air Traffic Controller Training | WindChasers Aviation Academy",
  description: "Structured ATC preparation with expert trainers, live classes, and a clear path to one of aviation's most critical careers.",
};

export default function ATCLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
