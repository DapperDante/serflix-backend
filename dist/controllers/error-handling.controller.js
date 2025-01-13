"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandlingDB = void 0;
const ErrorHandlingDB = (ValidatorKey) => {
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
            return {
                code: 400,
                msg: "Has an ocurred problem"
            };
    }
};
exports.ErrorHandlingDB = ErrorHandlingDB;
