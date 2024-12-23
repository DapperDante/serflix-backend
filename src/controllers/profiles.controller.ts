import { Request, Response } from "express";
import Profiles from "../models/profiles.model";
import sequelize from "../db/connection";
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
				SELECT group_concat(movies.movie_id) FROM profile_movies AS movies WHERE movies.is_delete = 0
			) AS movies, (
				SELECT group_concat(series.serie_id) FROM profile_series AS series WHERE series.is_delete = 0
			) AS series FROM profiles WHERE profiles.id = 3;
		`);
		const result = {
			name: data[0].name,
			img: data[0].img,
			movies: data[0].movies.split(',').map(Number),
			series: data[0].series.split(',').map(Number)
		}
		resp.status(200).json(result);
	} catch (err) {
		resp.status(400).json({
			msg: "There was a problem"
		})
	}
}