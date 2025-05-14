import jwt from 'jsonwebtoken';
import { tokenAccess, tokenAuthentication, tokenPassword, role, tokenProfile } from '../interface/token.interface';
import { ENV_SETUP } from '../config/variables.config';
import { tokenAccessLifeTime, tokenAuthenticationLifeTime, tokenResetPasswordLifeTime } from '../config/token.config';

export const createTokenUser = (idUser: number, email: string): string =>{
	const payload: tokenAccess = {
		idUser,
		email,
		role: role.user
	}
	return jwt.sign(payload, ENV_SETUP.SECRET_KEY_TOKEN!, {
		expiresIn: tokenAccessLifeTime
	});
}
export const createTokenProfile = (idUser: number, email: string, idProfile: number): string =>{
	const payload: tokenProfile = {
		idUser,
		idProfile,
		email,
		role: role.profile,
	}
	return jwt.sign(payload, ENV_SETUP.SECRET_KEY_TOKEN!, {
		expiresIn: tokenAccessLifeTime
	});
}
export const createTokenAuth = (idUser: number, username: string): string =>{
	const payload: tokenAuthentication = {
			idUser,
			username,
			role: role.auth
	}
	return jwt.sign(payload, ENV_SETUP.SECRET_KEY_TOKEN!, {
		expiresIn: tokenAuthenticationLifeTime
	})
}
export const createTokenForgotPassword = (idUser: number, email: string): string =>{
	const payload: tokenPassword = {
		idUser,
		email,
		role: role.forgot_password
	}
	return jwt.sign(payload, ENV_SETUP.SECRET_KEY_TOKEN!, {
		expiresIn: tokenResetPasswordLifeTime
	});
}
export const decodeToken = (token: string): any => {
	const decoded = jwt.verify(token, ENV_SETUP.SECRET_KEY_TOKEN!) as tokenAccess | tokenAuthentication | tokenPassword;
	return decoded;
}