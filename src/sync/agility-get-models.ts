
interface Props {
	apiClient: any
}

export const getModels = async ({ apiClient }: Props) => {

	const req = {
		url: `${apiClient.config.isPreview ? "preview" : "fetch"}/contentmodels`,
		method: 'get',
		baseURL: apiClient.config.baseUrl,
		headers: {
			'APIKey': apiClient.config.apiKey
		},
		params: {}
	};

	const ret = apiClient.makeRequest(req);

	return ret

}