
import chalk from 'chalk';
const log = console.log;

const agilityMsgTitle = chalk.bgHex("#DECCF6").hex('#4F00BF').bold('Agility:')
const agilityMsg = chalk.bgHex("#F3F4F6").hex('#000000')
const agilityError = chalk.bgHex("#FEE2E2").hex('#991B1B')

const getLogLevel = () => {
	const logLevel = (process.env.AGILITY_LOG_LEVEL || 'warning').toLowerCase();

	if (logLevel !== 'debug' && logLevel !== 'info' && logLevel !== 'warning' && logLevel !== 'error' && logLevel !== 'none') {
		return 'warning';
	}

	return logLevel;

}


export const outputMessage = (message?: any, ...optionalParams: any[]) => {

	const logLevel = getLogLevel()

	if (logLevel === 'debug' || logLevel === 'info') {
		log(agilityMsgTitle, agilityMsg(message, optionalParams));
	}

}

export const outputError = (message?: any, ...optionalParams: any[]) => {

	const logLevel = getLogLevel()

	if (logLevel === 'debug' || logLevel === 'info' || logLevel === 'warning' || logLevel === 'error') {
		log(agilityMsgTitle, agilityError(message, optionalParams));
	}

}