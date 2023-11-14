import { outputMessage } from "../util/log"

export const defineAgilitySitemaps = (define: any) => {

	outputMessage("Adding Sitemap Models...")

	//sitemaps are a single JSON field
	define.nodeModel({
		name: "SitemapFlat",
		fields: {
			referenceName: {
				type: "String",
				required: true
			},
			locale: {
				type: "String",
				required: true
			},
			nodes: {
				type: "JSON",
				required: true
			}
		}
	})

	define.nodeModel({
		name: "SitemapNested",
		fields: {
			referenceName: {
				type: "String",
				required: true
			},
			locale: {
				type: "String",
				required: true
			},
			nodes: {
				type: "JSON",
				required: true
			}
		}
	})






}