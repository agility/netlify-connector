import agilitySync from "@agility/content-sync"
let syncInterfaceNetlify = require("./agility-sync-interface.cjs");
import agilityAPI from '@agility/content-fetch'
import { config } from "chai";

interface IAgilitySyncConfig {
	configOptions: Record<string, any>
	models?: Record<string, any>

}

interface IAgilityClients {
	apiClient: any
	syncClient: any
}

export const getAgilityAPIClients = ({ configOptions, models }: IAgilitySyncConfig): IAgilityClients => {

	const baseUrl = null //"https://localhost:5001"

	const apiClient = agilityAPI.getApi({
		guid: configOptions.guid,
		apiKey: configOptions.apiKey,
		isPreview: configOptions.isPreview,
		baseUrl
	});


	const syncClient = agilitySync.getSyncClient({
		guid: configOptions.guid,
		apiKey: configOptions.apiKey,
		isPreview: configOptions.isPreview,
		logLevel: configOptions.logLevel,
		debug: false,
		channels: configOptions.sitemaps.split(","),
		languages: configOptions.locales.split(","),
		store: {
			//use netlify sync interface
			interface: syncInterfaceNetlify,
			options: {
				models
			},
		},
	});




	return {
		apiClient,
		syncClient,
	}

}