import { Request, Response } from "express";
import Users from "../models/users.model";
import { Encrypt, Decrypt } from "../encryptation/Encryptation";
import {
	ErrorControl
} from "../error/error-handling";
import { createToken } from "../middleware/authentication.middleware";

export const register = async (req: Request, resp: Response) => {
	try {
		const { username, password, email } = req.body;
		if (!(username && password && email)) throw new Error("sintax_error");
		const passwordEncrypted = Encrypt(password);
		const user = await Users.create({ username, password: passwordEncrypted, email });
		const token = createToken(user.dataValues.id);
		resp
		.status(201).json({ msg: "User created", token });
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
				username
			},
		});
		if (!user) throw new Error("not_find_user");
		if (password != Decrypt(user.dataValues.password))
			throw new Error("not_match_password");
		const token = createToken(user.dataValues.id);
		resp
		.status(200).json({ msg: "User logged", token });
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
