import agilitySync from "@agility/content-sync"
let syncInterfaceNetlify = require("./agility-sync-interface.cjs");

import { outputMessage } from "../util/log";

interface IAgilitySyncConfig {
	configOptions: Record<string, any>
	cache: any
	models: Record<string, any>

}

export const syncAgilityContent = async ({ configOptions, cache, models }: IAgilitySyncConfig) => {

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

	outputMessage("Syncing fetch...")
	await fetchSyncClient.runSync()

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

	//sync the content for preview and fetch
	outputMessage("Syncing preview...")
	await previewSyncClient.runSync()



	outputMessage("Syncing complete.")

}