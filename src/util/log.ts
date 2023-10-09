
import chalk from 'chalk';
const log = console.log;

const agilityMsgTitle = chalk.bgHex("#DECCF6").hex('#4F00BF').bold('Agility:')
const agilityMsg = chalk.bgHex("#F3F4F6").hex('#000000')
const agilityError = chalk.bgHex("#FEE2E2").hex('#991B1B')

export const outputMessage = (message?: any, ...optionalParams: any[]) => {

	log(agilityMsgTitle, agilityMsg(message, optionalParams));

}

export const outputError = (message?: any, ...optionalParams: any[]) => {

	log(agilityMsgTitle, agilityError(message, optionalParams));

}