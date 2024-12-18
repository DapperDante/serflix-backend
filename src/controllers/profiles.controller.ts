import { Request, Response } from "express";
import Profiles from "../models/profiles.model";
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
        const {id} = req.params;
        await Profiles.findAll({where: {
            user_id: id
        }}).then(data=>{
            resp.status(200).json(data);
        })
    }catch(err){
        resp.status(404).json({
            msg: "Not find your profiles"
        })
    }
}