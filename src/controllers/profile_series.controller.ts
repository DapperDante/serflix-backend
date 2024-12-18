import { Request, Response } from "express";
import ProfileSeries from "../models/profile_series.model";

export const getAllSeriesOfProfile = async (req: Request, resp: Response) => {
    try{
        const {idProfile} = req.body;
        await ProfileSeries.findAll({where: {
            idProfile: idProfile
        }}).then((data)=>{
            resp.status(200).json({
                msg: 'Find your profile',
                data: data
            })
        })
    }catch(err){
        resp.status(400).json({
            msg: 'Not find profile',
        })
    }
}