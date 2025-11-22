import { z } from "zod";
import { MAX_CODE_LENGTH, MIN_CODE_LENGTH } from "./code";

export const createLinkSchema = z.object({
  url: z
    .string()
    .min(1, "URL is required")
    .url("Enter a valid URL (include http/https)"),
  code: z
    .string()
    .trim()
    .regex(new RegExp(`^[A-Za-z0-9]{${MIN_CODE_LENGTH},${MAX_CODE_LENGTH}}$`), {
      message: `Code must be ${MIN_CODE_LENGTH}-${MAX_CODE_LENGTH} letters or numbers`,
    })
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;

