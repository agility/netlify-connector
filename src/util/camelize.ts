
export const camelize = (str: string) => {

	// const firstChar = str.charAt(0).toLowerCase();
	// const rest = str.slice(1);
	// return `${firstChar}${rest}`


	let retStr = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
		return index === 0 ? word.toLowerCase() : word.toUpperCase();
	}).replace(/\s+/g, '').replaceAll("_", "");

	if (retStr.endsWith("ID")) {
		retStr = `${retStr.slice(0, -2)}Id`
	}

	console.log("Camelize: ", str, retStr)

	return retStr

}