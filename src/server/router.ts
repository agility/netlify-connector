import { TRPCError } from "@trpc/server";
import { procedure, router } from "./trpc";
import { configurationSchema } from '../schema/connect-config-schema';
import { z } from 'zod';


const GetConnectConfigurationSchema = z.object({
  configurationId: z.string().min(1).trim(),
  dataLayerId: z.string().min(1).trim(),
});

const UpsertConnectConfigurationSchema = z.object({
  config: configurationSchema,
  configurationId: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => val ?? ''),
  name: z.string().min(1).trim(),
  prefix: z.string().min(1).trim(),
  dataLayerId: z.string().min(1).trim(),
});

export const appRouter = router({
  connectSettings: {
    query: procedure
      .input(GetConnectConfigurationSchema)
      .query(
        async ({
          ctx: { client, teamId },
          input: { dataLayerId, configurationId },
        }) => {
          if (dataLayerId === null || teamId === null) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'teamId and dataLayerId required',
            });
          }

          return client.getConnectConfiguration({
            teamId,
            dataLayerId,
            configurationId,
          });
        }
      ),
    mutate: procedure
      .input(UpsertConnectConfigurationSchema)
      .mutation(
        async ({
          ctx: { client, teamId },
          input: { config, configurationId, name, prefix, dataLayerId },
        }) => {
          if (dataLayerId === null || teamId === null) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'teamId and dataLayerId required',
            });
          }

          try {
            if (configurationId !== '') {
              await client.updateConnectConfiguration({
                config,
                configurationId,
                name,
                prefix: prefix,
                dataLayerId,
                teamId,
              });
            } else {
              await client.createConnectConfiguration({
                config,
                dataLayerId,
                name,
                prefix: prefix,
                teamId,
              });
            }
          } catch (err) {
            // @ts-expect-error
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (err?.response?.status === 409) {
              throw new TRPCError({
                code: 'CONFLICT',
                message:
                  'This prefix is already used for a configuration for the same data layer and team installation',
              });
            }
            throw err;
          }
        }
      ),
  },
});

export type AppRouter = typeof appRouter;
