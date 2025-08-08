import { NotificationType } from "@prisma/client";
import { z } from "zod";

// Params par type de notification (pas de texte; i18n côté client)
export const UserNotificationParamsSchema = z.object({
  kind: z.enum(["PROFILE_INCOMPLETE", "ACTION_REQUIRED", "REMINDER"]),
  contextId: z.string().optional(),
  meta: z.record(z.string(), z.any()).optional(),
});

export type UserNotificationParams = z.infer<typeof UserNotificationParamsSchema>;

// Registre de validation des params par type
export const NotificationParamsRegistry: Record<
  NotificationType,
  z.ZodTypeAny
> = {
  [NotificationType.USER]: UserNotificationParamsSchema,
};

export const NotifyInputSchema = z.object({
  userId: z.string().min(1),
  type: z.literal(NotificationType.USER),
  params: z.record(z.string(), z.any()).optional(),
});

export type NotifyInput = z.infer<typeof NotifyInputSchema>;


