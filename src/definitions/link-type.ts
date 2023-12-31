export const defineLinkField = (define: any) => {
	const AgilityLink = define.object({
		name: "Link",
		fields: {
			href: {
				type: "String",
			},
			target: {
				type: "String",
			},
			text: {
				type: "String",
			}
		},
	});

	return AgilityLink
}