"use client";

import { Construction } from "lucide-react";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";

interface UnderDevelopmentProps {
  title: string;
  description?: string;
}

export default function UnderDevelopment({ title, description }: UnderDevelopmentProps) {
  const { t } = useAdminI18n();

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px]">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-primary-lighter flex items-center justify-center mx-auto mb-6">
          <Construction size={36} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">{title}</h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          {description || t("underDev.description")}
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="text-xs text-text-muted mt-4">{t("underDev.comingSoon")}</p>
      </div>
    </div>
  );
}