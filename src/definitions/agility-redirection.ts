import { outputMessage } from "../util/log"

export const defineAgilityRedirection = (define: any) => {

	outputMessage("Adding Redirection Model...")

	define.document({
		name: "Redirections",
		fields: {
			items: {
				type: "JSON",
				required: true
			}
		}
	})


}
