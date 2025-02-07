import { Request, Response } from "express";
import Users from "../models/users.model";
import { Encrypt, Decrypt } from "../encryptation/Encryptation";
import { ErrorControl } from "../error/error-handling";
import {
	createToken,
	decodeJwt,
} from "../middleware/authentication.middleware";
import sequelize from "../db/connection";
import { QueryTypes } from "sequelize";
import { decrypt } from "dotenv";

export const register = async (req: Request, resp: Response) => {
	try {
		const { username, password, email } = req.body;
		if (!(username && password && email)) throw new Error("sintax_error");
		const passwordEncrypted = Encrypt(password);
		const user = await Users.create({
			username,
			password: passwordEncrypted,
			email,
		});
		const token = createToken(user.dataValues.id);
		const resultEndPoint = {
			msg: "User created",
			token,
		};
		resp.status(201).json(resultEndPoint);
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};

export const login = async (req: Request, resp: Response) => {
	try {
		const { username, password } = req.body;
		if (!(username && password)) throw new Error("sintax_error");
		const user = await Users.findOne({
			where: {
				username,
			},
		});
		if (!user) throw new Error("not_find_user");
		if (password != Decrypt(user.dataValues.password))
			throw new Error("not_match_password");
		const token = createToken(user.dataValues.id);
		const resultEndPoint = {
			msg: "User logged",
			token,
		};
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
export const changePassword = async (req: Request, resp: Response) => {
	try {
		const { oldPassword, newPassword } = req.body;
		if (!(oldPassword && newPassword)) throw new Error("sintax_error");
		const { idUser } = decodeJwt(req.headers.authorization!);
		const passwordEncrypted = await Users.findByPk(idUser);
		if (oldPassword != Decrypt(passwordEncrypted?.dataValues.password))
			throw new Error("not_match_password");
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
		if(query['0'].status == 403)
			throw new Error("not_update_password");
		resp.status(200).json({ msg: "Password updated" });
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
export const changeUsername = async (req: Request, resp: Response) => {
	try {
		const { newUsername } = req.body;
		if (!newUsername) throw new Error("sintax_error");
		const { idUser } = decodeJwt(req.headers.authorization!);
		await Users.update(
			{ username: newUsername },
			{
				where: {
				id: idUser,
				}
			}
		);
		resp.status(200).json({ msg: "Username updated" });	
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
