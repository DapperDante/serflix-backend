import { Request, Response } from "express";
import Profiles from "../models/profiles.model";
import sequelize from "../db/connection";
import { getMovieById } from "../tmdb_api/movies.tmdb";
import { getSeriesById } from "../tmdb_api/series.tmdb";
import {
	ErrorControl
} from "../error/error-handling";
import { createToken, decodeJwt } from "../middleware/authentication.middleware";
export const addProfile = async (req: Request, resp: Response) => {
	try {
		const { name, img } = req.body;
		const { idUser: user_id } = decodeJwt(req.headers["authorization"]!);
		if (!(name && img)) throw new Error("sintax_error");
		const result = await Profiles.create({ user_id, name, img });
		const token = createToken(user_id, result.dataValues.id);
		resp.status(200).json({
			msg: "profile created",
			token
		});
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
export const logInProfile = async (req: Request, resp: Response) => {
	try{
		const { idProfile } = req.body;
		const { idUser } = decodeJwt(req.headers["authorization"]!);
		const token = createToken(idUser, idProfile);
		resp.status(200).json({msg: 'Profile access', token});
	}catch(error:any){
		const {code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
}
export const logOutProfile = async (req: Request, resp: Response) => {
	try{
		const { idUser } = decodeJwt(req.headers["authorization"]!);
		const token = createToken(idUser);
		resp.status(200).json({msg: 'Profile agress', token});
	}catch(error:any){
		const {code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
}
export const getProfiles = async (req: Request, resp: Response) => {
	try {
		const { idUser: user_id } = decodeJwt(req.headers["authorization"]!);
		const results = await Profiles.findAll({
			attributes: ["id", "name", "img"],
			where: {
				user_id,
			},
		});
		resp.status(200).json({ results });
	} catch (error:any) {
		const {code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
export const getProfile = async (req: Request, resp: Response) => {
	try {
		const {idProfile} = decodeJwt(req.headers["authorization"]!);
		const [data, metadata]: [any, unknown] = await sequelize.query(
			`
			CALL getProfile(:idProfile);
		`,
			{
				replacements: {
					idProfile
				},
			}
		);
		let movies = [];
		let series = [];
		let goals = [];
		if (data.movies) {
			movies = await data.movies.split(",").map(async (value: any) => {
				return await getMovieById(value);
			});
		}
		if (data.series) {
			series = await data.series.split(",").map(async (value: any) => {
				return await getSeriesById(value);
			});
		}
		if(data.goals){
			goals = data.goals.split(",").map((value:string)=>Number(value))
		}
		//This line of code is to wait for all promises to be resolved
		let results = await Promise.all([...movies, ...series]);
		results = results.map((item) => {
			if ("original_title" in item)
				return {
					id: item.id,
					title: item.original_title,
					poster_path: item.poster_path,
					type: "movie",
				};
			return {
				id: item.id,
				title: item.original_name,
				poster_path: item.poster_path,
				type: "serie",
			};
		});
		resp.status(200).json({name: data.name, img: data.img, results, goals});
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
export const updateProfile = async (req: Request, resp: Response) => {
	try {
		const { name, img } = req.body;
		const { idProfile: id } = decodeJwt(req.headers["authorization"]!);
		if (!(name || img)) {
			throw new Error("sintax_error");
		}
		if (name) {
			await Profiles.update({ name }, { where: { id } });
			resp.status(200).json({
				msg: "Name updated",
			});
			return;
		}
		await Profiles.update({ img }, { where: { id } });
		resp.status(200).json({
			msg: "Image updated",
		});
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
