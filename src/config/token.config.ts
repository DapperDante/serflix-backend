import jwt from 'jsonwebtoken';
import { tokenLogUser, tokenAuthentication, tokenPassword, tokenLogProfile } from '../interface/token.api';
import { ENV_SETUP } from './variables.config';

const tokenLoginLifeTime = "4h";
const tokenAuthenticationLifeTime = "2h";
const tokenPasswordLifeTime = "1h";

export const createTokenLogUser = (idUser: number, email: string): string =>{
	const data: tokenLogUser = {
		idUser,
		email,
		type: 1
	}
	return jwt.sign(data, ENV_SETUP.SECRET_KEY_TOKEN!, {
		expiresIn: tokenLoginLifeTime
	});
}
export const decodeTokenLogUser = (token:string): tokenLogUser => {
	const decodeToken =  jwt.decode(token, {json:true}) as tokenLogUser;
	if(decodeToken.type > 2){
		throw new Error("Invalid token type");
	}
	return decodeToken;
}
export const createTokenLogProfile = (idUser: number, email: string, idProfile: number) =>{
	const data: tokenLogProfile = {
		idUser, 
		email,
		idProfile,
		type: 2
	};
	return jwt.sign(data, ENV_SETUP.SECRET_KEY_TOKEN!, {
		expiresIn: tokenLoginLifeTime
	});
}
export const decodeTokenLogProfile = (token: string): tokenLogProfile => {	
	const decodeToken = jwt.decode(token, {json:true}) as tokenLogProfile;
	if(decodeToken.type !== 2){
		throw new Error("Invalid token type");
	}
	return decodeToken;
}
export const createTokenAuthentication = (idUser: number, username: string): string =>{
	const data: tokenAuthentication = {
			idUser,
			username,
			type: 3
	}
	return jwt.sign(data, ENV_SETUP.SECRET_KEY_TOKEN!, {
		expiresIn: tokenAuthenticationLifeTime
	})
}

export const decodeTokenAuthentication = (token:string): tokenAuthentication => {
	const decodeToken = jwt.decode(token, {json:true}) as tokenAuthentication;
	if(decodeToken.type !== 3){
		throw new Error("Invalid token type");
	}
	return decodeToken;
}

export const createTokenPassword = (idUser: number, username: string): string =>{
	const data: tokenPassword = {
		idUser,
		username,
		type: 4
	}
	return jwt.sign(data, ENV_SETUP.SECRET_KEY_TOKEN!, {
		expiresIn: tokenPasswordLifeTime
	});
}

export const decodeTokenPassword = (token: string): tokenPassword =>{
	const decodeToken = jwt.decode(token, {json:true}) as tokenPassword;
	if(decodeToken.type !== 4){
		throw new Error("Invalid token type");
	}
	return decodeToken;
}