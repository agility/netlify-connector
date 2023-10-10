import { camelize } from "../util/camelize"
import { MODELS_CACHE_KEY } from "../constants"

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
			if (!model) {

				//if we don't have a specific model for this content definition, then it's a "component"
				models["Component"].create({
					id,
					contentId: item.contentID,
					versionId: item.properties.versionID,
					properties,
					content: item.fields
				})
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

				const fields = {}
				agilityModel.fields.forEach(field => {

					const fieldName = camelize(field.name)
					const propertyName = Object.keys(item.fields).find(key => key.toLowerCase() === fieldName.toLowerCase())
					let fieldValue = item.fields[propertyName]

					if (field.type === "Content") {

						if (fieldValue.contentid) {
							//a single linked content item value
							const linkedContentID = getNodeID({ options, itemType: "item", languageCode, itemID: fieldValue.contentid })
							fieldValue = linkedContentID
						} else {

							console.log(modelReferenceName, "content field", fieldName, fieldValue)
						}
					}

					if (fieldValue !== undefined) {
						fields[fieldName] = fieldValue
					}
				})

				model.create({
					id,
					contentId: item.contentID,
					versionId: item.properties.versionID,
					properties,
					...fields
				})
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



	console.log("***** save sync item id", id, "type:", itemType)
	console.log("***** save sync item", item)

}



const deleteItem = async ({ options, itemType, languageCode, itemID }) => {
	/*
	const nodeID = getNodeID({ options, itemType, languageCode, itemID });
	const node = options.getNode(nodeID);

	if (node) {
		options.deleteNode(node);
	}
	*/
}

const mergeItemToList = async ({ options, item, languageCode, itemID, referenceName, definitionName }) => {
	/*
	//save the item in a list based on the content definition name...
	if (item.properties.state === 3) {
		//handle deletes

		await deleteItem({ options, itemType: definitionName, languageCode, itemID });

	} else {
		//save the item in the list
		await saveItem({ options, item: item, itemType: definitionName, languageCode, itemID });
	}
	*/
}

const getItem = async ({ options, itemType, languageCode, itemID }) => {

	const cache = options.cache
	const preview = options.preview



	if (itemType === "state") {
		//get the state from cache...
		const itemKey = `${itemType} - ${itemID} - ${preview ? "preview" : "fetch"}`
		const retItem = await cache.get(itemKey);

		return retItem;
	} else if (itemType === "urlredirections") {
		//get the last mod date for the url redirections
		const retItem = await cache.get(itemType);
		return retItem
	}

	console.log("getItem", itemType, itemKey, languageCode)

	/*
	const nodeID = getNodeID({ options, itemType, languageCode, itemID });
	const node = await options.getNode(nodeID);
	if (node == null) return null;

	const json = node.internal.content;
	const item = JSON.parse(json);

	return item;
	*/
}

const clearItems = async ({ options }) => {
	//don't need to handle this - gatsby clear will do that for us...
}


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
