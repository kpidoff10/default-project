import { NotificationType } from "@prisma/client"
import { prisma } from "@/lib/prisma"

// Types pour les notifications
export interface CreateNotificationData {
  userId: string
  type: NotificationType
  params?: Record<string, any>
}

// Créer une notification simple
export async function createNotification(data: CreateNotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        params: (data.params || {}) as any,
      },
    })

    return { success: true, notification }
  } catch (error) {
    console.error("Erreur lors de la création de la notification:", error)
    return { success: false, error: "Erreur lors de la création de la notification" }
  }
}

// Marquer une notification comme lue
export async function markNotificationAsRead(notificationId: string) {
  try {
    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })

    return { success: true, notification }
  } catch (error) {
    console.error("Erreur lors du marquage de la notification:", error)
    return { success: false, error: "Erreur lors du marquage de la notification" }
  }
}

// Récupérer les notifications d'un utilisateur
export async function getUserNotifications(userId: string, limit = 20) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        notificationUser: true,
      },
    })

    return { success: true, notifications }
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error)
    return { success: false, error: "Erreur lors de la récupération des notifications" }
  }
}

// Récupérer les notifications non lues d'un utilisateur
export async function getUnreadNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: { 
        userId,
        read: false 
      },
      orderBy: { createdAt: "desc" },
      include: {
        notificationUser: true,
      },
    })

    return { success: true, notifications }
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications non lues:", error)
    return { success: false, error: "Erreur lors de la récupération des notifications non lues" }
  }
} 