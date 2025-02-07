import { Request, Response } from "express";
import Profiles from "../models/profiles.model";
import sequelize from "../db/connection";
import { getMovieById } from "../tmdb_api/movies.tmdb";
import { getSerieById } from "../tmdb_api/series.tmdb";
import {
	ErrorControl
} from "../error/error-handling";
import { createToken, decodeJwt } from "../middleware/authentication.middleware";
import { QueryTypes } from "sequelize";

export const addProfile = async (req: Request, resp: Response) => {
	try {
		const { name, img } = req.body;
		if (!(name && img)) 
			throw new Error("sintax_error");
		const { idUser: user_id } = decodeJwt(req.headers["authorization"]!);
		const query = await Profiles.create({ user_id, name, img });
		const token = createToken(user_id, query.dataValues.id);
		const resultEndPoint = {
			msg: "profile created",
			token
		}
		resp.status(201).json(resultEndPoint);
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
export const logInProfile = async (req: Request, resp: Response) => {
	try{
		const { idProfile } = req.body;
		if(!idProfile) 
			throw new Error("sintax_error");
		const { idUser } = decodeJwt(req.headers["authorization"]!);
		const token = createToken(idUser, idProfile);
		const resultEndPoint = {
			msg: "Profile access",
			token
		};
		resp.status(200).json(resultEndPoint);
	}catch(error:any){
		const {code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
}
export const getProfiles = async (req: Request, resp: Response) => {
	try {
		const { idUser: user_id } = decodeJwt(req.headers["authorization"]!);
		const query = await Profiles.findAll({
			attributes: ["id", "name", "img"],
			where: {
				user_id,
			},
		});
		const resultEndPoint = {
			results: query
		}
		resp.status(200).json(resultEndPoint);
	} catch (error:any) {
		const {code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
export const getProfile = async (req: Request, resp: Response) => {
	try {
		const {idProfile} = decodeJwt(req.headers["authorization"]!);
		const [query]: any[] = await sequelize.query(
			`
			CALL get_profile(:idProfile);
		`,
			{
				replacements: {
					idProfile
				},
				type: QueryTypes.SELECT
			}
		);
		const result = {
			name: query['0'].name,
			img: query['0'].img,
			results: await embeddingItemsFavorite(query['0'].movies, query['0'].series),
			goals: query['0'].goals,
		}
		resp.status(200).json(result);
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
export const updateProfile = async (req: Request, resp: Response) => {
	try {
		const { name, img } = req.body;
		if (!(name || img)) {
			throw new Error("sintax_error");
		}
		const { idProfile: id } = decodeJwt(req.headers["authorization"]!);
		let msg: string;
		if (name) {
			await Profiles.update({ name }, { where: { id } });
			msg = "Name updated";
		}else{
			await Profiles.update({ img }, { where: { id } });
			msg = "Image updated";
		}
		const resultEndPoint = {
			msg
		}
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
const embeddingItemsFavorite = async(movies: any[], series: any[]): Promise<any[]>=>{
	if(!movies?.length)
		movies = [];
	if(!series?.length)
		series = [];
	return (await Promise.all(
		[
			...movies.map(movie=>getMovieById(movie.id)),
			...series.map(serie=>getSerieById(serie.id))
		]
	)).map((item)=>{
		if("original_title" in item)
			return {
				id: item.id,
				original_title: item.original_title,
				poster_path: item.poster_path,
				type: "movie"
			}
		return {
			id: item.id,
			original_name: item.original_name,
			poster_path: item.poster_path,
			type: "serie"
		}
	});
}