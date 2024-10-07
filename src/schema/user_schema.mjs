import z from "zod";

export const registerSchema = z.object({
  name: z.string().max(255), // String with a max length of 255
  surname: z.string().max(255), // String with a max length of 255
  email: z.string().email().max(255), // Unique email with max length 255
  password: z.string().max(255), // Password with max length 255
});

export const loginSchema = z.object({
  email: z.string().email().max(255), // Unique email with max length 255
  password: z.string().max(255), // Password with max length 255
});
