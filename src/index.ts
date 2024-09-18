import { NetlifyExtension } from "@netlify/sdk";
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


const extension = new NetlifyExtension();
const connector = extension.addConnector({
	typePrefix: "Agility",
	localDevOptions: {
		guid: "2b17d772-d",

		//LIVE
		apiKey: "defaultlive.ea30c52c8d2af8989ed15578997fac51b7ede4eb4f1878ab6c76867e945541d7",

		//PREVIEW
		/*
		apiKey: "defaultpreview.ab58cfd7fc5acbc7af2b3277feee018c5501275b2f6e48120e7c6ec3690dc76c",
		isPreview: true,
		*/
		locales: "en-us",
		sitemaps: "website",
		logLevel: "debug" //debug, info, warn, error, none
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
		apiKey: zod.string().meta({
			label: "The Agility API token",
			helpText: "The fetch or preview API token from your Agility instance",
			secret: true,
		}),
		isPreview: zod.boolean().optional().default(false).meta({
			label: "Preview Mode?",
			helpText: "Determines if you are viewing preview content.  Match with the preview API key.",
			secret: false,
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
		}),
		logLevel: zod.string().optional().default("warning").meta({
			label: "Log Level",
			helpText: "The log level for this connector (debug, info, warn, error, none).",
			secret: false
		}),

	});
});

/**
 * Defines the models for the connector
 */
connector.model(async ({ define, cache }, configOptions) => {

	//get the agility clients...
	const { apiClient } = getAgilityAPIClients({ configOptions })

	//build the models for layouts (pages, sitemaps, redirects, etc)
	defineAgilityLayout(define)
	defineAgilitySitemaps(define)
	defineAgilityRedirection(define)

	outputMessage("Adding Content Models...")

	//build the content models
	await defineAgilityModels({ define, cache, apiClient })

	outputMessage("Content Models added...")

});

/**
 * Create the nodes for the first time...
 * Docs here: https://sdk.netlify.com/connectors/develop/
 */
connector.event("createAllNodes", async ({ models, cache }, configOptions) => {

	outputMessage("Pulling content for initial sync..")
	await syncAgilityContent({ configOptions, models, cache })
	outputMessage("Initial content pull complete.")



});

/**
 * Content Delta! Do a sync pull down the delta and update the nodes
 * Netlify Docs here: https://sdk.netlify.com/connectors/develop/
 */
connector.event("updateNodes", async ({ models, cache }, configOptions) => {

	outputMessage("Pulling content for delta sync..")

	await syncAgilityContent({ configOptions, models, cache })

	outputMessage("Delta content pull complete.")

});

export { extension };

