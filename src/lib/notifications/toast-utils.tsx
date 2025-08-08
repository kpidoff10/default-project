"use client";

import { AlertTriangle, Bell, CheckCircle2, UserCog } from "lucide-react";
import { RedirectType, redirect } from "next/navigation";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

type NotificationTypeName = "USER";
type UserNotificationKindName =
  | "PROFILE_INCOMPLETE"
  | "ACTION_REQUIRED"
  | "REMINDER";

export type ToastNotification = {
  type: NotificationTypeName;
  priority: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  params?: ({ kind?: UserNotificationKindName } & Record<string, any>) | null;
};

type ToastCfg = {
  titleKey?: string; // défaut: `Notifications.<type>.title`
  bodyKey?: string; // défaut: `Notifications.<type>.body`
  duration?: number; // défaut: 6000
  icon?: React.ReactNode;
  getHref?: (n: ToastNotification) => string | undefined;
};

const USER_KIND_TOAST: Record<UserNotificationKindName, ToastCfg> = {
  PROFILE_INCOMPLETE: { icon: <UserCog className="h-4 w-4" />, duration: 8000 },
  ACTION_REQUIRED: {
    icon: <AlertTriangle className="h-4 w-4" />,
    duration: 9000,
  },
  REMINDER: { icon: <Bell className="h-4 w-4" />, duration: 7000 },
} as const;

const TYPE_TOAST: Record<
  NotificationTypeName,
  (n: ToastNotification) => ToastCfg
> = {
  USER: (n) =>
    USER_KIND_TOAST[n.params?.kind || "PROFILE_INCOMPLETE"] ?? {
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
} as const;

export function showToastForNotification(
  n: ToastNotification,
  t: (k: string, v?: Record<string, any>) => string
) {
  const baseTitleKey = `${n.type}.title`;
  const baseBodyKey = `${n.type}.body`;

  const cfg = TYPE_TOAST[n.type](n);
  const titleKey = cfg.titleKey ?? baseTitleKey;
  const bodyKey = cfg.bodyKey ?? baseBodyKey;

  const title = t(titleKey, n.params ?? undefined);
  const description = t(bodyKey, n.params ?? undefined);

  const common = {
    description,
    duration: cfg.duration ?? 6000,
    icon: cfg.icon,
    action: {
      label: t("view"),
      onClick: () => {
        const href = cfg.getHref?.(n) ?? "/notifications";
        redirect(href, RedirectType.push);
      },
    },
  } as const;

  switch (n.priority) {
    case "SUCCESS":
      toast.success(title, common);
      break;
    case "WARNING":
      toast.warning(title, common);
      break;
    case "ERROR":
      toast.error(title, common);
      break;
    default:
      toast(title, common);
  }
}
