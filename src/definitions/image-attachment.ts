export const defineImageAttachment = (define: any) => {
	const AgilityImageAttachment = define.object({
		name: "AgilityImageAttachment",
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
			},
			height: {
				type: "Int",
			},
			width: {
				type: "Int",
			},
		},
	});

	return AgilityImageAttachment
}