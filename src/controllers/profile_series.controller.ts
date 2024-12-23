import { Request, Response } from "express";
import ProfileSeries from "../models/profile_series.model";

export const getAllSeriesOfProfile = async (req: Request, resp: Response) => {
	try {
		const { idProfile } = req.params;
		await ProfileSeries.findAll({
			where: {
				profile_id: idProfile,
				is_delete: 0,
			},
		}).then((modelSeries) => {
			Promise.all(
				modelSeries.map(async modelSerie=>{
				let auxData: any;
				await fetch(`${process.env.API_TMDB}/tv/${modelSerie.dataValues.serie_id}?language=US`,
					{
							method: 'GET',
							headers: {
									Authorization: `Bearer ${process.env.TOKEN_TMDB!}`
							}
					}
				).then(series=>{
						auxData = series.json();
				})
				return auxData;
			})).then(results=>{
				resp.status(200).json({results});
			});
		});
	} catch (err) {
		resp.status(404).json({
			msg: "Not find profile",
		});
	}
};
export const addFavoriteSerie = async (req: Request, resp: Response)=>{
	try {
		const {body} = req;
		await ProfileSeries.findOne({where: {
			profile_id: body.profile_id,
			serie_id: body.serie_id
		}}).then(async value=>{
			if(!value){
				await ProfileSeries.create(body);
				return resp.status(200).json({
					msg: "Add serie"
				});
			}
			await ProfileSeries.update({is_delete: 0}, {where: {id: value.dataValues.id}});
			return resp.status(200).json({
				msg: "Update serie",
				id: value.dataValues.id
			});
		})
	} catch (err) {
		resp.status(400).json({
			msg: "Has an ocurred problem"
		})
	}
}
export const getSerieByIdOfProfile = async (req: Request, resp: Response)=>{
	try {
		const {idProfile, idSerie} = req.params;
		await ProfileSeries.findOne({where: {
			profile_id: idProfile,
			serie_id: idSerie,
			is_delete: 0
		}}).then(value=>{
			resp.status(200).json(value ? {msg: "Find movie", id: value.dataValues.id}: {});
		})
	} catch (error) {
		resp.status(400).json({
			msg: "Has an ocurred problem"
		})
	}
}
export const deleteFavoriteSerie = async (req: Request, resp: Response)=>{
	try {
		const {id} = req.params;
		await ProfileSeries.update({is_delete: 1}, {where: {id}});
		resp.status(200).json({
			msg: "delete successful"
		})
	} catch (error) {
		resp.status(400).json({
			msg: "Has an ocurred problem"
		})
	}
}
