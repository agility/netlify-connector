export const defineContentSEO = (define: any) => {
	const AgilityContentSeo = define.object({
		name: "ContentSeo",
		fields: {
			metaDescription: {
				type: "String",
			},
			metaKeywords: {
				type: "String",
			},
			metaHtml: {
				type: "String",
			},
			menuVisible: {
				type: "Boolean",
			},
			sitemapVisible: {
				type: "Boolean",
			}
		},
	});

	return AgilityContentSeo
}