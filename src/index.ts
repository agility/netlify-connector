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
	supports: {
		connect: true,
		visualEditor: false,
	},
	autoFormatGraphQLTypesAndFields: true,
	defineOptions: (({ zod }) => {
		return zod.object({
			guid: zod.string(),
			apiKey: zod.string(),
			isPreview: zod.boolean().optional().default(false),
			locales: zod.string(),
			sitemaps: zod.string(),
			logLevel: zod.string().optional().default("warning"),
		});
	})
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


connector.sync(async ({isInitialSync, models, cache, options}) => {
	if (isInitialSync) {
		/**
		 * Create the nodes for the first time...
		 * Docs here: https://sdk.netlify.com/connectors/develop/
		 */
		outputMessage("Pulling content for initial sync..")
		
		await syncAgilityContent({ configOptions: options, models, cache })

		outputMessage("Initial content pull complete.")
	} else {
		/**
		 * Content Delta! Do a sync pull down the delta and update the nodes
		 * Netlify Docs here: https://sdk.netlify.com/connectors/develop/
		 */
		outputMessage("Pulling content for delta sync..")

		await syncAgilityContent({ configOptions: options, models, cache })

		outputMessage("Delta content pull complete.")
	}
})

export { extension };

