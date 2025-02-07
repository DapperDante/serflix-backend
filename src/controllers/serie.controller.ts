import { Request, Response } from "express";
import ProfileSeries from "../models/profile_series.model";
import { ErrorControl } from "../error/error-handling";
import { getSerieById, getSerieWithExtras } from "../tmdb_api/series.tmdb";
import sequelize from "../db/connection";
import { decodeJwt } from "../middleware/authentication.middleware";
import { QueryTypes } from "sequelize";

export const addFavoriteSerie = async (req: Request, resp: Response) => {
	try {
		const { idSerie } = req.body;
		if (!idSerie) 
			throw new Error("sintax_error");
		const { idProfile } = decodeJwt(req.headers["authorization"]!);
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
		const resultEndPoint = {
			msg: "Serie added",
			goal: query['0'].goal || null
		}
		resp.status(201).json(resultEndPoint);
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};

export const getSeriesByProfile = async (req: Request, resp: Response) => {
	try {
		const { idProfile: profile_id } = decodeJwt(req.headers["authorization"]!);
		const query = await ProfileSeries.findAll({
			attributes: ["serie_id"],
			where: {
				profile_id
			},
		});
		query.map(async (serie) => await getSerieById(serie.dataValues.serie_id));
		const entertaiment = await Promise.all(query);
		const resultEndPoint = {
			results: entertaiment
		}
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};

export const getSerieByProfile = async (req: Request, resp: Response) => {
	try {
		const { idSerie } = req.params;
		const { idProfile } = decodeJwt(req.headers["authorization"]!);
		const [data]: any[] = await sequelize.query(
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
		let resultEndPoint = {
			result : await getSerieWithExtras(idSerie),
			is_favorite: Object.values(data).length ? true : false
		}
		resp.status(200).json(resultEndPoint);
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};

export const deleteFavoriteSerie = async (req: Request, resp: Response) => {
	try {
		const { idSerie: serie_id } = req.params;
		const { idProfile: profile_id } = decodeJwt(req.headers["authorization"]!);
		await ProfileSeries.destroy({
			where: {
				profile_id,
				serie_id
			}
		});
		resp.status(200).json({
			msg: "delete successful"
		})
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
