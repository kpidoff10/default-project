"use server";

import Ably from "ably";
import { authActionClient } from "../create-safe-action";
import { serverConfig } from "../config/server-config";
import { z } from "zod";

export const getAblyToken = authActionClient
  .metadata({ actionName: "getAblyToken" })
  .inputSchema(z.undefined())
  .action(async ({ ctx: { userId } }) => {
    if (!serverConfig.ably?.apiKey) {
      return { tokenRequest: null };
    }
    if (!serverConfig.ably.apiKey.includes(":")) {
      throw new Error("ABLY_API_KEY invalide. Format attendu: 'keyId:keySecret'.");
    }
    
    // Configuration Ably sans cache pour éviter les problèmes keyv
    const ably = new Ably.Rest({ 
      key: serverConfig.ably.apiKey, 
      queryTime: true,
      // Désactiver le cache pour éviter les conflits keyv
      restHost: undefined,
      realtimeHost: undefined,
      port: undefined,
      tlsPort: undefined,
    });
    
    const tokenRequest = await ably.auth.createTokenRequest({ clientId: userId || undefined });
    return { tokenRequest };
  });


