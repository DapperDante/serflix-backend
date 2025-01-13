"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encrypt = Encrypt;
exports.Decrypt = Decrypt;
const crypto_js = require('crypto-js');
const clave = process.env.CLAVE_ENCRYPTATION;
function Encrypt(password) {
    return crypto_js.AES.encrypt(password, clave).toString();
}
function Decrypt(password) {
    return crypto_js.AES.decrypt(password, clave).toString(crypto_js.enc.Utf8);
}
