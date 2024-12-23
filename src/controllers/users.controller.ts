import { Request, Response } from "express";
import Users from "../models/users.model";
import { Encrypt, Decrypt} from "../Incriptation/incriptation";
//It's only to refer with current error message and get best control
const ErrorTypes = {
    SAME_VALUES: '23000',
    OUT_OF_RANGE: '22001'
}
function controlOfErrors(errorStateSql: string){
    let status = 0;
    switch(errorStateSql){
        case ErrorTypes.SAME_VALUES: 
            status = 409;
        break;
        case ErrorTypes.OUT_OF_RANGE:
            status = 400;
        break;
    }
    return status;
}
export const addNewUser = async(req: Request, resp: Response) => {
    try{
        const {body} = req;
        body.password = Encrypt(body.password);
        await Users.create(body);
        resp.status(200).json({
            msg: 'User created'
        });
    }catch(error: any){
        //For get state of sql you need to use error.original.sqlState to method controlOfErrors
        resp.status(controlOfErrors(error.original.sqlState)).json({
            msg: "Fail to create user"
        });
    }
}
export const verifyUser = async(req: Request, resp: Response) =>{
    try{
        const {body} = req;
        await Users.findOne({where: {
            username: body.username
        }}).then((data)=>{
            if(!data){
                resp.status(400).json({
                    msg: "Not find that user"
                });
                return;
            }
            if(body.password != Decrypt(data?.dataValues.password)){
                resp.status(404).json({
                    msg: "Password incorrect"
                });
                return
            }
            resp.status(200).json({
                msg: "find user",
                idUser: data?.dataValues.id
            });
        })
    }catch(err){
        resp.status(400).json({
            msg: "Has an ocurred problem"
        });
    }
}