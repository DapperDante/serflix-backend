import path from 'path';
import { ENV_SETUP } from '../config/variables.config';
import transport from './email-config';
import fs from 'fs';

const DIR_TEMPLATES = './template';

export const sendEmailtoAuthenticate = async (email: string, username: string, token: string) =>{
	const htmlWithCssTemplate = await getTemplate('auth-user');
	const dataToTemplate = [
		{var: '{TOKEN}', value: token},
		{var: '{API}', value: `${ENV_SETUP.API_SERFLIX}/auth`},
		{var: '{USERNAME}', value: username}
	];
	const htmlWithDataEmbedded = replaceDataOnTemplate(htmlWithCssTemplate, dataToTemplate);
	const mailOptions = {
		from: ENV_SETUP.EMAIL,
		to: email,
		subject: 'Serflix | Authentication',
		html: htmlWithDataEmbedded
	}
	transport.sendMail(mailOptions);
}
export const sendEmailtoWelcome = async (email: string) => {
	const htmlWithCssTemplate = await getTemplate('welcome'); 
	const mailOptions = {
		from: ENV_SETUP.EMAIL,
		to: email,
		subject: 'Serflix | Welcome',
		html: htmlWithCssTemplate
	}
	transport.sendMail(mailOptions);
}
export const sendEmailtoNotifyUpdatePassword = async (email: string) =>{
	const htmlWithCssTemplate = await getTemplate('update-password');
	const mailOptions = {
		from: ENV_SETUP.EMAIL,
		to: email,
		subject: 'Serflix | Change Password',
		html: htmlWithCssTemplate
	}
	transport.sendMail(mailOptions);
}
export const sendEmailToResetPassword = async (email: string, username: string, token: string) =>{
	const htmlWithCssTemplate = await getTemplate('reset-password');
	const dataToTemplate = [
		{var: '{USERNAME}', value: username},
		{var: '{TOKEN}', value: token},
		{var: '{API}', value: `${ENV_SETUP.API_SERFLIX}/reset-password`},
	];
	const htmlWithDataEmbedded = replaceDataOnTemplate(htmlWithCssTemplate, dataToTemplate);
	const mailOptions = {
		from: ENV_SETUP.EMAIL,
		to: email,
		subject: 'Serflix | Reset Password',
		html: htmlWithDataEmbedded
	}
	transport.sendMail(mailOptions);
}
const getTemplate = async (dir: string): Promise<string> =>{
	const pathHtml = path.join(__dirname, `${DIR_TEMPLATES}/${dir}/index.html`);
	const pathCss = path.join(__dirname, `${DIR_TEMPLATES}/${dir}/style.css`);
	const [htmlTemplate, cssTemplate] = 
		await Promise.all([readFile(pathHtml), readFile(pathCss)])
	return htmlTemplate.replace('<link rel="stylesheet" href="style.css">', `<style>${cssTemplate}</style>`);
}
const readFile = (filePath: string): Promise<String> => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, 'utf-8');
    let data = '';
    stream.on('data', (chunk) => {
      data += chunk;
    });
    stream.on('end', () => {
			resolve(data);
    });
    stream.on('error', (err) => {
      reject(err);
    });
  });
};
// If you wanna use a template with variables into it, you can use this function and get a new template with the variables replaced
const replaceDataOnTemplate = (template: string, data: {var: string, value: string}[]) =>{
	data.forEach((d) => {
		template = template.replace(d.var, d.value);
	});
	return template;
}