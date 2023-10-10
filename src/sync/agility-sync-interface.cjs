import { camelize } from "../util/camelize"

const saveItem = async ({ options, item, itemType, languageCode, itemID }) => {

	const cache = options.cache
	const preview = options.preview
	const models = options.models

	const itemKey = `${itemType}-${itemID}-${preview ? "preview" : "fetch"}`
	const id = getNodeID({ options, itemType, languageCode, itemID });

	switch (itemType) {
		case "state":
			//state is special we store it in the cache...
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
			console.log("***** save sync item", item.properties)
			const model = models[item.properties.definitionName]
			if (!model) {

				console.log("no model found for content definition", item.properties.definitionName)

				//if we don't have a specific model for this content definition, then it's a "component"
				models["Component"].create({
					id,
					contentId: item.contentID,
					versionId: item.properties.versionID,
					properties,
					content: item.fields
				})
			} else {
				console.log("***** save sync item", item)

				const fields = {}
				for (const key in item.fields) {
					const fieldName = camelize(key)
					fields[fieldName] = item.fields[key]
				}

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
				layoutId: item.pageID,
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
	}



	console.log("***** save sync item id", id, "type:", itemType)
	//console.log("***** save sync item", item)




	/*

	let nodeObj = {
		languageCode: languageCode,
		itemID: itemID
	}

	//rename 'fields' to 'customFields', because 'fields' is a reserved name
	if (item.fields) {
		item.customFields = item.fields;
		delete item.fields;
	}

	switch (itemType) {
		case "item": {
			nodeObj.itemJson = "";
			break;
		}
		case "page": {
			nodeObj.pageJson = "";
			break;
		}
		case "state": {
			break;
		}
		case "sitemap": {
			break;
		}
		case "urlredirections":{
			break;
		}
		case "nestedsitemap": {
			//we can't store an array...
			item = { nodes: item };
			break;
		}
		default: {
			//a content 'list'...
			item.languageCode = languageCode;
			item.itemID = itemID;
			nodeObj = item;
		}

	}

	const jsonContent = JSON.stringify(item);
	const nodeMeta = {
		id: nodeID,
		parent: null,
		children: [],
		internal: {
			type: typeName,
			content: jsonContent,
			contentDigest: options.createContentDigest(item)
		}
	}

	const nodeToCreate = Object.assign({}, nodeObj, nodeMeta);

	await options.createNode(nodeToCreate);
	*/
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

	const itemKey = `${itemType}-${itemID}-${preview ? "preview" : "fetch"}`

	if (itemType === "state") {
		const retItem = await cache.get(itemKey);
		console.log("***** get sync state", itemKey, retItem)
		return retItem;
	}

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
