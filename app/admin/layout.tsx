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
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
