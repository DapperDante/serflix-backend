import { Request, Response } from "express";
import ProfileSeries from "../models/profile_series.model";
import { ErrorControl } from "../error/error-handling";
import { getSeriesById } from "../tmdb_api/series.tmdb";
import sequelize from "../db/connection";
import { decodeJwt } from "../middleware/authentication.middleware";

export const addFavoriteSerie = async (req: Request, resp: Response) => {
	try {
		const { idSerie: serie_id } = req.body;
		if (!serie_id) throw new Error("sintax_error");
		const { idProfile: profile_id } = decodeJwt(req.headers["authorization"]!);
		const [data, metadata]: [any, unknown] = await sequelize.query(
			`
			CALL add_serie(:profile_id, :serie_id);
			`, {
				replacements: {
					profile_id,
					serie_id,
				}
			}
		);
		resp.status(201).json({
			msg: "Serie added",
			id: data.id,
			goal: data?.goal
		});
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};

export const getSeriesByProfile = async (req: Request, resp: Response) => {
	try {
		const { idProfile: profile_id } = decodeJwt(req.headers["authorization"]!);
		const seriesId = await ProfileSeries.findAll({
			attributes: ["serie_id"],
			where: {
				profile_id,
				is_delete: 0,
			},
		});
		const results = await Promise.all(
			seriesId.map(async (serie) => {
				return await getSeriesById(serie.dataValues.serie_id);
			})
		);
		resp.status(200).json({ results });
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};

export const getSerieByProfile = async (req: Request, resp: Response) => {
	try {
		const {idSerie: serie_id } = req.params;
		const { idProfile: profile_id } = decodeJwt(req.headers["authorization"]!);
		const serieId = await ProfileSeries.findOne({
			attributes: ["id", "serie_id"],
			where: {
				profile_id,
				serie_id,
				is_delete: 0,
			},
		});
		let results = {}
		if (serieId)
			results = await getSeriesById(serieId?.dataValues.serie_id);
		resp.status(200).json({ id: serieId?.dataValues.id, results });
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};

export const deleteFavoriteSerie = async (req: Request, resp: Response) => {
	try {
		const { id} = req.params;
		const { idProfile: profile_id } = decodeJwt(req.headers["authorization"]!);
		const [data, metadata]: [any[], unknown] = await sequelize.query(
			`
			SELECT * FROM profile_series WHERE id = :id AND profile_id = :profile_id
			`,
			{
				replacements: { id, profile_id },
			}
		);
		if(!data.length || !data.find((item)=>item.id == id)) throw new Error("not_find");
		await ProfileSeries.update({ is_delete: 1 }, { where: { id } });
		resp.status(200).json({
			msg: "delete successful",
		});
	} catch (error: any) {
		const { code, msg } = ErrorControl(error);
		resp.status(code).json({ msg });
	}
};
