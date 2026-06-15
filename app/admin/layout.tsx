import type { Metadata } from "next";
import AdminNav from "./components/AdminNav";

export const metadata: Metadata = {
  title: "WindChasers Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AdminNav />
      {/* md+: offset for the collapsed icon rail (it expands over content on hover) */}
      <main className="md:pl-16">
        {/* Full-width, admin tables want the whole screen, not a 1280 column */}
        <div className="w-full px-4 md:px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
