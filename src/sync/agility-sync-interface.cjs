import { camelize } from "../util/camelize"
import { MODELS_CACHE_KEY } from "../constants"

/*****************************************************************
 * This file is a plugin for the Agility Sync SDK
 * It provides the following methods
 * - saveItem - save an item
 * - deleteItem - deletes an item
 * - getItem - gets an item (only used for a couple things)
 *******************************************************************/


/**
 * Save an item to the persistence layer.
 * For most items, it's the GraphQL layer, but for state, it's the cache
 *
 * @param {
 * 	options: object - the options object passed into the sync - this has te cache, models, and whether we are in preview mode
 * 	itemType: string - the type of item being synced (item, page, etc)
 * 	languageCode: string - the locale code of this item
 * 	itemID: string - the ID (from Agility ) of this item
 * } param0
 * @returns
 */
const saveItem = async ({ options, item, itemType, languageCode, itemID }) => {

	const cache = options.cache
	const preview = options.preview
	const models = options.models

	const id = getNodeID({ options, itemType, languageCode, itemID });

	switch (itemType) {
		case "state":
			//state is special we store it in the cache...
			const itemKey = `${itemType} - ${itemID} - ${preview ? "preview" : "fetch"}`
			await cache.set(itemKey, item);
			return
		case "item": {

			const properties = {
				preview,
				locale: languageCode,
				state: item.properties.state,
				modified: item.properties.modified,
				versionId: item.properties.versionID,
				referenceName: item.properties.referenceName,
				definitionName: item.properties.definitionName,
				itemOrder: item.properties.itemOrder
			}
			const modelReferenceName = item.properties.definitionName
			const model = models[modelReferenceName]

			let netlifyModelName = modelReferenceName

			if (!model) {

				//if we don't have a specific model for this content definition, then it's a "component"
				models["Component"].create({
					id,
					contentId: item.contentID,
					versionId: item.properties.versionID,
					properties,
					content: item.fields
				})

				netlifyModelName = "Component"

			} else {

				//TODO: handle linked content fields...
				let agilityModels = await cache.get(MODELS_CACHE_KEY)

				if (!agilityModels || !agilityModels.data) {
					outputError("Unable to find models in cache for content items...")
					return
				}

				//get the model for this item...
				const agilityModel = Object.keys(agilityModels.data).map(key => agilityModels.data[key]).find(m => m.referenceName === modelReferenceName)

				if (!agilityModel) {
					outputError(`Unable to find the Agility models in cache for ${modelReferenceName}...`)
					return
				}

				const seo = item.seo || null
				if (seo) {
					seo.metaHtml = seo.metaHTML
					delete seo.metaHTML
				}

				const fields = {}
				agilityModel.fields.forEach(field => {

					const fieldName = camelize(field.name)
					const propertyName = Object.keys(item.fields).find(key => key.toLowerCase() === fieldName.toLowerCase())
					let fieldValue = item.fields[propertyName]

					if (field.type === "Content") {


						if (fieldValue?.contentid) {
							//a single linked content item value
							const linkedContentID = getNodeID({ options, itemType: "item", languageCode, itemID: fieldValue.contentid })
							fieldValue = linkedContentID
						} else if (fieldValue?.sortids) {
							//a multi linked content item value
							fieldValue = fieldValue.sortids
								.split(",")
								.map(contentID => getNodeID({ options, itemType: "item", languageCode, itemID: contentID }))
						} else if (fieldValue?.referencename) {
							fieldValue = {
								referenceName: fieldValue.referencename
							}
						} else {
							console.warn("******* unknown linked content model", modelReferenceName, "content field", fieldName, fieldValue)
						}
					}

					if (fieldValue !== undefined) {
						fields[fieldName] = fieldValue
					}
				})

				//save the actual item
				model.create({
					id,
					contentId: item.contentID,
					versionId: item.properties.versionID,
					properties,
					seo: item.seo || null,
					...fields
				})

				//save the ID in a lookup table so we can find it's referenceName later if we need to delete it...
				cache.set(id, netlifyModelName)


			}
			return
		}
		case "nestedsitemap":
			models["SitemapNested"].create({
				id,
				referenceName: itemID,
				locale: languageCode,
				preview,
				nodes: item
			})
			return
		case "sitemap":
			models["SitemapFlat"].create({
				id,
				referenceName: itemID,
				locale: languageCode,
				preview,
				nodes: item
			})
			return
		case "page":
			item.properties.versionId = item.properties.versionID
			delete item.properties.versionID

			models["Layout"].create({
				id,
				pageId: item.pageID,
				versionId: item.properties.versionId.toString(),
				properties: {
					preview,
					locale: languageCode,
					...item.properties
				},
				visible: item.visible,
				scripts: item.scripts,
				seo: {
					metaDescription: item.metaDescription,
					metaKeywords: item.metaKeywords,
					metaHtml: item.metaHtml
				},
				name: item.name,
				path: item.path,
				title: item.title,
				menuText: item.menuText,
				pageType: item.pageType,
				templateName: item.templateName,
				redirectUrl: item.redirectUrl,
				securePage: item.securePage,
				excludeFromOutputCache: item.excludeFromOutputCache,
				zones: item.zones,
				dynamic: item.dynamic

			})
			return
		case "urlredirections": {

			//add the full object to the cache so we can track the lastAccessDate
			await cache.set(itemType, item);

			//add the redirection items to graphql
			models["Redirections"].create({
				id,
				items: item.items
			})
			return
		}
	}


}


/**
 * Delete an item from storage
 * @param {
 * 	options: object - the options object passed into the sync
 * 	itemType: string - the type of item being synced (item, page, etc)
 * 	languageCode: string - the locale code of this item
 * 	itemID: string - the ID (from Agility ) of this item
 * } param0

 */
const deleteItem = async ({ options, itemType, languageCode, itemID }) => {

	const cache = options.cache
	const preview = options.preview
	const models = options.models

	const id = getNodeID({ options, itemType, languageCode, itemID });

	switch (itemType) {
		case "state":
			//state is special we store it in the cache...
			const itemKey = `${itemType} - ${itemID} - ${preview ? "preview" : "fetch"}`
			await cache.del(itemKey);
			return
		case "item": {
			const modelReferenceName = await cache.get(id)

			const model = models[modelReferenceName]
			if (model) {
				model.delete(id)
			}
			await cache.del(id)
			return
		}
		case "nestedsitemap":
			models["SitemapNested"].delete(id)
			return
		case "sitemap":
			models["SitemapFlat"].delete(id)
			return
		case "page":
			models["Layout"].delete(id)
			return
		case "urlredirections": {

			//add the full object to the cache so we can track the lastAccessDate
			await cache.del(itemType);

			//add the redirection items to graphql
			models["Redirections"].delete(id)
			return
		}
	}


}


const mergeItemToList = async ({ options, item, languageCode, itemID, referenceName, definitionName }) => {
	//we don't need to do this
	//this method is only used when we want to store content items in a list separately
}

/**
 * Get an item from the persisted storage (in this case, we only need to get stuff from cache)
 * @param {
 * 	options: object - the options object passed into the sync
 * 	itemType: string - the type of item being synced (item, page, etc)
 * 	languageCode: string - the locale code of this item
 * 	itemID: string - the ID (from Agility ) of this item
 * } param0
 * @returns
 */
const getItem = async ({ options, itemType, languageCode, itemID }) => {

	const cache = options.cache
	const preview = options.preview

	const id = getNodeID({ options, itemType, languageCode, itemID });

	if (itemType === "state") {
		//get the state from cache...
		const itemKey = `${itemType} - ${itemID} - ${preview ? "preview" : "fetch"}`
		const retItem = await cache.get(itemKey);

		return retItem;
	} else if (itemType === "urlredirections") {
		//get the last mod date for the url redirections
		const retItem = await cache.get(itemType);
		return retItem
	} else if (itemType === "item") {
		const definitionName = await cache.get(id)

		if (!definitionName) return null

		//return a fake content item that is ONLY used to check the item is available before deleting it...
		return {
			contentID: itemID,
			properties: {
				definitionName
			}
		}
	}

}

const clearItems = async ({ options }) => {
	//don't need to handle this - the 'yarn clear' cmd will do that for us...
}


/**
 * Generate a proper node id for Netlify so that it will have all the info about an item to make it unique
 * @returns the node id
 */
const getNodeID = ({ options, itemType, languageCode, itemID }) => {
	return `agility.${options.preview ? "preview" : "fetch"}.${languageCode}.${itemType}.${itemID}`.toLowerCase();

}


module.exports = {
	saveItem,
	deleteItem,
	mergeItemToList,
	getItem,
	clearItems
}
