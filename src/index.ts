import { NetlifyIntegration } from "@netlify/sdk";
import { getAgilityAPIClients } from "./sync/agility-api-clients";
import { outputMessage } from "./util/log";
import { defineAgilityLayout } from "./definitions/agility-layout";
import { defineAgilityModels } from "./definitions/agility-models";
import { defineAgilitySitemaps } from "./definitions/agility-sitemaps";
import { syncAgilityContent } from "./sync/agility-sync";

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

	//build the layouts (pages) models
	defineAgilityLayout(define)
	defineAgilitySitemaps(define)

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

	/*
		models["Post"].create({
			id: "124",
			title: "Virtual Tours - Ways to Travel From Home",
			slug: "virtual-tours-ways-to-travel-from-home",
			"date": "2021-03-31T13:17:50+00:00",
			"category": "110",
			"image": {
				"label": "Virtual Tour",
				"url": "https://cdn-dev.aglty.io/hqokwsfv/posts/virtual-tour_20210331171226_0.jpg",
				"target": null,
				"filesize": 279207,
				"height": 1542,
				"width": 2048
			},
			"content": "<p>Virtual tours can open up ama</p>",
			"categoryId": "110"

		});

	*/

	/*

	models.User.create({
		id: "1",
		name: "Annie",
		posts: [
			{
				id: "1",
				__typename: "Post",
			},
		],
	});
	models.Post.create({
		id: "1",
		title: "Hello World",
		blocks: [
			{
				title: "Example block title",
				content: "You can create complex content models",
			},
		],
	});
	*/
});

/**
 * Content Delta! Do a sync pull down the delta and update the nodes
 * Docs here: https://sdk.netlify.com/connectors/develop/
 */
connector.event("updateNodes", async ({ models, cache }, configOptions) => {

	await syncAgilityContent({ configOptions, models, cache })


	/*
	models.User.create({
		id: "1", // overwrites the existing User node with this ID
		name: "Annie",
		posts: [
			{
				id: "1",
				__typename: "Post",
			},
		],
	});
	models.Post.create({
		id: "2", // creates a new Post since this ID doesn't exist yet
		title: "Writing lots of posts these days",
		blocks: [
			{
				title: "Page section",
				content: "what up",
			},
		],
	});
	*/
});

integration.onEnable(async (_, { teamId, siteId, client }) => {
	// Connectors are disabled by default, so we need to
	// enable them when the integration is enabled.

	console.log("*** AGILITY integration.onEnable")

	teamId && await client.enableConnectors(teamId);

	return {
		statusCode: 200,
	};
});

export { integration };

