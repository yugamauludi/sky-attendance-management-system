import Navbar from "@/components/navigation/Navbar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <div className="relative z-50">
        <Navbar />
      </div>
      <main className="p-2 pt-18">{children}</main>
    </div>
  );
}
