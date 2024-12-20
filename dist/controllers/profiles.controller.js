"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProfiles = exports.addNewProfile = void 0;
const profiles_model_1 = __importDefault(require("../models/profiles.model"));
const addNewProfile = async (req, resp) => {
    try {
        const { body } = req;
        await profiles_model_1.default.create(body);
        resp.status(200).json({
            msg: 'profile created'
        });
    }
    catch (error) {
        //For get state of sql you need to use error.original.sqlState to method controlOfErrors
        resp.status(400).json({
            msg: "Fail to create user"
        });
    }
};
exports.addNewProfile = addNewProfile;
const getAllProfiles = async (req, resp) => {
    try {
        const { idUser } = req.params;
        await profiles_model_1.default.findAll({ where: {
                user_id: idUser
            } }).then(data => {
            resp.status(200).json(data);
        });
    }
    catch (err) {
        resp.status(404).json({
            msg: "Not find your profiles"
        });
    }
};
exports.getAllProfiles = getAllProfiles;
