// Documentation: https://sdk.netlify.com
import { NetlifyIntegration } from "@netlify/sdk";
import { syncAgilityContent } from "./sync/agility-sync";
import { getAgilityClients } from "./sync/agility-clients";
import { getModels } from "./sync/agility-get-models";
import { camelize } from "./util/camelize";

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


	const FileAttachment = define.object({
		name: "FileAttachment",
		fields: {
			label: {
				type: "String",
			},
			url: {
				type: "String",
			},
			target: {
				type: "String",
			},
			filesize: {
				type: "Int",
			}
		},
	});

	const ImageAttachment = define.object({
		name: "ImageAttachment",
		fields: {
			label: {
				type: "String",
			},
			url: {
				type: "String",
			},
			target: {
				type: "String",
			},
			filesize: {
				type: "Int",
			},
			height: {
				type: "Int",
			},
			width: {
				type: "Int",
			},
		},
	});

	console.log("*** AGILITY Adding Models...")

	const { fetchApiClient } = getAgilityClients({ configOptions })

	//get the models from Agility
	const agilityModels = await getModels({ apiClient: fetchApiClient })

	Object.keys(agilityModels).forEach(modelID => {
		//create the models from Agility

		const model = agilityModels[modelID]

		console.log("*** AGILITY *** Adding Model: ", model)

		//build the fields first
		let fields: any = {}
		model.fields.forEach((field: any) => {
			const fieldName = camelize(field.name)
			fields[fieldName] = {
				//TODO: handle linked content field :)
				//String, Int, Float, Boolean, JSON, and Date
				type: field.type === "Date" ? "Date"
					: field.type === "Integer" ? "Int"
						: field.type === "Decimal" ? "Float"
							: field.type === "Boolean" ? "Boolean"
								: field.type === "FileAttachment" ? FileAttachment
									: field.type === "ImageAttachment" ? ImageAttachment
										//TODO	: field.type === "Link" ? Link
										//TODO	: field.type === "Content" ? ContentType...
										: "String",
				required: field.settings.Required === "True"
			}
		});

		console.log("Fields are", fields)

		define.nodeModel({
			name: model.referenceName,
			fields
		});

	})

	console.log("*** AGILITY *** Models Added...")

	// define.nodeModel({
	// 	name: "User",
	// 	fields: {
	// 		name: {
	// 			type: "String",
	// 			required: true,
	// 		},
	// 		posts: {
	// 			type: "Post",
	// 			list: true,
	// 		},
	// 	},
	// });

	// define.nodeModel({
	// 	name: "Post",
	// 	fields: {
	// 		title: {
	// 			type: "String",
	// 			required: true,
	// 		},
	// 		blocks: {
	// 			list: true,
	// 			required: true,
	// 			type: define.object({
	// 				name: "Blocks",
	// 				fields: {
	// 					title: {
	// 						type: "String",
	// 					},
	// 					content: {
	// 						type: "String",
	// 					},
	// 				},
	// 			}),
	// 		},
	// 	},
	// });
});

/**
 * Create the nodes for the first time...
 */
connector.event("createAllNodes", async ({ models },) => {

	console.log("*** AGILITY integration.createAllNodes")



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
 * Content Delta!
 */
connector.event("updateNodes", async ({ models, cache }) => {

	console.log("*** AGILITY integration.updateNodes")

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

