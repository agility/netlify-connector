import { getModels } from "../sync/agility-get-models"
import { camelize } from "../util/camelize"
import { outputMessage } from "../util/log"
import { defineAgilityProperties } from "./agility-properties"
import { defineFileAttachment } from "./file-attachment"
import { defineImageAttachment } from "./image-attachment"
import { defineLinkField } from "./link-type"

interface Props {
	define: any
	fetchApiClient: any
	cache: any
}

export const defineAgilityModels = async ({ define, cache, fetchApiClient }: Props) => {

	const AgilityFileAttachment = defineFileAttachment(define)
	const AgilityImageAttachment = defineImageAttachment(define)
	const AgiltyLinkField = defineLinkField(define)
	const AgilityProperties = defineAgilityProperties(define)

	//define a generic model for Components
	define.nodeModel({
		name: "Component",
		fields: {
			//every type has an Agility properties type and a special cache field based on the version ID and the typename
			contentId: {
				type: "Int",
				required: true
			},
			versionId: {
				type: "String",
				required: true
			},
			properties: {
				type: AgilityProperties,
				required: true
			},
			content: {
				type: "JSON",
				required: true
			}
		}
	});

	//get the content models from Agility (or cache)
	const agilityModels = await getModels({ apiClient: fetchApiClient, cache })

	Object.keys(agilityModels).forEach(modelID => {
		//create the models from Agility

		const model = agilityModels[modelID]

		outputMessage("Adding Model: ", model.referenceName)

		//build the fields first
		let fields: any = {
			//every type has an Agility properties type and a special cache field based on the version ID and the typename
			contentId: {
				type: "Int",
				required: true
			},
			versionId: {
				type: "String",
				required: true
			},
			properties: {
				type: AgilityProperties,
				required: true
			}
		}

		model.fields.forEach((field: any) => {

			const fieldName = camelize(field.name)

			const modelID = parseInt(field.settings.ContentDefinition || "0")
			const renderAs = field.settings.RenderAs || null
			let linkedModelName = null
			if (!isNaN(modelID) && modelID > 0) {
				//this is a linked content field
				const linkedModel = agilityModels[modelID]
				linkedModelName = linkedModel.referenceName
			}

			fields[fieldName] = {
				type: field.type === "Date" ? "Date"
					: field.type === "Integer" ? "Int"
						: field.type === "Decimal" ? "Float"
							: field.type === "Boolean" ? "Boolean"
								: field.type === "FileAttachment" ? AgilityFileAttachment
									: field.type === "ImageAttachment" ? AgilityImageAttachment
										: field.type === "Link" ? AgiltyLinkField
											: field.type === "Content" && linkedModelName ? linkedModelName
												: "String",
				required: field.type === "Link" ? false : field.settings.Required === "True",
				list: field.type !== "Link" ? false : renderAs === "dropdown" ? false : true,
			}
		});

		define.nodeModel({
			name: model.referenceName,
			cacheFieldName: "versionId",
			fields
		});

	})
}