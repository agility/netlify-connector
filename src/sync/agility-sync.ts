import agilitySync from "@agility/content-sync"
let syncInterfaceNetlify = require("./agility-sync-interface.cjs");

import { outputMessage } from "../util/log";
import { config } from "chai";

interface IAgilitySyncConfig {
	configOptions: Record<string, any>
	cache: any
	models: Record<string, any>

}

export const syncAgilityContent = async ({ configOptions, cache, models }: IAgilitySyncConfig) => {

	const syncClient = agilitySync.getSyncClient({
		guid: configOptions.guid,
		apiKey: configOptions.apiKey,
		isPreview: configOptions.isPreview,
		debug: false,
		channels: configOptions.sitemaps.split(","),
		languages: configOptions.locales.split(","),
		logLevel: configOptions.logLevel,
		store: {
			//use netlify sync interface
			interface: syncInterfaceNetlify,
			options: {
				models,
				cache,
				preview: false

			},
		},
	});

	const modeStr = configOptions.isPreview ? "preview" : "live"

	outputMessage(`Syncing Agility Content for ${modeStr}...`)

	await syncClient.runSync()

	outputMessage(`Agility Content Syncing for ${modeStr} complete.`)

}