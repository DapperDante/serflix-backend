import nodemailer from 'nodemailer';
import { ENV_SETUP } from '../config/variables.config';
const transport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: ENV_SETUP.EMAIL,
		pass: ENV_SETUP.PASSWORD_EMAIL
	}
});
export default transport;