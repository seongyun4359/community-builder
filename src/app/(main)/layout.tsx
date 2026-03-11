import AppShell from "@/components/layout/AppShell";
import Header from "@/components/layout/Header";
import PageTransition from "@/components/layout/PageTransition";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <Header />
      <main className="flex-1 pb-6">
        <PageTransition>{children}</PageTransition>
      </main>
    </AppShell>
  );
}
