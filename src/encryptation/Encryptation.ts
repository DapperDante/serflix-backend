const crypto_js = require('crypto-js');
const clave = process.env.CLAVE_ENCRYPTATION;
export function Encrypt(password: string){
    return crypto_js.AES.encrypt(password, clave).toString();
}
export function Decrypt(password: string){
    return crypto_js.AES.decrypt(password, clave).toString(crypto_js.enc.Utf8);
}

