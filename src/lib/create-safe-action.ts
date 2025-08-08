import {
    DEFAULT_SERVER_ERROR_MESSAGE,
    createSafeActionClient,
} from "next-safe-action";

import { cookies } from "next/headers";
import { getAuthSession } from "./auth";
import { z } from "zod";

export class ActionError extends Error {}
  
  // Base client.
  const actionClient = createSafeActionClient({
    defineMetadataSchema() {
      return z.object({
        actionName: z.string(),
      });
    },
    handleServerError(e) {
      console.error("Action error:", e.message);
  
       if (e instanceof ActionError) {
        return e.message;
      }
  
      return DEFAULT_SERVER_ERROR_MESSAGE;
    },
    // Define logging middleware.
  }).use(async ({ next, clientInput, metadata }) => {
  
    // Here we await the action execution.
    const result = await next();
    // And then return the result of the awaited action.
    return result;
  });
  
  // Auth client defined by extending the base one.
  // Note that the same initialization options and middleware functions of the base client
  // will also be used for this one.
    export const authActionClient = actionClient
    // Define authorization middleware.
    .use(async ({ next }) => {
      const userId = await getAuthSession();

      if (!userId) {
        throw new Error("Session is not valid!");
      }

      // Return the next middleware with `userId` value in the context
      return next({ ctx: { userId } });
    });