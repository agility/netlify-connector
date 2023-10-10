import agilitySync from "@agility/content-sync"
let syncInterfaceNetlify = require("./agility-sync-interface.cjs");
import agilityAPI from '@agility/content-fetch'

interface IAgilitySyncConfig {
	configOptions: Record<string, any>
	models?: Record<string, any>

}

interface IAgilityClients {
	fetchApiClient: any
	previewApiClient: any
	fetchSyncClient: any
	previewSyncClient: any
}

export const getAgilityAPIClients = ({ configOptions, models }: IAgilitySyncConfig): IAgilityClients => {

	const baseUrl = null //"https://localhost:5001"

	const fetchApiClient = agilityAPI.getApi({
		guid: configOptions.guid,
		apiKey: configOptions.fetchAPIToken,
		baseUrl
	});

	//const models = await getModels({ apiClient: fetchApiClient })

	const previewApiClient = agilityAPI.getApi({
		guid: configOptions.guid,
		apiKey: configOptions.previewAPIToken,
		isPreview: true,
		baseUrl
	});

	const fetchSyncClient = agilitySync.getSyncClient({
		guid: configOptions.guid,
		apiKey: configOptions.fetchAPIToken,
		isPreview: false,
		debug: false,
		channels: configOptions.sitemaps.split(","),
		languages: configOptions.locales.split(","),
		store: {
			//use gatsby sync interface
			interface: syncInterfaceNetlify,
			options: {
				models
				// getNode,
				// createNodeId,
				// createNode,
				// createContentDigest,
				// deleteNode,
			},
		},
	});

	const previewSyncClient = agilitySync.getSyncClient({
		guid: configOptions.guid,
		apiKey: configOptions.previewAPIToken,
		isPreview: true,
		debug: false,
		channels: configOptions.sitemaps.split(","),
		languages: configOptions.locales.split(","),
		store: {
			//use gatsby sync interface
			interface: syncInterfaceNetlify,
			options: {
				models
				// getNode,
				// createNodeId,
				// createNode,
				// createContentDigest,
				// deleteNode,
			},
		},
	});


	return {
		fetchApiClient,
		previewApiClient,
		fetchSyncClient,
		previewSyncClient
	}

}