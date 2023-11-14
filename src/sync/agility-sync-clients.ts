import agilitySync from "@agility/content-sync"
let syncInterfaceNetlify = require("./agility-sync-interface.cjs");
import agilityAPI from '@agility/content-fetch'

interface IAgilitySyncConfig {
	configOptions: Record<string, any>
	models: Record<string, any>
	cache: any

}

interface IAgilitySyncClients {
	syncClient: any
}

export const getAgilitySyncClients = ({ configOptions, models, cache }: IAgilitySyncConfig): IAgilitySyncClients => {

	const syncClient = agilitySync.getSyncClient({
		guid: configOptions.guid,
		apiKey: configOptions.apiKey,
		isPreview: configOptions.isPreview,
		logLevel: configOptions.logLevel,
		debug: false,
		channels: configOptions.sitemaps.split(","),
		languages: configOptions.locales.split(","),
		store: {
			interface: syncInterfaceNetlify,
			options: {
				options: {
					models,
					cache,
					preview: configOptions.isPreview
				},
			},
		},
	});




	return {
		syncClient
	}

}