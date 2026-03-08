import AppShell from "@/components/layout/AppShell";
import PageTransition from "@/components/layout/PageTransition";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <PageTransition>{children}</PageTransition>
      </main>
    </AppShell>
  );
}
