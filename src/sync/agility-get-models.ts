import axios from "axios"
import https from "https"
import { MODELS_CACHE_KEY } from "../constants"
import { ModelsResponse } from "../types/ModelsResponse"
import { outputError, outputMessage } from "../util/log"


interface Props {
	apiClient: any
	cache: any
}


export const getModels = async ({ apiClient, cache }: Props) => {

	let agilityModels: ModelsResponse | null = await cache.get(MODELS_CACHE_KEY) as ModelsResponse | null

	const lastModified = agilityModels?.lastModified || ""

	//get the server for an update
	const agilityModelsResponse = await getModelsFromAgility(apiClient, lastModified)

	if (agilityModelsResponse && agilityModelsResponse?.isUpToDate === false) {
		//if we have a new response, update the cache and return the new value
		await cache.set(MODELS_CACHE_KEY, agilityModelsResponse)
		outputMessage("Got the models from the server")
		return agilityModelsResponse?.data || []
	} else {
		//use the cached value
		outputMessage("Got the models from cache.")
		return agilityModels?.data || []
	}

}

/**
 * Gets the models from Agility
 * @param apiClient
 */
export const getModelsFromAgility = async (apiClient: any, lastModified: string) => {

	const url = `${apiClient.config.baseUrl}/${apiClient.config.isPreview ? "preview" : "fetch"}/contentmodels?lastModifiedDate=${encodeURIComponent(lastModified)}	`

	console.log("*** models url", url)
	try {

		const agent = new https.Agent({
			rejectUnauthorized: false,
		})


		const ret = await axios({
			url,
			method: 'GET',
			headers: {
				'APIKey': apiClient.config.apiKey
			},
			httpsAgent: agent,
			validateStatus: function (status) {
				return status >= 200 && status < 305; // allow a 200 or 304
			}

		})



		if (ret.status === 200) {
			//we need to get the latest
			const lastModStr = ret.headers["x-last-modified"] || null

			return {
				isUpToDate: false,
				lastModified: lastModStr,
				data: ret.data
			}
		} else if (ret.status === 304) {
			//we are up to date
			return {
				isUpToDate: true,
				data: null,
				lastModified: null
			}
		}

	} catch (error) {
		outputError("Could not get the Models from Agility", error)
		return null
	}


}