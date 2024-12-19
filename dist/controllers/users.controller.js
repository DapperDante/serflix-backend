"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfoProfile = exports.verifyUser = exports.addNewUser = void 0;
const users_model_1 = __importDefault(require("../models/users.model"));
const incriptation_1 = require("../Incriptation/incriptation");
const connection_1 = __importDefault(require("../db/connection"));
//It's only to refer with current error message and get best control
const ErrorTypes = {
    SAME_VALUES: '23000',
    OUT_OF_RANGE: '22001'
};
function controlOfErrors(errorStateSql) {
    let status = 0;
    switch (errorStateSql) {
        case ErrorTypes.SAME_VALUES:
            status = 409;
            break;
        case ErrorTypes.OUT_OF_RANGE:
            status = 400;
            break;
    }
    return status;
}
const addNewUser = async (req, resp) => {
    try {
        const { body } = req;
        body.password = (0, incriptation_1.Encrypt)(body.password);
        await users_model_1.default.create(body);
        resp.status(200).json({
            msg: 'User created'
        });
    }
    catch (error) {
        //For get state of sql you need to use error.original.sqlState to method controlOfErrors
        resp.status(controlOfErrors(error.original.sqlState)).json({
            msg: "Fail to create user"
        });
    }
};
exports.addNewUser = addNewUser;
const verifyUser = async (req, resp) => {
    try {
        const { body } = req;
        await users_model_1.default.findOne({ where: {
                username: body.username
            } }).then((data) => {
            if (!data) {
                resp.status(400).json({
                    msg: "Not find that user"
                });
                return;
            }
            if (body.password != (0, incriptation_1.Decrypt)(data === null || data === void 0 ? void 0 : data.dataValues.password)) {
                resp.status(404).json({
                    msg: "Password incorrect"
                });
                return;
            }
            resp.status(200).json({
                msg: "find user",
                idUser: data === null || data === void 0 ? void 0 : data.dataValues.id
            });
        });
    }
    catch (err) {
        resp.status(400).json({
            msg: "Has an ocurred problem"
        });
    }
};
exports.verifyUser = verifyUser;
const getInfoProfile = async (req, resp) => {
    try {
        const { idProfile } = req.params;
        const { idUser } = req.params;
        connection_1.default.query(`
            SELECT COUNT(*) FROM profile_movies WHERE profile_id = :idProfile AND user_id = :idUser`, {
            replacements: {
                idProfile: idProfile,
                idUser: idUser
            }
        }).then((data) => {
            resp.status(200).json(data);
        });
    }
    catch (err) {
        resp.status(404).json({
            msg: "Not find profile"
        });
    }
};
exports.getInfoProfile = getInfoProfile;
