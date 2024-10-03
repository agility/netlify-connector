import { z } from "zod";

export const configurationSchema = z.object({
  guid: z.string(),
  apiKey: z.string(),
  isPreview: z.boolean().optional().default(false),
  locales: z.string(),
  sitemaps: z.string(),
  logLevel: z.string().optional(),
});

export const connectRequiredSettingsSchema = z.object({
  name: z.string().min(1),
  prefix: z
    .string()
    .min(1)
    .regex(
      /^$|^[A-Z][A-Za-z0-9_]*$/,
      'Must start with an uppercase letter and only consist of alphanumeric characters and underscores'
    ),
})

export const connectSettingsSchema = configurationSchema.merge(
  connectRequiredSettingsSchema
);
