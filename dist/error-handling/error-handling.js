"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorControl = void 0;
//This is core of error handling
const ErrorControl = (error) => {
    try {
        console.log(error.name);
        switch (error.name) {
            case 'TokenExpiredError':
                return ErrorHandlingJwt(error);
            case 'Error':
                return ErrorHandling(error);
            default:
                throw new Error();
        }
    }
    catch (_a) {
        return {
            code: 500,
            msg: "Has an ocurred problem"
        };
    }
};
exports.ErrorControl = ErrorControl;
const ErrorHandlingDB = (ValidatorKey) => {
    console.log(ValidatorKey);
    switch (ValidatorKey) {
        case 'is_null':
            return {
                code: 400,
                msg: "The field is null"
            };
        case 'not_unique':
            return {
                code: 400,
                msg: "The field is unique"
            };
        default:
            throw new Error();
    }
};
const ErrorHandlingJwt = (error) => {
    console.log(error.message);
    switch (error.message) {
        case 'jwt expired':
            return {
                code: 401,
                msg: "Token expired"
            };
        case 'jwt must be provided':
            return {
                code: 401,
                msg: "Token must be provided"
            };
        case 'invalid token':
            return {
                code: 401,
                msg: "Invalid token"
            };
        default:
            throw new Error();
    }
};
//This is to custom errors
const ErrorHandling = (error) => {
    console.log(error);
    switch (error.message) {
        case 'sintax_error':
            return {
                code: 400,
                msg: "The fields are incorrect"
            };
        case 'not_find_user':
            return {
                code: 404,
                msg: "Not find user"
            };
        case 'not_match_password':
            return {
                code: 401,
                msg: "The password is incorrect"
            };
        case 'not_find':
            return {
                code: 404,
                msg: "Not find your query"
            };
        default:
            throw new Error();
    }
};
