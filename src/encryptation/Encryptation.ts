import { ENV_SETUP } from "../config/variables.config";
import { PasswordError } from "../error/errors";
const crypto_js = require("crypto-js");

const clave = ENV_SETUP.CLAVE_ENCRYPTATION;

export function Encrypt(password: string): string {
	return crypto_js.AES.encrypt(password, clave).toString();
}
export function VerifyPassword(password: string, passwordEncrypted: string) {
	if(crypto_js.AES.decrypt(passwordEncrypted, clave).toString(crypto_js.enc.Utf8) != password)
		throw new PasswordError("Password incorrect");
}
