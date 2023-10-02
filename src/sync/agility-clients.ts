import agilitySync from "@agility/content-sync"
let syncInterfaceGatsby = require("./agility-sync-interface.cjs");
import agilityAPI from '@agility/content-fetch'
import { getModels } from "./agility-get-models";

interface IAgilitySyncConfig {
	configOptions: Record<string, any>
}

interface IAgilityClients {
	fetchApiClient: any
	previewApiClient: any
	fetchSyncClient: any
	previewSyncClient: any
}

export const getAgilityClients = ({ configOptions }: IAgilitySyncConfig): IAgilityClients => {

	const fetchApiClient = agilityAPI.getApi({
		guid: configOptions.guid,
		apiKey: configOptions.fetchAPIToken
	});

	//const models = await getModels({ apiClient: fetchApiClient })

	const previewApiClient = agilityAPI.getApi({
		guid: configOptions.guid,
		apiKey: configOptions.previewAPIToken,
		isPreview: true
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
			interface: syncInterfaceGatsby,
			options: {
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
			interface: syncInterfaceGatsby,
			options: {
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