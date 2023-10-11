import { NetlifyIntegration } from "@netlify/sdk";
import { getAgilityAPIClients } from "./sync/agility-api-clients";
import { outputMessage } from "./util/log";
import { defineAgilityLayout } from "./definitions/agility-layout";
import { defineAgilityModels } from "./definitions/agility-models";
import { defineAgilitySitemaps } from "./definitions/agility-sitemaps";
import { syncAgilityContent } from "./sync/agility-sync";
import { defineAgilityRedirection } from "./definitions/agility-redirection";

/*
	 ___         _ ___ __           _   __     __  ___ ____         ______                            __
	/   | ____ _(_) (_) /___  __   / | / /__  / /_/ (_) __/_  __   / ____/___  ____  ____  ___  _____/ /_
  / /| |/ __ `/ / / / __/ / / /  /  |/ / _ \/ __/ / / /_/ / / /  / /   / __ \/ __ \/ __ \/ _ \/ ___/ __/
 / ___ / /_/ / / / / /_/ /_/ /  / /|  /  __/ /_/ / / __/ /_/ /  / /___/ /_/ / / / / / / /  __/ /__/ /_
/_/  |_\__, /_/_/_/\__/\__, /  /_/ |_/\___/\__/_/_/_/  \__, /   \____/\____/_/ /_/_/ /_/\___/\___/\__/
		/____/          /____/                          /____/
*/


const integration = new NetlifyIntegration();
const connector = integration.addConnector({
	typePrefix: "Agility",
	localDevOptions: {
		guid: "2b17d772-d",
		fetchAPIToken: "defaultlive.ea30c52c8d2af8989ed15578997fac51b7ede4eb4f1878ab6c76867e945541d7",
		previewAPIToken: "defaultpreview.ab58cfd7fc5acbc7af2b3277feee018c5501275b2f6e48120e7c6ec3690dc76c",
		locales: "en-us",
		sitemaps: "website"
	},
});

/**
 * Defines the options / config values for this connector
 */
connector.defineOptions(({ zod }) => {

	return zod.object({
		guid: zod.string().meta({
			label: "Instance GUID",
			helpText: "The guid from your Agility instance.",
			secret: false,
		}),
		fetchAPIToken: zod.string().meta({
			label: "Fetch API token",
			helpText: "The fetch API token from your Agility instance",
			secret: true,
		}),
		previewAPIToken: zod.string().meta({
			label: "Preview API token",
			helpText: "The preview API token from your Agility instance",
			secret: true,
		}),
		locales: zod.string().meta({
			label: "Locales",
			helpText: "Comma separated list of locale codes from your Agility instance (e.g. en-us,fr-ca)",
			secret: false,
		}),
		sitemaps: zod.string().meta({
			label: "Sitemaps",
			helpText: "Comma separated list of sitemap reference names your Agility instance that you wish to include.",
			secret: false,
		})
	});
});

/**
 * Defines the models for the connector
 */
connector.model(async ({ define, cache }, configOptions) => {

	//get the agility clients...
	const { fetchApiClient } = getAgilityAPIClients({ configOptions })

	//build the models for layouts (pages, sitemaps, redirects, etc)
	defineAgilityLayout(define)
	defineAgilitySitemaps(define)
	defineAgilityRedirection(define)


	outputMessage("Adding Content Models...")

	//build the content models
	await defineAgilityModels({ define, cache, fetchApiClient })

	outputMessage("Content Models added...")

});

/**
 * Create the nodes for the first time...
 * Docs here: https://sdk.netlify.com/connectors/develop/
 */
connector.event("createAllNodes", async ({ models, cache }, configOptions) => {

	await syncAgilityContent({ configOptions, models, cache })

});

/**
 * Content Delta! Do a sync pull down the delta and update the nodes
 * Docs here: https://sdk.netlify.com/connectors/develop/
 */
connector.event("updateNodes", async ({ models, cache }, configOptions) => {

	await syncAgilityContent({ configOptions, models, cache })


});

integration.onEnable(async (_, { teamId, siteId, client }) => {
	// Connectors are disabled by default, so we need to
	// enable them when the integration is enabled.

	teamId && await client.enableConnectors(teamId);

	return {
		statusCode: 200,
	};
});

export { integration };

