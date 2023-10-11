export const defineLinkedList = (define: any) => {
	const AgilityLinkedList = define.object({
		name: "LinkedList",
		fields: {
			referenceName: {
				type: "String",
			},
		},
	});

	return AgilityLinkedList
}