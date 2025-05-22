import sequelize from "../db/connection";
import { NextFunction, Request, Response } from "express";
import { Encrypt, VerifyPassword } from "../security/Encryptation";
import { QueryTypes } from "sequelize";
import { createTokenAuth, createTokenForgotPassword, createTokenUser } from "../security/token";
import { spApi } from "../interface/sp.interface";
import { SpError, SyntaxError } from "../error/errors";
import { sendEmailtoAuthenticate, sendEmailtoNotifyUpdatePassword, sendEmailToForgotPassword, sendEmailtoWelcome } from "../email/email";

export const signup = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { username, password, email } = req.body;
		if (!(username && password && email)) 
			throw new SyntaxError("username, password and email are required");
		const passwordEncrypted = Encrypt(password);
		const [query]: any[] = await sequelize.query(
			`CALL add_user(:username, :email, :passwordEncrypted);`,
			{
				replacements: {
					username,
					passwordEncrypted,
					email
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		const resultEndPoint = {
			msg: "User created"
		};
		const token = createTokenAuth(resultSp.result.id, email, username);
		sendEmailtoAuthenticate(email, username, token);
		resp.status(201).json(resultEndPoint);
	} catch (error: any) {
		next(error)
	}
};
export const login = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { username, password } = req.body;
		if (!(username && password)) 
			throw new SyntaxError("username and password are required");
		const [query]: any[] = await sequelize.query(
			`CALL get_user_by_username(:username)`,
			{
				replacements: {
					username
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code){
			if(resultSp.error_code == 45000){
				VerifyPassword(password, resultSp.result.password);
				const tokenToAuthenticate = createTokenAuth(resultSp.result.id, resultSp.result.email, resultSp.result.username);
				sendEmailtoAuthenticate(resultSp.result.email, username, tokenToAuthenticate)
				throw new SpError(resultSp.message);
			}
			throw new SpError(resultSp.message);
		}
		VerifyPassword(password, resultSp.result.password);
		const token = createTokenUser(resultSp.result.id, resultSp.result.email);
		const resultEndPoint = {
			msg: "User logged",
			first_time: resultSp.result.is_first_time == 1 ? true : false,
			token,
		};
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};
export const updateToPremium = async (req: Request, resp: Response, next: NextFunction) =>{
	try{
		const { idUser } = req.user;
		await sequelize.query(
			`CALL change_to_premium(:idUser)`,
			{
				replacements: {
					idUser
				},
				type: QueryTypes.RAW
			}
		);
		const resultEndPoint = {
			msg: "User is now premium",
		};
		resp.status(200).json(resultEndPoint);
	}catch(error: any){
		next(error);
	}
};
export const updateToFree = async (req: Request, resp: Response, next: NextFunction) =>{
	try{
		const { idUser } = req.user;
		await sequelize.query(
			`CALL change_to_free(:idUser)`,
			{
				replacements: {
					idUser
				},
				type: QueryTypes.RAW
			}
		);
		const resultEndPoint = {
			msg: "User is now free",
		};
		resp.status(200).json(resultEndPoint);
	}catch(error: any){
		next(error);
	}
};
export const updatePassword = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { oldPassword, newPassword } = req.body;
		if (!(oldPassword && newPassword)) 
			throw new SyntaxError("oldPassword and newPassword are required");
		const { idUser, email } = req.user;
		const [queryAux]: any = await sequelize.query(
			`
			SELECT password FROM users WHERE id = :idUser;
			`, 
			{
				replacements: {
					idUser
				}
			}
		);
		const passwordEncrypted = queryAux['0'].password;
		VerifyPassword(oldPassword, passwordEncrypted);
		const newPasswordEncrypted = Encrypt(newPassword);
		const [query]: any[] = await sequelize.query(
			`
			CALL update_password(:idUser, :newPasswordEncrypted);
			`,
			{
				replacements: {
					idUser,
					newPasswordEncrypted
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		sendEmailtoNotifyUpdatePassword(email);
		const resultEndPoint = {
			msg: "Password updated",
		};
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};
export const updateUsername = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { newUsername } = req.body;
		if (!newUsername) 
			throw new SyntaxError("newUsername is required");
		const { idUser } = req.user;
		const [query]: any[] = await sequelize.query(
			`
			CALL update_username(:idUser, :newUsername);
			`, {
				replacements: {
					idUser,
					newUsername
				}, 
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		const resultEndPoint = {
			msg: "Username updated"
		}
		resp.status(200).json(resultEndPoint);	
	} catch (error: any) {
		next(error);
	}
};
export const updateFirstTime = async (req: Request, resp: Response, next: NextFunction) => {
	try{
		const { idUser } = req.user;
		const [query]: any = await sequelize.query(
			`CALL update_first_time(:idUser)`,
			{
				replacements: {
					idUser
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		const resultEndPoint = {
			msg: "First time updated"
		}
		resp.status(200).json(resultEndPoint);
	}catch(error: any){
		next(error);
	}
};
export const requestForgotPassword = async (req: Request, resp: Response, next: NextFunction) => {
	try{
		const { email } = req.body;
		if (!email) 
			throw new SyntaxError("email is required");
		const [query]: any = await sequelize.query(
			`
			CALL get_user_by_email(:email);
			`, {
				replacements: {
					email
				}, 
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code && resultSp.error_code != 45000)
			throw new SpError(resultSp.message);
		const token = createTokenForgotPassword(resultSp.result.id, email);
		sendEmailToForgotPassword(email, resultSp.result.username, token);
		const resultEndPoint = {
			msg: "Email sent"
		}
		resp.status(200).json(resultEndPoint);
	}catch(error: any){
		next(error);
	}
};
export const forgotPassword = async (req: Request, resp: Response, next: NextFunction) => {
	try{
		const { newPassword } = req.body;
		if (!newPassword) 
			throw new SyntaxError("newPassword is required");
		const { idUser } = req.user;
		const [query]: any[] = await sequelize.query(
			`
			CALL update_password(:idUser, :newPasswordEncrypted);
			`, {
				replacements: {
					idUser,
					newPasswordEncrypted: Encrypt(newPassword)
				}, 
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		sendEmailtoNotifyUpdatePassword(req.user.email);
		const resultEndPoint = {
			msg: "Password updated"
		}
		resp.status(200).json(resultEndPoint);
	}catch(error: any){
		next(error);
	}
};
export const authenticate = async (req: Request, resp: Response, next: NextFunction) => {
	try{
		const { idUser } = req.user;
		const [query]: any[] = await sequelize.query(
			`
			CALL authenticate_user(:idUser);
			`, {
				replacements: {
					idUser
				}, 
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		const resultEndPoint = {
			msg: "User authenticated"
		}
		sendEmailtoWelcome(req.user.email);
		resp.status(200).json(resultEndPoint);
	}catch(error: any){
		next(error);
	}
};
export const resetPassword = async (req: Request, resp: Response, next: NextFunction) => {
	try{
		const { newPassword } = req.body;
		if (!newPassword)	
			throw new SyntaxError("newPassword is required");
		const { idUser } = req.user;
		const [query]: any[] = await sequelize.query(
			`
			CALL update_password(:idUser, :newPasswordEncrypted);
			`, 
			{
				replacements: {
					idUser, 
					newPasswordEncrypted: Encrypt(newPassword)
				},
				type: QueryTypes.SELECT
			}
		);
		query
		const resultEndPoint = {
			msg: "Password updated"
		}
		resp.status(200).json(resultEndPoint);
	}catch(error: any){
		next(error);
	}
};