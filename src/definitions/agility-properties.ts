export const defineAgilityProperties = (define: any) => {
	const AgilityProperties = define.object({
		name: "AgilityProperties",
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
			referenceName: {
				type: "String",
			},
			definitionName: {
				type: "String",
			},
			itemOrder: {
				type: "Int",
			},
		},
	});

	return AgilityProperties
}