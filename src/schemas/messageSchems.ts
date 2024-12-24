import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, "content must be atleast 10 words")
    .max(300, "content must not be more than 300 words"),
});
