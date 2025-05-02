import { NextFunction, Request, Response } from "express";
import { getSerieById, getSerieWithExtras } from "../tmdb_api/series.tmdb";
import { QueryTypes } from "sequelize";
import { decodeTokenLogProfile } from "../config/token.config";
import { SpError, SyntaxError } from "../error/errors";
import { spApi } from "../interface/sp.api";
import sequelize from "../db/connection";

export const addFavoriteSerie = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { idSerie } = req.body;
		if (!idSerie) 
			throw new SyntaxError("sintax_error");
		const { idProfile } = decodeTokenLogProfile(req.headers["authorization"]!);
		const [query]: any[] = await sequelize.query(
			`
			CALL add_serie(:idProfile, :idSerie);
			`, {
				replacements: {
					idProfile,
					idSerie
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		const resultEndPoint = {
			msg: "Serie added",
			goal: resultSp.result.goal
		}
		resp.status(201).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};

export const getSeriesByProfile = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { idProfile } = decodeTokenLogProfile(req.headers["authorization"]!);
		const [query]: any[] = await sequelize.query(
			`
			CALL get_all_series(:idProfile);
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
		const series = resultSp.result.map(async (serie: {serie_id: number}) => await getSerieById(serie.serie_id));
		const entertaiment = await Promise.all(query);
		const resultEndPoint = {
			results: entertaiment
		}
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		next(error)
	}
};

export const getSerieByProfile = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { idSerie } = req.params;
		const { idProfile } = decodeTokenLogProfile(req.headers["authorization"]!);
		const [query]: any[] = await sequelize.query(
			`
				CALL get_serie(:idProfile, :idSerie);
			`,{
				replacements: {
					idProfile,
					idSerie
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code && resultSp.error_code != 1329)
			throw new SpError(resultSp.message);
		let resultEndPoint = {
			result : await getSerieWithExtras(idSerie),
			is_favorite: resultSp.result ? true : false
		}
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};

export const deleteFavoriteSerie = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { idSerie: serie_id } = req.params;
		const { idProfile: profile_id } = decodeTokenLogProfile(req.headers["authorization"]!);
		// await ProfileSeries.destroy({
		// 	where: {
		// 		profile_id,
		// 		serie_id
		// 	}
		// });
		resp.status(200).json({
			msg: "delete successful"
		})
	} catch (error: any) {
		next(error);
	}
};
