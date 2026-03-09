import type { Metadata } from "next";
import AdminDashboardLayout from "@/components/admin/layout/DashboardLayout";
import { AdminI18nProvider } from "@/components/admin/AdminI18nProvider";
import "./admin.css";

export const metadata: Metadata = {
  title: "Dashboard, Store Management",
  description:
    "Modern e-commerce admin dashboard for managing your Casify store. Track orders, manage products, and view analytics.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      id="admin-root"
      dir="ltr"
      style={{
        fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cairo:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <AdminI18nProvider>
        <AdminDashboardLayout>{children}</AdminDashboardLayout>
      </AdminI18nProvider>
    </div>
  );
}
