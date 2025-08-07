import { EarningStatus, NotificationType } from "@prisma/client"

import { prisma } from "@/lib/prisma"

// Types pour les notifications
export interface CreateNotificationData {
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
}

export interface CreateEarningData {
  userId: string
  amount: number
  currency?: string
  source: string
}

// Créer une notification simple
export async function createNotification(data: CreateNotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
      },
    })

    return { success: true, notification }
  } catch (error) {
    console.error("Erreur lors de la création de la notification:", error)
    return { success: false, error: "Erreur lors de la création de la notification" }
  }
}

// Créer une notification de gain avec la relation
export async function createEarningNotification(data: CreateEarningData) {
  try {
    // Créer d'abord la notification de gain
    const earningNotification = await prisma.notificationEarning.create({
      data: {
        userId: data.userId,
        amount: data.amount,
        currency: data.currency || "EUR",
        source: data.source,
      },
    })

    // Créer la notification liée
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: "EARNING",
        title: "Nouveau gain !",
        message: `Vous avez gagné ${data.amount} ${data.currency || "EUR"} via ${data.source}`,
        data: {
          earningId: earningNotification.id,
          amount: data.amount,
          currency: data.currency || "EUR",
          source: data.source,
        },
        notificationEarningId: earningNotification.id, // Lier les deux
      },
    })

    return { 
      success: true, 
      earningNotification,
      notification 
    }
  } catch (error) {
    console.error("Erreur lors de la création de la notification de gain:", error)
    return { success: false, error: "Erreur lors de la création de la notification de gain" }
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
        notificationEarning: true,
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
        notificationEarning: true,
      },
    })

    return { success: true, notifications }
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications non lues:", error)
    return { success: false, error: "Erreur lors de la récupération des notifications non lues" }
  }
} 