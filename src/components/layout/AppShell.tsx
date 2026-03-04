export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-[var(--width-app)] flex-col border-border bg-background shadow-none sm:border-x sm:shadow-sm">
      {children}
    </div>
  );
}
