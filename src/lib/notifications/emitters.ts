import { NotificationPriority, NotificationType } from "@prisma/client";

import { notifyUser } from "./actions";

export type JsonRecord = Record<string, any>;

export type EmitUserBase = {
  userId: string;
  priority?: NotificationPriority;
  contextId?: string;
  meta?: JsonRecord;
};

export async function emitUserNotification(params: {
  userId: string;
  kind: "PROFILE_INCOMPLETE" | "ACTION_REQUIRED" | "REMINDER";
  priority?: NotificationPriority;
  contextId?: string;
  meta?: JsonRecord;
}) {
  return notifyUser({
    userId: params.userId,
    type: NotificationType.USER,
    priority: params.priority ?? "INFO",
    params: {
      kind: params.kind,
      contextId: params.contextId,
      meta: params.meta ?? {},
    },
  });
}

export function emitUserProfileIncomplete(args: EmitUserBase) {
  return emitUserNotification({ ...args, kind: "PROFILE_INCOMPLETE" });
}

export function emitUserActionRequired(args: EmitUserBase) {
  return emitUserNotification({ ...args, kind: "ACTION_REQUIRED" });
}

export function emitUserReminder(args: EmitUserBase) {
  return emitUserNotification({ ...args, kind: "REMINDER" });
}


