import agilitySync from "@agility/content-sync"
//let syncInterfaceGatsby = require("./agility-sync-interface.cjs");
import agilityAPI from '@agility/content-fetch'
import { getModels } from "./agility-get-models";

interface IAgilitySyncConfig {
	configOptions: Record<string, any>
}

export const syncAgilityContent = async ({ configOptions }: IAgilitySyncConfig) => {

	const fetchApiClient = agilityAPI.getApi({
		guid: configOptions.guid,
		apiKey: configOptions.fetchAPIToken
	});


	const previewApiClient = agilityAPI.getApi({
		guid: configOptions.guid,
		apiKey: configOptions.previewAPIToken,
		isPreview: true
	});

	console.log("fetchApiClient", fetchApiClient)

	// const syncClient = agilitySync.getSyncClient({
	// 	guid: configOptions.guid,
	// 	apiKey: configOptions.apiKey,
	// 	isPreview: configOptions.isPreview,
	// 	debug: configOptions.debug,
	// 	baseUrl: configOptions.baseUrl,
	// 	channels: channelsRefs,
	// 	languages: languageCodes,
	// 	store: {
	// 		//use gatsby sync interface
	// 		interface: syncInterfaceGatsby,
	// 		options: {
	// 			getNode,
	// 			createNodeId,
	// 			createNode,
	// 			createContentDigest,
	// 			deleteNode,
	// 		},
	// 	},
	// });

}