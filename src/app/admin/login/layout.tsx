export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page skips dashboard shell (handled in DashboardLayout)
  return <>{children}</>;
}