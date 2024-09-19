import {
  Card,
  CardLoader,
  CardTitle,
  Checkbox,
  ConnectConfigurationSurface,
  Form,
  FormField,
  FormFieldSecret,
} from "@netlify/sdk/ui/react/components";
import { trpc } from "../trpc";
import { useNetlifySDK } from "@netlify/sdk/ui/react";
import { connectSettingsSchema } from "../../schema/connect-config-schema";
import { z } from "zod";

type ConfigFormData = z.infer<typeof connectSettingsSchema>;

export const ConnectConfiguration = () => {
  const sdk = useNetlifySDK();

  const query = trpc.connectSettings.query.useQuery(
    {
      configurationId: sdk.context.configurationId ?? "",
      dataLayerId: sdk.context.dataLayerId ?? "",
    },
    { enabled: sdk.context.configurationId != null }
  );
  const mutation = trpc.connectSettings.mutate.useMutation({
    onSuccess: async () => {},
  });

  const onSubmit = ({ name, prefix, ...rest }: ConfigFormData) => {
    void (async () => {
      await mutation.mutateAsync({
        config: { ...rest },
        configurationId: sdk.context.configurationId,
        dataLayerId: sdk.context.dataLayerId ?? "",
        name,
        prefix,
      });
      sdk.requestTermination();
    })();
  };

  if (query.isLoading) {
    return <CardLoader />;
  }

  return (
    <ConnectConfigurationSurface>
      <Card>
        <CardTitle>Data Source Configuration</CardTitle>
        <Form
          defaultValues={
            query.data
              ? {
                  ...query.data,
                  guid: query.data?.config?.guid,
                  apiKey: query.data?.config?.apiKey,
                  isPreview: query.data?.config?.isPreview,
                  locales: query.data?.config?.locales,
                  sitemaps: query.data?.config?.sitemaps,
                  logLevel: query.data?.config?.logLevel,
                }
              : {
                  guid: "",
                  apiKey: "",
                  isPreview: false,
                  locales: "",
                  sitemaps: "",
                  logLevel: "warn",
                  prefix: "",
                  name: "",
                }
          }
          schema={connectSettingsSchema}
          onSubmit={onSubmit}
        >
          <FormField label="Name" name="name" required />
          <FormField
            label="Prefix"
            name="prefix"
            helpText="The prefix to use for types synced from this data source. It must start with an uppercase letter and can only consist of alphanumeric characters and underscores. For example, Product becomes {Prefix}Product."
            required
          />
          <FormField
            name="guid"
            type="text"
            label="Instance GUID"
            helpText="The guid from your Agility instance."
            required
          />
          <FormFieldSecret
            name="apiKey"
            label="The Agility API token"
            helpText="The fetch or preview API token from your Agility instance"
            required
          />
          <Checkbox
            name="isPreview"
            label="Preview Mode?"
            helpText="Determines if you are viewing preview content.  Match with the preview API key."
          />
          <FormField
            name="locales"
            type="text"
            label="Locales"
            helpText="Comma separated list of locale codes from your Agility instance (e.g. en-us,fr-ca)"
            required
          />
          <FormField
            name="sitemaps"
            type="text"
            label="Sitemaps"
            helpText="Comma separated list of sitemap reference names your Agility instance that you wish to include."
            required
          />
          <FormField
            name="logLevel"
            type="text"
            label="Log Level (optional)"
            helpText="The log level for this connector (debug, info, warn, error, none)."
          />
        </Form>
      </Card>
    </ConnectConfigurationSurface>
  );
};
