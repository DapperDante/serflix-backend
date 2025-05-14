import { NextFunction, Request, Response } from "express";
import { getSerieById, getSerieWithExtras } from "../tmdb_api/series.tmdb";
import { QueryTypes } from "sequelize";
import { SpError, SyntaxError } from "../error/errors";
import { spApi } from "../interface/sp.interface";
import sequelize from "../db/connection";

export const addFavoriteSerie = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { idSerie } = req.body;
		if (!idSerie) 
			throw new SyntaxError("sintax_error");
		const { idProfile } = req.user;
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
		const { idProfile } = req.user;
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
		let entertaiment = null;
		if(resultSp.result){
			const series = resultSp.result.map(async (serie: {serie_id: number}) => await getSerieById(serie.serie_id));
			entertaiment = await Promise.all(query);
		}
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
		const { id } = req.params;
		const { idProfile } = req.user;
		const [query]: any[] = await sequelize.query(
			`
				CALL get_serie(:idProfile, :id);
			`,{
				replacements: {
					idProfile,
					id
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code && resultSp.error_code != 1329)
			throw new SpError(resultSp.message);
		let resultEndPoint = {
			result : await getSerieWithExtras(id),
			is_favorite: resultSp.result ? true : false
		}
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		next(error);
	}
};

export const deleteFavoriteSerie = async (req: Request, resp: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const { idProfile } = req.user;
		const [query]: any[] = await sequelize.query(
			`
				CALL delete_serie(:idProfile, :idSerie);
			`, {
				replacements: {
					idProfile,
					id
				},
				type: QueryTypes.SELECT
			}
		);
		const resultSp: spApi = query['0'].response;
		if(resultSp.error_code)
			throw new SpError(resultSp.message);
		resp.status(200).json({
			msg: "delete successful"
		})
	} catch (error: any) {
		next(error);
	}
};
