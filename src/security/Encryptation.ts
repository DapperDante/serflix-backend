import { ENV_SETUP } from "../config/variables.config";
import { PasswordError } from "../error/errors";
import { AES, enc } from "crypto-js";

const clave = ENV_SETUP.CLAVE_ENCRYPTATION;

export function Encrypt(password: string): string {
	return AES.encrypt(password, clave!).toString();
}
export function VerifyPassword(password: string, passwordEncrypted: string) {
	if(AES.decrypt(passwordEncrypted, clave!).toString(enc.Utf8) != password)
		throw new PasswordError("Password incorrect");
}
