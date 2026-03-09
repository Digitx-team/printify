"use client";

import UnderDevelopment from "@/components/admin/shared/UnderDevelopment";
import { useAdminI18n } from "@/components/admin/AdminI18nProvider";

export default function MessagesRoute() {
  const { t } = useAdminI18n();
  return <UnderDevelopment title={t("underDev.messagesTitle")} description={t("underDev.messagesDesc")} />;
}