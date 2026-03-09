"use client";

import UnderDevelopment from "@/components/admin/shared/UnderDevelopment";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";

export default function ReviewsRoute() {
  const { t } = useAdminI18n();
  return <UnderDevelopment title={t("underDev.reviewsTitle")} description={t("underDev.reviewsDesc")} />;
}