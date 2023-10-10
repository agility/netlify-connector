import { outputMessage } from "../util/log"

export const defineAgilityLayout = (define: any) => {

	// #region *** ExtraTypes for Layouts ***
	const AgilityLayoutProperties = define.object({
		name: "AgilityLayoutProperties",
		fields: {
			state: {
				type: "Int",
			},
			modified: {
				type: "Date",
			},
			versionId: {
				type: "Int",
			}
		}
	})

	const AgilityLayoutVisibility = define.object({
		name: "AgilityLayoutVisibility",
		fields: {
			menu: {
				type: "Boolean",
			},
			sitemap: {
				type: "Boolean",
			}
		}
	})

	const AgilityLayoutSeo = define.object({
		name: "AgilityLayoutSeo",
		fields: {
			metaDescription: {
				type: "String",
			},
			metaKeywords: {
				type: "String",
			},
			metaHtml: {
				type: "String",
			}
		}
	})

	const AgilityLayoutScripts = define.object({
		name: "AgilityLayoutScripts",
		fields: {
			excludedFromGlobal: {
				type: "Boolean",
			},
			top: {
				type: "String",
			},
			bottom: {
				type: "String",
			}
		}
	})

	//#endregion END ExtraTypes
	outputMessage("Adding Layout Model...")
	define.nodeModel({
		name: "AgilityLayout",
		cacheFieldName: "versionId",
		fields: {
			isAgilityPreview: {
				type: "Boolean",
				required: true
			},
			properties: {
				type: AgilityLayoutProperties,
				required: true
			},
			versionId: {
				type: "String",
				required: true
			},
			visible: {
				type: AgilityLayoutVisibility,
				required: true
			},
			seo: {
				type: AgilityLayoutSeo,
				required: true
			},
			scripts: {
				type: AgilityLayoutScripts,
				required: true
			},
			name: {
				type: "String",
				required: true
			},
			path: {
				type: "String",
				required: false
			},

			title: {
				type: "String",
				required: true
			},
			menuText: {
				type: "String",
				required: true
			},

			pageType: {
				type: "String",
				required: true
			},
			templateName: {
				type: "String",
				required: false
			},

			redirectUrl: {
				type: "String",
				required: false
			},

			securePage: {
				type: "Boolean",
				required: true
			},

			excludeFromOutputCache: {
				type: "Boolean",
				required: true
			},
		}
	})


}