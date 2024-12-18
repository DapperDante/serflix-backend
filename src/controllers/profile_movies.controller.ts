import { Request, Response } from "express";
import ProfileMovies from "../models/profile_movies.model";

export const getAllMoviesOfProfile = async (req: Request, resp: Response) => {
    try{
        const {idProfile} = req.params;
        await ProfileMovies.findAll({where: {
            profile_id: idProfile,
            is_delete: 0
        }}).then((data)=>{
            //For this request need uses other database (TMDB)
            Promise.all(data.map(async(value)=>{
                let auxData: any;
                await fetch(`${process.env.API_TMDB}/movie/${value.dataValues.movie_id}?language=en-US`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${process.env.TOKEN_TMDB!}`
                        }
                    }
                ).then(value=>{
                    auxData = value.json();
                })
                return auxData;
            })).then((results)=>{
                resp.status(200).json({results});
            });
        })
    }catch(err){
        resp.status(404).json({
            msg: 'Not find profile'
        });
    }
}
export const addFavoriteMovie = async (req: Request, resp: Response) => {
    try{
        const {body} = req
        await ProfileMovies.findOne({where: {
            profile_id: body.profile_id,
            movie_id: body.movie_id
        }}).then(async (value)=>{
            if(!value){
                await ProfileMovies.create(body);
                resp.status(200).json({
                    msg: 'Movie added successful'
                });
                return;
            }
            await ProfileMovies.update({is_delete: 0}, {where: {id: value.dataValues.id}});
            resp.status(200).json({
                msg: "Update movie",
                id: value.dataValues.id
            })
        })
    }catch(err){
        resp.status(400).json({
            msg: "Has an ocurred problem"
        })
    }
}
export const getMovieByIdOfProfile = async (req: Request, resp: Response)=>{
    try{
        const {idProfile, idMovie} = req.params;
        await ProfileMovies.findOne({where: {
            profile_id: idProfile,
            movie_id: idMovie,
            is_delete: 0
        }}).then((value)=>{
            resp.status(200).json(value ? {msg: "Find movie", id: value.dataValues.id}: {});
        })
    }catch(err){
        resp.status(400).json({
            msg: "Has an ocurred problem"
        })
    }
}
export const deleteFavoriteMovie = async (req: Request, resp: Response) => {
    try{
        const {id} = req?.params;
        await ProfileMovies.update({is_delete: 1}, {where: {id}});
        resp.status(200).json({
            msg: "delete successful"
        });
    }catch(err){
        resp.status(400).json({
            msg: "Has and ocurred problem"
        })
    }
}