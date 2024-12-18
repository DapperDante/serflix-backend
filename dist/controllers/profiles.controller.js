"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProfiles = exports.addNewProfile = void 0;
const profiles_model_1 = __importDefault(require("../models/profiles.model"));
const addNewProfile = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        yield profiles_model_1.default.create(body);
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
});
exports.addNewProfile = addNewProfile;
const getAllProfiles = (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield profiles_model_1.default.findAll({ where: {
                user_id: id
            } }).then(data => {
            resp.status(200).json(data);
        });
    }
    catch (err) {
        resp.status(404).json({
            msg: "Not find your profiles"
        });
    }
});
exports.getAllProfiles = getAllProfiles;
