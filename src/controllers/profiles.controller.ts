import { Request, Response } from "express";
import Profiles from "../models/profiles.model";
import sequelize from "../db/connection";
import { getMovieById, getSeriesById } from "../tmdb_api/movies.tmdb";
export const addNewProfile = async(req: Request, resp: Response) => {
    try{
        const {body} = req;
        await Profiles.create(body);
        resp.status(200).json({
            msg: 'profile created'
        });
    }catch(error){
        //For get state of sql you need to use error.original.sqlState to method controlOfErrors
        resp.status(400).json({
            msg: "Fail to create user"
        });
    }
}
export const getAllProfiles = async(req: Request, resp: Response) => {
    try{
        const {idUser} = req.params;
        await Profiles.findAll({where: {
            user_id: idUser
        }}).then(data=>{
            resp.status(200).json(data);
        })
    }catch(err){
        resp.status(404).json({
            msg: "Not find your profiles"
        })
    }
}
export const getProfile = async(req: Request, resp: Response)=>{
	try {
		const {idProfile} = req.params;
		const [data, metadata]: [any[], unknown] = await sequelize.query(`
			SELECT profiles.name, profiles.img, (
				SELECT substring_index(group_concat(movies.movie_id), ',', 1) FROM profile_movies AS movies WHERE movies.is_delete = 0 AND movies.profile_id = :idProfile LIMIT 1
			) AS movies, (
				SELECT substring_index(group_concat(series.serie_id), ',', 1) FROM profile_series AS series WHERE series.is_delete = 0 AND series.profile_id = :idProfile LIMIT 1
			) AS series FROM profiles WHERE profiles.id = :idProfile;
		`, {
			replacements: {
				idProfile
			}
		});
		console.log(data);
		let movies: Promise<any>[];
		let series: Promise<any>[];
		if(data[0].movies){
			movies = data[0].movies.split(',').map(function (value: string) {
				return getMovieById(value);
			});
		}
		if(data[0].series){
			console.log(data[0].series);
			series = data[0].series.split(',').map(function (value: string) {
				return getSeriesById(value);
			});
		}
		//This line of code is to wait for all promises to be resolved
		Promise.all([...movies!, ...series!]).then((values: any[]) => {
			resp.status(200).json({
				name: data[0].name,
				img: data[0].img,
				results: values.map(function (value: any) {
					if('original_title' in value){
						return {
							id: value.id,
							original_title: value.original_title,
							poster_path: value.poster_path,
							type: 'movie'
						}
					}
					return {
						id: value.id,
						original_name: value.original_name,
						poster_path: value.poster_path,
						type: 'serie'
					}
				})
			});
		});
	} catch (err) {
		console.log(err);
		resp.status(400).json({
			msg: "There was a problem"
		})
	}
}