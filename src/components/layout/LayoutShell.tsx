"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FacebookPixel from "@/components/tracking/FacebookPixel";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  // Admin routes get a completely clean layout — no site navbar/footer
  if (isAdmin) {
    return <>{children}</>;
  }

  // Regular site pages get the full chrome
  return (
    <>
      <FacebookPixel />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
