import { outputMessage } from "../util/log"

export const defineAgilitySitemaps = (define: any) => {

	outputMessage("Adding Sitemap Models...")

	//sitemaps are a single JSON field
	define.document({
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

	define.document({
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
