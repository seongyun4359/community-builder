import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <Header />
      <main className="flex-1 pb-20">
        {children}
      </main>
      <BottomNav />
    </AppShell>
  );
}
