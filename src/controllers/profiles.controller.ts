import { NextFunction, Request, Response } from "express";
import { getMovieById } from "../tmdb_api/movies.tmdb";
import { getSerieById } from "../tmdb_api/series.tmdb";
import { QueryTypes } from "sequelize";
import { createTokenProfile, createTokenUser } from "../security/token";
import { QueryError, SpError, SyntaxError } from "../error/errors";
import { spApi } from "../interface/sp.interface";
import sequelize from "../db/connection";
import { Encrypt, VerifyPassword } from "../security/Encryptation";

export const addProfile = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { name, img } = req.body;
		if (!(name && img)) 
			throw new SyntaxError("name and img is required");
		const { idUser, email} = req.user;
		const [query]: any = await sequelize.query(
			`CALL add_profile(:idUser, :name, :img);`,
			{
				replacements: {
					idUser,
					name,
					img
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		const resultEndPoint = {
			msg: "profile created"
		}
		resp.status(201).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};
export const loginProfile = async (req: Request, resp: Response, next: NextFunction) => {
	try{
		const { idProfile, password } = req.body;
		if(!idProfile) 
			throw new SyntaxError("idProfile is required");
		const { idUser, email } = req.user;
		const [query]: any = await sequelize.query(
			`
			SELECT password FROM profiles 
			LEFT JOIN profile_password AS p_password ON p_password.profile_id = profiles.id
			WHERE profiles.id = :idProfile AND user_id = :idUser;
			`,
			{
				replacements: {
					idProfile,
					idUser
				},
				type: QueryTypes.SELECT
			}
		);
		if(!query)
			throw new QueryError("Profile not found");
		if(query?.password)
			VerifyPassword(password, query?.password);
		const token = createTokenProfile(idUser, email, idProfile);
		const resultEndPoint = {
			msg: "Profile access",
			token
		};
		resp.status(200).json(resultEndPoint);
	}catch(error:any){
		next(error);
	}
}
export const logoutProfile = async (req: Request, resp: Response, next: NextFunction) => {
	try{
		const { idUser, email } = req.user;
		const token = createTokenUser(idUser, email);
		const resultEndPoint = {
			msg: "Logout profile",
			token
		}
		resp.status(200).json(resultEndPoint);
	}catch(error:any){
		next(error);
	}
};
export const getProfiles = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { idUser } = req.user;
		const [query]: any = await sequelize.query(
			`
			CALL get_all_profiles(:idUser);
			`,
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
			results: resultSp.result
		}
		resp.status(200).json(resultEndPoint);
	} catch (error:any) {
		next(error);
	}
};
export const getProfile = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { idProfile } = req.user;
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
		const resultSp = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		const { name, img, movies, series, goals, plan, password } = resultSp.result;
		const resultEndPoint = {
			name,
			img,
			results: await embeddingItemsFavorite(movies, series),
			goals,
			plan,
			password: password ? true : false
		}
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};
export const updateProfile = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { name, img } = req.body;
		if (!(name || img)) 
			throw new SyntaxError("name or img is required");
		const { idProfile } = req.user;
		let msg: string;
		if (name) {
			await sequelize.query(
				`
				UPDATE profiles SET name = :name WHERE id = :idProfile;
				`,
				{
					replacements: {
						name,
						idProfile
					},
					type: QueryTypes.RAW
				}
			);
			msg = "Name updated";
		}else{
			await sequelize.query(
				`
				UPDATE profiles SET img = :img WHERE id = :idProfile;
				`,
				{
					replacements: {
						img,
						idProfile
					},
					type: QueryTypes.RAW
				}
			);
			msg = "Image updated";
		}
		const resultEndPoint = {
			msg
		}
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};
export const addPasswordProfile = async (req: Request, resp: Response, next: NextFunction) => {
	try{
		const { password } = req.body;
		if(!password)
			throw new SyntaxError("password is required");
		const passwordEncrypted = Encrypt(password);
		const { idProfile } = req.user;
		const [query]: any = await sequelize.query(
			`
			CALL add_profile_password(:idProfile, :passwordEncrypted);
			`,
			{
				replacements: {
					idProfile,
					passwordEncrypted
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		const resultEndPoint = {
			msg: "Password updated"
		}
		resp.status(200).json(resultEndPoint);
	}catch(error: any){
		next(error);
	}
};
export const udpatePasswordProfile = async (req: Request, resp: Response, next: NextFunction) => {
	try{
		const { password } = req.body;
		if(!password)
			throw new SyntaxError("password is required");
		const passwordEncrypted = Encrypt(password);
		const { idProfile } = req.user;
		const [query]: any = await sequelize.query(
			`
			CALL update_profile_password(:idProfile, :passwordEncrypted);
			`,
			{
				replacements: {
					idProfile,
					passwordEncrypted
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		const resultEndPoint = {
			msg: "Password updated"
		}
		resp.status(200).json(resultEndPoint);
	}catch(error){
		next(error);
	}
};
export const deletePasswordProfile = async (req: Request, resp: Response, next: NextFunction) => {
	try{
		const { idProfile } = req.user;
		const [query]: any = await sequelize.query(
			`
			CALL delete_profile_password(:idProfile);
			`,
			{
				replacements: {
					idProfile
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		const resultEndPoint = {
			msg: "Password deleted"
		}
		resp.status(200).json(resultEndPoint);
	}catch(error: any){
		next(error);
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
};