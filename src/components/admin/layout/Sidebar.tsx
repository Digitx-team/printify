"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  X,
  Ticket,
  Star,
  MessageCircle,
  FileText,
  Puzzle,
  Bell,
  Truck,
} from "lucide-react";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";
import clsx from "clsx";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useAdminI18n();

  const navSections = [
    {
      label: "",
      items: [
        { name: t("nav.dashboard"), href: "/admin", icon: LayoutDashboard },
        { name: t("nav.orders"), href: "/admin/orders", icon: ShoppingBag },
        { name: t("nav.products"), href: "/admin/products", icon: Package },
        { name: t("nav.coupons"), href: "/admin/coupons", icon: Ticket },
        { name: t("nav.shipping"), href: "/admin/shipping", icon: Truck },
      ],
    },
    {
      label: t("nav.engage"),
      items: [
        { name: t("nav.reviews"), href: "/admin/reviews", icon: Star },
        {
          name: t("nav.messages"),
          href: "/admin/messages",
          icon: MessageCircle,
        },
        {
          name: t("nav.notifications"),
          href: "/admin/notifications",
          icon: Bell,
        },
      ],
    },
    {
      label: t("nav.tools"),
      items: [
        { name: t("nav.analytics"), href: "/admin/analytics", icon: BarChart3 },
        { name: t("nav.invoices"), href: "/admin/invoices", icon: FileText },
        {
          name: t("nav.integrations"),
          href: "/admin/integrations",
          icon: Puzzle,
        },
      ],
    },
    {
      label: t("nav.settingsLabel"),
      items: [
        { name: t("nav.settings"), href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-border flex flex-col shrink-0 transition-transform duration-300 ease-in-out",
          "lg:static lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="relative flex items-center justify-center px-6 h-[72px] border-b border-border">
          <Link href="/admin" className="flex items-center justify-center">
            <Image
              src="/mainLogo.png"
              alt="Printify Logo"
              width={120}
              height={36}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden absolute end-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 text-text-secondary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className={clsx(sIdx > 0 && "mt-5")}>
              {section.label && (
                <p className="px-3 mb-2 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  {section.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={clsx(
                          "nav-link flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium",
                          isActive ? "active" : "text-text-secondary",
                        )}
                      >
                        <item.icon size={18} strokeWidth={1.8} />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-primary-lighter flex items-center justify-center">
              <span className="text-primary text-sm font-bold">AD</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {t("common.admin")}
              </p>
              <p className="text-xs text-text-muted">{t("common.admin")}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
