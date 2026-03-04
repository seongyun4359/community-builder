import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <Header />
      <main className="flex-1 px-4 py-6">
        {children}
      </main>
    </AppShell>
  );
}
