import { outputMessage } from "../util/log"

export const defineAgilityRedirection = (define: any) => {

	outputMessage("Adding Redirection Model...")

	define.nodeModel({
		name: "Redirections",
		fields: {
			items: {
				type: "JSON",
				required: true
			}
		}
	})


}