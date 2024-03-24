import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRY: z.string(),
  EXCHANGE_RATE_API_KEY: z.string(),
  EXCHANGE_RATE_API_URL: z.string(),
});

export const ENV = envSchema.parse(process.env);
