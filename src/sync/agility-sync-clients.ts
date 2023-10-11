import agilitySync from "@agility/content-sync"
let syncInterfaceNetlify = require("./agility-sync-interface.cjs");
import agilityAPI from '@agility/content-fetch'

interface IAgilitySyncConfig {
	configOptions: Record<string, any>
	models: Record<string, any>
	cache: any

}

interface IAgilitySyncClients {
	fetchSyncClient: any
	previewSyncClient: any
}

export const getAgilitySyncClients = ({ configOptions, models, cache }: IAgilitySyncConfig): IAgilitySyncClients => {

	const baseUrl = null //"https://localhost:5001"

	const fetchSyncClient = agilitySync.getSyncClient({
		guid: configOptions.guid,
		apiKey: configOptions.fetchAPIKey,
		isPreview: false,
		debug: false,
		channels: configOptions.sitemaps.split(","),
		languages: configOptions.locales.split(","),
		store: {
			//use gatsby sync interface
			interface: syncInterfaceNetlify,
			options: {
				models,
				cache,
				preview: false

			},
		},
	});

	const previewSyncClient = agilitySync.getSyncClient({
		guid: configOptions.guid,
		apiKey: configOptions.previewAPIKey,
		isPreview: true,
		debug: false,
		channels: configOptions.sitemaps.split(","),
		languages: configOptions.locales.split(","),
		store: {
			//use gatsby sync interface
			interface: syncInterfaceNetlify,
			options: {
				models,
				cache,
				preview: true

			},
		},
	});


	return {
		fetchSyncClient,
		previewSyncClient
	}

}