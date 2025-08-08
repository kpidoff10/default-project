"use server";

import { ActionError, authActionClient } from "../create-safe-action";
import { NotificationParamsRegistry, NotifyInputSchema, UserNotificationParamsSchema } from "./registry";
import { NotificationPriority, NotificationType, Prisma } from "@prisma/client";

import { getAblyRest } from "../realtime/ably-server";
import { prisma } from "../prisma";
import { z } from "zod";

// Helper: publier via SDK Ably REST
async function publishToAbly(userId: string, event: string, payload: unknown) {
  const ably = getAblyRest();
  if (!ably) return;
  const channel = ably.channels.get(`user:${userId}:notifications`);
  await channel.publish(event, payload);
}

export const notifyUser = authActionClient
  .metadata({ actionName: "notifyUser" })
  .inputSchema(
    NotifyInputSchema.extend({
      priority: z.enum(["INFO", "SUCCESS", "WARNING", "ERROR"]).default("INFO"),
    })
  )
  .action(async ({ parsedInput, ctx: { userId: callerId } }) => {
    const { userId, type, params, priority } = parsedInput;

    // Valider params selon le type
    const schema = NotificationParamsRegistry[type];
    const validatedParams = schema ? schema.parse(params ?? {}) : {};

    // Vérifier l'existence du user cible pour éviter l'erreur FK
    const targetUser = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!targetUser) {
      throw new ActionError("Utilisateur introuvable");
    }

    let notification;

    // Créer d'abord la Notification
    notification = await prisma.notification.create({
      data: {
        userId,
        type,
        params: validatedParams as Prisma.InputJsonValue,
        priority,
      },
      select: {
        id: true,
        userId: true,
        type: true,
        priority: true,
        params: true,
        read: true,
        createdAt: true,
      },
    });

    // Si type USER, créer l'enregistrement NotificationUser lié
    if (type === NotificationType.USER) {
      const { kind, contextId, meta } = UserNotificationParamsSchema.parse(
        validatedParams
      );
      await prisma.notificationUser.create({
        data: {
          notificationId: notification.id,
          kind,
          contextId,
          meta: (meta ?? {}) as Prisma.InputJsonValue,
        },
      });
    }

    // Publier temps réel
    await publishToAbly(userId, "notification.created", notification);

    return notification;
  });

export const getUnreadCount = authActionClient
  .metadata({ actionName: "getUnreadCount" })
  .inputSchema(z.undefined())
  .action(async ({ ctx: { userId } }) => {
    const count = await prisma.notification.count({
      where: { userId, read: false },
    });
    return { count };
  });

export const getNotifications = authActionClient
  .metadata({ actionName: "getNotifications" })
  .inputSchema(
    z.object({
      cursor: z.string().optional(),
      limit: z.number().int().min(1).max(100).default(20),
    })
  )
  .action(async ({ parsedInput: { cursor, limit }, ctx: { userId } }) => {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      select: {
        id: true,
        userId: true,
        type: true,
        priority: true,
        params: true,
        read: true,
        createdAt: true,
      },
    });

    let nextCursor: string | undefined = undefined;
    if (notifications.length > limit) {
      const nextItem = notifications.pop();
      nextCursor = nextItem?.id;
    }

    return { items: notifications, nextCursor };
  });

export const markAsRead = authActionClient
  .metadata({ actionName: "markAsRead" })
  .inputSchema(z.object({ ids: z.array(z.string().min(1)).min(1) }))
  .action(async ({ parsedInput: { ids }, ctx: { userId } }) => {
    await prisma.notification.updateMany({
      where: { id: { in: ids }, userId },
      data: { read: true },
    });

    await publishToAbly(userId, "notification.read", { ids });
    const count = await prisma.notification.count({ where: { userId, read: false } });
    return { success: true, unreadCount: count };
  });

  export const markAllAsRead = authActionClient
  .metadata({ actionName: "markAllAsRead" })
  .action(async ({ ctx: { userId } }) => {
    await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
    return { success: true };
  });


