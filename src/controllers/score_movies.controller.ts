import { Request, Response } from "express";
import ScoreMovies from "../models/score_movies.model";
import sequelize from "../db/connection";
export const addNewReview = async(req: Request, resp: Response) =>{
    try{
        const {body} = req;
        await ScoreMovies.create(body);
        resp.status(200).json({
            msg: "Review created"
        });
    }catch(err){
        resp.status(400).json({
            msg: "A has an problem"
        })
    }
}
export const getReviewOfMovie = async(req: Request, resp: Response)=>{
    try{
        const {idMovie} = req.params;
        const [data, metadata] = await sequelize.query(`
            SELECT score_movies.*, profiles.name FROM score_movies 
            JOIN profiles ON profiles.id = score_movies.profile_id 
            AND score_movies.movie_id = :idMovie`, 
        {
            replacements: {
                idMovie
            }
        })
        resp.status(200).json(data);
    }catch(err){
        resp.status(400).json({
            msg: "A has an problem"
        })
    }
}