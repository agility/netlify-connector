export const defineFileAttachment = (define: any) => {
	const AgilityFileAttachment = define.object({
		name: "AgilityFileAttachment",
		fields: {
			label: {
				type: "String",
			},
			url: {
				type: "String",
			},
			target: {
				type: "String",
			},
			filesize: {
				type: "Int",
			}
		},
	});

	return AgilityFileAttachment
}