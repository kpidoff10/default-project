import { z } from "zod";

export const updateProfileImageInput = z.object({
    imageUrl: z.string().url(),
  });
  
  export const updateProfileCoverInput = z.object({
    imageUrl: z.string().url(),
  });
  