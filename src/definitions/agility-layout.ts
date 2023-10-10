import { outputMessage } from "../util/log"

export const defineAgilityLayout = (define: any) => {

	// #region *** ExtraTypes for Layouts ***
	const AgilityLayoutProperties = define.object({
		name: "LayoutProperties",
		fields: {
			state: {
				type: "Int",
			},
			modified: {
				type: "Date",
			},
			versionId: {
				type: "Int",
			},
			preview: {
				type: "Boolean",
				required: true
			},
			locale: {
				type: "String",
				required: true
			},
		}
	})

	const AgilityLayoutVisibility = define.object({
		name: "LayoutVisibility",
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
		name: "LayoutSeo",
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
		name: "LayoutScripts",
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
	const AgilityDynamicLayout = define.object({
		name: "DynamicLayout",
		fields: {
			referenceName: {
				type: "String"
			},
			fieldName: {
				type: "String"
			},
			titleFormula: {
				type: "String",
			},
			menuTextFormula: {
				type: "String",
			},
			pageNameFormula: {
				type: "String",
			},
			visibleOnMenu: {
				type: "Boolean",
			},
			visibleOnSitemap: {
				type: "Boolean",
			},
		}
	})

	//#endregion END ExtraTypes
	outputMessage("Adding Layout Model...")
	define.nodeModel({
		name: "Layout",
		cacheFieldName: "versionId",
		fields: {
			pageId: {
				type: "Int",
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
			dynamic: {
				type: AgilityDynamicLayout,
				required: false
			},
			name: {
				type: "String",
			},
			path: {
				type: "String",
			},
			title: {
				type: "String",
			},
			menuText: {
				type: "String"
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
			zones: {
				type: "JSON"
			}
		}
	})


}