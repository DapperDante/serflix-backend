"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = exports.decodeJwt = exports.AuthenticationProfile = exports.AuthenticationUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_handling_1 = require("../error/error-handling");
const AuthenticationUser = (req, res, next) => {
    if (req.url.includes('/api/user'))
        return next();
    const token = req.headers['authorization'];
    try {
        jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY_TOKEN);
        next();
    }
    catch (error) {
        const { code, msg } = (0, error_handling_1.ErrorControl)(error);
        res.status(code).json({ msg });
    }
};
exports.AuthenticationUser = AuthenticationUser;
const AuthenticationProfile = (req, res, next) => {
    var _a;
    if (req.url.includes('/api/profile/log-in') ||
        req.url.includes('/api/profile/get-all') ||
        req.url.includes('/api/profile/add') ||
        req.url.includes('/api/user'))
        return next();
    try {
        const idProfile = (_a = (0, exports.decodeJwt)(req.headers['authorization'])) === null || _a === void 0 ? void 0 : _a.idProfile;
        if (!idProfile)
            throw new Error("unauthorized");
        next();
    }
    catch (error) {
        const { code, msg } = (0, error_handling_1.ErrorControl)(error);
        res.status(code).json({ msg });
    }
};
exports.AuthenticationProfile = AuthenticationProfile;
const decodeJwt = (token) => {
    return jsonwebtoken_1.default.decode(token, { json: true });
};
exports.decodeJwt = decodeJwt;
const createToken = (idUser, idProfile) => {
    return jsonwebtoken_1.default.sign({ idUser, idProfile }, process.env.SECRET_KEY_TOKEN, {
        expiresIn: "1h"
    });
};
exports.createToken = createToken;
